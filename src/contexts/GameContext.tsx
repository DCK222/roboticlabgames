import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

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

const ROOMS_KEY = "roboticlab_rooms";
const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
};

const loadRooms = (): Room[] => {
  try {
    return JSON.parse(localStorage.getItem(ROOMS_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveRooms = (rooms: Room[]) => {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [rooms, setRooms] = useState<Room[]>(loadRooms);

  // Sync rooms to localStorage whenever they change
  useEffect(() => {
    saveRooms(rooms);
  }, [rooms]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ROOMS_KEY && e.newValue) {
        try {
          setRooms(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // Also use BroadcastChannel for same-origin tabs
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("roboticlab_sync");
      bc.onmessage = () => {
        setRooms(loadRooms());
      };
    } catch {}

    return () => {
      window.removeEventListener("storage", handleStorage);
      bc?.close();
    };
  }, []);

  // Broadcast changes to other tabs
  const broadcastChange = useCallback(() => {
    try {
      const bc = new BroadcastChannel("roboticlab_sync");
      bc.postMessage("update");
      bc.close();
    } catch {}
  }, []);

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
    setRooms((prev) => {
      const next = [...prev, room];
      saveRooms(next);
      return next;
    });
    broadcastChange();
    return room.id;
  }, [player, broadcastChange]);

  const joinRoom = useCallback((roomId: string): boolean => {
    if (!player) return false;
    let joined = false;
    setRooms((prev) => {
      const next = prev.map((r) => {
        if (r.id === roomId && r.players.length < r.maxPlayers && !r.players.find((p) => p.id === player.id)) {
          joined = true;
          return { ...r, players: [...r.players, player] };
        }
        return r;
      });
      saveRooms(next);
      return next;
    });
    broadcastChange();
    return joined;
  }, [player, broadcastChange]);

  const leaveRoom = useCallback((roomId: string) => {
    if (!player) return;
    setRooms((prev) => {
      const next = prev
        .map((r) => {
          if (r.id === roomId) {
            const newPlayers = r.players.filter((p) => p.id !== player.id);
            if (newPlayers.length === 0) return null;
            return { ...r, players: newPlayers, host: newPlayers[0].id };
          }
          return r;
        })
        .filter(Boolean) as Room[];
      saveRooms(next);
      return next;
    });
    broadcastChange();
  }, [player, broadcastChange]);

  const startGame = useCallback((roomId: string, gameId: string) => {
    setRooms((prev) => {
      const next = prev.map((r) =>
        r.id === roomId ? { ...r, gameId, status: "playing" as const } : r
      );
      saveRooms(next);
      return next;
    });
    broadcastChange();
  }, [broadcastChange]);

  const currentRoom = rooms.find((r) => r.players.some((p) => p.id === player?.id)) || null;

  // Poll for room updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms(loadRooms());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={{ player, setPlayerName, rooms, createRoom, joinRoom, leaveRoom, startGame, currentRoom }}>
      {children}
    </GameContext.Provider>
  );
};
