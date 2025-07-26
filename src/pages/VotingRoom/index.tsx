import React from "react";
import { useMyPresence, useOthers, useStorage, useMutation, useStatus } from "../../liveblocks.config";
import { useNavigate } from "react-router-dom";
import "./VotingRoom.css";

const MAX_PARTICIPANTS = 10;

export const VotingRoom: React.FC = () => {
  const [presence, setPresence] = useMyPresence();
  const [copied, setCopied] = React.useState(false);
  const [customValue, setCustomValue] = React.useState("");
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const navigate = useNavigate();

  const others = useOthers((others) =>
    others.map((user) => ({
      id: user.connectionId,
      presence: user.presence,
    }))
  );

  // pega o LiveObject "reveal" do storage
  const revealObject = useStorage((root) => root.reveal);
  const reveal = revealObject?.value ?? false;

  const setReveal = useMutation(
    ({ storage }, value: boolean) => {
      const reveal = storage.get("reveal");
      if (reveal) {
        reveal.set("value", value);
      }
    },
    []
  );

  // Monitora o status da conexão WebSocket
  const status = useStatus();

  // Verifica se a sala está cheia (incluindo o usuário atual)
  const totalParticipants = others.length + 1;
  const isRoomFull = totalParticipants > MAX_PARTICIPANTS;

  // Verifica se houve erro de conexão (possivelmente por sala lotada)
  const connectionFailed = status === "disconnected" || status === "reconnecting";

  // Se a sala estiver cheia OU se a conexão falhou, mostra aviso
  if (isRoomFull || connectionFailed) {
    const isConnectionIssue = connectionFailed && !isRoomFull;
    
    return (
      <div className="gradient-bg voting-room-container">
        <div className="voting-room-content">
          <div className="card card-shadow" style={{ maxWidth: '28rem', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#dc2626', marginBottom: '1rem' }}>
              {isConnectionIssue ? '🔌 Problema de Conexão' : '🚫 Sala Lotada'}
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              {isConnectionIssue ? 
                'Não foi possível conectar à sala. Isso pode indicar que a sala está lotada ou há problemas de rede.' :
                `Esta sala já atingiu o limite máximo de ${MAX_PARTICIPANTS} participantes.`
              }
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              {isConnectionIssue ? 
                'Verifique sua conexão ou tente novamente em alguns instantes.' :
                'Tente novamente mais tarde ou crie uma nova sala.'
              }
            </p>
            <button 
              onClick={() => navigate("/")}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              🏠 Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Opções base + valor customizado se existir
  const baseOptions: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const customVote = presence.vote && !baseOptions.includes(presence.vote) ? presence.vote : null;
  const options: (number | string)[] = customVote 
    ? [...baseOptions, customVote, "custom"]
    : [...baseOptions, "custom"];

  const handleVote = (opt: number | string) => {
    if (opt === "custom") {
      setShowCustomInput(true);
      return;
    }
    const vote = typeof opt === "number" ? opt : null;
    setPresence({ vote });
    setShowCustomInput(false);
  };

  const handleCustomVote = () => {
    const value = parseInt(customValue);
    if (!isNaN(value) && value > 0) {
      setPresence({ vote: value });
      setShowCustomInput(false);
      setCustomValue("");
    }
  };

  const handleCustomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomVote();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue("");
    }
  };

  const handleReset = () => {
    setPresence({ vote: null });
    setReveal(false);
  };

  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar link:', err);
    }
  };

  const allUsers = [...others, { id: "me", presence }];
  const revealedVotes = allUsers
    .map((u) => u.presence.vote)
    .filter((v): v is number => typeof v === "number");

  const average =
    revealedVotes.length > 0
      ? (revealedVotes.reduce((a, b) => a + b, 0) / revealedVotes.length).toFixed(1)
      : null;
  
  const maxVote = revealedVotes.length > 0 ? Math.max(...revealedVotes) : null;
  const minVote = revealedVotes.length > 0 ? Math.min(...revealedVotes) : null;

  const votedCount = allUsers.filter(user => user.presence.vote !== null).length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="gradient-bg voting-room-container">
      <div className="voting-room-content">
        {/* Header */}
        <div className="voting-room-header">
          <div>
            <h1 className="voting-room-title">
              Planning Poker
            </h1>
            <p className="voting-room-subtitle">
              Olá, <span className="user-name">{presence.name}</span>! Escolha sua estimativa.
            </p>
          </div>
          
          <div className="voting-room-actions">
            <button
              onClick={copyRoomLink}
              className="btn btn-secondary"
            >
              {copied ? "✓ Copiado!" : "📋 Compartilhar"}
            </button>
          </div>
        </div>

        <div className="voting-room-grid">
          {/* Voting Cards */}
          <div className="voting-section">
            {/* Vote Options */}
            <div className="card vote-options-card">
              <div className="vote-options-header">
                <h2 className="vote-options-title">
                  Escolha sua estimativa
                </h2>
                <p className="vote-options-description">
                  Selecione o número de pontos que você acredita que esta história vale
                </p>
              </div>
              
              <div className="vote-options-grid">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleVote(opt)}
                    className={`vote-option-btn ${presence.vote === opt ? 'selected' : ''}`}
                  >
                    {opt === "custom" ? "✏️" : opt}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              {showCustomInput && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Digite um valor personalizado:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex: 20"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      onKeyPress={handleCustomKeyPress}
                      className="input"
                      style={{ flex: 1 }}
                      autoFocus
                    />
                    <button 
                      onClick={handleCustomVote}
                      disabled={!customValue.trim() || isNaN(parseInt(customValue)) || parseInt(customValue) <= 0}
                      className="btn btn-primary"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomValue("");
                      }}
                      className="btn btn-secondary"
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    Pressione Enter para confirmar ou Escape para cancelar
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="card action-buttons-card">
              <div className="action-buttons-container">
                <button 
                  onClick={() => setReveal(true)} 
                  disabled={reveal}
                  className="btn btn-primary btn-lg reveal-btn"
                >
                  👁️ Revelar Votos {votedCount < allUsers.length && `(aguardando ${allUsers.length - votedCount} votos)`}
                </button>
                
                <button 
                  onClick={handleReset} 
                  className="btn btn-secondary reset-btn"
                >
                  🔄 Nova Votação
                </button>
              </div>
            </div>

            {/* Results */}
            {reveal && revealedVotes.length > 0 && (
              <div className="card results-card">
                <h3 className="results-title">
                  Resultados da Votação
                </h3>
                <div className="results-grid">
                  {average && (
                    <div className="result-item average">
                      <div className="result-value average">
                        {average}
                      </div>
                      <div className="result-label average">
                        Média
                      </div>
                    </div>
                  )}
                  {minVote !== null && (
                    <div className="result-item min">
                      <div className="result-value min">
                        📉 {minVote}
                      </div>
                      <div className="result-label min">
                        Menor
                      </div>
                    </div>
                  )}
                  {maxVote !== null && (
                    <div className="result-item max">
                      <div className="result-value max">
                        📈 {maxVote}
                      </div>
                      <div className="result-label max">
                        Maior
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="participants-section">
            <div className="card participants-card">
              <div className="participants-header">
                <h3 className="participants-title">
                  👥 Participantes ({allUsers.length}/{MAX_PARTICIPANTS})
                </h3>
                <p className="participants-count">
                  {votedCount} de {allUsers.length} votaram
                </p>
                {allUsers.length >= MAX_PARTICIPANTS - 2 && (
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: allUsers.length >= MAX_PARTICIPANTS - 1 ? '#dc2626' : '#f59e0b',
                    marginTop: '0.25rem'
                  }}>
                    {allUsers.length === MAX_PARTICIPANTS ? 
                      '🚫 Sala lotada' : 
                      `⚠️ ${MAX_PARTICIPANTS - allUsers.length} vaga(s) restante(s)`
                    }
                  </p>
                )}
              </div>
              
              <div className="participants-list">
                {allUsers.map((user) => (
                  <div key={user.id} className="participant-item">
                    <div className="participant-info">
                      <div className="avatar">
                        <span>
                          {getInitials(user.presence.name)}
                        </span>
                      </div>
                      <span className="participant-name">
                        {user.presence.name}
                        {user.id === "me" && " (você)"}
                      </span>
                    </div>
                    
                    <div className="participant-status">
                      {reveal ? (
                        user.presence.vote !== null ? (
                          <span className="badge badge-blue">
                            {user.presence.vote}
                          </span>
                        ) : (
                          <span className="badge badge-gray">-</span>
                        )
                      ) : (
                        <span className={`badge ${user.presence.vote !== null ? 'badge-green' : 'badge-yellow'}`}>
                          {user.presence.vote !== null ? "✓" : "⏳"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
