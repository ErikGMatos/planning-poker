import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserManagement } from '@/planning-rooms/hooks/useUserManagement';
import { useWebsocket } from '@/planning-rooms/hooks/useWebsocket';

/**
 * Hook para gerenciar a criação de salas
 * Centraliza a lógica de criação e navegação
 */
export const useRoomCreation = () => {
  const navigate = useNavigate();
  const { connect, createRoom, setRoom, setMe } = useWebsocket();
  const { prepareUserForSession } = useUserManagement();

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cria uma nova sala e navega para ela
   */
  const createNewRoom = useCallback(
    async (userName: string) => {
      if (isCreating) return;

      setIsCreating(true);
      setError(null);

      try {
        // 1. Conectar ao WebSocket
        await connect();

        // 2. Preparar dados do usuário
        const userData = prepareUserForSession(userName);
        setMe(userData);

        // 3. Criar a sala
        const newRoom = await createRoom(userName);

        // 4. Navegar para a sala criada
        if (newRoom?.id) {
          navigate(`/planning/room/${newRoom.id}`);
        } else {
          throw new Error('Falha ao criar sala - ID não encontrado');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro inesperado ao criar sala';

        setError(errorMessage);
        console.error('Erro ao criar sala:', err);
      } finally {
        setIsCreating(false);
      }
    },
    [connect, createRoom, isCreating, navigate, prepareUserForSession, setMe]
  );

  /**
   * Limpa o estado de erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpa a sala atual (para voltar ao estado inicial)
   */
  const clearCurrentRoom = useCallback(() => {
    setRoom(null);
  }, [setRoom]);

  return {
    isCreating,
    error,
    createNewRoom,
    clearError,
    clearCurrentRoom,
  };
};
