import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { GAMES } from "@/data/games";
import MemoryGame from "@/games/MemoryGame";
import SimonGame from "@/games/SimonGame";
import SequenceGame from "@/games/SequenceGame";
import FlashGame from "@/games/FlashGame";
import GridGame from "@/games/GridGame";
import OrderGame from "@/games/OrderGame";
import SpeedGame from "@/games/SpeedGame";
import CountGame from "@/games/CountGame";
import ChainGame from "@/games/ChainGame";
import DifferGame from "@/games/DifferGame";
import ReverseGame from "@/games/ReverseGame";
import PatternGame from "@/games/PatternGame";
import ShapeSequenceGame from "@/games/ShapeSequenceGame";
import DoubleHalfGame from "@/games/DoubleHalfGame";
import ProportionTableGame from "@/games/ProportionTableGame";
import RecipeGame from "@/games/RecipeGame";
import MixGame from "@/games/MixGame";
import FractionMatchGame from "@/games/FractionMatchGame";
import ScaleGame from "@/games/ScaleGame";
import MoneyGame from "@/games/MoneyGame";
import RatioGame from "@/games/RatioGame";
import MemoryProportionGame from "@/games/MemoryProportionGame";
import GestureGame from "@/games/GestureGame";
import WordChainGame from "@/games/WordChainGame";
import ObjectMemoryGame from "@/games/ObjectMemoryGame";
import MathGame from "@/games/MathGame";
import LogicGame from "@/games/LogicGame";
import ChemistryGame from "@/games/ChemistryGame";

const GAME_COMPONENTS: Record<string, React.ComponentType<{ onComplete: (score: number) => void; variant?: string }>> = {
  memory: MemoryGame,
  simon: SimonGame,
  sequence: SequenceGame,
  flash: FlashGame,
  grid: GridGame,
  order: OrderGame,
  speed: SpeedGame,
  count: CountGame,
  chain: ChainGame,
  differ: DifferGame,
  reverse: ReverseGame,
  pattern: PatternGame,
  shapes: ShapeSequenceGame,
  doublehalf: DoubleHalfGame,
  proptable: ProportionTableGame,
  recipe: RecipeGame,
  mix: MixGame,
  fractions: FractionMatchGame,
  scale: ScaleGame,
  money: MoneyGame,
  ratio: RatioGame,
  memprop: MemoryProportionGame,
  gesture: GestureGame,
  wordchain: WordChainGame,
  objects: ObjectMemoryGame,
  math: MathGame,
  logic: LogicGame,
  chemistry: ChemistryGame,
};

const PlayGame = () => {
  const { roomId, gameId } = useParams<{ roomId: string; gameId: string }>();
  const { player, rooms, leaveRoom } = useGame();
  const navigate = useNavigate();

  const room = rooms.find((r) => r.id === roomId);
  const game = GAMES.find((g) => g.id === gameId);

  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<"playing" | "waiting" | "results">("playing");
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    if (!player) navigate("/");
  }, [player, navigate]);

  const handleComplete = useCallback((score: number) => {
    if (!room) return;
    const playerId = room.players[currentPlayerIdx]?.id;
    if (!playerId) return;

    const newScores = { ...scores, [playerId]: score };
    setScores(newScores);

    const nextIdx = currentPlayerIdx + 1;
    if (nextIdx >= room.players.length) {
      setPhase("results");
    } else {
      setCurrentPlayerIdx(nextIdx);
      setPhase("waiting");
    }
  }, [room, currentPlayerIdx, scores]);

  const handleNextPlayer = () => {
    setPhase("playing");
    setGameKey(k => k + 1);
  };

  const handlePlayAgain = () => {
    setScores({});
    setCurrentPlayerIdx(0);
    setPhase("playing");
    setGameKey(k => k + 1);
  };

  const handleBack = () => {
    if (room) leaveRoom(room.id);
    navigate("/lobby");
  };

  if (!player) return null;
  if (!room || !game) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Juego no encontrado</p>
        <button onClick={() => navigate("/lobby")} className="text-primary font-heading text-sm underline">Volver</button>
      </div>
    );
  }

  const GameComponent = GAME_COMPONENTS[game.type];
  const activePlayer = room.players[currentPlayerIdx];
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen px-3 sm:px-4 pb-8 max-w-3xl mx-auto">
      <header className="flex items-center justify-between py-3 sm:py-4 gap-2">
        <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors font-heading text-xs sm:text-sm shrink-0">← Salir</button>
        <h1 className="font-heading text-sm sm:text-lg font-bold text-foreground text-center truncate">{game.emoji} {game.name}</h1>
        <div className="w-8 sm:w-12 shrink-0" />
      </header>

      <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 justify-center flex-wrap">
        {room.players.map((p, i) => (
          <div key={p.id} className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all ${currentPlayerIdx === i && phase !== "results" ? "bg-primary text-primary-foreground neon-border" : "glass-card text-secondary-foreground"}`}>
            {p.name}: {scores[p.id] ?? "-"}
          </div>
        ))}
      </div>

      {phase === "playing" && activePlayer && (
        <div>
          <p className="text-center text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Turno de <span className="text-primary font-semibold">{activePlayer.name}</span>
          </p>
          {GameComponent && <GameComponent key={gameKey} onComplete={handleComplete} variant={game.variant} />}
        </div>
      )}

      {phase === "waiting" && (
        <div className="glass-card neon-border rounded-xl p-5 sm:p-8 text-center">
          <p className="text-foreground text-base sm:text-lg mb-2">
            {room.players[currentPlayerIdx - 1]?.name} terminó con <span className="text-primary font-bold">{scores[room.players[currentPlayerIdx - 1]?.id] ?? 0}</span> puntos
          </p>
          <p className="text-muted-foreground text-sm mb-4">Siguiente: <span className="text-primary font-semibold">{room.players[currentPlayerIdx]?.name}</span></p>
          <button onClick={handleNextPlayer} className="rounded-lg bg-primary px-6 sm:px-8 py-2.5 sm:py-3 font-heading text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90">
            ¡Listo!
          </button>
        </div>
      )}

      {phase === "results" && (
        <div className="glass-card neon-border rounded-xl p-5 sm:p-8 text-center">
          <p className="font-heading text-lg sm:text-xl font-bold neon-text text-primary mb-3 sm:mb-4">🎉 ¡Resultados!</p>
          <div className="flex flex-col gap-2 mb-4 sm:mb-6">
            {sortedScores.map(([id, s], i) => {
              const p = room.players.find(pl => pl.id === id);
              return (
                <div key={id} className={`rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between text-sm ${i === 0 ? "bg-primary/20 neon-border" : "glass-card"}`}>
                  <span className="font-semibold">{i === 0 ? "👑 " : ""}{p?.name}</span>
                  <span className="text-primary font-bold">{s} pts</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <button onClick={handlePlayAgain} className="rounded-lg bg-primary px-6 py-2.5 font-heading text-xs font-bold uppercase text-primary-foreground hover:opacity-90">Jugar otra vez</button>
            <button onClick={() => navigate(`/room/${room.id}`)} className="rounded-lg bg-secondary px-6 py-2.5 font-heading text-xs font-bold uppercase text-secondary-foreground hover:opacity-80">Elegir otro juego</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayGame;
