import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const EMOJIS = ["🏰", "👑", "🗡️", "🛡️", "🐉", "🧙‍♂️", "🦄", "🌟", "💎", "🔮"];

const ChainGame = ({ onComplete }: Props) => {
  const [chain, setChain] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [phase, setPhase] = useState<"show" | "input" | "done">("show");
  const [round, setRound] = useState(1);

  const startRound = (currentChain: string[]) => {
    const next = [...currentChain, EMOJIS[Math.floor(Math.random() * EMOJIS.length)]];
    setChain(next);
    setPlayerInput([]);
    setPhase("show");
    setTimeout(() => setPhase("input"), 1000 + next.length * 500);
  };

  useEffect(() => { startRound([]); }, []);

  const handlePick = (emoji: string) => {
    const next = [...playerInput, emoji];
    setPlayerInput(next);
    const idx = next.length - 1;

    if (next[idx] !== chain[idx]) {
      setPhase("done");
      onComplete((round - 1) * 15);
      return;
    }

    if (next.length === chain.length) {
      setRound(r => r + 1);
      setTimeout(() => startRound(chain), 600);
    }
  };

  return (
    <div className="text-center">
      {phase === "show" && (
        <div>
          <p className="text-muted-foreground text-sm mb-4">Memoriza la cadena (Ronda {round})</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {chain.map((e, i) => (
              <span key={i} className="text-3xl glass-card rounded-xl p-2 neon-border">{e}</span>
            ))}
          </div>
        </div>
      )}
      {phase === "input" && (
        <div>
          <p className="text-muted-foreground text-sm mb-2">Repite la cadena ({playerInput.length}/{chain.length})</p>
          <div className="flex gap-1 justify-center mb-3 min-h-[2.5rem]">
            {playerInput.map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {EMOJIS.map((e, i) => (
              <button key={i} onClick={() => handlePick(e)} className="text-3xl glass-card rounded-xl p-2 hover:neon-border cursor-pointer">
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
      {phase === "done" && (
        <p className="text-primary font-heading text-lg">Cadena de {round - 1} · Puntuación: {(round - 1) * 15}</p>
      )}
    </div>
  );
};

export default ChainGame;
