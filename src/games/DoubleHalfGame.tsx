import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

type Op = "doble" | "mitad" | "triple";
const OPS: { op: Op; fn: (n: number) => number; label: string }[] = [
  { op: "doble", fn: n => n * 2, label: "El DOBLE de" },
  { op: "mitad", fn: n => n / 2, label: "La MITAD de" },
  { op: "triple", fn: n => n * 3, label: "El TRIPLE de" },
];

const generateQuestion = () => {
  const opDef = OPS[Math.floor(Math.random() * OPS.length)];
  let num: number;
  if (opDef.op === "mitad") {
    num = (Math.floor(Math.random() * 20) + 1) * 2;
  } else {
    num = Math.floor(Math.random() * 30) + 2;
  }
  return { num, ...opDef, answer: opDef.fn(num) };
};

const DoubleHalfGame = ({ onComplete }: Props) => {
  const [question, setQuestion] = useState(generateQuestion());
  const [input, setInput] = useState("");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const totalRounds = 10;

  const handleSubmit = () => {
    const num = parseFloat(input);
    const correct = num === question.answer;
    if (correct) {
      setFeedback("✅ ¡Correcto!");
      setScore(s => s + 10);
    } else {
      setFeedback(`❌ Era ${question.answer}`);
    }
    setTimeout(() => {
      if (round >= totalRounds) {
        const finalScore = score + (correct ? 10 : 0);
        setDone(true);
        onComplete(finalScore);
      } else {
        setRound(r => r + 1);
        setQuestion(generateQuestion());
        setInput("");
        setFeedback(null);
      }
    }, 1200);
  };

  if (done) return <p className="text-center text-primary font-heading text-lg">Puntuación: {score}/{totalRounds * 10}</p>;

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-2">Ronda {round}/{totalRounds} · Puntos: {score}</p>
      <div className="glass-card rounded-xl p-6 mb-4 max-w-sm mx-auto">
        <p className="text-lg text-foreground font-semibold">{question.label}</p>
        <p className="text-5xl font-bold text-primary my-4">{question.num}</p>
      </div>
      {feedback ? (
        <p className="text-lg font-semibold">{feedback}</p>
      ) : (
        <div>
          <input
            value={input}
            onChange={e => setInput(e.target.value.replace(/[^0-9.]/g, ""))}
            className="rounded-lg bg-secondary px-4 py-3 text-center text-2xl font-bold text-foreground outline-none border border-border focus:border-primary w-28"
            autoFocus
            onKeyDown={e => e.key === "Enter" && input && handleSubmit()}
          />
          <br />
          <button onClick={handleSubmit} disabled={!input} className="mt-3 rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30">
            Responder
          </button>
        </div>
      )}
    </div>
  );
};

export default DoubleHalfGame;
