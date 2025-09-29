import { useContext } from 'react';

import { WebsocketContext } from '@/planning-rooms/context/WebsocketContextInstance';

export const useWebsocket = () => {
  const ctx = useContext(WebsocketContext);
  if (!ctx)
    throw new Error('useWebsocket deve ser usado dentro de WebsocketProvider');
  return ctx;
};
