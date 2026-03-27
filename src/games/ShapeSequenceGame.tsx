import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const SHAPES = [
  { name: "círculo", emoji: "🔴" },
  { name: "cuadrado", emoji: "🟦" },
  { name: "triángulo", emoji: "🔺" },
  { name: "estrella", emoji: "⭐" },
  { name: "rombo", emoji: "🔷" },
  { name: "corazón", emoji: "❤️" },
];

const generatePattern = (length: number): number[] => {
  const patternLen = 2 + Math.floor(Math.random() * 2);
  const base = Array.from({ length: patternLen }, () => Math.floor(Math.random() * SHAPES.length));
  const seq: number[] = [];
  while (seq.length < length) {
    seq.push(...base);
  }
  return seq.slice(0, length);
};

const ShapeSequenceGame = ({ onComplete }: Props) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [hiddenIdx, setHiddenIdx] = useState(-1);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const startRound = (r: number) => {
    const len = r + 4;
    const seq = generatePattern(len);
    const hideAt = len - 1;
    setSequence(seq);
    setHiddenIdx(hideAt);
    setFeedback(null);
  };

  useEffect(() => { startRound(1); }, []);

  const handlePick = (shapeIdx: number) => {
    if (feedback) return;
    const correct = sequence[hiddenIdx];
    if (shapeIdx === correct) {
      setFeedback("✅ ¡Correcto!");
      const newScore = score + 15;
      setScore(newScore);
      setTimeout(() => {
        if (round >= 6) { setDone(true); onComplete(newScore); }
        else { setRound(r => r + 1); startRound(round + 1); }
      }, 1000);
    } else {
      setFeedback(`❌ Era ${SHAPES[correct].emoji}`);
      setTimeout(() => { setDone(true); onComplete(score); }, 1500);
    }
  };

  if (done) return <p className="text-center text-primary font-heading text-lg">Puntuación: {score}</p>;

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-4">Ronda {round}/6 — Completa la secuencia de formas</p>
      <div className="flex gap-2 justify-center flex-wrap mb-6">
        {sequence.map((s, i) => (
          <span key={i} className={`text-3xl glass-card rounded-xl p-3 ${i === hiddenIdx ? "neon-border" : ""}`}>
            {i === hiddenIdx ? "❓" : SHAPES[s].emoji}
          </span>
        ))}
      </div>
      {feedback ? (
        <p className="text-lg font-semibold">{feedback}</p>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-3">¿Qué forma va en el ❓?</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {SHAPES.map((s, i) => (
              <button key={i} onClick={() => handlePick(i)} className="text-3xl glass-card rounded-xl p-3 hover:neon-border cursor-pointer transition-all">
                {s.emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShapeSequenceGame;
