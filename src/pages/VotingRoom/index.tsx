import React from "react";
import { useMyPresence, useOthers, useStorage, useMutation } from "../../liveblocks.config";

export const VotingRoom: React.FC = () => {
  const [presence, setPresence] = useMyPresence();

  const others = useOthers((others) =>
    others.map((user) => ({
      id: user.connectionId,
      presence: user.presence,
    }))
  );

  // pega o LiveObject "reveal" do storage
const revealObject = useStorage((root) => root.reveal);
const reveal = revealObject?.value ?? false;

const setReveal = useMutation(
  ({ storage }, value: boolean) => {
    const reveal = storage.get("reveal");
    if (reveal) {
      reveal.set("value", value);
    }
  },
  []
);

  const options: (number | string)[] = [1, 2, 3, 5, 8, 13, "?"];

  const handleVote = (opt: number | string) => {
    const vote = typeof opt === "number" ? opt : null;
    setPresence({ vote });
  };

  const handleReset = () => {
    setPresence({ vote: null });
    setReveal(false);
  };

  const allUsers = [...others, { id: "me", presence }];
  const revealedVotes = allUsers
    .map((u) => u.presence.vote)
    .filter((v): v is number => typeof v === "number");

  const average =
    revealedVotes.length > 0
      ? (revealedVotes.reduce((a, b) => a + b, 0) / revealedVotes.length).toFixed(1)
      : null;
  
  const maxVote = revealedVotes.length > 0 ? Math.max(...revealedVotes) : null;

  const minVote = revealedVotes.length > 0 ? Math.min(...revealedVotes) : null;

  return (
    <div>
      <h2>Planning Poker</h2>
      <h3>Olá, {presence.name}! Escolha seu voto:</h3>

      <div style={{ marginBottom: 20 }}>
        {options.map((opt) => (
          <button
            key={opt}
            style={{
              marginRight: 8,
              padding: "10px 15px",
              fontWeight: presence.vote === opt ? "bold" : "normal",
            }}
            onClick={() => handleVote(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setReveal(true)} disabled={reveal}>
          Revelar Votos
        </button>
        <button onClick={handleReset} style={{ marginLeft: 10 }}>
          Resete seu Voto
        </button>
      </div>

      <h3>Participantes:</h3>
      <ul>
        {allUsers.map((user) => (
          <li key={user.id}>
            {user.presence.name}:{" "}
            {reveal
              ? user.presence.vote ?? "⏳ aguardando..."
              : user.presence.vote !== null
              ? "✅ votou"
              : "⏳ aguardando..."}
          </li>
        ))}
      </ul>

      {reveal && (
        <>
          {average && <h4>Média dos votos: <strong>{average}</strong></h4>}
          {maxVote !== null && <h4>Maior voto: <strong>{maxVote}</strong></h4>}
          {minVote !== null && <h4>Menor voto: <strong>{minVote}</strong></h4>}
        </>
      )}
    </div>
  );
};
