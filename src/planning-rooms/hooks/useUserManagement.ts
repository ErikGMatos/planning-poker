import { useCallback } from 'react';

import { useWebsocket } from '@/planning-rooms/hooks/useWebsocket';
import { type User } from '@/planning-rooms/types/types';

/**
 * Hook para gerenciar o estado do usuário
 * Centraliza a lógica de criação e atualização do usuário
 */
export const useUserManagement = () => {
  const { me, setMe } = useWebsocket();

  /**
   * Prepara os dados do usuário para uma nova sessão
   * Se já existe usuário, reseta o voto
   * Se não existe, cria um novo usuário
   */
  const prepareUserForSession = useCallback(
    (userName: string): User => {
      if (me) {
        // Usuário existente: mantém ID mas atualiza nome e reseta voto
        return {
          ...me,
          name: userName,
          vote: null,
        };
      }

      // Novo usuário: cria com ID único
      return {
        id: crypto.randomUUID().toString(),
        name: userName,
        vote: null,
      };
    },
    [me]
  );

  /**
   * Atualiza o usuário no contexto
   */
  const updateUser = useCallback(
    (user: User) => {
      setMe(user);
    },
    [setMe]
  );

  /**
   * Limpa os dados do usuário
   */
  const clearUser = useCallback(() => {
    setMe(null);
  }, [setMe]);

  return {
    currentUser: me,
    prepareUserForSession,
    updateUser,
    clearUser,
  };
};
