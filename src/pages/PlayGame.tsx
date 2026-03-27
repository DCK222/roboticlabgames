import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { GAMES } from "@/data/games";

interface CardState {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const PlayGame = () => {
  const { roomId, gameId } = useParams<{ roomId: string; gameId: string }>();
  const { player, rooms, leaveRoom } = useGame();
  const navigate = useNavigate();

  const room = rooms.find((r) => r.id === roomId);
  const game = GAMES.find((g) => g.id === gameId);

  const [cards, setCards] = useState<CardState[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [gameOver, setGameOver] = useState(false);
  const [checking, setChecking] = useState(false);

  // Initialize cards
  useEffect(() => {
    if (!game) return;
    const pairs = [...game.cards, ...game.cards];
    const shuffled = pairs
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ sort, ...rest }) => rest);
    setCards(shuffled);
    if (room) {
      const initial: Record<string, number> = {};
      room.players.forEach((p) => (initial[p.id] = 0));
      setScores(initial);
    }
  }, [game, room?.id]);

  const handleFlip = useCallback(
    (cardId: number) => {
      if (checking) return;
      if (selected.length >= 2) return;

      const card = cards[cardId];
      if (card.flipped || card.matched) return;

      const newCards = cards.map((c, i) => (i === cardId ? { ...c, flipped: true } : c));
      setCards(newCards);

      const newSelected = [...selected, cardId];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setChecking(true);
        const [a, b] = newSelected;
        if (newCards[a].emoji === newCards[b].emoji) {
          // Match!
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c))
            );
            if (room) {
              const currentPlayerId = room.players[currentPlayer % room.players.length].id;
              setScores((prev) => ({ ...prev, [currentPlayerId]: (prev[currentPlayerId] || 0) + 1 }));
            }
            setSelected([]);
            setChecking(false);
          }, 600);
        } else {
          // No match
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c))
            );
            setSelected([]);
            setCurrentPlayer((prev) => prev + 1);
            setChecking(false);
          }, 1000);
        }
      }
    },
    [cards, selected, checking, currentPlayer, room]
  );

  // Check game over
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setGameOver(true);
    }
  }, [cards]);

  if (!player) {
    navigate("/");
    return null;
  }

  if (!room || !game) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Juego no encontrado</p>
        <button onClick={() => navigate("/lobby")} className="text-primary font-heading text-sm underline">
          Volver
        </button>
      </div>
    );
  }

  const activePlayer = room.players[currentPlayer % room.players.length];

  const handleBack = () => {
    leaveRoom(room.id);
    navigate("/lobby");
  };

  const handlePlayAgain = () => {
    // Reset
    const pairs = [...game.cards, ...game.cards];
    const shuffled = pairs
      .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ sort, ...rest }) => rest);
    setCards(shuffled);
    setSelected([]);
    setCurrentPlayer(0);
    setGameOver(false);
    setChecking(false);
    const initial: Record<string, number> = {};
    room.players.forEach((p) => (initial[p.id] = 0));
    setScores(initial);
  };

  const winner = gameOver
    ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
    : null;

  const winnerPlayer = winner ? room.players.find((p) => p.id === winner[0]) : null;

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors font-heading text-sm">
          ← Salir
        </button>
        <h1 className="font-heading text-lg font-bold text-foreground">
          {game.emoji} {game.name}
        </h1>
        <div className="w-12" />
      </header>

      {/* Scores */}
      <div className="flex gap-3 mb-4 justify-center flex-wrap">
        {room.players.map((p, i) => (
          <div
            key={p.id}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              currentPlayer % room.players.length === i && !gameOver
                ? "bg-primary text-primary-foreground neon-border"
                : "glass-card text-secondary-foreground"
            }`}
          >
            {p.name}: {scores[p.id] || 0}
          </div>
        ))}
      </div>

      {/* Turn indicator */}
      {!gameOver && (
        <p className="text-center text-sm text-muted-foreground mb-4">
          Turno de <span className="text-primary font-semibold">{activePlayer.name}</span>
        </p>
      )}

      {/* Game Over */}
      {gameOver && (
        <div className="glass-card neon-border rounded-xl p-6 mb-4 text-center">
          <p className="font-heading text-xl font-bold neon-text text-primary mb-2">
            🎉 ¡Juego terminado!
          </p>
          {winnerPlayer && (
            <p className="text-foreground text-lg mb-4">
              Ganador: <span className="text-primary font-bold">{winnerPlayer.name}</span> con {winner![1]} parejas
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePlayAgain}
              className="rounded-lg bg-primary px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 transition-all"
            >
              Jugar otra vez
            </button>
            <button
              onClick={handleBack}
              className="rounded-lg bg-secondary px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-widest text-secondary-foreground hover:opacity-80 transition-all"
            >
              Volver al lobby
            </button>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleFlip(idx)}
            disabled={card.flipped || card.matched || gameOver}
            className={`aspect-square rounded-xl text-3xl sm:text-4xl flex items-center justify-center font-bold transition-all duration-300 ${
              card.matched
                ? "bg-primary/20 border border-primary/40 scale-95 opacity-60"
                : card.flipped
                ? "glass-card border border-primary/60 scale-105"
                : "glass-card hover:neon-border hover:scale-105 cursor-pointer active:scale-95"
            }`}
          >
            {card.flipped || card.matched ? (
              <span>{card.emoji}</span>
            ) : (
              <span className="text-2xl text-muted-foreground">?</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayGame;
