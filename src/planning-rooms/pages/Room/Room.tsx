import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorAlert } from '../../components/ErrorAlert';
import { useConnectionError } from '../../hooks/useConnectionError';
import { useWebsocket } from '../../hooks/useWebsocket';
import type { User } from '../../types/types';
import { VotingRoom } from '../VotingRoom/VotingRoom';
import './Room.css';

export const PlanningRoom = () => {
  const navigate = useNavigate();
  const { joinRoom, connect, me, setMe } = useWebsocket();
  const { connectionError, clearError, executeWithErrorHandling } =
    useConnectionError();

  const { id = '' } = useParams<{ id: string }>();

  const [name, setName] = useState(me?.name || '');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    const enterAutomatically = async () => {
      if (!id) return;

      setLoading(true);
      setJoinError(null);
      try {
        await executeWithErrorHandling(async () => {
          await connect();
          await joinRoom(id);
          setReady(true);
        }, 'Falha ao conectar à sala. Verifique sua conexão.');
      } catch (error) {
        console.error('Erro ao entrar automaticamente:', error);
        setJoinError('Erro ao conectar à sala. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    // Se já tem usuário (vem da home), entra automaticamente
    if (me?.name && id) {
      enterAutomatically();
    }
  }, [connect, id, joinRoom, me?.name, executeWithErrorHandling]);

  const handleJoinRoom = async () => {
    if (!name.trim()) {
      setJoinError('Nome é obrigatório');
      return;
    }

    setLoading(true);
    setJoinError(null);
    clearError();

    try {
      await executeWithErrorHandling(async () => {
        await connect();

        // Preservar o ID existente se disponível, senão criar novo
        let _me: User | null = me ? { ...me } : null;

        if (_me) {
          _me.vote = null;
          _me.name = name; // Atualiza o nome
        } else {
          _me = {
            id: crypto.randomUUID().toString(),
            name,
            vote: null,
          };
        }
        setMe(_me);
        await joinRoom(id);

        setReady(true);
      }, 'Falha ao entrar na sala. Verifique sua conexão.');
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      setJoinError('Erro ao entrar na sala. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleJoinRoom();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // Limpa erros quando o usuário começa a digitar
    if (joinError) {
      setJoinError(null);
    }
  };

  if (!id) {
    return (
      <div className="gradient-bg room-container">
        <div className="room-content">
          <div className="card card-shadow room-error-card">
            <h2 className="room-error-title">Erro</h2>
            <p className="room-error-message">ID da sala inválido</p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary room-error-btn"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (ready) {
    return <VotingRoom />;
  }

  return (
    <div className="gradient-bg room-container">
      <div className="room-content">
        <div className="card card-shadow">
          <div className="room-join-header">
            <h2 className="room-join-title">👥 Entrar na Sala</h2>
            <p className="room-join-subtitle">
              Sala: <span className="room-id">{id}</span>
            </p>
          </div>

          <div className="room-join-form">
            {/* Exibe erros de conexão */}
            {connectionError && (
              <div style={{ marginBottom: '1rem' }}>
                <ErrorAlert message={connectionError} onClose={clearError} />
              </div>
            )}

            {/* Exibe erros de entrada na sala */}
            {joinError && (
              <div style={{ marginBottom: '1rem' }}>
                <ErrorAlert
                  message={joinError}
                  onClose={() => setJoinError(null)}
                />
              </div>
            )}
            <div className="room-input-group">
              <label htmlFor="name" className="room-label">
                Seu nome
              </label>
              <input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={handleNameChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className={`input room-input ${joinError ? 'input-error' : ''}`}
                maxLength={50}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={!name.trim() || loading}
              className="btn btn-primary btn-lg room-join-btn"
            >
              {loading ? (
                <>
                  <span className="room-loading-icon animate-spin">⏳</span>
                  Entrando...
                </>
              ) : (
                <>👥 Entrar na Sala</>
              )}
            </button>

            <div className="room-back-link">
              <button onClick={() => navigate('/')} className="room-back-btn">
                ← Voltar ao início
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
