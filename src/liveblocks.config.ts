// liveblocks.config.ts
import { createClient, LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Tipos que você está usando
type Presence = {
  name: string;
  vote: number | null;
};

type Storage = {
  reveal: LiveObject<{ value: boolean }>;
};

// Cria o cliente com sua API Key pública
const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
});

// Cria o contexto com tipagem
export const {
  RoomProvider,
  useOthers,
  useMyPresence,
  useStorage,
  useUpdateMyPresence,
  useMutation,
  useSelf,
  useStatus,
} = createRoomContext<Presence, Storage>(client);
