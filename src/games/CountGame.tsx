import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const EMOJIS = ["⭐", "🔵", "🔴", "🟢", "🟡", "💜"];

const CountGame = ({ onComplete }: Props) => {
  const [items, setItems] = useState<{ emoji: string; x: number; y: number }[]>([]);
  const [target, setTarget] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<"show" | "input" | "done">("show");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");

  const startRound = (r: number) => {
    const totalItems = Math.min(r * 3 + 5, 25);
    const tgt = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const tgtCount = Math.floor(Math.random() * (totalItems - 2)) + 2;
    const all: { emoji: string; x: number; y: number }[] = [];
    for (let i = 0; i < tgtCount; i++) {
      all.push({ emoji: tgt, x: Math.random() * 80 + 5, y: Math.random() * 80 + 5 });
    }
    for (let i = 0; i < totalItems - tgtCount; i++) {
      const other = EMOJIS.filter(e => e !== tgt)[Math.floor(Math.random() * (EMOJIS.length - 1))];
      all.push({ emoji: other, x: Math.random() * 80 + 5, y: Math.random() * 80 + 5 });
    }
    setItems(all.sort(() => Math.random() - 0.5));
    setTarget(tgt);
    setCorrectCount(tgtCount);
    setAnswer("");
    setPhase("show");
    setTimeout(() => setPhase("input"), 2000 + r * 300);
  };

  useEffect(() => { startRound(1); }, []);

  const handleSubmit = () => {
    const num = parseInt(answer);
    if (num === correctCount) {
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
        {phase === "show" ? `¡Cuenta cuántos ${target} hay!` :
         phase === "input" ? `Ronda ${round} — ¿Cuántos ${target} había?` :
         `Puntuación: ${score}`}
      </p>
      {phase === "show" && (
        <div className="relative w-full h-64 glass-card rounded-xl overflow-hidden">
          {items.map((item, i) => (
            <span
              key={i}
              className="absolute text-2xl"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.emoji}
            </span>
          ))}
        </div>
      )}
      {phase === "input" && (
        <div>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
            className="rounded-lg bg-secondary px-4 py-3 text-center text-2xl font-bold text-foreground outline-none border border-border focus:border-primary w-24"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && answer && handleSubmit()}
          />
          <br />
          <button
            onClick={handleSubmit}
            disabled={!answer}
            className="mt-3 rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30"
          >
            Comprobar
          </button>
        </div>
      )}
      {phase === "done" && (
        <p className="text-primary font-heading text-lg mt-2">
          {answer && parseInt(answer) !== correctCount ? `Había ${correctCount}. ` : ""}Puntuación: {score}
        </p>
      )}
    </div>
  );
};

export default CountGame;
