import { useState, useEffect, useCallback } from 'react';

import { useWebsocket } from './useWebsocket';

/**
 * Hook para gerenciar erros de conexão
 * Monitora o estado de conexão e exibe erros quando necessário
 */
export const useConnectionError = () => {
  const { isConnected } = useWebsocket();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [wasConnected, setWasConnected] = useState(false);

  // Monitora mudanças no estado de conexão
  useEffect(() => {
    if (isConnected) {
      // Conexão estabelecida - limpa erros
      setConnectionError(null);
      setWasConnected(true);
    } else if (wasConnected) {
      // Perdeu conexão após ter estado conectado
      setConnectionError('Conexão perdida. Tentando reconectar...');
    }
  }, [isConnected, wasConnected]);

  // Limpa o erro manualmente
  const clearError = useCallback(() => {
    setConnectionError(null);
  }, []);

  // Força um erro de conexão (útil para testes)
  const setError = useCallback((message: string) => {
    setConnectionError(message);
  }, []);

  // Wrapper para operações que podem falhar por problemas de conexão
  const executeWithErrorHandling = useCallback(
    async <T>(
      operation: () => Promise<T>,
      errorMessage: string = 'Operação falhou. Verifique sua conexão.'
    ): Promise<T | null> => {
      try {
        // Só bloqueia se já estava conectado e perdeu a conexão
        if (!isConnected && wasConnected) {
          setConnectionError('Sem conexão. Aguarde a reconexão...');
          return null;
        }

        // Executa a operação (pode ser a primeira tentativa de conexão)
        return await operation();
      } catch (error) {
        console.error('Erro na operação:', error);
        setConnectionError(errorMessage);
        return null;
      }
    },
    [isConnected, wasConnected, setConnectionError]
  );

  return {
    connectionError,
    isConnected,
    clearError,
    setError,
    executeWithErrorHandling,
  };
};
