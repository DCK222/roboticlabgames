import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react";

type Suit = "oros" | "copas" | "espadas" | "bastos";

interface Card {
  value: number; // 1-12 (sin 8 ni 9 en baraja española de 40, pero permitimos 1-12)
  suit: Suit;
  hidden?: boolean;
}

interface DeckGame {
  title: string;
  category: string;
  setup: string; // qué montar
  challenge: string; // qué preguntar
  reveal: string; // respuesta / cómo desvelar
  cards: Card[]; // disposición visual sugerida
  layout: "row" | "pyramid" | "elevator" | "balance" | "sandwich" | "scatter" | "mirror" | "path" | "covered";
  emoji: string;
  theme: string;
}

const SUIT_SYMBOL: Record<Suit, string> = {
  oros: "🟡",
  copas: "🍷",
  espadas: "⚔️",
  bastos: "🌳",
};

const SUIT_COLOR: Record<Suit, string> = {
  oros: "text-yellow-500",
  copas: "text-red-500",
  espadas: "text-blue-500",
  bastos: "text-green-600",
};

const VALUE_LABEL = (v: number) => {
  if (v === 10) return "S"; // Sota
  if (v === 11) return "C"; // Caballo
  if (v === 12) return "R"; // Rey
  return String(v);
};

const GAMES: DeckGame[] = [
  {
    title: "El Tren en el Túnel",
    category: "🚂 Suma acumulativa",
    setup: "Coloca varias cartas en fila india: '¡Sube al tren un 3... ahora un 4... ahora un 2... y entra al túnel!' Tapa todas las cartas.",
    challenge: "¿Cuántos pasajeros van en total dentro del túnel?",
    reveal: "Total: 9 (3 + 4 + 2). Destapa las cartas de golpe con efecto dramático.",
    cards: [
      { value: 3, suit: "oros" },
      { value: 4, suit: "copas" },
      { value: 2, suit: "bastos" },
    ],
    layout: "covered",
    emoji: "🚂",
    theme: "from-slate-500/20 to-zinc-500/10",
  },
  {
    title: "El Ladrón de Guante Blanco",
    category: "🕵️ Resta inversa",
    setup: "Pon 4 cartas bocarriba (2, 3, 1, 4). Pídeles que sumen rápido. Cierran ojos, retiras una en secreto.",
    challenge: "La suma original era 10. Ahora ves 2 + 1 + 4 = 7. ¿Qué carta se llevó el ladrón?",
    reveal: "Se llevó el 3. (10 − 7 = 3)",
    cards: [
      { value: 2, suit: "oros" },
      { value: 3, suit: "copas", hidden: true },
      { value: 1, suit: "espadas" },
      { value: 4, suit: "bastos" },
    ],
    layout: "row",
    emoji: "🕵️",
    theme: "from-zinc-500/20 to-slate-500/10",
  },
  {
    title: "El Sándwich Numérico",
    category: "🥪 Ecuación visual",
    setup: "Pon dos cartas bocarriba en los extremos (4 y 2) y una bocabajo en el medio.",
    challenge: "El sándwich entero suma 10. ¿Cuál es el relleno?",
    reveal: "El relleno es un 4. (10 − 4 − 2 = 4)",
    cards: [
      { value: 4, suit: "oros" },
      { value: 4, suit: "copas", hidden: true },
      { value: 2, suit: "bastos" },
    ],
    layout: "sandwich",
    emoji: "🥪",
    theme: "from-amber-500/20 to-yellow-500/10",
  },
  {
    title: "La Pirámide Mágica",
    category: "🔺 Suma por niveles",
    setup: "Dos cartas en la base bocarriba (5 y 3). Encima, una carta bocabajo cruzada.",
    challenge: "La carta de arriba pesa lo mismo que la suma de las dos de abajo. ¿Cuál es?",
    reveal: "Es un 8. (5 + 3 = 8)",
    cards: [
      { value: 8, suit: "espadas", hidden: true },
      { value: 5, suit: "oros" },
      { value: 3, suit: "copas" },
    ],
    layout: "pyramid",
    emoji: "🔺",
    theme: "from-orange-500/20 to-red-500/10",
  },
  {
    title: "El Ascensor",
    category: "🛗 Suma y resta direccional",
    setup: "Carta central: 5 (piso 5). Encima sube un 2. Debajo baja un 3.",
    challenge: "¿En qué piso se para el ascensor al final?",
    reveal: "Piso 4. (5 + 2 − 3 = 4)",
    cards: [
      { value: 2, suit: "copas" },
      { value: 5, suit: "oros" },
      { value: 3, suit: "bastos" },
    ],
    layout: "elevator",
    emoji: "🛗",
    theme: "from-cyan-500/20 to-blue-500/10",
  },
  {
    title: "Las Parejas de Baile",
    category: "💃 Búsqueda rápida",
    setup: "Despliega 6 cartas desordenadas: 7, 3, 5, 9, 4, 8.",
    challenge: "Hay dos cartas que sumadas dan exactamente 12. ¿Cuáles son?",
    reveal: "¡La pareja es el 4 y el 8! (también sirve 3 + 9, ¡hay dos parejas!)",
    cards: [
      { value: 7, suit: "oros" },
      { value: 3, suit: "copas" },
      { value: 5, suit: "espadas" },
      { value: 9, suit: "bastos" },
      { value: 4, suit: "oros" },
      { value: 8, suit: "copas" },
    ],
    layout: "scatter",
    emoji: "💃",
    theme: "from-pink-500/20 to-rose-500/10",
  },
  {
    title: "El Espejo Trucado",
    category: "🪞 Doble o mitad",
    setup: "Pon una carta (4) y a su lado un 'espejo' (lápiz). Al otro lado, una carta bocabajo.",
    challenge: "El espejo refleja el doble del original. ¿Qué carta se esconde?",
    reveal: "¡Un 8! (4 × 2)",
    cards: [
      { value: 4, suit: "oros" },
      { value: 8, suit: "copas", hidden: true },
    ],
    layout: "mirror",
    emoji: "🪞",
    theme: "from-violet-500/20 to-purple-500/10",
  },
  {
    title: "El Camino de Baldosas",
    category: "🚶 Recorrido sumando",
    setup: "Camino curvo con 5 cartas bocarriba: 2, 5, 1, 4, 3. Usa una pieza pequeña como caminante.",
    challenge: "Ve saltando una a una. ¿Cuánto suma todo el camino?",
    reveal: "Total: 15. (2 + 5 + 1 + 4 + 3)",
    cards: [
      { value: 2, suit: "oros" },
      { value: 5, suit: "copas" },
      { value: 1, suit: "espadas" },
      { value: 4, suit: "bastos" },
      { value: 3, suit: "oros" },
    ],
    layout: "path",
    emoji: "🚶",
    theme: "from-green-500/20 to-emerald-500/10",
  },
  {
    title: "La Carta Tímida",
    category: "🙈 Memoria a corto plazo",
    setup: "Tres cartas bocarriba (6, 2, 7) tapadas con folios. Levantas cada una un segundo.",
    challenge: "¿Recordáis los tres números? ¡Sumadlos!",
    reveal: "Suma: 15. (6 + 2 + 7)",
    cards: [
      { value: 6, suit: "oros", hidden: true },
      { value: 2, suit: "copas", hidden: true },
      { value: 7, suit: "bastos", hidden: true },
    ],
    layout: "covered",
    emoji: "🙈",
    theme: "from-purple-500/20 to-indigo-500/10",
  },
  {
    title: "La Balanza Equilibrada",
    category: "⚖️ Igualación",
    setup: "Izquierda: 5 y 4 (suman 9). Derecha: un 7 y una bocabajo.",
    challenge: "La balanza debe pesar igual a ambos lados. ¿Qué carta falta a la derecha?",
    reveal: "Un 2. (7 + 2 = 9)",
    cards: [
      { value: 5, suit: "oros" },
      { value: 4, suit: "copas" },
      { value: 7, suit: "espadas" },
      { value: 2, suit: "bastos", hidden: true },
    ],
    layout: "balance",
    emoji: "⚖️",
    theme: "from-yellow-500/20 to-amber-500/10",
  },
  {
    title: "El Cofre del Pirata",
    category: "🏴‍☠️ Multiplicación oculta",
    setup: "Dos cartas bocarriba (3 y 4). Encima una bocabajo: 'el botín del cofre'.",
    challenge: "El cofre vale tantas monedas como las dos cartas multiplicadas. ¿Cuántas son?",
    reveal: "12 monedas. (3 × 4)",
    cards: [
      { value: 12, suit: "oros", hidden: true },
      { value: 3, suit: "copas" },
      { value: 4, suit: "bastos" },
    ],
    layout: "pyramid",
    emoji: "🏴‍☠️",
    theme: "from-amber-500/20 to-orange-500/10",
  },
  {
    title: "La Torre Inestable",
    category: "🗼 Suma vertical",
    setup: "Apila 4 cartas verticalmente: 1, 3, 2, 4 (de abajo a arriba).",
    challenge: "¿Cuánto pesa toda la torre antes de que se caiga?",
    reveal: "Pesa 10. (1 + 3 + 2 + 4)",
    cards: [
      { value: 4, suit: "oros" },
      { value: 2, suit: "copas" },
      { value: 3, suit: "espadas" },
      { value: 1, suit: "bastos" },
    ],
    layout: "elevator",
    emoji: "🗼",
    theme: "from-stone-500/20 to-zinc-500/10",
  },
  {
    title: "Los Gemelos",
    category: "👯 Detección de pares",
    setup: "Despliega 6 cartas: 3, 7, 5, 3, 2, 7.",
    challenge: "¿Cuántas parejas de gemelos (mismo número) hay?",
    reveal: "2 parejas: dos 3 y dos 7.",
    cards: [
      { value: 3, suit: "oros" },
      { value: 7, suit: "copas" },
      { value: 5, suit: "espadas" },
      { value: 3, suit: "bastos" },
      { value: 2, suit: "oros" },
      { value: 7, suit: "espadas" },
    ],
    layout: "scatter",
    emoji: "👯",
    theme: "from-fuchsia-500/20 to-pink-500/10",
  },
  {
    title: "El Reloj de Arena",
    category: "⏳ Resta sucesiva",
    setup: "Empieza con un 12 grande arriba. Debajo van cayendo: −3, −4, −2.",
    challenge: "¿Cuántos granos quedan al final?",
    reveal: "Quedan 3. (12 − 3 − 4 − 2)",
    cards: [
      { value: 12, suit: "oros" },
      { value: 3, suit: "copas" },
      { value: 4, suit: "espadas" },
      { value: 2, suit: "bastos" },
    ],
    layout: "elevator",
    emoji: "⏳",
    theme: "from-amber-500/20 to-yellow-500/10",
  },
  {
    title: "El Trébol de la Suerte",
    category: "🍀 Suma en cruz",
    setup: "Cruz con 5 cartas: centro 4, arriba 2, abajo 3, izquierda 1, derecha 5.",
    challenge: "¿Cuál es la suma total del trébol?",
    reveal: "Suma 15. (4 + 2 + 3 + 1 + 5)",
    cards: [
      { value: 2, suit: "oros" },
      { value: 1, suit: "copas" },
      { value: 4, suit: "espadas" },
      { value: 5, suit: "bastos" },
      { value: 3, suit: "oros" },
    ],
    layout: "scatter",
    emoji: "🍀",
    theme: "from-green-500/20 to-lime-500/10",
  },
  {
    title: "El Disfraz del Rey",
    category: "👑 Valor de figuras",
    setup: "Pon una Sota (10), un Caballo (11) y un Rey (12) bocarriba.",
    challenge: "Si Sota=10, Caballo=11 y Rey=12, ¿cuánto suman las tres figuras?",
    reveal: "Suman 33.",
    cards: [
      { value: 10, suit: "oros" },
      { value: 11, suit: "copas" },
      { value: 12, suit: "espadas" },
    ],
    layout: "row",
    emoji: "👑",
    theme: "from-yellow-500/20 to-orange-500/10",
  },
  {
    title: "El Doble Espejo",
    category: "🪞 Operación combinada",
    setup: "Carta original 3. Espejo 1: doble. Espejo 2: doble del primero.",
    challenge: "¿Qué número aparece en el segundo espejo?",
    reveal: "Un 12. (3 → 6 → 12)",
    cards: [
      { value: 3, suit: "oros" },
      { value: 6, suit: "copas", hidden: true },
      { value: 12, suit: "espadas", hidden: true },
    ],
    layout: "row",
    emoji: "🪞",
    theme: "from-indigo-500/20 to-blue-500/10",
  },
  {
    title: "La Caja Fuerte",
    category: "🔐 Combinación correcta",
    setup: "Cuatro cartas bocabajo. La pista: 'Suman 20, todas distintas, ninguna mayor que 7'.",
    challenge: "¿Qué combinación abre la caja?",
    reveal: "Una solución: 7 + 6 + 4 + 3 = 20.",
    cards: [
      { value: 7, suit: "oros", hidden: true },
      { value: 6, suit: "copas", hidden: true },
      { value: 4, suit: "espadas", hidden: true },
      { value: 3, suit: "bastos", hidden: true },
    ],
    layout: "row",
    emoji: "🔐",
    theme: "from-slate-500/20 to-gray-500/10",
  },
  {
    title: "El Reparto Justo",
    category: "🍰 División",
    setup: "Pon un 12 grande y al lado tres cartas vacías representando 3 amigos.",
    challenge: "Si reparto 12 caramelos entre 3 amigos por igual, ¿cuántos toca cada uno?",
    reveal: "4 caramelos cada uno. (12 ÷ 3)",
    cards: [
      { value: 12, suit: "oros" },
      { value: 4, suit: "copas" },
      { value: 4, suit: "espadas" },
      { value: 4, suit: "bastos" },
    ],
    layout: "balance",
    emoji: "🍰",
    theme: "from-rose-500/20 to-pink-500/10",
  },
  {
    title: "La Carrera de Cartas",
    category: "🏁 Comparación",
    setup: "Dos filas de 3 cartas. Fila A: 4, 5, 2. Fila B: 3, 6, 1.",
    challenge: "¿Qué fila gana la carrera (suma más)?",
    reveal: "Gana la Fila A con 11 (Fila B suma 10).",
    cards: [
      { value: 4, suit: "oros" },
      { value: 5, suit: "copas" },
      { value: 2, suit: "espadas" },
      { value: 3, suit: "bastos" },
      { value: 6, suit: "oros" },
      { value: 1, suit: "copas" },
    ],
    layout: "scatter",
    emoji: "🏁",
    theme: "from-red-500/20 to-orange-500/10",
  },
];

