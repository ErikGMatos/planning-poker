import React, { useEffect, useState } from 'react';

import { ErrorAlert } from '../components/ErrorAlert';
import { useRoomCreation } from '../hooks/useRoomCreation';
import { useUserManagement } from '../hooks/useUserManagement';
import { validateUserName, sanitizeUserName } from '../utils/validation';

import '../../Home/Home.css';

export const HomeContent = () => {
  const { isCreating, error, createNewRoom, clearError, clearCurrentRoom } =
    useRoomCreation();
  const { currentUser } = useUserManagement();
  const [name, setName] = useState(currentUser?.name || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Limpa a sala atual quando o componente monta
  useEffect(() => {
    clearCurrentRoom();
  }, [clearCurrentRoom]);

  // Atualiza o nome quando o usuário atual mudar
  useEffect(() => {
    if (currentUser?.name) {
      setName(currentUser.name);
    }
  }, [currentUser?.name]);

  const handleCreate = async () => {
    // Limpa erros anteriores
    setValidationError(null);
    clearError();

    // Valida o nome
    const validation = validateUserName(name);
    if (!validation.isValid) {
      setValidationError(validation.error!);
      return;
    }

    // Sanitiza o nome e cria a sala
    const sanitizedName = sanitizeUserName(name);
    await createNewRoom(sanitizedName);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating) {
      handleCreate();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    // Limpa erro de validação quando o usuário começa a digitar
    if (validationError) {
      setValidationError(null);
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
            {/* Exibe erros de validação */}
            {validationError && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {validationError}
              </div>
            )}

            {/* Exibe erros de criação de sala */}
            {error && <ErrorAlert message={error} onClose={clearError} />}

            <div className="home-input-group">
              <label htmlFor="name" className="home-label">
                Seu nome
              </label>
              <input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={handleNameChange}
                onKeyPress={handleKeyPress}
                disabled={isCreating}
                className={`input home-input ${validationError ? 'input-error' : ''}`}
                maxLength={50}
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={!name.trim() || isCreating}
              className="btn btn-primary btn-lg home-create-btn"
            >
              {isCreating ? (
                <>
                  <span className="animate-spin">⏳ </span>
                  Criando sala...
                </>
              ) : (
                <>🚀 Criar Nova Sala</>
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
