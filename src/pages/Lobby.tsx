import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { GAMES } from "@/data/games";
import logo from "@/assets/logo.webp";
import RiddleCarousel from "@/components/RiddleCarousel";
import VisualRiddleCarousel from "@/components/VisualRiddleCarousel";

const CATEGORY_LABELS: Record<string, string> = {
  memoria: "🧠 Memoria y Secuencias",
  proporciones: "📐 Proporciones",
  mixto: "🧩 Mixto",
  matematicas: "➕ Matemáticas Online",
  logica: "🧩 Reta Tu Mente — Lógica y Números",
  quimica: "⚗️ Tabla Periódica",
};

const CATEGORIES = ["memoria", "proporciones", "mixto", "matematicas", "logica", "quimica"] as const;

const Lobby = () => {
  const { player, createRoom, startGame } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!player) navigate("/");
  }, [player, navigate]);

  if (!player) return null;

  const handlePlayGame = (gameId: string) => {
    const id = createRoom("Partida rápida");
    if (id) {
      startGame(id, gameId);
      navigate(`/play/${id}/${gameId}`);
    }
  };

  return (
    <div className="min-h-screen px-3 sm:px-4 pb-8 max-w-5xl mx-auto">
      <header className="flex items-center justify-between py-4 sm:py-6 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src={logo} alt="Roboticlab" className="h-6 sm:h-8 shrink-0" />
          <h1 className="font-heading text-lg sm:text-2xl font-bold neon-text text-primary whitespace-nowrap">GAMES</h1>
        </div>
        <span className="glass-card rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-secondary-foreground truncate max-w-[120px] sm:max-w-none">
          {player.name}
        </span>
      </header>

      {CATEGORIES.map((cat) => {
        const catGames = GAMES.filter((g) => g.category === cat);
        if (catGames.length === 0) return null;
        return (
          <div key={cat} className="mb-6 sm:mb-8">
            <h2 className="font-heading text-xs sm:text-sm uppercase tracking-widest text-primary mb-2 sm:mb-3">
              {CATEGORY_LABELS[cat]}
            </h2>

            {cat === "quimica" && (
              <button
                onClick={() => navigate("/tabla-periodica")}
                className="mb-3 sm:mb-4 glass-card neon-border rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all w-full sm:w-auto"
              >
                <span className="text-2xl sm:text-3xl">🗺️</span>
                <div className="text-left">
                  <span className="font-heading text-xs sm:text-sm font-bold text-foreground">Ver Tabla Periódica Interactiva</span>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Explora todos los elementos con sus propiedades</p>
                </div>
              </button>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {catGames.map((game) => (
                <button
                  key={game.id}
                  onClick={() => handlePlayGame(game.id)}
                  className={`glass-card rounded-xl p-2.5 sm:p-3 flex flex-col items-center gap-1 hover:neon-border transition-all bg-gradient-to-br ${game.color}`}
                >
                  <span className="text-xl sm:text-2xl">{game.emoji}</span>
                  <span className="font-heading text-[10px] sm:text-xs font-semibold text-foreground leading-tight text-center">{game.name}</span>
                  <span className="text-[8px] sm:text-[9px] text-muted-foreground leading-tight text-center line-clamp-2">{game.description}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <RiddleCarousel />
    </div>
  );
};

export default Lobby;
