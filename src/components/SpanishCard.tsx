import { CSSProperties } from "react";

export type Suit = "oros" | "copas" | "espadas" | "bastos";

interface Props {
  value: number; // 1..7, 10..12
  suit: Suit;
  hidden?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  highlight?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

const DIM = {
  sm: { w: 56, h: 84, num: 12, pip: 16, fig: 28 },
  md: { w: 80, h: 120, num: 16, pip: 22, fig: 40 },
  lg: { w: 110, h: 165, num: 22, pip: 30, fig: 56 },
  xl: { w: 150, h: 225, num: 28, pip: 40, fig: 76 },
};

const SUIT_COLOR: Record<Suit, string> = {
  oros: "#D4A017",
  copas: "#C8102E",
  espadas: "#1E40AF",
  bastos: "#15803D",
};

const VALUE_LABEL = (v: number) => {
  if (v === 10) return "10";
  if (v === 11) return "11";
  if (v === 12) return "12";
  return String(v);
};

const FIGURE_NAME = (v: number) => {
  if (v === 10) return "Sota";
  if (v === 11) return "Caballo";
  if (v === 12) return "Rey";
  return null;
};

const FIGURE_EMOJI = (v: number) => {
  if (v === 10) return "🧑‍🎤"; // Sota - paje
  if (v === 11) return "🐴"; // Caballo
  if (v === 12) return "👑"; // Rey
  return "";
};

function SuitPip({ suit, size, color }: { suit: Suit; size: number; color: string }) {
  const s = size;
  if (suit === "oros") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill={color} stroke="#8B6914" strokeWidth="1" />
        <circle cx="12" cy="12" r="7" fill="none" stroke="#8B6914" strokeWidth="0.8" />
        <text x="12" y="15.5" textAnchor="middle" fontSize="7" fill="#8B6914" fontWeight="bold" fontFamily="serif">€</text>
      </svg>
    );
  }
  if (suit === "copas") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <path d="M6 4 L18 4 L17 11 Q17 15 12 15 Q7 15 7 11 Z" fill={color} stroke="#7A0A1C" strokeWidth="0.8" />
        <rect x="11" y="15" width="2" height="3" fill={color} />
        <rect x="8" y="18" width="8" height="2" rx="0.5" fill={color} stroke="#7A0A1C" strokeWidth="0.8" />
      </svg>
    );
  }
  if (suit === "espadas") {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24">
        <line x1="4" y1="4" x2="20" y2="20" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <line x1="20" y1="4" x2="4" y2="20" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="4" cy="20" r="1.5" fill={color} />
        <circle cx="20" cy="20" r="1.5" fill={color} />
      </svg>
    );
  }
  // bastos
  return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <line x1="5" y1="5" x2="19" y2="19" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="19" y1="5" x2="5" y2="19" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="5" cy="5" r="1.8" fill="#5C3A1E" />
      <circle cx="19" cy="5" r="1.8" fill="#5C3A1E" />
    </svg>
  );
}

function PipLayout({ value, suit, size, color }: { value: number; suit: Suit; size: number; color: string }) {
  // Posiciones de los pips según el valor (1..7)
  const positions: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[50, 30], [50, 70]],
    3: [[50, 25], [50, 50], [50, 75]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 25], [70, 25], [30, 50], [70, 50], [30, 75], [70, 75]],
    7: [[30, 25], [70, 25], [30, 50], [70, 50], [50, 50], [30, 75], [70, 75]],
  };
  const pos = positions[value] || [];
  return (
    <div className="absolute inset-0">
      {pos.map(([x, y], i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
            width: size,
            height: size,
          }}
        >
          <SuitPip suit={suit} size={size} color={color} />
        </div>
      ))}
    </div>
  );
}

export default function SpanishCard({
  value,
  suit,
  hidden = false,
  size = "md",
  highlight = false,
  className = "",
  style,
  onClick,
}: Props) {
  const dim = DIM[size];
  const color = SUIT_COLOR[suit];

  const baseStyle: CSSProperties = {
    width: dim.w,
    height: dim.h,
    ...style,
  };

  if (hidden) {
    return (
      <div
        onClick={onClick}
        style={baseStyle}
        className={`relative rounded-lg shadow-lg shrink-0 overflow-hidden border-2 ${
          highlight ? "border-primary ring-2 ring-primary/50" : "border-yellow-700/60"
        } ${onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""} ${className}`}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(45deg, #7c1d1d 0 6px, #5a0f0f 6px 12px), radial-gradient(circle, #b8860b 0%, transparent 70%)",
            backgroundBlendMode: "overlay",
          }}
        />
        <div className="absolute inset-1 border-2 border-yellow-600/70 rounded flex items-center justify-center">
          <span style={{ fontSize: dim.fig * 0.7 }}>👑</span>
        </div>
      </div>
    );
  }

  const isFigure = value >= 10;
  const label = VALUE_LABEL(value);

  return (
    <div
      onClick={onClick}
      style={baseStyle}
      className={`relative rounded-lg shadow-lg shrink-0 overflow-hidden bg-white border-2 ${
        highlight ? "border-primary ring-2 ring-primary/50" : "border-foreground/30"
      } ${onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""} ${className}`}
    >
      {/* Esquinas: número + símbolo pequeño */}
      <div
        className="absolute top-1 left-1.5 flex flex-col items-center leading-none font-bold font-mono"
        style={{ color, fontSize: dim.num }}
      >
        <span>{label}</span>
        <div style={{ width: dim.num * 0.85, height: dim.num * 0.85, marginTop: 1 }}>
          <SuitPip suit={suit} size={dim.num * 0.85} color={color} />
        </div>
      </div>
      <div
        className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none font-bold font-mono rotate-180"
        style={{ color, fontSize: dim.num }}
      >
        <span>{label}</span>
        <div style={{ width: dim.num * 0.85, height: dim.num * 0.85, marginTop: 1 }}>
          <SuitPip suit={suit} size={dim.num * 0.85} color={color} />
        </div>
      </div>

      {/* Cuerpo */}
      {isFigure ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: dim.fig }}>{FIGURE_EMOJI(value)}</span>
          <span className="font-heading font-bold uppercase tracking-wide" style={{ color, fontSize: dim.num * 0.7 }}>
            {FIGURE_NAME(value)}
          </span>
          <div className="mt-1" style={{ width: dim.pip * 0.9, height: dim.pip * 0.9 }}>
            <SuitPip suit={suit} size={dim.pip * 0.9} color={color} />
          </div>
        </div>
      ) : (
        <PipLayout value={value} suit={suit} size={dim.pip} color={color} />
      )}
    </div>
  );
}
