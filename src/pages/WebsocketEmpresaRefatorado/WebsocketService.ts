/* eslint-disable @typescript-eslint/no-explicit-any */
import { HubConnectionBuilder, HttpTransportType, HubConnection, HubConnectionState } from "@microsoft/signalr";
import { SocketMethods } from "./types";

class SimpleWebsocketService {
  private connection: HubConnection | null = null;
  private readonly hubUrl = "https://hhub.webmotors.com.br/PlanningPoker.Api/planingHub";

  get state() {
    return this.connection?.state ?? HubConnectionState.Disconnected;
  }

  async connect(): Promise<HubConnection> {
    if (this.connection && this.state === HubConnectionState.Connected) {
      return this.connection;
    }

    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    await this.connection.start();
    return this.connection;
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  // -------------------------
  // Métodos invoke
  // -------------------------
  private ensureConnection() {
    if (!this.connection) throw new Error("Não conectado ao WebSocket");
  }

  async createRoom(command: unknown) {
    this.ensureConnection();
    return this.connection!.invoke(SocketMethods.CreateRoom, command);
  }

  async joinRoom(command: unknown) {
    this.ensureConnection();
    return this.connection!.invoke(SocketMethods.JoinRoomAsync, command);
  }

  async leaveRoom(command: unknown) {
    this.ensureConnection();
    return this.connection!.invoke(SocketMethods.LeftRoomAsync, command);
  }

  async vote(command: unknown) {
    this.ensureConnection();
    return this.connection!.invoke(SocketMethods.Vote, command);
  }

  async reveal(command: unknown) {
    this.ensureConnection();
    return this.connection!.invoke(SocketMethods.Reveal, command);
  }

  async reset(command: unknown) {
    this.ensureConnection();
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
    this.connection?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.connection?.off(event, callback);
  }
}

export default new SimpleWebsocketService();
