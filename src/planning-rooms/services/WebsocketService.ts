/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HubConnectionBuilder,
  HttpTransportType,
  type HubConnection,
  HubConnectionState,
} from '@microsoft/signalr';

import { SocketMethods, type Room } from '../types/types';

class SimpleWebsocketService {
  private connection: HubConnection | null = null;
  private readonly hubUrl =
    'https://hhub.webmotors.com.br/PlanningPoker.Api/planingHub';
  private connectingPromise: Promise<HubConnection> | null = null;

  get state() {
    return this.connection?.state ?? HubConnectionState.Disconnected;
  }

  async connect(): Promise<HubConnection> {
    // Se já está conectado, retorna a conexão existente
    if (this.connection && this.state === HubConnectionState.Connected) {
      return this.connection;
    }

    // Se já está tentando conectar, aguarda a promessa existente
    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    // Cria uma nova promessa de conexão
    this.connectingPromise = this._doConnect();

    try {
      const connection = await this.connectingPromise;
      return connection;
    } finally {
      this.connectingPromise = null;
    }
  }

  private async _doConnect(): Promise<HubConnection> {
    // Para a conexão existente se houver
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
        console.warn('Erro ao parar conexão anterior:', error);
      }
      this.connection = null;
    }

    // Cria nova conexão
    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    // Aguarda a conexão estar realmente estabelecida
    await this.connection.start();

    // Aguarda um pouco mais para garantir que a conexão está estável
    await new Promise(resolve => setTimeout(resolve, 100));

    return this.connection;
  }

  async disconnect(): Promise<void> {
    // Cancela qualquer tentativa de conexão em andamento
    this.connectingPromise = null;

    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
        console.warn('Erro ao desconectar:', error);
      } finally {
        this.connection = null;
      }
    }
  }

  // -------------------------
  // Métodos invoke
  // -------------------------
  private ensureConnection() {
    if (!this.connection) {
      throw new Error('Não conectado ao WebSocket');
    }

    if (this.connection.state !== HubConnectionState.Connected) {
      throw new Error(
        `Conexão não está ativa. Estado atual: ${this.connection.state}`
      );
    }
  }

  private async waitForConnection(): Promise<void> {
    if (!this.connection) {
      throw new Error('Não conectado ao WebSocket');
    }

    // Aguarda até a conexão estar estabelecida
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos máximo

    while (
      this.connection.state !== HubConnectionState.Connected &&
      attempts < maxAttempts
    ) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (this.connection.state !== HubConnectionState.Connected) {
      throw new Error(
        `Falha ao estabelecer conexão. Estado: ${this.connection.state}`
      );
    }
  }

  async createRoom(command: unknown): Promise<Room> {
    await this.waitForConnection();
    return this.connection!.invoke(SocketMethods.CreateRoom, command);
  }

  async joinRoom(command: unknown) {
    await this.waitForConnection();
    return this.connection!.invoke(SocketMethods.JoinRoomAsync, command);
  }

  async leaveRoom(command: unknown) {
    await this.waitForConnection();
    return this.connection!.invoke(SocketMethods.LeftRoomAsync, command);
  }

  async vote(command: unknown) {
    await this.waitForConnection();
    return this.connection!.invoke(SocketMethods.Vote, command);
  }

  async reveal(command: unknown) {
    await this.waitForConnection();
    return this.connection!.invoke(SocketMethods.Reveal, command);
  }

  async reset(command: unknown) {
    await this.waitForConnection();
    return this.connection!.invoke(SocketMethods.Reset, command);
  }

  async getState(): Promise<HubConnectionState> {
    this.ensureConnection();
    return this.connection!.state;
  }

  // -------------------------
  // Listeners
  // -------------------------
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.connection) {
      console.warn('Tentativa de adicionar listener sem conexão ativa');
      return;
    }
    this.connection.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.connection) {
      return;
    }

    if (!callback) {
      this.connection.off(event);
      return;
    }
    this.connection.off(event, callback);
  }

  // Remove todos os listeners de um evento específico
  removeAllListenersForEvent(event: string) {
    if (!this.connection) {
      return;
    }
    this.connection.off(event);
  }

  // Remove todos os listeners
  removeAllListeners() {
    if (!this.connection) {
      return;
    }
    // Remove listeners específicos que sabemos que existem
    const events = [
      SocketMethods.UserChanged,
      SocketMethods.Voted,
      SocketMethods.Revealed,
      SocketMethods.Reseted,
    ];

    events.forEach(event => {
      this.connection!.off(event);
    });
  }
}

export default new SimpleWebsocketService();
