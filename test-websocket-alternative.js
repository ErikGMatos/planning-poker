#!/usr/bin/env node

import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

// Configurações
const HUB_URL = 'https://hhub.webmotors.com.br/PlanningPoker.Api/planingHub';

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

async function testWebsocketConnection() {
  console.log('🧪 Iniciando teste alternativo do WebSocket...');
  console.log('🔗 URL:', HUB_URL);

  let connection = null;

  try {
    // Tentar diferentes configurações de conexão
    console.log('\n📡 Tentativa 1: Conexão padrão...');
    connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    try {
      await connection.start();
      console.log('✅ Conectado com sucesso!');
    } catch (error) {
      console.log('❌ Falha na tentativa 1:', error.message);

      // Tentativa 2: Sem skipNegotiation
      console.log('\n📡 Tentativa 2: Sem skipNegotiation...');
      connection = new HubConnectionBuilder()
        .withUrl(HUB_URL, {
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .build();

      try {
        await connection.start();
        console.log('✅ Conectado com sucesso na tentativa 2!');
      } catch (error2) {
        console.log('❌ Falha na tentativa 2:', error2.message);

        // Tentativa 3: Com Server-Sent Events
        console.log('\n📡 Tentativa 3: Server-Sent Events...');
        connection = new HubConnectionBuilder()
          .withUrl(HUB_URL, {
            transport: HttpTransportType.ServerSentEvents,
          })
          .withAutomaticReconnect([0, 2000, 10000, 30000])
          .build();

        try {
          await connection.start();
          console.log('✅ Conectado com sucesso na tentativa 3!');
        } catch (error3) {
          console.log('❌ Falha na tentativa 3:', error3.message);
          throw new Error('Todas as tentativas de conexão falharam');
        }
      }
    }

    console.log('📊 Estado da conexão:', connection.state);

    // Testar criação de sala
    console.log('\n🏠 Testando criação de sala...');

    const createRoomCommand = {
      name: `Sala Teste ${Date.now()}`,
      description: 'Sala criada via teste de terminal',
      votingOptions: ['1', '2', '3', '5', '8', '13', '21', '?'],
    };

    console.log(
      '📤 Enviando comando:',
      JSON.stringify(createRoomCommand, null, 2)
    );

    const result = await connection.invoke(
      SocketMethods.CreateRoom,
      createRoomCommand
    );
    console.log('✅ Sala criada com sucesso!');
    console.log('📥 Resposta do servidor:', JSON.stringify(result, null, 2));

    // Testar join na sala (usando o ID retornado na criação)
    if (result && result.id) {
      console.log('\n🚪 Testando join na sala...');

      const joinCommand = {
        roomId: result.id,
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

      const joinResult = await connection.invoke(
        SocketMethods.JoinRoomAsync,
        joinCommand
      );
      console.log('✅ Join realizado com sucesso!');
      console.log(
        '📥 Resposta do servidor:',
        JSON.stringify(joinResult, null, 2)
      );
    } else {
      console.log('⚠️ Não foi possível obter ID da sala para testar join');
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
testWebsocketConnection()
  .then(() => {
    console.log('\n🎉 Teste concluído!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
