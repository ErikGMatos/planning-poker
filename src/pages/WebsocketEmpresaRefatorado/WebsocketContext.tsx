/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect, type ReactNode } from 'react';
import SimpleWebsocketService from './WebsocketService';
import { type Room, type User, SocketMethods } from './types';
import { HubConnectionState } from '@microsoft/signalr';
import { WebsocketContext } from './WebsocketContextInstance';

// localStorage keys
const LS_ROOM = 'ws_room';
const LS_ME = 'ws_me';

export const WebsocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room | null>(() =>
    JSON.parse(localStorage.getItem(LS_ROOM) || 'null')
  );
  const [me, setMe] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem(LS_ME) || 'null')
  );
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
      setMe(prev => (prev ? { ...prev, vote: null } : null));
    });

    conn.onreconnected(async () => {
      setIsConnected(true);
      // Usar dados do localStorage em vez do estado atual
      const savedRoom = JSON.parse(localStorage.getItem(LS_ROOM) || 'null');
      const savedMe = JSON.parse(localStorage.getItem(LS_ME) || 'null');

      if (savedRoom && savedMe) {
        try {
          await SimpleWebsocketService.joinRoom({
            roomId: savedRoom.id,
            user: savedMe,
          });
          if (savedMe.vote != null) {
            await SimpleWebsocketService.vote({
              roomId: savedRoom.id,
              userId: savedMe.id,
              value: savedMe.vote,
            });
          }
        } catch (error) {
          console.error('Erro ao reconectar:', error);
        }
      }
    });

    conn.onclose(() => setIsConnected(false));
  }, []);

  const connect = useCallback(async () => {
    try {
      const connection = await SimpleWebsocketService.connect();
      setIsConnected(connection.state === HubConnectionState.Connected);
      setupListeners();

      // Usar dados do localStorage para reconexão
      const savedRoom = JSON.parse(localStorage.getItem(LS_ROOM) || 'null');
      const savedMe = JSON.parse(localStorage.getItem(LS_ME) || 'null');

      if (savedRoom && savedMe) {
        await SimpleWebsocketService.joinRoom({
          roomId: savedRoom.id,
          user: savedMe,
        });
        if (savedMe.vote != null) {
          await SimpleWebsocketService.vote({
            roomId: savedRoom.id,
            userId: savedMe.id,
            value: savedMe.vote,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setIsConnected(false);
    }
  }, [setupListeners]);

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
      votingOptions: ['1', '2', '3', '5', '8', '13', '21', '?'],
    })) as Room;
    setRoom(result);
    return result;
  };

  const joinRoom = useCallback(async (roomId: string, user: User) => {
    await SimpleWebsocketService.joinRoom({ roomId, user });
    // Sempre atualizar o me com o usuário fornecido
    setMe(user);
  }, []);

  const leaveRoom = useCallback(async () => {
    if (room && me)
      await SimpleWebsocketService.leaveRoom({
        roomId: room.id,
        userId: me.id,
      });
    setMe(null);
  }, [room, me]);

  const vote = useCallback(
    async ({
      userId,
      roomId,
      vote,
    }: {
      userId: string;
      roomId: string;
      vote: number;
    }) => {
      if (room && me) {
        await SimpleWebsocketService.vote({ roomId, userId, vote });
        setMe(prev => (prev ? { ...prev, vote } : null));
      }
    },
    [room, me]
  );

  const reveal = useCallback(
    async () => room && SimpleWebsocketService.reveal({ roomId: room.id }),
    [room]
  );
  const reset = useCallback(
    async () => room && SimpleWebsocketService.reset({ roomId: room.id }),
    [room]
  );
  const getState = useCallback(
    async () => SimpleWebsocketService.getState(),
    []
  );

  return (
    <WebsocketContext.Provider
      value={{
        room,
        me,
        isConnected,
        connect,
        disconnect,
        createRoom,
        joinRoom,
        leaveRoom,
        vote,
        reveal,
        reset,
        getState,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};
