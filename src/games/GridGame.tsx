import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const GRID_SIZE = 4;

const GridGame = ({ onComplete }: Props) => {
  const [litCells, setLitCells] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<"show" | "input" | "done">("show");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const startRound = (r: number) => {
    const count = Math.min(r + 2, 10);
    const cells = new Set<number>();
    while (cells.size < count) cells.add(Math.floor(Math.random() * GRID_SIZE * GRID_SIZE));
    setLitCells(cells);
    setSelected(new Set());
    setPhase("show");
    setTimeout(() => setPhase("input"), 1200 + count * 200);
  };

  useEffect(() => { startRound(1); }, []);

  const toggleCell = (idx: number) => {
    const next = new Set(selected);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setSelected(next);
  };

  const handleCheck = () => {
    let correct = 0;
    selected.forEach(c => { if (litCells.has(c)) correct++; });
    const wrong = selected.size - correct;
    const roundScore = Math.max(correct * 10 - wrong * 5, 0);

    if (correct === litCells.size && wrong === 0) {
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
      onComplete(score + roundScore);
    }
  };

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-3">
        {phase === "show" ? "Memoriza las casillas..." :
         phase === "input" ? `Ronda ${round} — Marca las ${litCells.size} casillas` :
         `Puntuación: ${score}`}
      </p>
      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
          <button
            key={i}
            onClick={() => phase === "input" && toggleCell(i)}
            disabled={phase !== "input"}
            className={`aspect-square rounded-lg transition-all duration-200 ${
              phase === "show" && litCells.has(i) ? "bg-primary neon-border" :
              phase === "input" && selected.has(i) ? "bg-primary/80 scale-95" :
              "glass-card hover:bg-muted/30"
            }`}
          />
        ))}
      </div>
      {phase === "input" && (
        <button
          onClick={handleCheck}
          className="rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground"
        >
          Comprobar
        </button>
      )}
      {phase === "done" && (
        <p className="text-primary font-heading text-lg mt-2">Puntuación final: {score}</p>
      )}
    </div>
  );
};

export default GridGame;
