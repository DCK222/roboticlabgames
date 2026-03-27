import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const ReverseGame = ({ onComplete }: Props) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [phase, setPhase] = useState<"show" | "input" | "done">("show");
  const [input, setInput] = useState("");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const startRound = (len: number) => {
    const nums = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
    setNumbers(nums);
    setPhase("show");
    setInput("");
    setTimeout(() => setPhase("input"), 800 + len * 600);
  };

  useEffect(() => { startRound(3); }, []);

  const handleSubmit = () => {
    const reversed = [...numbers].reverse().join("");
    if (input === reversed) {
      const newScore = score + round * 10;
      setScore(newScore);
      const nextR = round + 1;
      setRound(nextR);
      if (nextR > 6) { setPhase("done"); onComplete(newScore); }
      else startRound(nextR + 2);
    } else {
      setPhase("done");
      onComplete(score);
    }
  };

  return (
    <div className="text-center">
      {phase === "show" && (
        <div>
          <p className="text-muted-foreground text-sm mb-4">Memoriza y luego escríbelos AL REVÉS</p>
          <div className="flex gap-2 justify-center">
            {numbers.map((n, i) => (
              <span key={i} className="glass-card neon-border rounded-lg px-4 py-3 text-2xl font-bold text-primary">{n}</span>
            ))}
          </div>
        </div>
      )}
      {phase === "input" && (
        <div>
          <p className="text-muted-foreground text-sm mb-4">Ronda {round} — Escribe {numbers.length} números AL REVÉS</p>
          <input
            value={input}
            onChange={e => setInput(e.target.value.replace(/\D/g, ""))}
            maxLength={numbers.length}
            className="rounded-lg bg-secondary px-4 py-3 text-center text-2xl font-bold text-foreground tracking-widest outline-none border border-border focus:border-primary w-48"
            autoFocus
            onKeyDown={e => e.key === "Enter" && input.length === numbers.length && handleSubmit()}
          />
          <br />
          <button onClick={handleSubmit} disabled={input.length !== numbers.length}
            className="mt-3 rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30">
            Comprobar
          </button>
        </div>
      )}
      {phase === "done" && <p className="text-primary font-heading text-lg">Puntuación: {score}</p>}
    </div>
  );
};

export default ReverseGame;
