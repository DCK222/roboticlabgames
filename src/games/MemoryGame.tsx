import { useState, useEffect, useCallback } from "react";

interface Props {
  onComplete: (score: number) => void;
}

const EMOJIS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

interface Card { id: number; emoji: string; flipped: boolean; matched: boolean; }

const MemoryGame = ({ onComplete }: Props) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [pairs, setPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const all = [...EMOJIS, ...EMOJIS];
    setCards(
      all
        .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ sort, ...r }) => r)
    );
  }, []);

  const handleFlip = useCallback((idx: number) => {
    if (checking || selected.length >= 2) return;
    const c = cards[idx];
    if (c.flipped || c.matched) return;

    const next = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    setCards(next);
    const sel = [...selected, idx];
    setSelected(sel);

    if (sel.length === 2) {
      setChecking(true);
      setMoves(m => m + 1);
      const [a, b] = sel;
      if (next[a].emoji === next[b].emoji) {
        setTimeout(() => {
          setCards(p => p.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
          setPairs(p => {
            const np = p + 1;
            if (np === EMOJIS.length) onComplete(Math.max(100 - (moves + 1 - EMOJIS.length) * 5, 10));
            return np;
          });
          setSelected([]);
          setChecking(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(p => p.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c));
          setSelected([]);
          setChecking(false);
        }, 800);
      }
    }
  }, [cards, selected, checking, moves, onComplete]);

  return (
    <div>
      <p className="text-center text-sm text-muted-foreground mb-3">Parejas: {pairs}/{EMOJIS.length} · Movimientos: {moves}</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleFlip(idx)}
            disabled={card.flipped || card.matched}
            className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-300 ${
              card.matched ? "bg-primary/20 border border-primary/40 opacity-50" :
              card.flipped ? "glass-card border border-primary/60 scale-105" :
              "glass-card hover:neon-border cursor-pointer"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : "?"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
