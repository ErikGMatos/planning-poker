import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WebsocketProvider } from '../WebsocketContext';

import { VotingRoom } from '../VotingRoom/VotingRoom';
import '../../Room/Room.css';
import { useWebsocket } from '../useWebsocket';


const RoomContent: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { joinRoom, connect, disconnect, me } = useWebsocket();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const enterAutomatically = useCallback(async () => {
    if (!me || !me.name.trim() || ready) return;
    
    setLoading(true);
    try {
      await disconnect();
      await connect();
      await joinRoom(id, me);
      setReady(true);
    } catch (error) {
      console.error('Erro ao entrar automaticamente:', error);
    } finally {
      setLoading(false);
    }
  }, [connect, disconnect, id, joinRoom, me, ready]);

  React.useEffect(() => {
    if (me && me.name.trim() && !ready) {
      setName(me.name);
      enterAutomatically();
    }
  }, [me, ready, enterAutomatically]);

  const handleJoinRoom = async () => {
    if (!name.trim()) {
      alert("Nome obrigatório");
      return;
    }
    
    setLoading(true);
    try {
      await disconnect();
      await connect();
      
      // Preservar o ID existente se disponível, senão criar novo
      const userId = me?.id || crypto.randomUUID();
      const userVote = me?.vote || null;
      
      await joinRoom(id, {
        id: userId,
        name: name.trim(),
        vote: userVote
      });
      
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
            <h2 className="room-error-title">
              Erro
            </h2>
            <p className="room-error-message">
              ID da sala inválido
            </p>
            <button 
              onClick={() => navigate("/refatorado")} 
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
                  onClick={() => navigate("/refatorado")}
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

export const RefatoradoRoom: React.FC = () => {
  return (
    <WebsocketProvider>
      <RoomContent />
    </WebsocketProvider>
  );
};
