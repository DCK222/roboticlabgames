import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

const OBJECTS = ["🎒", "📖", "✏️", "🔑", "⌚", "🧢", "👓", "🎧", "📱", "🧸", "🪥", "🧴", "🎨", "🧩", "🔔"];

const ObjectMemoryGame = ({ onComplete }: Props) => {
  const [shown, setShown] = useState<string[]>([]);
  const [phase, setPhase] = useState<"show" | "count" | "recall" | "done">("show");
  const [countAnswer, setCountAnswer] = useState("");
  const [recallSelected, setRecallSelected] = useState<Set<string>>(new Set());
  const [allOptions, setAllOptions] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const totalRounds = 4;

  const startRound = (r: number) => {
    const count = Math.min(r + 3, 8);
    const shuffled = [...OBJECTS].sort(() => Math.random() - 0.5);
    const toShow = shuffled.slice(0, count);
    const extras = shuffled.slice(count, count + 4);
    setShown(toShow);
    setAllOptions([...toShow, ...extras].sort(() => Math.random() - 0.5));
    setRecallSelected(new Set());
    setCountAnswer("");
    setPhase("show");
    setTimeout(() => setPhase("count"), 2000 + count * 500);
  };

  useEffect(() => { startRound(1); }, []);

  const handleCount = () => {
    const num = parseInt(countAnswer);
    if (num === shown.length) setScore(s => s + 10);
    setPhase("recall");
  };

  const toggleRecall = (emoji: string) => {
    const next = new Set(recallSelected);
    if (next.has(emoji)) next.delete(emoji); else next.add(emoji);
    setRecallSelected(next);
  };

  const handleRecallSubmit = () => {
    let correct = 0;
    recallSelected.forEach(e => { if (shown.includes(e)) correct++; });
    const wrong = recallSelected.size - correct;
    const roundScore = Math.max(correct * 5 - wrong * 3, 0);
    const newScore = score + roundScore;
    setScore(newScore);

    if (round >= totalRounds) {
      setPhase("done");
      onComplete(newScore);
    } else {
      setRound(r => r + 1);
      startRound(round + 1);
    }
  };

  if (phase === "done") return <p className="text-center text-primary font-heading text-lg">Puntuación: {score}</p>;

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-3">Ronda {round}/{totalRounds} · Puntos: {score}</p>
      {phase === "show" && (
        <div>
          <p className="text-foreground text-lg mb-4 animate-pulse">Memoriza los objetos...</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {shown.map((e, i) => (
              <span key={i} className="text-4xl glass-card rounded-xl p-3 neon-border">{e}</span>
            ))}
          </div>
        </div>
      )}
      {phase === "count" && (
        <div>
          <p className="text-foreground text-lg mb-4">¿Cuántos objetos había?</p>
          <input
            value={countAnswer}
            onChange={e => setCountAnswer(e.target.value.replace(/\D/g, ""))}
            className="rounded-lg bg-secondary px-4 py-3 text-center text-2xl font-bold text-foreground outline-none border border-border focus:border-primary w-20"
            autoFocus
            onKeyDown={e => e.key === "Enter" && countAnswer && handleCount()}
          />
          <br />
          <button onClick={handleCount} disabled={!countAnswer} className="mt-3 rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground disabled:opacity-30">
            Siguiente
          </button>
        </div>
      )}
      {phase === "recall" && (
        <div>
          <p className="text-foreground text-lg mb-3">Selecciona los objetos que viste</p>
          <div className="flex gap-2 justify-center flex-wrap mb-4">
            {allOptions.map((e, i) => (
              <button
                key={i}
                onClick={() => toggleRecall(e)}
                className={`text-3xl rounded-xl p-3 transition-all ${
                  recallSelected.has(e) ? "glass-card neon-border scale-110" : "glass-card hover:scale-105"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <button onClick={handleRecallSubmit} className="rounded-lg bg-primary px-6 py-2 font-heading text-xs font-bold uppercase text-primary-foreground">
            Comprobar
          </button>
        </div>
      )}
    </div>
  );
};

export default ObjectMemoryGame;
