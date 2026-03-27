import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const ALL_EMOJIS = ["🍎", "🚗", "⭐", "🎸", "🌈", "🐉", "🍕", "🤖", "⚽", "🎮", "🌸", "🚀"];

const FlashGame = ({ onComplete }: Props) => {
  const [shown, setShown] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<"show" | "pick" | "done">("show");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const startRound = (r: number) => {
    const count = Math.min(r + 2, 6);
    const shuffled = [...ALL_EMOJIS].sort(() => Math.random() - 0.5);
    const toShow = shuffled.slice(0, count);
    const extras = shuffled.slice(count, count + 3);
    setShown(toShow);
    setOptions([...toShow, ...extras].sort(() => Math.random() - 0.5));
    setSelected(new Set());
    setPhase("show");

    setTimeout(() => setPhase("pick"), 1500 + count * 300);
  };

  useEffect(() => { startRound(1); }, []);

  const toggleSelect = (emoji: string) => {
    const next = new Set(selected);
    if (next.has(emoji)) next.delete(emoji); else next.add(emoji);
    setSelected(next);
  };

  const handleCheck = () => {
    let correct = 0;
    selected.forEach(e => { if (shown.includes(e)) correct++; });
    const wrong = selected.size - correct;
    const roundScore = Math.max(correct * 10 - wrong * 5, 0);

    if (correct === shown.length && wrong === 0) {
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
      setScore(s => s + roundScore);
      setPhase("done");
      onComplete(score + roundScore);
    }
  };

  return (
    <div className="text-center">
      {phase === "show" && (
        <div>
          <p className="text-muted-foreground text-sm mb-4">¡Memoriza estos emojis!</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {shown.map((e, i) => (
              <span key={i} className="text-4xl glass-card rounded-xl p-3 neon-border animate-pulse">{e}</span>
            ))}
          </div>
        </div>
      )}
      {phase === "pick" && (
        <div>
          <p className="text-muted-foreground text-sm mb-4">Ronda {round} — Selecciona los {shown.length} que viste</p>
          <div className="flex gap-2 justify-center flex-wrap mb-4">
            {options.map((e, i) => (
              <button
                key={i}
                onClick={() => toggleSelect(e)}
                className={`text-3xl rounded-xl p-3 transition-all ${
                  selected.has(e) ? "glass-card neon-border scale-110" : "glass-card hover:scale-105"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <button
            onClick={handleCheck}
            disabled={selected.size === 0}
            className="rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30"
          >
            Comprobar
          </button>
        </div>
      )}
      {phase === "done" && (
        <p className="text-primary font-heading text-lg">Puntuación: {score}</p>
      )}
    </div>
  );
};

export default FlashGame;
