import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/contexts/GameContext";
import NameEntry from "./pages/NameEntry";
import Lobby from "./pages/Lobby";
import RoomView from "./pages/RoomView";
import PlayGame from "./pages/PlayGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GameProvider>
          <Routes>
            <Route path="/" element={<NameEntry />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/room/:roomId" element={<RoomView />} />
            <Route path="/play/:roomId/:gameId" element={<PlayGame />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </GameProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
