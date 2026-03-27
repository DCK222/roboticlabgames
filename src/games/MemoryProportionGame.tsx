import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

interface PriceInfo { item: string; emoji: string; qty: number; price: number; }

const generateRound = (): { items: PriceInfo[]; questions: { text: string; answer: number }[] } => {
  const pool = [
    { item: "manzana", emoji: "🍎" },
    { item: "pera", emoji: "🍐" },
    { item: "plátano", emoji: "🍌" },
    { item: "naranja", emoji: "🍊" },
    { item: "fresa", emoji: "🍓" },
    { item: "uva", emoji: "🍇" },
  ];
  const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  const items: PriceInfo[] = chosen.map(c => {
    const qty = Math.floor(Math.random() * 4) + 1;
    const unitPrice = Math.floor(Math.random() * 4) + 1;
    return { ...c, qty, price: qty * unitPrice };
  });

  const questions = items.map(it => {
    const unitPrice = it.price / it.qty;
    const askQty = Math.floor(Math.random() * 5) + 2;
    return {
      text: `¿Cuánto cuestan ${askQty} ${it.item}${askQty > 1 ? "s" : ""}?`,
      answer: askQty * unitPrice,
    };
  });

  return { items, questions };
};

const MemoryProportionGame = ({ onComplete }: Props) => {
  const [roundData, setRoundData] = useState(generateRound());
  const [phase, setPhase] = useState<"show" | "questions" | "done">("show");
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const totalRounds = 3;

  useEffect(() => {
    if (phase === "show") {
      const timer = setTimeout(() => setPhase("questions"), 6000);
      return () => clearTimeout(timer);
    }
  }, [phase, round]);

  const handleSubmit = () => {
    const num = parseFloat(input);
    const correct = num === roundData.questions[qIdx].answer;
    if (correct) { setFeedback("✅"); setScore(s => s + 15); }
    else setFeedback(`❌ Era ${roundData.questions[qIdx].answer} €`);

    setTimeout(() => {
      setFeedback(null);
      setInput("");
      if (qIdx + 1 < roundData.questions.length) {
        setQIdx(q => q + 1);
      } else {
        if (round >= totalRounds) {
          setPhase("done");
          onComplete(score + (correct ? 15 : 0));
        } else {
          setRound(r => r + 1);
          setRoundData(generateRound());
          setQIdx(0);
          setPhase("show");
        }
      }
    }, 1200);
  };

  if (phase === "done") return <p className="text-center text-primary font-heading text-lg">Puntuación: {score}</p>;

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-4">Ronda {round}/{totalRounds} · Puntos: {score}</p>
      {phase === "show" && (
        <div>
          <p className="text-foreground text-lg mb-4 animate-pulse">🧠 ¡Memoriza los precios! (6 segundos)</p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            {roundData.items.map((it, i) => (
              <div key={i} className="glass-card neon-border rounded-xl p-4 flex justify-between items-center">
                <span className="text-2xl">{it.emoji} {it.qty} {it.item}{it.qty > 1 ? "s" : ""}</span>
                <span className="text-primary font-bold text-xl">{it.price} €</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {phase === "questions" && (
        <div>
          <p className="text-foreground text-lg mb-4">{roundData.questions[qIdx].text}</p>
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
      )}
    </div>
  );
};

export default MemoryProportionGame;
