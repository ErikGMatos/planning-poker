export interface User {
  id: string;
  name: string;
  vote: number | null;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  votingOptions: string[];
  status: number;
  users: User[];
}

export const RoomStatus = {
  Voting: 1,
  Voted: 2,
} as const;

export const SocketMethods = {
  // Eventos recebidos
  Voted: "Voted",
  UserChanged: "UserChanged", 
  Revealed: "Revealed",
  Reseted: "Reseted",
  
  // Métodos para invocar
  CreateRoom: "CreateRoomAsync",
  JoinRoomAsync: "JoinRoomAsync",
  LeftRoomAsync: "LeftRoomAsync",
  Vote: "VoteAsync",
  Reveal: "RevealAsync",
  Reset: "ResetAsync",
} as const;
