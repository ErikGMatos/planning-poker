#!/usr/bin/env node

import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

// Configurações
const HUB_URL = 'https://hhub.webmotors.com.br/PlanningPoker.Api/planingHub';

// Métodos do socket
const SocketMethods = {
  CreateRoom: "CreateRoomAsync",
  JoinRoomAsync: "JoinRoomAsync",
  LeftRoomAsync: "LeftRoomAsync",
  Vote: "VoteAsync",
  Reveal: "RevealAsync",
  Reset: "ResetAsync",
  Voted: "Voted",
  UserChanged: "UserChanged", 
  Revealed: "Revealed",
  Reseted: "Reseted",
};

async function testRoomUsers() {
  console.log('🧪 Testando usuários da sala...');
  console.log('🔗 URL:', HUB_URL);
  
  let connection = null;
  let roomId = null;
  
  try {
    // Criar conexão
    console.log('\n📡 Criando conexão...');
    connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging("Information")
      .build();

    // Adicionar listeners para eventos
    connection.on(SocketMethods.UserChanged, (room) => {
      console.log('👥 UserChanged recebido:');
      console.log('📊 Usuários na sala:', room.users?.length || 0);
      console.log('📋 Lista de usuários:', JSON.stringify(room.users, null, 2));
    });

    connection.onclose((error) => {
      console.log('🔌 Conexão fechada:', error || 'Sem erro');
    });

    // Conectar
    console.log('🔌 Conectando...');
    await connection.start();
    console.log('✅ Conectado com sucesso!');

    // 1. Criar sala
    console.log('\n🏠 1. Criando sala...');
    const createRoomCommand = {
      name: `Sala Teste Usuários ${Date.now()}`,
      description: 'Teste de usuários',
      votingOptions: ['1', '2', '3', '5', '8', '13', '21', '?']
    };

    const createResult = await connection.invoke(SocketMethods.CreateRoom, createRoomCommand);
    console.log('✅ Sala criada!');
    console.log('🆔 ID da sala:', createResult.id);
    console.log('👥 Usuários após criação:', createResult.users?.length || 0);
    console.log('📋 Lista de usuários:', JSON.stringify(createResult.users, null, 2));
    
    roomId = createResult.id;

    // Aguardar um pouco para ver se recebemos eventos
    console.log('\n⏳ Aguardando eventos por 2 segundos...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Fazer join na sala
    console.log('\n🚪 2. Fazendo join na sala...');
    const joinCommand = {
      roomId: roomId,
      user: {
        id: `test-user-${Date.now()}`,
        name: 'Usuário Teste',
        vote: null
      }
    };

    console.log('📤 Comando join:', JSON.stringify(joinCommand, null, 2));
    const joinResult = await connection.invoke(SocketMethods.JoinRoomAsync, joinCommand);
    console.log('✅ Join realizado!');
    console.log('📥 Resposta do join:', JSON.stringify(joinResult, null, 2));
    
    if (joinResult && joinResult.users) {
      console.log('👥 Usuários após join:', joinResult.users.length);
      console.log('📋 Lista de usuários:', JSON.stringify(joinResult.users, null, 2));
    } else {
      console.log('⚠️ joinResult é null ou não tem users');
    }

    // Aguardar eventos
    console.log('\n⏳ Aguardando eventos por 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. Fazer join com segundo usuário
    console.log('\n🚪 3. Fazendo join com segundo usuário...');
    const joinCommand2 = {
      roomId: roomId,
      user: {
        id: `test-user-2-${Date.now()}`,
        name: 'Segundo Usuário',
        vote: null
      }
    };

    console.log('📤 Comando join 2:', JSON.stringify(joinCommand2, null, 2));
    const joinResult2 = await connection.invoke(SocketMethods.JoinRoomAsync, joinCommand2);
    console.log('✅ Join 2 realizado!');
    console.log('👥 Usuários após join 2:', joinResult2.users?.length || 0);
    console.log('📋 Lista de usuários:', JSON.stringify(joinResult2.users, null, 2));

    // Aguardar eventos finais
    console.log('\n⏳ Aguardando eventos finais por 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    console.error('📋 Detalhes do erro:', {
      message: error.message,
      stack: error.stack
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
testRoomUsers()
  .then(() => {
    console.log('\n🎉 Teste concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
