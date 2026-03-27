import { useState, useEffect } from "react";

interface Props { onComplete: (score: number) => void; }

interface FractionPair { a: string; b: string; }

const PAIRS: FractionPair[] = [
  { a: "1/2", b: "2/4" }, { a: "1/3", b: "2/6" }, { a: "2/3", b: "4/6" },
  { a: "3/4", b: "6/8" }, { a: "1/4", b: "2/8" }, { a: "2/5", b: "4/10" },
  { a: "3/6", b: "1/2" }, { a: "5/10", b: "1/2" }, { a: "4/8", b: "1/2" },
  { a: "2/4", b: "3/6" }, { a: "1/5", b: "2/10" }, { a: "3/9", b: "1/3" },
];

interface Card { id: number; text: string; pairId: number; matched: boolean; }

const FractionMatchGame = ({ onComplete }: Props) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [pairs, setPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [checking, setChecking] = useState(false);
  const totalPairs = 6;

  useEffect(() => {
    const chosen = [...PAIRS].sort(() => Math.random() - 0.5).slice(0, totalPairs);
    const all: Card[] = [];
    chosen.forEach((p, i) => {
      all.push({ id: all.length, text: p.a, pairId: i, matched: false });
      all.push({ id: all.length, text: p.b, pairId: i, matched: false });
    });
    setCards(all.sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, id: i })));
  }, []);

  const handleClick = (idx: number) => {
    if (checking || selected.includes(idx) || cards[idx].matched) return;
    const sel = [...selected, idx];
    setSelected(sel);

    if (sel.length === 2) {
      setChecking(true);
      setMoves(m => m + 1);
      const [a, b] = sel;
      if (cards[a].pairId === cards[b].pairId) {
        setTimeout(() => {
          setCards(p => p.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
          setPairs(p => {
            const np = p + 1;
            if (np === totalPairs) onComplete(Math.max(100 - (moves + 1 - totalPairs) * 5, 10));
            return np;
          });
          setSelected([]);
          setChecking(false);
        }, 500);
      } else {
        setTimeout(() => { setSelected([]); setChecking(false); }, 800);
      }
    }
  };

  return (
    <div className="text-center">
      <p className="text-muted-foreground text-sm mb-3">Empareja fracciones equivalentes · {pairs}/{totalPairs} · Movimientos: {moves}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-md mx-auto">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            disabled={card.matched}
            className={`rounded-xl py-4 px-2 text-lg font-bold transition-all ${
              card.matched ? "bg-primary/20 border border-primary/40 opacity-50" :
              selected.includes(idx) ? "glass-card neon-border scale-105 text-primary" :
              "glass-card hover:neon-border cursor-pointer text-foreground"
            }`}
          >
            {selected.includes(idx) || card.matched ? card.text : "?"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FractionMatchGame;
