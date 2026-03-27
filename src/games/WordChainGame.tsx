import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const WORDS = [
  "casa", "perro", "sol", "luna", "río", "árbol", "flor", "mar",
  "luz", "fuego", "nube", "tierra", "viento", "piedra", "estrella",
  "campo", "lago", "pez", "pájaro", "montaña",
];

const WordChainGame = ({ onComplete }: Props) => {
  const [chain, setChain] = useState<string[]>([]);
  const [phase, setPhase] = useState<"show" | "input" | "done">("show");
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [round, setRound] = useState(1);

  const startRound = (current: string[]) => {
    const available = WORDS.filter(w => !current.includes(w));
    const newWord = available[Math.floor(Math.random() * available.length)];
    const next = [...current, newWord];
    setChain(next);
    setPlayerInput([]);
    setPhase("show");

    // Create options: all chain words + some distractors, shuffled
    const distractors = available.filter(w => w !== newWord).slice(0, 4);
    setOptions([...next, ...distractors].sort(() => Math.random() - 0.5));

    setTimeout(() => setPhase("input"), 1500 + next.length * 500);
  };

  useEffect(() => { startRound([]); }, []);

  const handlePick = (word: string) => {
    if (playerInput.includes(word)) return;
    const next = [...playerInput, word];
    setPlayerInput(next);
    const pos = next.length - 1;

    if (next[pos] !== chain[pos]) {
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
          <p className="text-muted-foreground text-sm mb-4">Memoriza la cadena de palabras (Ronda {round})</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {chain.map((w, i) => (
              <span key={i} className="glass-card neon-border rounded-lg px-4 py-2 text-lg font-semibold text-foreground">{w}</span>
            ))}
          </div>
        </div>
      )}
      {phase === "input" && (
        <div>
          <p className="text-muted-foreground text-sm mb-2">Repite la cadena en orden ({playerInput.length}/{chain.length})</p>
          <div className="flex gap-1 justify-center mb-3 min-h-[2.5rem] flex-wrap">
            {playerInput.map((w, i) => (
              <span key={i} className="glass-card rounded-lg px-3 py-1 text-sm font-semibold text-primary">{w}</span>
            ))}
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {options.map((w, i) => (
              <button
                key={i}
                onClick={() => handlePick(w)}
                disabled={playerInput.includes(w)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  playerInput.includes(w) ? "opacity-20" : "glass-card hover:neon-border cursor-pointer text-foreground"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      )}
      {phase === "done" && (
        <p className="text-primary font-heading text-lg">Cadena de {round - 1} palabras · Puntuación: {(round - 1) * 15}</p>
      )}
    </div>
  );
};

export default WordChainGame;
