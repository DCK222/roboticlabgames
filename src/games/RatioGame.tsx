import { useState } from "react";

interface Props { onComplete: (score: number) => void; }

interface RatioQ { a1: number; b1: number; a2: number; answer: number; }

const QUESTIONS: RatioQ[] = [
  { a1: 2, b1: 6, a2: 4, answer: 12 },
  { a1: 3, b1: 9, a2: 5, answer: 15 },
  { a1: 1, b1: 5, a2: 3, answer: 15 },
  { a1: 4, b1: 8, a2: 6, answer: 12 },
  { a1: 5, b1: 15, a2: 2, answer: 6 },
  { a1: 2, b1: 10, a2: 7, answer: 35 },
  { a1: 6, b1: 3, a2: 10, answer: 5 },
  { a1: 3, b1: 12, a2: 5, answer: 20 },
  { a1: 8, b1: 4, a2: 12, answer: 6 },
  { a1: 7, b1: 21, a2: 3, answer: 9 },
];

const RatioGame = ({ onComplete }: Props) => {
  const [shuffled] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8));
  const [round, setRound] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = shuffled[round];

  const handleSubmit = () => {
    const num = parseFloat(input);
    const correct = num === current.answer;
    if (correct) { setFeedback("✅ ¡Correcto!"); setScore(s => s + 15); }
    else setFeedback(`❌ Era ${current.answer}`);

    setTimeout(() => {
      if (round + 1 >= shuffled.length) {
        setDone(true);
        onComplete(score + (correct ? 15 : 0));
      } else {
        setRound(r => r + 1);
        setInput("");
        setFeedback(null);
      }
    }, 1200);
  };

  if (done) return <p className="text-center text-primary font-heading text-lg">Puntuación: {score}</p>;

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-4">Ronda {round + 1}/{shuffled.length} · Puntos: {score}</p>
      <div className="glass-card rounded-xl p-6 max-w-sm mx-auto mb-4">
        <p className="text-foreground text-lg mb-2">⚖️ Completa la razón</p>
        <p className="text-3xl font-bold text-foreground mt-4">
          <span className="text-primary">{current.a1}</span> : <span className="text-primary">{current.b1}</span>
          <span className="mx-3">=</span>
          <span className="text-primary">{current.a2}</span> : <span className="text-primary">?</span>
        </p>
      </div>
      {feedback ? (
        <p className="text-lg font-semibold">{feedback}</p>
      ) : (
        <div>
          <input
            value={input}
            onChange={e => setInput(e.target.value.replace(/[^0-9.]/g, ""))}
            className="rounded-lg bg-secondary px-4 py-3 text-center text-xl font-bold text-foreground outline-none border border-border focus:border-primary w-24"
            autoFocus
            onKeyDown={e => e.key === "Enter" && input && handleSubmit()}
          />
          <button onClick={handleSubmit} disabled={!input} className="mt-3 ml-2 rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30">
            Responder
          </button>
        </div>
      )}
    </div>
  );
};

export default RatioGame;
