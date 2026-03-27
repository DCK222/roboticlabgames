import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const ALL = ["🌈", "🌸", "🍀", "🌺", "🌻", "🍄", "🌵", "🌴", "🎋", "🌾", "🍁", "🌷"];

const DifferGame = ({ onComplete }: Props) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [changedIdx, setChangedIdx] = useState(-1);
  const [newEmoji, setNewEmoji] = useState("");
  const [phase, setPhase] = useState<"show" | "find" | "done">("show");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const startRound = (r: number) => {
    const size = Math.min(r + 3, 9);
    const picked = [...ALL].sort(() => Math.random() - 0.5).slice(0, size);
    setGrid(picked);
    setPhase("show");

    const idx = Math.floor(Math.random() * size);
    const replacement = ALL.filter(e => !picked.includes(e))[0] || "❓";
    setChangedIdx(idx);
    setNewEmoji(replacement);

    setTimeout(() => {
      setGrid(prev => prev.map((e, i) => i === idx ? replacement : e));
      setPhase("find");
    }, 2000 + r * 300);
  };

  useEffect(() => { startRound(1); }, []);

  const handleClick = (idx: number) => {
    if (phase !== "find") return;
    if (idx === changedIdx) {
      const newScore = score + 20;
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
  };

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-3">
        {phase === "show" ? "Memoriza los emojis..." :
         phase === "find" ? `Ronda ${round} — ¿Cuál cambió?` :
         `Puntuación: ${score}`}
      </p>
      <div className="flex gap-3 justify-center flex-wrap max-w-sm mx-auto">
        {grid.map((e, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={phase !== "find"}
            className={`text-4xl glass-card rounded-xl p-4 transition-all ${
              phase === "find" ? "hover:neon-border cursor-pointer" : ""
            }`}
          >
            {e}
          </button>
        ))}
      </div>
      {phase === "done" && (
        <p className="text-primary font-heading text-lg mt-4">Puntuación final: {score}</p>
      )}
    </div>
  );
};

export default DifferGame;
