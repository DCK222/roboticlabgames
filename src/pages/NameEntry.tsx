import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";

const NameEntry = () => {
  const [name, setName] = useState("");
  const { setPlayerName } = useGame();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    setPlayerName(name.trim());
    navigate("/lobby");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="animate-float mb-8">
        <span className="text-7xl">🤖</span>
      </div>

      <h1 className="font-heading text-4xl font-black tracking-wider neon-text text-primary mb-2 text-center">
        RoboticlabGAMES
      </h1>
      <p className="text-muted-foreground text-lg mb-10 font-medium">
        Juegos de memoria multijugador
      </p>

      <form onSubmit={handleSubmit} className="glass-card neon-border rounded-xl p-8 w-full max-w-sm flex flex-col gap-5">
        <label className="font-heading text-sm tracking-widest text-primary uppercase">
          Tu nombre
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Escribe tu nombre..."
          maxLength={20}
          className="w-full rounded-lg bg-secondary px-4 py-3 text-foreground font-body text-lg outline-none border border-border focus:border-primary focus:neon-border transition-all placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={name.trim().length < 2}
          className="w-full rounded-lg bg-primary py-3 font-heading text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default NameEntry;
