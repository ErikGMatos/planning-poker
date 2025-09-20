import React, { useState } from 'react';
import '../../VotingRoom/VotingRoom.css';
import { useWebsocket } from '../useWebsocket';

const MAX_PARTICIPANTS = 10;

export const VotingRoom: React.FC = () => {
  const {
    room,
    me,
    vote: doVote,
    reveal: doReveal,
    reset: doReset,
  } = useWebsocket();
  const [copied, setCopied] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!room || !me) {
    return (
      <div className='gradient-bg voting-room-container'>
        <div className='voting-room-content'>
          <div
            className='card card-shadow'
            style={{ maxWidth: '28rem', margin: '0 auto', textAlign: 'center' }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#f87171',
                marginBottom: '1rem',
              }}
            >
              🔌 Conectando...
            </h2>
            <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
              Aguarde enquanto tentamos conectar à sala...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // O backend já inclui o usuário atual no room.users
  const allUsers = room.users;

  const votedCount = allUsers.filter(u => u.vote !== null).length;

  const revealedVotes = allUsers
    .map(u => u.vote)
    .filter((v): v is number => typeof v === 'number');

  const average =
    revealedVotes.length > 0
      ? (
          revealedVotes.reduce((a, b) => a + b, 0) / revealedVotes.length
        ).toFixed(1)
      : null;

  const maxVote = revealedVotes.length > 0 ? Math.max(...revealedVotes) : null;
  const minVote = revealedVotes.length > 0 ? Math.min(...revealedVotes) : null;

  const getInitials = (name: string) => {
    let nameInitials = name;
    if (!name) nameInitials = '';
    return nameInitials
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseOptions: (number | string)[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];
  const customVote = me.vote && !baseOptions.includes(me.vote) ? me.vote : null;
  const options: (number | string)[] = customVote
    ? [...baseOptions, customVote, 'custom']
    : [...baseOptions, 'custom'];

  const handleVote = (opt: number | string) => {
    if (opt === 'custom') {
      setShowCustomInput(true);
      return;
    }
    const voteValue = typeof opt === 'number' ? opt : null;
    if (voteValue !== null)
      doVote({ userId: me.id, roomId: room.id, vote: voteValue });
    setShowCustomInput(false);
  };

  const handleCustomVote = () => {
    const value = parseInt(customValue);
    if (!isNaN(value) && value > 0) {
      doVote({ userId: me.id, roomId: room.id, vote: value });
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  const handleCustomKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCustomVote();
    else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  const handleReset = () => doReset({ roomId: room.id });

  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar link:', err);
    }
  };

  const reveal = room.status === 2;

  return (
    <div className='gradient-bg voting-room-container'>
      <div className='voting-room-content'>
        {/* Header */}
        <div className='voting-room-header'>
          <div>
            <h1 className='voting-room-title'>Planning Poker</h1>
            <p className='voting-room-subtitle'>
              Olá, <span className='user-name'>{me.name}</span>! Escolha sua
              estimativa.
            </p>
          </div>
          <div className='voting-room-actions'>
            <button onClick={copyRoomLink} className='btn btn-secondary'>
              {copied ? '✓ Copiado!' : '📋 Compartilhar'}
            </button>
          </div>
        </div>

        <div className='voting-room-grid'>
          {/* Voting Cards */}
          <div className='voting-section'>
            {/* Vote Options */}
            <div className='card vote-options-card'>
              <div className='vote-options-header'>
                <h2 className='vote-options-title'>Escolha sua estimativa</h2>
                <p className='vote-options-description'>
                  Selecione o número de pontos que você acredita que esta
                  história vale
                </p>
              </div>
              <div className='vote-options-grid'>
                {options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleVote(opt)}
                    className={`vote-option-btn ${me.vote === opt ? 'selected' : ''}`}
                  >
                    {opt === 'custom' ? '✏️' : opt}
                  </button>
                ))}
              </div>

              {showCustomInput && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#374151',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563',
                  }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      marginBottom: '0.5rem',
                      color: '#cbd5e1',
                    }}
                  >
                    Digite um valor personalizado:
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type='number'
                      min='1'
                      placeholder='Ex: 20'
                      value={customValue}
                      onChange={e => setCustomValue(e.target.value)}
                      onKeyPress={handleCustomKeyPress}
                      className='input'
                      style={{ flex: 1 }}
                      autoFocus
                    />
                    <button
                      onClick={handleCustomVote}
                      disabled={
                        !customValue.trim() ||
                        isNaN(parseInt(customValue)) ||
                        parseInt(customValue) <= 0
                      }
                      className='btn btn-primary'
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomValue('');
                      }}
                      className='btn btn-secondary'
                    >
                      ✕
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.5rem',
                    }}
                  >
                    Pressione Enter para confirmar ou Escape para cancelar
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='card action-buttons-card'>
              <div className='action-buttons-container'>
                <button
                  onClick={() => doReveal({ roomId: room.id })}
                  disabled={reveal}
                  className='btn btn-primary btn-lg reveal-btn'
                >
                  👁️ Revelar Votos{' '}
                  {votedCount < allUsers.length &&
                    `(aguardando ${allUsers.length - votedCount} votos)`}
                </button>

                <button
                  onClick={handleReset}
                  className='btn btn-secondary reset-btn'
                >
                  🔄 Nova Votação
                </button>
              </div>
            </div>

            {/* Results */}
            {reveal && revealedVotes.length > 0 && (
              <div className='card results-card'>
                <h3 className='results-title'>Resultados da Votação</h3>
                <div className='results-grid'>
                  {average && (
                    <div className='result-item average'>
                      <div className='result-value average'>{average}</div>
                      <div className='result-label average'>Média</div>
                    </div>
                  )}
                  {minVote !== null && (
                    <div className='result-item min'>
                      <div className='result-value min'>📉 {minVote}</div>
                      <div className='result-label min'>Menor</div>
                    </div>
                  )}
                  {maxVote !== null && (
                    <div className='result-item max'>
                      <div className='result-value max'>📈 {maxVote}</div>
                      <div className='result-label max'>Maior</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Participants */}
          <div className='participants-section'>
            <div className='card participants-card'>
              <div className='participants-header'>
                <h3 className='participants-title'>
                  👥 Participantes ({allUsers.length}/{MAX_PARTICIPANTS})
                </h3>
                <p className='participants-count'>
                  {votedCount} de {allUsers.length} votaram
                </p>
                {allUsers.length >= MAX_PARTICIPANTS - 2 && (
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color:
                        allUsers.length >= MAX_PARTICIPANTS - 1
                          ? '#f87171'
                          : '#fbbf24',
                      marginTop: '0.25rem',
                    }}
                  >
                    {allUsers.length === MAX_PARTICIPANTS
                      ? '🚫 Sala lotada'
                      : `⚠️ ${MAX_PARTICIPANTS - allUsers.length} vaga(s) restante(s)`}
                  </p>
                )}
              </div>
              <div className='participants-list'>
                {allUsers.map(user => (
                  <div key={user.id} className='participant-item'>
                    <div className='participant-info'>
                      <div className='avatar'>
                        <span>{getInitials(user.name)}</span>
                      </div>
                      <span className='participant-name'>
                        {user.name}
                        {user.id === me.id && ' (você)'}
                      </span>
                    </div>
                    <div className='participant-status'>
                      {reveal ? (
                        user.vote !== null ? (
                          <span className='badge badge-blue'>{user.vote}</span>
                        ) : (
                          <span className='badge badge-gray'>-</span>
                        )
                      ) : (
                        <span
                          className={`badge ${user.vote !== null ? 'badge-green' : 'badge-yellow'}`}
                        >
                          {user.vote !== null ? '✓' : '⏳'}
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
