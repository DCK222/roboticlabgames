import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface Player {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  host: string;
  players: Player[];
  maxPlayers: number;
  gameId: string | null;
  status: "waiting" | "playing";
}

interface GameContextType {
  player: Player | null;
  setPlayerName: (name: string) => void;
  rooms: Room[];
  createRoom: (name: string) => string;
  joinRoom: (roomId: string) => boolean;
  leaveRoom: (roomId: string) => void;
  startGame: (roomId: string, gameId: string) => void;
  currentRoom: Room | null;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  const setPlayerName = useCallback((name: string) => {
    setPlayer({ id: crypto.randomUUID(), name });
  }, []);

  const createRoom = useCallback((name: string): string => {
    if (!player) return "";
    const room: Room = {
      id: crypto.randomUUID(),
      name,
      host: player.id,
      players: [player],
      maxPlayers: 4,
      gameId: null,
      status: "waiting",
    };
    setRooms((prev) => [...prev, room]);
    return room.id;
  }, [player]);

  const joinRoom = useCallback((roomId: string): boolean => {
    if (!player) return false;
    let joined = false;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId && r.players.length < r.maxPlayers && !r.players.find((p) => p.id === player.id)) {
          joined = true;
          return { ...r, players: [...r.players, player] };
        }
        return r;
      })
    );
    return joined;
  }, [player]);

  const leaveRoom = useCallback((roomId: string) => {
    if (!player) return;
    setRooms((prev) =>
      prev
        .map((r) => {
          if (r.id === roomId) {
            const newPlayers = r.players.filter((p) => p.id !== player.id);
            if (newPlayers.length === 0) return null;
            return { ...r, players: newPlayers, host: newPlayers[0].id };
          }
          return r;
        })
        .filter(Boolean) as Room[]
    );
  }, [player]);

  const startGame = useCallback((roomId: string, gameId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, gameId, status: "playing" as const } : r
      )
    );
  }, []);

  const currentRoom = rooms.find((r) => r.players.some((p) => p.id === player?.id)) || null;

  return (
    <GameContext.Provider value={{ player, setPlayerName, rooms, createRoom, joinRoom, leaveRoom, startGame, currentRoom }}>
      {children}
    </GameContext.Provider>
  );
};
