export interface GameDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  type: "memory" | "simon" | "sequence" | "flash" | "grid" | "order" | "speed" | "count" | "chain" | "differ";
  data?: string[];
}

export const GAMES: GameDefinition[] = [
  {
    id: "memory",
    name: "Parejas",
    emoji: "🃏",
    description: "Encuentra las parejas de cartas",
    color: "from-green-500/20 to-emerald-500/20",
    type: "memory",
    data: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
  },
  {
    id: "simon",
    name: "Simón Dice",
    emoji: "🔴",
    description: "Repite la secuencia de colores",
    color: "from-red-500/20 to-orange-500/20",
    type: "simon",
  },
  {
    id: "sequence",
    name: "Números",
    emoji: "🔢",
    description: "Recuerda la secuencia de números",
    color: "from-blue-500/20 to-indigo-500/20",
    type: "sequence",
  },
  {
    id: "flash",
    name: "Flash",
    emoji: "⚡",
    description: "Recuerda los emojis que aparecen",
    color: "from-yellow-500/20 to-amber-500/20",
    type: "flash",
    data: ["🍎", "🚗", "⭐", "🎸", "🌈", "🐉", "🍕", "🤖", "⚽", "🎮", "🌸", "🚀"],
  },
  {
    id: "grid",
    name: "Cuadrícula",
    emoji: "🟦",
    description: "Recuerda las posiciones iluminadas",
    color: "from-cyan-500/20 to-sky-500/20",
    type: "grid",
  },
  {
    id: "order",
    name: "Orden",
    emoji: "📋",
    description: "Pon los elementos en el orden correcto",
    color: "from-purple-500/20 to-pink-500/20",
    type: "order",
    data: ["🍎", "🍊", "🍋", "🍇", "🍉", "🍓", "🫐", "🍑", "🥝", "🍌"],
  },
  {
    id: "speed",
    name: "Velocidad",
    emoji: "💨",
    description: "¿Es igual al anterior? ¡Reacciona rápido!",
    color: "from-teal-500/20 to-cyan-500/20",
    type: "speed",
    data: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊"],
  },
  {
    id: "count",
    name: "Cuenta",
    emoji: "🔢",
    description: "¿Cuántos elementos viste?",
    color: "from-orange-500/20 to-red-500/20",
    type: "count",
  },
  {
    id: "chain",
    name: "Cadena",
    emoji: "🔗",
    description: "Recuerda la cadena creciente de emojis",
    color: "from-violet-500/20 to-fuchsia-500/20",
    type: "chain",
    data: ["🏰", "👑", "🗡️", "🛡️", "🐉", "🧙‍♂️", "🦄", "🌟", "💎", "🔮"],
  },
  {
    id: "differ",
    name: "Diferencias",
    emoji: "🔍",
    description: "Encuentra el emoji que cambió",
    color: "from-lime-500/20 to-green-500/20",
    type: "differ",
    data: ["🌈", "🌸", "🍀", "🌺", "🌻", "🍄", "🌵", "🌴", "🎋", "🌾"],
  },
];
