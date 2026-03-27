import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

interface TableQ {
  item: string;
  unitPrice: number;
  rows: { qty: number; price: number | null }[];
}

const ITEMS = ["lápiz", "cuaderno", "goma", "rotulador", "regla", "bolígrafo", "carpeta", "pegamento"];

const generateTable = (): TableQ => {
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const unitPrice = Math.floor(Math.random() * 5) + 1;
  const quantities = [1, 2, 3, 5, 10].sort(() => Math.random() - 0.5).slice(0, 4).sort((a, b) => a - b);
  const hiddenIdx = 1 + Math.floor(Math.random() * (quantities.length - 1));
  const rows = quantities.map((qty, i) => ({
    qty,
    price: i === hiddenIdx ? null : qty * unitPrice,
  }));
  return { item, unitPrice, rows };
};

const ProportionTableGame = ({ onComplete }: Props) => {
  const [table, setTable] = useState(generateTable());
  const [input, setInput] = useState("");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const totalRounds = 6;

  const hiddenRow = table.rows.find(r => r.price === null)!;
  const correctAnswer = hiddenRow.qty * table.unitPrice;

  const handleSubmit = () => {
    const num = parseFloat(input);
    const correct = num === correctAnswer;
    if (correct) { setFeedback("✅ ¡Correcto!"); setScore(s => s + 15); }
    else setFeedback(`❌ Era ${correctAnswer} €`);

    setTimeout(() => {
      if (round >= totalRounds) {
        setDone(true);
        onComplete(score + (correct ? 15 : 0));
      } else {
        setRound(r => r + 1);
        setTable(generateTable());
        setInput("");
        setFeedback(null);
      }
    }, 1200);
  };

  if (done) return <p className="text-center text-primary font-heading text-lg">Puntuación: {score}</p>;

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-4">Ronda {round}/{totalRounds} · Completa la tabla</p>
      <div className="glass-card rounded-xl p-4 max-w-xs mx-auto mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-sm text-primary font-heading">Cantidad</th>
              <th className="py-2 text-sm text-primary font-heading">Precio</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="border-b border-border/30">
                <td className="py-2 text-foreground">{row.qty} {table.item}{row.qty > 1 ? "s" : ""}</td>
                <td className="py-2 text-foreground font-bold">
                  {row.price !== null ? `${row.price} €` : (
                    <span className="text-primary animate-pulse">? €</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            placeholder="€"
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

export default ProportionTableGame;
