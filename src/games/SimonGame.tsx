import { useState, useEffect, useCallback, useRef } from "react";

interface Props { onComplete: (score: number) => void; }

const COLORS = [
  { name: "Rojo", bg: "bg-red-500", active: "bg-red-300", dim: "bg-red-900" },
  { name: "Azul", bg: "bg-blue-500", active: "bg-blue-300", dim: "bg-blue-900" },
  { name: "Verde", bg: "bg-green-500", active: "bg-green-300", dim: "bg-green-900" },
  { name: "Amarillo", bg: "bg-yellow-500", active: "bg-yellow-300", dim: "bg-yellow-900" },
];

const SimonGame = ({ onComplete }: Props) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<"showing" | "input" | "fail">("showing");
  const [round, setRound] = useState(0);
  const timeoutRef = useRef<number[]>([]);

  const clearTimeouts = () => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const playSequence = useCallback((seq: number[]) => {
    setPhase("showing");
    clearTimeouts();
    seq.forEach((color, i) => {
      const t1 = window.setTimeout(() => setActiveIdx(color), i * 600 + 300);
      const t2 = window.setTimeout(() => setActiveIdx(null), i * 600 + 550);
      timeoutRef.current.push(t1, t2);
    });
    const t3 = window.setTimeout(() => {
      setPhase("input");
      setPlayerInput([]);
    }, seq.length * 600 + 400);
    timeoutRef.current.push(t3);
  }, []);

  const startNextRound = useCallback(() => {
    const next = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(next);
    setRound(r => r + 1);
    playSequence(next);
  }, [sequence, playSequence]);

  useEffect(() => {
    const initial = [Math.floor(Math.random() * 4)];
    setSequence(initial);
    setRound(1);
    playSequence(initial);
    return clearTimeouts;
  }, []);

  const handlePress = (idx: number) => {
    if (phase !== "input") return;
    setActiveIdx(idx);
    setTimeout(() => setActiveIdx(null), 150);

    const next = [...playerInput, idx];
    setPlayerInput(next);
    const pos = next.length - 1;

    if (next[pos] !== sequence[pos]) {
      setPhase("fail");
      onComplete(round * 10);
      return;
    }

    if (next.length === sequence.length) {
      setTimeout(startNextRound, 800);
    }
  };

  return (
    <div>
      <p className="text-center text-sm text-muted-foreground mb-4">
        {phase === "showing" ? "Observa la secuencia..." :
         phase === "input" ? `Ronda ${round} — ¡Tu turno! (${playerInput.length}/${sequence.length})` :
         `¡Fallaste en la ronda ${round}!`}
      </p>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {COLORS.map((c, i) => (
          <button
            key={i}
            onClick={() => handlePress(i)}
            disabled={phase !== "input"}
            className={`aspect-square rounded-2xl transition-all duration-150 ${
              activeIdx === i ? c.active + " scale-110" : phase === "input" ? c.bg + " hover:scale-105 cursor-pointer" : c.dim
            }`}
          />
        ))}
      </div>
      {phase === "fail" && (
        <p className="text-center text-primary font-heading mt-4">Puntuación: {round * 10}</p>
      )}
    </div>
  );
};

export default SimonGame;
