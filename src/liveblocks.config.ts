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
  publicApiKey: "pk_dev_OTTh6VRfxxQkq5GkLqatRI0yHs5bmeUanBwUF7QAVtYPtLkuRGpqCESwK5GdDEmP",
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
} = createRoomContext<Presence, Storage>(client);
