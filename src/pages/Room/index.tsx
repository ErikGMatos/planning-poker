// Room.tsx
import { LiveObject } from '@liveblocks/client';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoomProvider } from '../../liveblocks.config';
import { VotingRoom } from '../VotingRoom';

export const Room: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const storedName = localStorage.getItem("userName") || "";
  const [name, setName] = React.useState(storedName);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!name) {
      const promptName = prompt("Digite seu nome para entrar na sala:");
      if (!promptName) {
        alert("Nome obrigatório");
        navigate("/");
      } else {
        localStorage.setItem("userName", promptName);
        setName(promptName);
      }
    } else {
      setReady(true);
    }
  }, [name, navigate]);

  if (!id) return <div>ID da sala inválido</div>;
  if (!ready) return <div>Carregando...</div>;

  return (
    <RoomProvider
      id={id}
      initialPresence={{ name, vote: null }}
      initialStorage={{
        reveal: new LiveObject({ value: false })
      }}
    >
      <VotingRoom />
    </RoomProvider>
  );
};
