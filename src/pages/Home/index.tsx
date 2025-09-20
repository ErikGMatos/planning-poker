import { nanoid } from 'nanoid';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Tenta pegar nome no localStorage
  const storedName = localStorage.getItem('userName') || '';
  const [name, setName] = React.useState(storedName);

  // Cria sala nova (id aleatório)
  const createRoom = () => {
    if (!name.trim()) {
      alert('Por favor, digite seu nome');
      return;
    }
    const roomId = nanoid(6);
    localStorage.setItem('userName', name.trim());
    navigate(`/room/${roomId}`);
  };

  // // Cria sala nova com websocket da empresa
  // const createWebsocketRoom = () => {
  //   if (!name.trim()) {
  //     alert("Por favor, digite seu nome");
  //     return;
  //   }
  //   const roomId = nanoid(6);
  //   localStorage.setItem("userName", name.trim());
  //   navigate(`/websocket-room/${roomId}`);
  // };

  // // Navega para versão refatorada
  // const goToRefatorado = () => {
  //   navigate('/refatorado');
  // };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      createRoom();
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

            {/* <div className="home-buttons"> */}
            <button
              onClick={createRoom}
              disabled={!name.trim()}
              className="btn btn-primary btn-lg home-create-btn"
            >
              Criar Nova Sala
            </button>

            {/* <button
                onClick={createWebsocketRoom}
                disabled={!name.trim()}
                className="btn btn-secondary btn-lg home-create-btn"
              >
                Criar Nova Sala (Websocket Empresa)
              </button>

              <button
                onClick={goToRefatorado}
                className="btn btn-success btn-lg home-create-btn"
              >
                🚀 Versão Refatorada (Websocket)
              </button> */}
            {/* </div> */}

            <div className="home-help-text">
              <p>
                Ou entre em uma sala existente através do link compartilhado
              </p>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  marginTop: '0.5rem',
                }}
              >
                ⚠️ Limite máximo: 10 participantes por sala
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
