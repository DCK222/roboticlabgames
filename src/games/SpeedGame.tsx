import { useState, useEffect, useRef } from "react";

interface Props { onComplete: (score: number) => void; }

const EMOJIS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊"];
const TOTAL_ROUNDS = 15;

const SpeedGame = ({ onComplete }: Props) => {
  const [current, setCurrent] = useState("");
  const [previous, setPrevious] = useState("");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<number>();

  const nextCard = () => {
    // ~40% chance same as previous
    const isSame = Math.random() < 0.4 && previous;
    const emoji = isSame ? previous : EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setPrevious(current);
    setCurrent(emoji);
    setRound(r => r + 1);
    setFeedback(null);
  };

  const start = () => {
    setPhase("playing");
    setCurrent(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    setPrevious("");
    setRound(1);
    setScore(0);
  };

  const answer = (same: boolean) => {
    if (round < 2) { nextCard(); return; }
    const isCorrect = same === (current === previous);
    if (isCorrect) {
      setScore(s => s + 10);
      setFeedback("correct");
    } else {
      setFeedback("wrong");
    }

    if (round >= TOTAL_ROUNDS) {
      const finalScore = score + (isCorrect ? 10 : 0);
      setPhase("done");
      onComplete(finalScore);
    } else {
      timerRef.current = window.setTimeout(nextCard, 400);
    }
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  if (phase === "ready") {
    return (
      <div className="text-center">
        <p className="text-muted-foreground mb-4">¿El emoji actual es igual al anterior? ¡Responde rápido!</p>
        <button onClick={start} className="rounded-lg bg-primary px-8 py-3 font-heading text-sm font-bold uppercase text-primary-foreground">
          ¡Empezar!
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-2">Ronda {round}/{TOTAL_ROUNDS} · Puntos: {score}</p>
      <div className={`text-7xl mb-6 transition-all ${
        feedback === "correct" ? "scale-110" : feedback === "wrong" ? "scale-90 opacity-60" : ""
      }`}>
        {current}
      </div>
      {round < 2 ? (
        <button onClick={nextCard} className="rounded-lg bg-primary px-8 py-3 font-heading text-sm font-bold uppercase text-primary-foreground">
          Siguiente →
        </button>
      ) : phase === "playing" ? (
        <div className="flex gap-3 justify-center">
          <button onClick={() => answer(true)} className="rounded-xl bg-green-600 px-8 py-3 font-heading text-sm font-bold text-white hover:bg-green-500">
            ✓ Igual
          </button>
          <button onClick={() => answer(false)} className="rounded-xl bg-red-600 px-8 py-3 font-heading text-sm font-bold text-white hover:bg-red-500">
            ✗ Diferente
          </button>
        </div>
      ) : (
        <p className="text-primary font-heading text-lg">Puntuación: {score}</p>
      )}
    </div>
  );
};

export default SpeedGame;
