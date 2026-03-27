import { useState } from "react";

interface Props { onComplete: (score: number) => void; }

interface MoneyQ { item: string; qty: number; price: number; askQty: number; answer: number; }

const QUESTIONS: MoneyQ[] = [
  { item: "camiseta", qty: 3, price: 24, askQty: 6, answer: 48 },
  { item: "libro", qty: 2, price: 18, askQty: 5, answer: 45 },
  { item: "helado", qty: 4, price: 12, askQty: 8, answer: 24 },
  { item: "entrada", qty: 5, price: 50, askQty: 3, answer: 30 },
  { item: "pizza", qty: 2, price: 16, askQty: 7, answer: 56 },
  { item: "pegatina", qty: 10, price: 5, askQty: 30, answer: 15 },
  { item: "pulsera", qty: 3, price: 9, askQty: 10, answer: 30 },
  { item: "globo", qty: 6, price: 12, askQty: 4, answer: 8 },
];

const MoneyGame = ({ onComplete }: Props) => {
  const [shuffled] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 6));
  const [round, setRound] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = shuffled[round];

  const handleSubmit = () => {
    const num = parseFloat(input);
    const correct = num === current.answer;
    if (correct) { setFeedback("✅ ¡Correcto!"); setScore(s => s + 20); }
    else setFeedback(`❌ Era ${current.answer} €`);

    setTimeout(() => {
      if (round + 1 >= shuffled.length) {
        setDone(true);
        onComplete(score + (correct ? 20 : 0));
      } else {
        setRound(r => r + 1);
        setInput("");
        setFeedback(null);
      }
    }, 1500);
  };

  if (done) return <p className="text-center text-primary font-heading text-lg">Puntuación: {score}</p>;

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-4">Ronda {round + 1}/{shuffled.length} · Puntos: {score}</p>
      <div className="glass-card rounded-xl p-6 max-w-md mx-auto mb-4">
        <p className="text-foreground text-lg mb-3">💰 Problema con dinero</p>
        <p className="text-foreground">
          <span className="font-bold">{current.qty} {current.item}{current.qty > 1 ? "s" : ""}</span> cuestan{" "}
          <span className="font-bold text-primary">{current.price} €</span>
        </p>
        <p className="text-foreground mt-3 text-lg">
          ¿Cuánto cuestan <span className="font-bold text-primary">{current.askQty}</span> {current.item}{current.askQty > 1 ? "s" : ""}?
        </p>
      </div>
      {feedback ? (
        <p className="text-lg font-semibold">{feedback}</p>
      ) : (
        <div>
          <div className="flex items-center justify-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value.replace(/[^0-9.]/g, ""))}
              className="rounded-lg bg-secondary px-4 py-3 text-center text-xl font-bold text-foreground outline-none border border-border focus:border-primary w-24"
              autoFocus
              onKeyDown={e => e.key === "Enter" && input && handleSubmit()}
            />
            <span className="text-muted-foreground">€</span>
          </div>
          <button onClick={handleSubmit} disabled={!input} className="mt-3 rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30">
            Responder
          </button>
        </div>
      )}
    </div>
  );
};

export default MoneyGame;
