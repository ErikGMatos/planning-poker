/**
 * Utilitários para validação de dados
 */

/**
 * Valida se o nome do usuário é válido
 */
export const validateUserName = (
  name: string
): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }

  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Nome deve ter no máximo 50 caracteres' };
  }

  // Verifica se contém apenas caracteres válidos (letras, números, espaços e alguns símbolos)
  const validNameRegex = /^[a-zA-ZÀ-ÿ0-9\s\-_.]+$/;
  if (!validNameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error:
        'Nome contém caracteres inválidos. Use apenas letras, números, espaços, hífens, underscores e pontos',
    };
  }

  return { isValid: true };
};

/**
 * Sanitiza o nome do usuário removendo espaços extras
 */
export const sanitizeUserName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' ');
};
