import { HubConnectionState } from '@microsoft/signalr';
import { type Room, type User } from './types';

export interface WebsocketContextType {
  room: Room | null;
  me: User | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  createRoom: (name: string, description: string) => Promise<Room>;
  joinRoom: (roomId: string, user: User) => Promise<void>;
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
}
