export interface GameDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cards: string[];
  color: string;
}

export const GAMES: GameDefinition[] = [
  {
    id: "animals",
    name: "Animales",
    emoji: "🐶",
    description: "Encuentra las parejas de animales",
    cards: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "fruits",
    name: "Frutas",
    emoji: "🍎",
    description: "Encuentra las parejas de frutas",
    cards: ["🍎", "🍊", "🍋", "🍇", "🍉", "🍓", "🫐", "🍑"],
    color: "from-red-500/20 to-orange-500/20",
  },
  {
    id: "space",
    name: "Espacio",
    emoji: "🚀",
    description: "Encuentra las parejas espaciales",
    cards: ["🚀", "🌍", "🌙", "⭐", "☄️", "🛸", "🪐", "👽"],
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    id: "vehicles",
    name: "Vehículos",
    emoji: "🚗",
    description: "Encuentra las parejas de vehículos",
    cards: ["🚗", "🚀", "✈️", "🚢", "🏎️", "🚁", "🚂", "🛸"],
    color: "from-cyan-500/20 to-sky-500/20",
  },
  {
    id: "music",
    name: "Música",
    emoji: "🎸",
    description: "Encuentra las parejas musicales",
    cards: ["🎸", "🎹", "🎺", "🥁", "🎻", "🎷", "🪗", "🎵"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "sports",
    name: "Deportes",
    emoji: "⚽",
    description: "Encuentra las parejas deportivas",
    cards: ["⚽", "🏀", "🎾", "🏈", "⚾", "🏐", "🎱", "🏓"],
    color: "from-yellow-500/20 to-amber-500/20",
  },
  {
    id: "fantasy",
    name: "Fantasía",
    emoji: "🐉",
    description: "Encuentra las parejas fantásticas",
    cards: ["🏰", "👑", "🗡️", "🛡️", "🐉", "🧙‍♂️", "🧝‍♀️", "🦄"],
    color: "from-violet-500/20 to-fuchsia-500/20",
  },
  {
    id: "food",
    name: "Comida",
    emoji: "🍕",
    description: "Encuentra las parejas de comida",
    cards: ["🍕", "🍔", "🌮", "🍣", "🍩", "🎂", "🍿", "🥐"],
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "tech",
    name: "Tecnología",
    emoji: "🤖",
    description: "Encuentra las parejas tecnológicas",
    cards: ["🤖", "👾", "💻", "🎮", "🕹️", "📱", "⌨️", "🖥️"],
    color: "from-teal-500/20 to-cyan-500/20",
  },
  {
    id: "nature",
    name: "Naturaleza",
    emoji: "🌈",
    description: "Encuentra las parejas naturales",
    cards: ["🌈", "🌸", "🍀", "🌺", "🌻", "🍄", "🌵", "🌴"],
    color: "from-lime-500/20 to-green-500/20",
  },
];
