export interface GameDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  type: string;
  category: "memoria" | "proporciones" | "mixto";
}

export const GAMES: GameDefinition[] = [
  // === MEMORIA ===
  {
    id: "memory", name: "Parejas", emoji: "🃏",
    description: "Voltea cartas para encontrar parejas",
    color: "from-green-500/20 to-emerald-500/20", type: "memory", category: "memoria",
  },
  {
    id: "simon", name: "Simón Dice", emoji: "🔴",
    description: "Repite la secuencia de colores",
    color: "from-red-500/20 to-orange-500/20", type: "simon", category: "memoria",
  },
  {
    id: "sequence", name: "Números", emoji: "🔢",
    description: "Recuerda la secuencia de números",
    color: "from-blue-500/20 to-indigo-500/20", type: "sequence", category: "memoria",
  },
  {
    id: "reverse", name: "Memoria Inversa", emoji: "🔄",
    description: "Repite los números al revés",
    color: "from-violet-500/20 to-purple-500/20", type: "reverse", category: "memoria",
  },
  {
    id: "flash", name: "Flash", emoji: "⚡",
    description: "Recuerda los emojis que aparecen brevemente",
    color: "from-yellow-500/20 to-amber-500/20", type: "flash", category: "memoria",
  },
  {
    id: "grid", name: "Cuadrícula", emoji: "🟦",
    description: "Recuerda las posiciones iluminadas",
    color: "from-cyan-500/20 to-sky-500/20", type: "grid", category: "memoria",
  },
  {
    id: "order", name: "Orden", emoji: "📋",
    description: "Pon los elementos en el orden correcto",
    color: "from-purple-500/20 to-pink-500/20", type: "order", category: "memoria",
  },
  {
    id: "speed", name: "Velocidad", emoji: "💨",
    description: "¿Es igual al anterior? ¡Reacciona rápido!",
    color: "from-teal-500/20 to-cyan-500/20", type: "speed", category: "memoria",
  },
  {
    id: "count", name: "Cuenta", emoji: "🔢",
    description: "¿Cuántos elementos viste?",
    color: "from-orange-500/20 to-red-500/20", type: "count", category: "memoria",
  },
  {
    id: "chain", name: "Cadena", emoji: "🔗",
    description: "Recuerda la cadena creciente de emojis",
    color: "from-violet-500/20 to-fuchsia-500/20", type: "chain", category: "memoria",
  },
  {
    id: "differ", name: "Diferencias", emoji: "🔍",
    description: "Encuentra el emoji que cambió",
    color: "from-lime-500/20 to-green-500/20", type: "differ", category: "memoria",
  },
  {
    id: "objects", name: "Objetos", emoji: "🎒",
    description: "Memoriza objetos: ¿cuántos y cuáles eran?",
    color: "from-amber-500/20 to-yellow-500/20", type: "objects", category: "memoria",
  },
  {
    id: "gesture", name: "Movimientos", emoji: "👆",
    description: "Repite la secuencia de movimientos",
    color: "from-rose-500/20 to-pink-500/20", type: "gesture", category: "memoria",
  },
  {
    id: "wordchain", name: "Palabras", emoji: "💬",
    description: "Cadena creciente de palabras",
    color: "from-sky-500/20 to-blue-500/20", type: "wordchain", category: "memoria",
  },
  {
    id: "shapes", name: "Formas", emoji: "🔺",
    description: "Completa la secuencia de formas",
    color: "from-indigo-500/20 to-violet-500/20", type: "shapes", category: "memoria",
  },
  // === PROPORCIONES ===
  {
    id: "pattern", name: "Patrones", emoji: "🧩",
    description: "Encuentra el patrón numérico",
    color: "from-emerald-500/20 to-teal-500/20", type: "pattern", category: "proporciones",
  },
  {
    id: "doublehalf", name: "Doble y Mitad", emoji: "✖️",
    description: "Calcula el doble, la mitad o el triple",
    color: "from-pink-500/20 to-rose-500/20", type: "doublehalf", category: "proporciones",
  },
  {
    id: "proptable", name: "Tabla Proporciones", emoji: "📊",
    description: "Completa la tabla de precios",
    color: "from-blue-500/20 to-cyan-500/20", type: "proptable", category: "proporciones",
  },
  {
    id: "recipe", name: "Recetas", emoji: "🍳",
    description: "Adapta recetas a más o menos personas",
    color: "from-orange-500/20 to-amber-500/20", type: "recipe", category: "proporciones",
  },
  {
    id: "mix", name: "Mezclas", emoji: "🧪",
    description: "Calcula proporciones de mezclas",
    color: "from-green-500/20 to-lime-500/20", type: "mix", category: "proporciones",
  },
  {
    id: "fractions", name: "Fracciones", emoji: "🔲",
    description: "Empareja fracciones equivalentes",
    color: "from-fuchsia-500/20 to-purple-500/20", type: "fractions", category: "proporciones",
  },
  {
    id: "scale", name: "Escalas", emoji: "📐",
    description: "Calcula medidas reales desde un plano",
    color: "from-slate-500/20 to-gray-500/20", type: "scale", category: "proporciones",
  },
  {
    id: "money", name: "Dinero", emoji: "💰",
    description: "Proporciones con precios y dinero",
    color: "from-yellow-500/20 to-orange-500/20", type: "money", category: "proporciones",
  },
  {
    id: "ratio", name: "Razones", emoji: "⚖️",
    description: "Completa la razón proporcional",
    color: "from-red-500/20 to-rose-500/20", type: "ratio", category: "proporciones",
  },
  // === MIXTO ===
  {
    id: "memprop", name: "Memoria + Proporción", emoji: "🧠",
    description: "Memoriza precios y calcula proporciones",
    color: "from-purple-500/20 to-indigo-500/20", type: "memprop", category: "mixto",
  },
];
