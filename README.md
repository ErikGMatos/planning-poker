# Planning Poker 🃏

[![Netlify Status](https://api.netlify.com/api/v1/badges/91eee342-7358-40a3-a1e9-6b424e9cd4e1/deploy-status)](https://app.netlify.com/projects/planning-poker-crm/deploys)

Uma aplicação moderna de Planning Poker para refinamento de histórias em equipes ágeis, construída com React, TypeScript, Vite e Liveblocks.

## ✨ Funcionalidades

- 🎯 **Votação em tempo real** com sincronização entre participantes
- 🔢 **Opções flexíveis**: Números de 1-16 + valores customizados
- 👥 **Até 10 participantes** por sala com controle robusto de capacidade
- 🎨 **Interface dark moderna** com gradientes e animações
- 📱 **Totalmente responsiva** para desktop, tablet e mobile
- 🚀 **Revelação flexível** sem bloqueio por participantes ausentes
- 📊 **Estatísticas automáticas** (média, menor, maior)
- 🔗 **Compartilhamento fácil** de salas via link

## 🚀 Como executar

### Pré-requisitos

- Node.js 18+
- Yarn ou npm
- Conta no [Liveblocks](https://liveblocks.io/)

### Configuração

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd planning-poker
```

2. **Instale as dependências**

```bash
yarn install
# ou
npm install
```

3. **Configure as variáveis de ambiente**

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e adicione sua chave do Liveblocks
VITE_LIVEBLOCKS_PUBLIC_KEY=sua_chave_publica_aqui
```

4. **Obtenha sua chave do Liveblocks**
   - Acesse [liveblocks.io/dashboard](https://liveblocks.io/dashboard)
   - Crie um novo projeto
   - Copie a **Public Key** para o arquivo `.env`

5. **Execute o projeto**

```bash
yarn dev
# ou
npm run dev
```

6. **Acesse a aplicação**
   - Abra [http://localhost:5174](http://localhost:5174)

## 🎮 Como usar

### Criando uma sala

1. Digite seu nome na página inicial
2. Clique em "🚀 Criar Sala"
3. Compartilhe o link da sala com sua equipe

### Votando

1. Escolha um valor de 1-16 ou clique em ✏️ para valor customizado
2. Aguarde outros participantes votarem
3. Clique em "👁️ Revelar Votos" quando pronto
4. Veja as estatísticas e inicie nova votação com "🔄 Nova Votação"

## 🛠️ Tecnologias

- **React 18** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Liveblocks** - Colaboração em tempo real
- **CSS3** - Estilização com gradientes e animações
- **React Router** - Navegação entre páginas

## 📁 Estrutura do projeto

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
│   ├── Home/           # Página inicial
│   ├── Room/           # Página de entrada na sala
│   └── VotingRoom/     # Sala de votação
├── liveblocks.config.ts # Configuração do Liveblocks
├── routes.tsx          # Configuração de rotas
└── main.tsx           # Ponto de entrada
```

## 🎨 Design System

### Cores principais

- **Background**: Gradiente escuro (`#0f172a` → `#334155`)
- **Cards**: `#1e293b` com bordas `#475569`
- **Primário**: Gradiente azul (`#3b82f6` → `#1d4ed8`)
- **Sucesso**: Gradiente verde (`#10b981` → `#059669`)
- **Aviso**: Gradiente laranja (`#f59e0b` → `#d97706`)

### Animações

- **Hover effects**: Transform e box-shadow
- **Loading states**: Pulse e shimmer
- **Transições**: 0.3s ease para suavidade

## 🔒 Segurança

- ✅ Chaves de API em variáveis de ambiente
- ✅ Arquivo `.env` no `.gitignore`
- ✅ Validação de entrada de dados
- ✅ Controle de capacidade de salas

## 📝 Scripts disponíveis

```bash
# Desenvolvimento
yarn dev

# Build para produção
yarn build

# Preview da build
yarn preview

# Linting
yarn lint
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se encontrar algum problema:

1. Verifique se todas as dependências estão instaladas
2. Confirme se a chave do Liveblocks está configurada corretamente
3. Verifique se o arquivo `.env` existe e está no formato correto
4. Abra uma issue no repositório com detalhes do problema

---

Feito com ❤️ para equipes ágeis

# Teste
