// Room.tsx
import { LiveObject } from '@liveblocks/client';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoomProvider } from '../../liveblocks.config';
import { VotingRoom } from '../VotingRoom';
import "./Room.css";

export const Room: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const storedName = localStorage.getItem("userName") || "";
  const [name, setName] = React.useState(storedName);
  const [ready, setReady] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    // Só entra automaticamente se já tem um nome salvo no localStorage
    if (storedName && storedName.trim()) {
      setReady(true);
    }
  }, [storedName]);

  const handleJoinRoom = () => {
    if (!name.trim()) {
      alert("Nome obrigatório");
      return;
    }
    setLoading(true);
    localStorage.setItem("userName", name.trim());
    setName(name.trim());
    setTimeout(() => {
      setReady(true);
      setLoading(false);
    }, 500);
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
            <h2 className="room-error-title">
              Erro
            </h2>
            <p className="room-error-message">
              ID da sala inválido
            </p>
            <button 
              onClick={() => navigate("/")} 
              className="btn btn-primary room-error-btn"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="gradient-bg room-container">
        <div className="room-content">
          <div className="card card-shadow">
            <div className="room-join-header">
              <h2 className="room-join-title">
                👥 Entrar na Sala
              </h2>
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
                  onChange={(e) => setName(e.target.value)}
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
                  <>
                    👥 Entrar na Sala
                  </>
                )}
              </button>

              <div className="room-back-link">
                <button 
                  onClick={() => navigate("/")}
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
  }

  return (
    <RoomProvider
      id={id}
      initialPresence={{ name, vote: null }}
      initialStorage={{
        reveal: new LiveObject({ value: false })
      }}
    >
      <VotingRoom />
    </RoomProvider>
  );
};