function SpanishCard({ card, size = "md" }: { card: Card; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "w-20 h-28 sm:w-24 sm:h-32" : size === "sm" ? "w-12 h-16" : "w-16 h-22 sm:w-20 sm:h-28";
  const valueText = size === "lg" ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl";
  const suitText = size === "lg" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl";

  if (card.hidden) {
    return (
      <div
        className={`${dims} rounded-lg border-2 border-primary/40 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center shadow-lg shrink-0`}
      >
        <span className="text-2xl">❓</span>
      </div>
    );
  }

  return (
    <div
      className={`${dims} rounded-lg border-2 border-foreground/20 bg-card flex flex-col items-center justify-between p-1.5 shadow-lg shrink-0`}
    >
      <span className={`${valueText} font-bold ${SUIT_COLOR[card.suit]} font-mono leading-none self-start`}>
        {VALUE_LABEL(card.value)}
      </span>
      <span className={suitText}>{SUIT_SYMBOL[card.suit]}</span>
      <span className={`${valueText} font-bold ${SUIT_COLOR[card.suit]} font-mono leading-none self-end rotate-180`}>
        {VALUE_LABEL(card.value)}
      </span>
    </div>
  );
}

function CardLayout({ game, expanded }: { game: DeckGame; expanded: boolean }) {
  const size = expanded ? "lg" : "md";
  const cards = game.cards;

  switch (game.layout) {
    case "row":
    case "path":
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {cards.map((c, i) => (
            <SpanishCard key={i} card={c} size={size} />
          ))}
        </div>
      );
    case "covered":
      return (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {cards.map((c, i) => (
            <SpanishCard key={i} card={{ ...c, hidden: true }} size={size} />
          ))}
        </div>
      );
    case "sandwich":
      return (
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <SpanishCard card={cards[0]} size={size} />
          <span className="text-3xl">+</span>
          <SpanishCard card={cards[1]} size={size} />
          <span className="text-3xl">+</span>
          <SpanishCard card={cards[2]} size={size} />
          <span className="text-3xl">=</span>
          <span className="font-heading text-2xl font-bold text-primary">10</span>
        </div>
      );
    case "pyramid":
      return (
        <div className="flex flex-col items-center gap-2">
          <SpanishCard card={cards[0]} size={size} />
          <div className="flex items-center justify-center gap-3">
            <SpanishCard card={cards[1]} size={size} />
            <SpanishCard card={cards[2]} size={size} />
          </div>
        </div>
      );
    case "elevator":
      return (
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">⬆️</span>
          <SpanishCard card={cards[0]} size={size} />
          <SpanishCard card={cards[1]} size={size} />
          <SpanishCard card={cards[2]} size={size} />
          {cards[3] && <SpanishCard card={cards[3]} size={size} />}
          <span className="text-2xl">⬇️</span>
        </div>
      );
    case "balance":
      return (
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {cards.slice(0, 2).map((c, i) => (
                <SpanishCard key={i} card={c} size={size} />
              ))}
            </div>
            <div className="h-1 w-24 bg-muted-foreground/40 rounded" />
          </div>
          <span className="text-4xl">⚖️</span>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {cards.slice(2).map((c, i) => (
                <SpanishCard key={i} card={c} size={size} />
              ))}
            </div>
            <div className="h-1 w-24 bg-muted-foreground/40 rounded" />
          </div>
        </div>
      );
    case "mirror":
      return (
        <div className="flex items-center justify-center gap-3">
          <SpanishCard card={cards[0]} size={size} />
          <div className="w-2 h-32 bg-gradient-to-b from-primary/60 to-secondary/60 rounded-full shadow-[0_0_20px_hsl(var(--primary))]" />
          <SpanishCard card={cards[1]} size={size} />
        </div>
      );
    case "scatter":
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-xl mx-auto">
          {cards.map((c, i) => (
            <div key={i} style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (3 + (i % 3) * 2)}deg)` }}>
              <SpanishCard card={c} size={size} />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function SpanishDeckGames() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const game = GAMES[current];
  const total = GAMES.length;

  const go = (dir: number) => {
    setRevealed(false);
    setCurrent((p) => (p + dir + total) % total);
  };

  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="font-heading text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 sm:mb-4">
        🃏 Juegos con Baraja Española
      </h2>

      <button
        onClick={() => setOpen(true)}
        className="glass-card neon-border rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 hover:opacity-90 transition-all w-full sm:w-auto"
      >
        <span className="text-2xl sm:text-3xl">🃏</span>
        <div className="text-left">
          <span className="font-heading text-xs sm:text-sm font-bold text-foreground">20 Dinámicas con Baraja Española</span>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Retos visuales para jugar en casa con cartas reales</p>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 glass-card neon-border rounded-2xl bg-gradient-to-br ${game.theme} animate-in fade-in zoom-in-95 duration-200 overflow-y-auto transition-all flex flex-col ${
              expanded ? "w-[95vw] h-[95vh] max-w-none p-6 sm:p-10" : "w-full max-w-3xl max-h-[90vh] p-5 sm:p-8 md:p-10"
            }`}
          >
            {/* Close + Expand */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
              <button onClick={() => setExpanded((e) => !e)} className="text-muted-foreground hover:text-foreground transition-colors" title={expanded ? "Reducir" : "Ampliar"}>
                {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 pr-10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{game.emoji}</span>
                <div>
                  <h3 className={`font-heading font-bold text-foreground ${expanded ? "text-2xl" : "text-base sm:text-lg"}`}>
                    {game.title}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{game.category}</span>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                {current + 1} / {total}
              </span>
            </div>

            {/* Setup */}
            <div className={`glass-card rounded-xl p-3 sm:p-4 mb-3 ${expanded ? "p-5" : ""}`}>
              <p className={`text-foreground/90 leading-relaxed ${expanded ? "text-base sm:text-lg" : "text-xs sm:text-sm"}`}>
                <span className="font-bold text-primary">🎬 Montaje: </span>
                {game.setup}
              </p>
            </div>

            {/* Cards visual */}
            <div className={`flex items-center justify-center my-4 ${expanded ? "my-8" : ""}`}>
              <CardLayout game={game} expanded={expanded} />
            </div>

            {/* Challenge */}
            <div className={`glass-card rounded-xl p-3 sm:p-4 border border-primary/30 mb-4 ${expanded ? "p-5" : ""}`}>
              <p className={`text-foreground leading-relaxed font-medium ${expanded ? "text-lg sm:text-xl" : "text-sm sm:text-base"}`}>
                <span className="font-bold text-primary">❓ Reto: </span>
                {game.challenge}
              </p>
            </div>

            {/* Reveal */}
            <div className="flex justify-center my-2">
              {revealed ? (
                <div className={`glass-card rounded-xl border border-primary/40 animate-in fade-in zoom-in-95 duration-300 ${expanded ? "px-8 py-5" : "px-4 sm:px-6 py-3 sm:py-4"}`}>
                  <p className={`text-primary font-heading text-center font-bold ${expanded ? "text-lg sm:text-xl md:text-2xl" : "text-sm sm:text-base md:text-lg"}`}>
                    ✅ {game.reveal}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 font-heading text-xs sm:text-sm font-bold hover:opacity-90 transition-all active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  Revelar respuesta
                </button>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2 mt-4">
              <button onClick={() => go(-1)} className="flex items-center gap-1 glass-card rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:opacity-80 transition-all active:scale-95">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
              {revealed && (
                <button onClick={() => setRevealed(false)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <EyeOff className="w-3 h-3" />
                  Ocultar
                </button>
              )}
              <button onClick={() => go(1)} className="flex items-center gap-1 glass-card rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:opacity-80 transition-all active:scale-95">
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1 mt-4 flex-wrap">
              {GAMES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setRevealed(false); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
