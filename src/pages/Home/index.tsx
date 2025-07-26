import { nanoid } from "nanoid";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Tenta pegar nome no localStorage
  const storedName = localStorage.getItem("userName") || "";
  const [name, setName] = React.useState(storedName);

  // Cria sala nova (id aleatório)
  const createRoom = () => {
    if (!name) {
      alert("Por favor, digite seu nome");
      return;
    }
    const roomId = nanoid(6);
    localStorage.setItem("userName", name);
    navigate(`/room/${roomId}`);
  };

  return (
    <div>
      <h1>Bem-vindo ao Poker Planning</h1>
      
        <input
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      
      <button onClick={createRoom}>Criar sala nova</button>
      <p>Ou entre numa sala pelo link</p>
    </div>
  );
}
