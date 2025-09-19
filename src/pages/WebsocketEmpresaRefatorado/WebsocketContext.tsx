/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect, type ReactNode } from "react";
import SimpleWebsocketService from "./WebsocketService";
import { type Room, type User, SocketMethods } from "./types";
import { HubConnectionState } from "@microsoft/signalr";
import { WebsocketContext } from "./WebsocketContextInstance";

// localStorage keys
const LS_ROOM = "ws_room";
const LS_ME = "ws_me";

export const WebsocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [room, setRoom] = useState<Room | null>(() => JSON.parse(localStorage.getItem(LS_ROOM) || "null"));
  const [me, setMe] = useState<User | null>(() => JSON.parse(localStorage.getItem(LS_ME) || "null"));
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (room) {
      localStorage.setItem(LS_ROOM, JSON.stringify(room));
    } else {
      localStorage.removeItem(LS_ROOM);
    }
  }, [room]);

  useEffect(() => {
    if (me) {
      localStorage.setItem(LS_ME, JSON.stringify(me));
    } else {
      localStorage.removeItem(LS_ME);
    }
  }, [me]);

  const setupListeners = useCallback(() => {
    const conn = (SimpleWebsocketService as any).connection;
    if (!conn) return;

    conn.on(SocketMethods.UserChanged, setRoom);
    conn.on(SocketMethods.Voted, setRoom);
    conn.on(SocketMethods.Revealed, setRoom);
    conn.on(SocketMethods.Reseted, (updated: Room) => {
      setRoom(updated);
      setMe((prev) => (prev ? { ...prev, vote: null } : null));
    });

    conn.onreconnected(async () => {
      setIsConnected(true);
      if (room && me) {
        try {
          await SimpleWebsocketService.joinRoom({ roomId: room.id, user: me });
          if (me.vote != null) {
            await SimpleWebsocketService.vote({ roomId: room.id, userId: me.id, value: me.vote });
          }
        } catch(error) {
          console.error('Erro ao reconectar:', error);
        }
      }
    });

    conn.onclose(() => setIsConnected(false));
  }, [room, me]);

  const connect = useCallback(async () => {
    try {
      const connection = await SimpleWebsocketService.connect();
      setIsConnected(connection.state === HubConnectionState.Connected);
      setupListeners();

      if (room && me) {
        await SimpleWebsocketService.joinRoom({ roomId: room.id, user: me });
        if (me.vote != null) {
          await SimpleWebsocketService.vote({ roomId: room.id, userId: me.id, value: me.vote });
        }
      }
    } catch(error) {
      console.error('Erro ao conectar:', error);
      setIsConnected(false);
    }
  }, [setupListeners, room, me]);

  const disconnect = useCallback(async () => {
    await SimpleWebsocketService.disconnect();
    setIsConnected(false);
    setRoom(null);
    setMe(null);
  }, []);

  const createRoom = async (name: string, description: string) => {
    const result = (await SimpleWebsocketService.createRoom({
      name,
      description,
      votingOptions: ["1", "2", "3", "5", "8", "13", "21", "?"],
    })) as Room;
    setRoom(result);
    return result;
  };

  const joinRoom = async (roomId: string, user: User) => {
    await SimpleWebsocketService.joinRoom({ roomId, user });
    setMe(user);
  };

  const leaveRoom = async () => {
    if (room && me) await SimpleWebsocketService.leaveRoom({ roomId: room.id, userId: me.id });
    setMe(null);
  };

  const vote = async ({userId, roomId, vote}: {userId: string, roomId: string, vote: number}) => {
    if (room && me) {
      await SimpleWebsocketService.vote({ roomId, userId, vote });
      setMe((prev) => (prev ? { ...prev, vote } : null));
    }
  };

  const reveal = async () => room && SimpleWebsocketService.reveal({ roomId: room.id });
  const reset = async () => room && SimpleWebsocketService.reset({ roomId: room.id });
  const getState = async () => SimpleWebsocketService.getState();

  return (
    <WebsocketContext.Provider
      value={{ room, me, isConnected, connect, disconnect, createRoom, joinRoom, leaveRoom, vote, reveal, reset, getState }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};

