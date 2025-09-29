import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../Room/Room.css';
import type { User } from '../types';
import { useWebsocket } from '../useWebsocket';
import { VotingRoom } from '../VotingRoom/VotingRoom';

export const RefatoradoRoom = () => {
  const navigate = useNavigate();
  const { joinRoom, connect, setMe, me } = useWebsocket();

  const { id = '' } = useParams<{ id: string }>();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enterAutomatically = async () => {
      if (!id) return;

      setLoading(true);
      try {
        await connect();
        await joinRoom(id);
        setReady(true);
      } catch (error) {
        console.error('Erro ao entrar automaticamente:', error);
      } finally {
        setLoading(false);
      }
    };

    // Se já tem usuário (vem da home), entra automaticamente
    if (me?.name && id) {
      enterAutomatically();
    }
  }, [connect, id, joinRoom, me?.name]); // ← Apenas id como dependência

  const handleJoinRoom = async () => {
    if (!name.trim()) {
      alert('Nome obrigatório');
      return;
    }

    setLoading(true);
    try {
      await connect();

      // Preservar o ID existente se disponível, senão criar novo
      let _me: User | null = me ? { ...me } : null;

      if (_me) {
        _me.vote = null;
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
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      alert('Erro ao entrar na sala. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
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
              onClick={() => navigate('/refatorado')}
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
            <div className="room-input-group">
              <label htmlFor="name" className="room-label">
                Seu nome
              </label>
              <input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="input room-input"
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
              <button
                onClick={() => navigate('/refatorado')}
                className="room-back-btn"
              >
                ← Voltar ao início
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
