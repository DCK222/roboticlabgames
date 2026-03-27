import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";

const Lobby = () => {
  const { player, rooms, createRoom, joinRoom } = useGame();
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  if (!player) {
    navigate("/");
    return null;
  }

  const handleCreate = () => {
    if (!roomName.trim()) return;
    const id = createRoom(roomName.trim());
    if (id) {
      setRoomName("");
      navigate(`/room/${id}`);
    }
  };

  const handleJoin = (roomId: string) => {
    joinRoom(roomId);
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <header className="flex items-center justify-between py-6">
        <h1 className="font-heading text-2xl font-bold neon-text text-primary">
          🤖 RoboticlabGAMES
        </h1>
        <span className="glass-card rounded-full px-4 py-1.5 text-sm font-semibold text-secondary-foreground">
          {player.name}
        </span>
      </header>

      {/* Create Room */}
      <div className="glass-card neon-border rounded-xl p-6 mb-6">
        <h2 className="font-heading text-sm uppercase tracking-widest text-primary mb-4">
          Crear Sala
        </h2>
        <div className="flex gap-3">
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Nombre de la sala..."
            maxLength={30}
            className="flex-1 rounded-lg bg-secondary px-4 py-2.5 text-foreground outline-none border border-border focus:border-primary transition-all placeholder:text-muted-foreground"
          />
          <button
            onClick={handleCreate}
            disabled={!roomName.trim()}
            className="rounded-lg bg-primary px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Crear
          </button>
        </div>
      </div>

      {/* Room List */}
      <div>
        <h2 className="font-heading text-sm uppercase tracking-widest text-primary mb-4">
          Salas Disponibles
        </h2>
        {rooms.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <p className="text-muted-foreground text-lg">No hay salas aún</p>
            <p className="text-muted-foreground text-sm mt-1">¡Crea la primera!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="glass-card rounded-xl p-5 flex items-center justify-between hover:neon-border transition-all"
              >
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {room.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {room.players.length}/{room.maxPlayers} jugadores · {room.status === "waiting" ? "Esperando" : "Jugando"}
                  </p>
                </div>
                <button
                  onClick={() => handleJoin(room.id)}
                  disabled={room.players.length >= room.maxPlayers || room.players.some((p) => p.id === player.id)}
                  className="rounded-lg bg-primary px-5 py-2 font-heading text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {room.players.some((p) => p.id === player.id) ? "Dentro" : "Unirse"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
