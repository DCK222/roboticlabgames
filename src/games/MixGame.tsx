import { useState } from "react";

interface Props { onComplete: (score: number) => void; }

interface MixQ {
  concentrate: number;
  water: number;
  targetConcentrate: number;
  answer: number;
  liquid: string;
}

const QUESTIONS: MixQ[] = [
  { concentrate: 2, water: 5, targetConcentrate: 4, answer: 10, liquid: "zumo" },
  { concentrate: 1, water: 3, targetConcentrate: 3, answer: 9, liquid: "limonada" },
  { concentrate: 3, water: 6, targetConcentrate: 5, answer: 10, liquid: "pintura" },
  { concentrate: 2, water: 8, targetConcentrate: 3, answer: 12, liquid: "refresco" },
  { concentrate: 1, water: 4, targetConcentrate: 5, answer: 20, liquid: "batido" },
  { concentrate: 4, water: 2, targetConcentrate: 8, answer: 4, liquid: "café" },
];

const MixGame = ({ onComplete }: Props) => {
  const [shuffled] = useState(() => [...QUESTIONS].sort(() => Math.random() - 0.5));
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
    else setFeedback(`❌ Eran ${current.answer} vasos de agua`);

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
        <p className="text-foreground text-lg mb-3">🧪 Mezcla de <span className="text-primary font-bold">{current.liquid}</span></p>
        <p className="text-foreground">
          Se mezclan <span className="font-bold text-primary">{current.concentrate}</span> vasos de concentrado
          con <span className="font-bold text-primary">{current.water}</span> vasos de agua.
        </p>
        <p className="text-foreground mt-3 text-lg">
          ¿Cuántos vasos de agua hacen falta para{" "}
          <span className="font-bold text-primary">{current.targetConcentrate}</span> vasos de concentrado?
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

export default MixGame;
