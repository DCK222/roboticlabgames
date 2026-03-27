import { useNavigate, useParams } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import { GAMES } from "@/data/games";

const RoomView = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { player, rooms, leaveRoom, startGame } = useGame();
  const navigate = useNavigate();

  const room = rooms.find((r) => r.id === roomId);

  if (!player) {
    navigate("/");
    return null;
  }

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground text-lg">Sala no encontrada</p>
        <button onClick={() => navigate("/lobby")} className="text-primary font-heading text-sm underline">
          Volver al lobby
        </button>
      </div>
    );
  }

  const isHost = room.host === player.id;

  const handleSelectGame = (gameId: string) => {
    startGame(room.id, gameId);
    navigate(`/play/${room.id}/${gameId}`);
  };

  const handleLeave = () => {
    leaveRoom(room.id);
    navigate("/lobby");
  };

  // Don't auto-redirect - let players choose from room view

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">
      <header className="flex items-center justify-between py-6">
        <button onClick={handleLeave} className="text-muted-foreground hover:text-foreground transition-colors font-heading text-sm">
          ← Salir
        </button>
        <h1 className="font-heading text-xl font-bold neon-text text-primary">
          {room.name}
        </h1>
        <span className="text-sm text-muted-foreground">
          {room.players.length}/{room.maxPlayers}
        </span>
      </header>

      {/* Players */}
      <div className="glass-card neon-border rounded-xl p-5 mb-6">
        <h2 className="font-heading text-xs uppercase tracking-widest text-primary mb-3">Jugadores</h2>
        <div className="flex flex-wrap gap-3">
          {room.players.map((p) => (
            <span
              key={p.id}
              className="rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground"
            >
              {p.name} {p.id === room.host && "👑"}
            </span>
          ))}
        </div>
      </div>

      {/* Game Selection */}
      {isHost ? (
        <>
          <h2 className="font-heading text-sm uppercase tracking-widest text-primary mb-4">
            Elige un juego
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => handleSelectGame(game.id)}
                className={`glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:neon-border transition-all bg-gradient-to-br ${game.color}`}
              >
                <span className="text-3xl">{game.emoji}</span>
                <span className="font-heading text-xs font-semibold text-foreground">{game.name}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="glass-card rounded-xl p-10 text-center">
          <p className="text-muted-foreground text-lg animate-pulse-neon">
            Esperando a que el anfitrión elija un juego...
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomView;
