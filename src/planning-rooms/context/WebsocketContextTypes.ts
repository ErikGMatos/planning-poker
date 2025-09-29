import { type HubConnectionState } from '@microsoft/signalr';

import type { Room, User } from '../types/types';

export interface WebsocketContextType {
  room: Room | null;
  me: User | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  createRoom: (name: string) => Promise<Room>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  vote: ({
    userId,
    roomId,
    vote,
  }: {
    userId: string;
    roomId: string;
    vote: number;
  }) => Promise<void>;
  reveal: ({ roomId }: { roomId: string }) => Promise<void>;
  reset: ({ roomId }: { roomId: string }) => Promise<void>;
  getState: () => Promise<HubConnectionState>;
  setMe: (me: User | null) => void;
  setRoom: (room: Room | null) => void;
}
