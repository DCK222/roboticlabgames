import { useState } from "react";

interface Props { onComplete: (score: number) => void; }

interface ScaleQ { cmOnMap: number; scale: number; answer: number; unit: string; context: string; }

const QUESTIONS: ScaleQ[] = [
  { cmOnMap: 4, scale: 10, answer: 40, unit: "m", context: "Una calle mide" },
  { cmOnMap: 7, scale: 100, answer: 700, unit: "m", context: "Un río mide" },
  { cmOnMap: 3, scale: 5, answer: 15, unit: "m", context: "Una habitación mide" },
  { cmOnMap: 10, scale: 50, answer: 500, unit: "m", context: "Un parque mide" },
  { cmOnMap: 2, scale: 1000, answer: 2000, unit: "m", context: "Una carretera mide" },
  { cmOnMap: 5, scale: 20, answer: 100, unit: "m", context: "Un edificio mide" },
  { cmOnMap: 8, scale: 25, answer: 200, unit: "m", context: "Un campo mide" },
  { cmOnMap: 6, scale: 10, answer: 60, unit: "m", context: "Un puente mide" },
];

const ScaleGame = ({ onComplete }: Props) => {
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
        <p className="text-foreground text-lg mb-2">📐 Escala del plano</p>
        <p className="text-muted-foreground mb-3">1 cm en el plano = <span className="text-primary font-bold">{current.scale} {current.unit}</span> en la realidad</p>
        <p className="text-foreground text-lg">
          {current.context} <span className="font-bold text-primary">{current.cmOnMap} cm</span> en el plano.
        </p>
        <p className="text-foreground mt-2 text-lg">¿Cuánto mide en la realidad?</p>
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

export default ScaleGame;
