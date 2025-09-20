#!/usr/bin/env node

import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

// Configurações
const HUB_URL = 'https://hhub.webmotors.com.br/PlanningPoker.Api/planingHub';
const ROOM_ID = '2e3cded8-d689-41d1-9006-5f9eeb832efe';

// Métodos do socket
const SocketMethods = {
  CreateRoom: 'CreateRoomAsync',
  JoinRoomAsync: 'JoinRoomAsync',
  LeftRoomAsync: 'LeftRoomAsync',
  Vote: 'VoteAsync',
  Reveal: 'RevealAsync',
  Reset: 'ResetAsync',
  Voted: 'Voted',
  UserChanged: 'UserChanged',
  Revealed: 'Revealed',
  Reseted: 'Reseted',
};

async function testJoinExistingRoom() {
  console.log('🧪 Testando conexão com sala existente...');
  console.log('🔗 URL:', HUB_URL);
  console.log('🏠 ID da Sala:', ROOM_ID);

  let connection = null;

  try {
    // Criar conexão
    console.log('\n📡 Criando conexão...');
    connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    // Adicionar listeners para eventos
    connection.onclose(error => {
      console.log('🔌 Conexão fechada:', error || 'Sem erro');
    });

    connection.onreconnecting(error => {
      console.log('🔄 Reconectando...', error || 'Sem erro');
    });

    connection.onreconnected(connectionId => {
      console.log('✅ Reconectado! ID:', connectionId);
    });

    // Conectar
    console.log('🔌 Conectando...');
    await connection.start();
    console.log('✅ Conectado com sucesso!');
    console.log('📊 Estado da conexão:', connection.state);

    // Tentar entrar na sala existente
    console.log('\n🚪 Tentando entrar na sala existente...');

    const joinCommand = {
      roomId: ROOM_ID,
      user: {
        id: `test-${Date.now()}`,
        name: 'Teste Terminal',
        vote: null,
      },
    };

    console.log(
      '📤 Enviando comando join:',
      JSON.stringify(joinCommand, null, 2)
    );

    try {
      const joinResult = await connection.invoke(
        SocketMethods.JoinRoomAsync,
        joinCommand
      );
      console.log('✅ Join realizado com sucesso!');
      console.log(
        '📥 Resposta do servidor:',
        JSON.stringify(joinResult, null, 2)
      );
    } catch (joinError) {
      console.log('❌ Erro ao entrar na sala:', joinError.message);

      // Tentar criar uma nova sala se não conseguir entrar na existente
      console.log('\n🏠 Tentando criar uma nova sala...');

      const createRoomCommand = {
        name: `Sala Teste ${Date.now()}`,
        description: 'Sala criada via teste de terminal',
        votingOptions: ['1', '2', '3', '5', '8', '13', '21', '?'],
      };

      console.log(
        '📤 Enviando comando create:',
        JSON.stringify(createRoomCommand, null, 2)
      );

      const createResult = await connection.invoke(
        SocketMethods.CreateRoom,
        createRoomCommand
      );
      console.log('✅ Sala criada com sucesso!');
      console.log(
        '📥 Resposta do servidor:',
        JSON.stringify(createResult, null, 2)
      );

      // Tentar entrar na nova sala
      if (createResult && createResult.id) {
        console.log('\n🚪 Tentando entrar na nova sala...');

        const newJoinCommand = {
          roomId: createResult.id,
          user: {
            id: `test-${Date.now()}`,
            name: 'Teste Terminal',
            vote: null,
          },
        };

        console.log(
          '📤 Enviando comando join na nova sala:',
          JSON.stringify(newJoinCommand, null, 2)
        );

        const newJoinResult = await connection.invoke(
          SocketMethods.JoinRoomAsync,
          newJoinCommand
        );
        console.log('✅ Join na nova sala realizado com sucesso!');
        console.log(
          '📥 Resposta do servidor:',
          JSON.stringify(newJoinResult, null, 2)
        );
      }
    }

    // Aguardar um pouco para ver se recebemos eventos
    console.log('\n⏳ Aguardando eventos por 5 segundos...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    console.error('📋 Detalhes do erro:', {
      message: error.message,
      stack: error.stack,
    });
  } finally {
    // Desconectar
    if (connection) {
      console.log('\n🔌 Desconectando...');
      try {
        await connection.stop();
        console.log('✅ Desconectado com sucesso!');
      } catch (error) {
        console.log('⚠️ Erro ao desconectar:', error.message);
      }
    }
  }
}

// Executar teste
testJoinExistingRoom()
  .then(() => {
    console.log('\n🎉 Teste concluído!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
