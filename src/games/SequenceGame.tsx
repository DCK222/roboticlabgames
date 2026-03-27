import { useState, useEffect, useRef } from "react";

interface Props { onComplete: (score: number) => void; }

const SequenceGame = ({ onComplete }: Props) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [phase, setPhase] = useState<"show" | "input" | "done">("show");
  const [input, setInput] = useState("");
  const [round, setRound] = useState(1);
  const [showIdx, setShowIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateNumbers = (len: number) => {
    return Array.from({ length: len }, () => Math.floor(Math.random() * 10));
  };

  useEffect(() => {
    startRound(3);
  }, []);

  const startRound = (len: number) => {
    const nums = generateNumbers(len);
    setNumbers(nums);
    setPhase("show");
    setShowIdx(0);
    setInput("");

    // Show numbers one by one
    nums.forEach((_, i) => {
      setTimeout(() => setShowIdx(i + 1), (i + 1) * 700);
    });
    setTimeout(() => {
      setPhase("input");
      setTimeout(() => inputRef.current?.focus(), 100);
    }, nums.length * 700 + 500);
  };

  const handleSubmit = () => {
    const correct = numbers.join("");
    if (input === correct) {
      const nextRound = round + 1;
      setRound(nextRound);
      startRound(nextRound + 2);
    } else {
      setPhase("done");
      onComplete((round - 1) * 15);
    }
  };

  return (
    <div className="text-center">
      {phase === "show" && (
        <div>
          <p className="text-muted-foreground text-sm mb-4">Memoriza los números...</p>
          <div className="flex gap-2 justify-center">
            {numbers.map((n, i) => (
              <span
                key={i}
                className={`w-12 h-16 rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${
                  i < showIdx ? "glass-card text-primary neon-border" : "bg-muted/20 text-transparent"
                }`}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
      {phase === "input" && (
        <div>
          <p className="text-muted-foreground text-sm mb-4">Ronda {round} — Escribe los {numbers.length} números</p>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
            maxLength={numbers.length}
            className="rounded-lg bg-secondary px-4 py-3 text-center text-2xl font-bold text-foreground tracking-widest outline-none border border-border focus:border-primary w-48"
            onKeyDown={(e) => e.key === "Enter" && input.length === numbers.length && handleSubmit()}
          />
          <br />
          <button
            onClick={handleSubmit}
            disabled={input.length !== numbers.length}
            className="mt-3 rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30"
          >
            Comprobar
          </button>
        </div>
      )}
      {phase === "done" && (
        <p className="text-primary font-heading text-lg">¡Llegaste a la ronda {round}! Puntuación: {(round - 1) * 15}</p>
      )}
    </div>
  );
};

export default SequenceGame;
