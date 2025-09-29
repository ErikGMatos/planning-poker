import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { User } from '../types';
import { useWebsocket } from '../useWebsocket';

import '../../Home/Home.css';

export const HomeContent = () => {
  const navigate = useNavigate();
  const { createRoom, connect, setRoom, setMe, me } = useWebsocket();
  const [name, setName] = useState(me?.name || '');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setRoom(null);
  }, [setRoom]);

  const handleCreate = async () => {
    setLoading(true);
    await connect();

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

    const newRoom = await createRoom(name);
    //await joinRoom(newRoom.id);
    if (newRoom.id) {
      navigate(`/refatorado-room/${newRoom.id}`);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <div className="gradient-bg home-container">
      <div className="home-content">
        {/* Header */}
        <div className="home-header">
          <h1 className="home-title">Planning Poker</h1>
        </div>

        {/* Main Card */}
        <div className="card card-shadow home-main-card">
          <div className="home-card-header">
            <h2 className="home-card-title">Começar Sessão</h2>
            <p className="home-card-description">
              Digite seu nome para criar uma nova sala de votação
            </p>
          </div>

          <div className="home-form">
            <div className="home-input-group">
              <label htmlFor="name" className="home-label">
                Seu nome
              </label>
              <input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input home-input"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || loading}
              className="btn btn-primary btn-lg home-create-btn"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳ </span>
                  Criando sala...
                </>
              ) : (
                <>Criar Nova Sala</>
              )}
            </button>
            <div className="home-help-text">
              <p>
                Ou entre em uma sala existente através do link compartilhado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
