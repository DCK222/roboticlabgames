import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const PATTERNS = [
  { seq: [2, 4, 6, 8], next: 10, hint: "+2" },
  { seq: [3, 6, 9, 12], next: 15, hint: "+3" },
  { seq: [1, 2, 4, 8], next: 16, hint: "×2" },
  { seq: [5, 10, 20, 40], next: 80, hint: "×2" },
  { seq: [100, 50, 25], next: 12.5, hint: "÷2" },
  { seq: [1, 1, 2, 3, 5], next: 8, hint: "Fibonacci" },
  { seq: [2, 4, 8, 16], next: 32, hint: "×2" },
  { seq: [1, 3, 5, 7], next: 9, hint: "+2" },
  { seq: [10, 7, 4, 1], next: -2, hint: "-3" },
  { seq: [3, 6, 12, 24], next: 48, hint: "×2" },
  { seq: [1, 4, 9, 16], next: 25, hint: "cuadrados" },
  { seq: [100, 90, 80, 70], next: 60, hint: "-10" },
];

const PatternGame = ({ onComplete }: Props) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shuffled, setShuffled] = useState<typeof PATTERNS>([]);
  const [done, setDone] = useState(false);
  const totalRounds = 6;

  useEffect(() => {
    setShuffled([...PATTERNS].sort(() => Math.random() - 0.5).slice(0, totalRounds));
  }, []);

  if (shuffled.length === 0) return null;
  const current = shuffled[round];

  const handleSubmit = () => {
    if (!current) return;
    const num = parseFloat(answer);
    if (num === current.next) {
      setFeedback("✅ ¡Correcto!");
      setScore(s => s + 20);
    } else {
      setFeedback(`❌ Era ${current.next} (${current.hint})`);
    }
    setTimeout(() => {
      setFeedback(null);
      setAnswer("");
      if (round + 1 >= totalRounds) {
        const finalScore = score + (parseFloat(answer) === current.next ? 20 : 0);
        setDone(true);
        onComplete(finalScore);
      } else {
        setRound(r => r + 1);
      }
    }, 1500);
  };

  if (done) return <p className="text-center text-primary font-heading text-lg">Puntuación: {score}</p>;

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-4">Ronda {round + 1}/{totalRounds} — Encuentra el patrón</p>
      <div className="flex gap-2 justify-center items-center flex-wrap mb-6">
        {current.seq.map((n, i) => (
          <span key={i} className="glass-card rounded-lg px-4 py-3 text-xl font-bold text-foreground">{n}</span>
        ))}
        <span className="text-primary text-2xl font-bold">→ ?</span>
      </div>
      {feedback ? (
        <p className="text-lg font-semibold mb-4">{feedback}</p>
      ) : (
        <div>
          <input
            value={answer}
            onChange={e => setAnswer(e.target.value.replace(/[^0-9.\-]/g, ""))}
            className="rounded-lg bg-secondary px-4 py-3 text-center text-xl font-bold text-foreground outline-none border border-border focus:border-primary w-28"
            autoFocus
            onKeyDown={e => e.key === "Enter" && answer && handleSubmit()}
          />
          <br />
          <button onClick={handleSubmit} disabled={!answer} className="mt-3 rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30">
            Comprobar
          </button>
        </div>
      )}
    </div>
  );
};

export default PatternGame;
