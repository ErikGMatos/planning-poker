import React from 'react';

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

/**
 * Componente para exibir erros de forma consistente
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  return (
    <div className="error-alert">
      <div className="error-alert-content">
        <span className="error-alert-icon">⚠️</span>
        <span className="error-alert-message" style={{ margin: '12px' }}>
          {message}
        </span>
        <button
          style={{ cursor: 'pointer' }}
          className="error-alert-close"
          onClick={onClose}
          aria-label="Fechar erro"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
