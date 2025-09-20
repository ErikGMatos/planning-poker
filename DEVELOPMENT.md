# Guia de Desenvolvimento

Este projeto está configurado com EditorConfig, Prettier e ESLint para manter a consistência do código.

## Ferramentas Configuradas

### EditorConfig

- Configuração de indentação, charset e quebras de linha
- Arquivo: `.editorconfig`

### Prettier

- Formatação automática de código
- Configuração: `.prettierrc`
- Ignorar arquivos: `.prettierignore`

### ESLint

- Análise estática de código
- Integração com Prettier
- Configuração: `eslint.config.js`

## Scripts Disponíveis

```bash
# Executar linting
yarn lint

# Corrigir problemas de linting automaticamente
yarn lint:fix

# Formatar código com Prettier
yarn format

# Verificar formatação sem alterar arquivos
yarn format:check
```

## Configuração do VS Code

O projeto inclui configurações do VS Code (`.vscode/settings.json`) que:

- Formata o código automaticamente ao salvar
- Executa o ESLint automaticamente
- Usa o Prettier como formatador padrão

### Extensões Recomendadas

Instale as seguintes extensões no VS Code:

- Prettier - Code formatter
- ESLint
- EditorConfig for VS Code
- Tailwind CSS IntelliSense
- TypeScript Importer

## Como Usar

1. **Desenvolvimento**: O código será formatado automaticamente ao salvar
2. **Antes do commit**: Execute `yarn lint` para verificar problemas
3. **Correção automática**: Use `yarn lint:fix` para corrigir problemas automaticamente
4. **Formatação manual**: Use `yarn format` para formatar todo o projeto

## Configurações

### Prettier

- Aspas simples
- Ponto e vírgula obrigatório
- 2 espaços de indentação
- Quebra de linha no final do arquivo

### ESLint

- Regras do TypeScript
- Regras do React
- Integração com Prettier
- Validação de hooks do React
