import { HubConnectionState } from '@microsoft/signalr';
import React, { useState, useCallback, useEffect, type ReactNode } from 'react';

import { WebsocketContext } from '@/planning-rooms/context/WebsocketContextInstance';
import SimpleWebsocketService from '@/planning-rooms/services/WebsocketService';
import {
  type Room,
  type User,
  SocketMethods,
} from '@/planning-rooms/types/types';

// localStorage keys
const LS_ROOM = 'ws_room';
const LS_ME = 'ws_me';

export const WebsocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room | null>(() =>
    JSON.parse(localStorage.getItem(LS_ROOM) || 'null')
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (room) {
      localStorage.setItem(LS_ROOM, JSON.stringify(room));
    } else {
      localStorage.removeItem(LS_ROOM);
    }
  }, [room]);

  const getMe = useCallback((): User | null => {
    const _user = JSON.parse(localStorage.getItem(LS_ME) || 'null');
    return _user;
  }, []);

  const setUser = useCallback((user: User | null) => {
    localStorage.setItem(LS_ME, JSON.stringify(user));
  }, []);

  const setupListeners = useCallback(() => {
    // Remove listeners existentes antes de adicionar novos
    SimpleWebsocketService.removeAllListeners();

    // Adiciona os listeners
    SimpleWebsocketService.on(SocketMethods.UserChanged, setRoom);
    SimpleWebsocketService.on(SocketMethods.Voted, setRoom);
    SimpleWebsocketService.on(SocketMethods.Revealed, setRoom);
    SimpleWebsocketService.on(SocketMethods.Reseted, (updated: Room) => {
      setRoom(updated);
    });

    // Configura listeners de reconexão
    SimpleWebsocketService.on('onreconnected', async () => {
      setIsConnected(true);
      // Usar dados do localStorage em vez do estado atual
      const savedRoom = JSON.parse(localStorage.getItem(LS_ROOM) || 'null');
      const savedMe = getMe();

      if (savedRoom && savedMe) {
        try {
          await SimpleWebsocketService.joinRoom({
            roomId: savedRoom.id,
            userId: savedMe.id,
            name: savedMe.name,
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

    SimpleWebsocketService.on('onclose', () => setIsConnected(false));
  }, [getMe]);

  const connect = useCallback(async () => {
    try {
      const connection = await SimpleWebsocketService.connect();
      setIsConnected(connection.state === HubConnectionState.Connected);
      setupListeners();
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setIsConnected(false);
    }
  }, [setupListeners]);

  const disconnect = useCallback(async () => {
    await SimpleWebsocketService.disconnect();
    setIsConnected(false);
    setRoom(null);
  }, []);

  const createRoom = useCallback(async (name: string) => {
    // verificar aqui para colocar um nome padrão para a criação da sala
    const result = await SimpleWebsocketService.createRoom({
      name,
      description: '',
      votingOptions: ['1', '2', '3', '5', '8', '13', '21', '?'],
    });
    setRoom(result);
    return result;
  }, []);

  const joinRoom = useCallback(
    async (roomId: string) => {
      const me = getMe();
      await SimpleWebsocketService.joinRoom({
        roomId,
        userId: me?.id,
        name: me?.name,
      });
    },
    [getMe]
  );

  const leaveRoom = useCallback(async () => {
    const me = getMe();
    if (room && me)
      await SimpleWebsocketService.leaveRoom({
        roomId: room.id,
        userId: me.id,
      });
  }, [getMe, room]);

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
      const me = getMe();
      if (room && me) {
        await SimpleWebsocketService.vote({ roomId, userId, vote });
      }
    },
    [getMe, room]
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
        me: getMe(),
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
        setMe: setUser,
        setRoom,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};
