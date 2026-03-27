import { useState, useEffect, useRef } from "react";

interface Props { onComplete: (score: number) => void; }

const GESTURES = [
  { name: "👆 Arriba", emoji: "👆" },
  { name: "👇 Abajo", emoji: "👇" },
  { name: "👈 Izquierda", emoji: "👈" },
  { name: "👉 Derecha", emoji: "👉" },
  { name: "👏 Palma", emoji: "👏" },
  { name: "🔄 Giro", emoji: "🔄" },
  { name: "✋ Stop", emoji: "✋" },
  { name: "👊 Puño", emoji: "👊" },
];

const GestureGame = ({ onComplete }: Props) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [showIdx, setShowIdx] = useState(-1);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [phase, setPhase] = useState<"show" | "input" | "done">("show");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const startRound = (r: number) => {
    const len = r + 2;
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * GESTURES.length));
    setSequence(seq);
    setPlayerInput([]);
    setPhase("show");
    setShowIdx(-1);

    seq.forEach((_, i) => {
      setTimeout(() => setShowIdx(i), i * 800 + 300);
    });
    setTimeout(() => {
      setShowIdx(-1);
      setPhase("input");
    }, seq.length * 800 + 500);
  };

  useEffect(() => { startRound(1); }, []);

  const handlePick = (gestureIdx: number) => {
    const next = [...playerInput, gestureIdx];
    setPlayerInput(next);
    const pos = next.length - 1;

    if (next[pos] !== sequence[pos]) {
      setPhase("done");
      onComplete(score);
      return;
    }

    if (next.length === sequence.length) {
      const newScore = score + round * 10;
      setScore(newScore);
      const nextR = round + 1;
      setRound(nextR);
      if (nextR > 6) { setPhase("done"); onComplete(newScore); }
      else setTimeout(() => startRound(nextR), 600);
    }
  };

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-4">
        {phase === "show" ? "Observa la secuencia de movimientos..." :
         phase === "input" ? `Ronda ${round} — Repite la secuencia (${playerInput.length}/${sequence.length})` :
         `Puntuación: ${score}`}
      </p>

      {phase === "show" && showIdx >= 0 && (
        <div className="text-8xl mb-4 animate-bounce">{GESTURES[sequence[showIdx]].emoji}</div>
      )}

      {phase === "input" && (
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {GESTURES.map((g, i) => (
            <button
              key={i}
              onClick={() => handlePick(i)}
              className="glass-card rounded-xl p-3 text-2xl hover:neon-border cursor-pointer transition-all active:scale-90"
            >
              {g.emoji}
            </button>
          ))}
        </div>
      )}

      {phase === "done" && (
        <p className="text-primary font-heading text-lg mt-4">Puntuación: {score}</p>
      )}

      {phase === "input" && playerInput.length > 0 && (
        <div className="flex gap-1 justify-center mt-3">
          {playerInput.map((g, i) => (
            <span key={i} className="text-xl">{GESTURES[g].emoji}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GestureGame;
