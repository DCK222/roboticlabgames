import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const ALL = ["🍎", "🍊", "🍋", "🍇", "🍉", "🍓", "🫐", "🍑", "🥝", "🍌"];

const OrderGame = ({ onComplete }: Props) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [phase, setPhase] = useState<"show" | "input" | "done">("show");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const startRound = (r: number) => {
    const count = Math.min(r + 2, 8);
    const picked = [...ALL].sort(() => Math.random() - 0.5).slice(0, count);
    setSequence(picked);
    setShuffled([...picked].sort(() => Math.random() - 0.5));
    setPlayerOrder([]);
    setPhase("show");
    setTimeout(() => setPhase("input"), 1500 + count * 400);
  };

  useEffect(() => { startRound(1); }, []);

  const handlePick = (emoji: string) => {
    if (playerOrder.includes(emoji)) return;
    const next = [...playerOrder, emoji];
    setPlayerOrder(next);

    if (next.length === sequence.length) {
      const correct = next.every((e, i) => e === sequence[i]);
      if (correct) {
        const roundScore = sequence.length * 10;
        const newScore = score + roundScore;
        setScore(newScore);
        const nextR = round + 1;
        setRound(nextR);
        if (nextR > 5) {
          setPhase("done");
          onComplete(newScore);
        } else {
          startRound(nextR);
        }
      } else {
        setPhase("done");
        onComplete(score);
      }
    }
  };

  const handleUndo = () => {
    setPlayerOrder(p => p.slice(0, -1));
  };

  return (
    <div className="text-center">
      {phase === "show" && (
        <div>
          <p className="text-muted-foreground text-sm mb-4">Memoriza el orden...</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {sequence.map((e, i) => (
              <span key={i} className="text-3xl glass-card rounded-xl p-3 neon-border">{e}</span>
            ))}
          </div>
        </div>
      )}
      {phase === "input" && (
        <div>
          <p className="text-muted-foreground text-sm mb-3">Ronda {round} — Ponlos en orden ({playerOrder.length}/{sequence.length})</p>
          <div className="flex gap-1 justify-center mb-3 min-h-[3rem]">
            {playerOrder.map((e, i) => (
              <span key={i} className="text-2xl glass-card rounded-lg p-2">{e}</span>
            ))}
          </div>
          {playerOrder.length > 0 && (
            <button onClick={handleUndo} className="text-xs text-muted-foreground underline mb-3 block mx-auto">Deshacer</button>
          )}
          <div className="flex gap-2 justify-center flex-wrap">
            {shuffled.map((e, i) => (
              <button
                key={i}
                onClick={() => handlePick(e)}
                disabled={playerOrder.includes(e)}
                className={`text-3xl rounded-xl p-3 transition-all ${
                  playerOrder.includes(e) ? "opacity-20" : "glass-card hover:neon-border cursor-pointer"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
      {phase === "done" && (
        <p className="text-primary font-heading text-lg">Puntuación: {score}</p>
      )}
    </div>
  );
};

export default OrderGame;
