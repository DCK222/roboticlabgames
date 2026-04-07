import { useNavigate } from "react-router-dom";
import { useGame } from "@/contexts/GameContext";
import logo from "@/assets/logo.webp";

const NameEntry = () => {
  const { setPlayerName } = useGame();
  const navigate = useNavigate();

  const handleEnter = () => {
    const randomId = Math.floor(Math.random() * 9999) + 1;
    setPlayerName(`Jugador${randomId}`);
    navigate("/lobby");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 gap-4 sm:gap-6">
      <img src={logo} alt="Roboticlab" className="w-48 sm:w-72 md:w-96" />
      <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-black tracking-wider neon-text text-primary">
        GAMES
      </h1>
      <p className="text-muted-foreground text-sm sm:text-lg font-medium text-center">
        Juegos educativos multijugador
      </p>
      <button
        onClick={handleEnter}
        className="mt-2 sm:mt-4 rounded-xl bg-primary px-8 sm:px-12 py-3 sm:py-4 font-heading text-base sm:text-lg font-bold uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90 hover:scale-105 neon-border"
      >
        🚀 Entrar
      </button>
    </div>
  );
};

export default NameEntry;
