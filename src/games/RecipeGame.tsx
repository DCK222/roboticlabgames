import { useState } from "react";

interface Props { onComplete: (score: number) => void; }

interface Recipe {
  text: string;
  basePeople: number;
  baseAmount: number;
  unit: string;
  targetPeople: number;
  answer: number;
}

const RECIPES: Recipe[] = [
  { text: "pasta", basePeople: 2, baseAmount: 200, unit: "g", targetPeople: 6, answer: 600 },
  { text: "arroz", basePeople: 4, baseAmount: 400, unit: "g", targetPeople: 2, answer: 200 },
  { text: "leche", basePeople: 3, baseAmount: 600, unit: "ml", targetPeople: 9, answer: 1800 },
  { text: "harina", basePeople: 2, baseAmount: 250, unit: "g", targetPeople: 8, answer: 1000 },
  { text: "huevos", basePeople: 4, baseAmount: 3, unit: "unidades", targetPeople: 12, answer: 9 },
  { text: "mantequilla", basePeople: 5, baseAmount: 100, unit: "g", targetPeople: 10, answer: 200 },
  { text: "azúcar", basePeople: 6, baseAmount: 300, unit: "g", targetPeople: 2, answer: 100 },
  { text: "tomate", basePeople: 3, baseAmount: 450, unit: "g", targetPeople: 5, answer: 750 },
];

const RecipeGame = ({ onComplete }: Props) => {
  const [shuffled] = useState(() => [...RECIPES].sort(() => Math.random() - 0.5).slice(0, 6));
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
    else setFeedback(`❌ Era ${current.answer} ${current.unit}`);

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
        <p className="text-foreground text-lg mb-2">🍳 Receta de <span className="text-primary font-bold">{current.text}</span></p>
        <p className="text-foreground">
          Para <span className="font-bold">{current.basePeople}</span> personas hacen falta{" "}
          <span className="font-bold text-primary">{current.baseAmount} {current.unit}</span>
        </p>
        <p className="text-foreground mt-3 text-lg">
          ¿Cuánta {current.text} hace falta para{" "}
          <span className="font-bold text-primary">{current.targetPeople}</span> personas?
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
              className="rounded-lg bg-secondary px-4 py-3 text-center text-xl font-bold text-foreground outline-none border border-border focus:border-primary w-28"
              autoFocus
              onKeyDown={e => e.key === "Enter" && input && handleSubmit()}
            />
            <span className="text-muted-foreground">{current.unit}</span>
          </div>
          <button onClick={handleSubmit} disabled={!input} className="mt-3 rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30">
            Responder
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeGame;
