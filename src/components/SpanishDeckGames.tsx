import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, RotateCcw, Check, X } from "lucide-react";
import SpanishCard, { Suit } from "./SpanishCard";

// ============ Helpers ============
const SUITS: Suit[] = ["oros", "copas", "espadas", "bastos"];
const VALUES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];

interface Card {
  value: number;
  suit: Suit;
  id: string;
}

let _cid = 0;
const newCard = (value: number, suit: Suit): Card => ({ value, suit, id: `c${++_cid}` });

const randSuit = (): Suit => SUITS[Math.floor(Math.random() * SUITS.length)];
const randVal = (min = 1, max = 7) => {
  const pool = VALUES.filter((v) => v >= min && v <= max);
  return pool[Math.floor(Math.random() * pool.length)];
};
const randCard = (min = 1, max = 7) => newCard(randVal(min, max), randSuit());
const randCards = (n: number, min = 1, max = 7) => Array.from({ length: n }, () => randCard(min, max));

// Common UI for answer input
function NumberInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "?",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        disabled={disabled}
        placeholder={placeholder}
        className="w-24 sm:w-32 text-center text-xl sm:text-2xl font-heading font-bold bg-card border-2 border-primary/40 rounded-lg px-3 py-2 focus:outline-none focus:border-primary text-foreground"
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-heading text-sm font-bold hover:opacity-90 transition active:scale-95 disabled:opacity-50"
      >
        Comprobar
      </button>
    </div>
  );
}

function Feedback({ status, correct }: { status: "idle" | "ok" | "ko"; correct: string | number }) {
  if (status === "idle") return null;
  if (status === "ok")
    return (
      <div className="flex items-center justify-center gap-2 text-green-500 font-heading font-bold animate-in fade-in zoom-in-95">
        <Check className="w-5 h-5" /> ¡Correcto! {correct}
      </div>
    );
  return (
    <div className="flex items-center justify-center gap-2 text-red-500 font-heading font-bold animate-in fade-in zoom-in-95">
      <X className="w-5 h-5" /> Casi… La respuesta es {correct}
    </div>
  );
}

// ============ Game definitions ============
interface GameDef {
  id: string;
  title: string;
  emoji: string;
  category: string;
  description: string;
  Component: React.FC<{ expanded: boolean; size: "md" | "lg"; replayKey: number }>;
}

// 1. Tren en el Túnel
const TrenTunel: React.FC<any> = ({ size, replayKey }) => {
  const cards = useMemo(() => randCards(3 + Math.floor(Math.random() * 2), 1, 7), [replayKey]);
  const total = cards.reduce((s, c) => s + c.value, 0);
  const [phase, setPhase] = useState<"show" | "tunnel">("show");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => {
    setPhase("show");
    setAnswer("");
    setStatus("idle");
    const t = setTimeout(() => setPhase("tunnel"), 3500);
    return () => clearTimeout(t);
  }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === total ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">
        🚂 El tren va recogiendo pasajeros… {phase === "tunnel" ? "¡Ha entrado en el túnel!" : "¡Memoriza!"}
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-3 min-h-[140px]">
        {cards.map((c) => (
          <SpanishCard key={c.id} value={c.value} suit={c.suit} hidden={phase === "tunnel"} size={size} />
        ))}
      </div>
      {phase === "tunnel" && (
        <>
          <p className="text-foreground font-medium text-center">¿Cuántos pasajeros van en el tren?</p>
          <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
          <Feedback status={status} correct={total} />
        </>
      )}
    </div>
  );
};

// 2. Ladrón de Guante Blanco
const Ladron: React.FC<any> = ({ size, replayKey }) => {
  const cards = useMemo(() => randCards(4, 1, 7), [replayKey]);
  const stolenIdx = useMemo(() => Math.floor(Math.random() * cards.length), [replayKey]);
  const stolen = cards[stolenIdx];
  const [phase, setPhase] = useState<"show" | "robbed">("show");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => {
    setPhase("show");
    setAnswer("");
    setStatus("idle");
    const t = setTimeout(() => setPhase("robbed"), 3000);
    return () => clearTimeout(t);
  }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === stolen.value ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">
        🕵️ {phase === "show" ? "Memoriza la suma…" : "¡El ladrón se llevó una carta!"}
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-3 min-h-[140px]">
        {cards.map((c, i) => {
          if (phase === "robbed" && i === stolenIdx) {
            return <div key={c.id} style={{ width: size === "lg" ? 110 : 80, height: size === "lg" ? 165 : 120 }} className="border-2 border-dashed border-red-500/60 rounded-lg flex items-center justify-center text-3xl">❓</div>;
          }
          return <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} />;
        })}
      </div>
      {phase === "robbed" && (
        <>
          <p className="text-foreground font-medium text-center">¿Qué número se llevó el ladrón?</p>
          <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
          <Feedback status={status} correct={stolen.value} />
        </>
      )}
    </div>
  );
};

// 3. Sándwich Numérico
const Sandwich: React.FC<any> = ({ size, replayKey }) => {
  const total = useMemo(() => 8 + Math.floor(Math.random() * 8), [replayKey]); // 8..15
  const left = useMemo(() => randCard(1, Math.min(7, total - 2)), [replayKey]);
  const right = useMemo(() => {
    const max = Math.min(7, total - left.value - 1);
    return newCard(Math.max(1, Math.floor(Math.random() * max) + 1), randSuit());
  }, [replayKey, left]);
  const middle = total - left.value - right.value;
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === middle ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🥪 El sándwich entero suma <b className="text-primary">{total}</b></p>
      <div className="flex items-center justify-center gap-3 min-h-[140px]">
        <SpanishCard value={left.value} suit={left.suit} size={size} />
        <span className="text-2xl font-bold text-primary">+</span>
        <SpanishCard value={1} suit="oros" hidden size={size} />
        <span className="text-2xl font-bold text-primary">+</span>
        <SpanishCard value={right.value} suit={right.suit} size={size} />
      </div>
      <p className="text-foreground font-medium">¿Cuál es el relleno oculto?</p>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={middle} />
    </div>
  );
};

// 4. Pirámide Mágica
const Piramide: React.FC<any> = ({ size, replayKey }) => {
  const a = useMemo(() => randCard(1, 6), [replayKey]);
  const b = useMemo(() => randCard(1, 6), [replayKey]);
  const top = a.value + b.value;
  const [reveal, setReveal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setReveal(false); setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => {
    const ok = parseInt(answer) === top;
    setStatus(ok ? "ok" : "ko");
    if (ok) setReveal(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🔺 La carta de arriba pesa lo mismo que las dos de abajo juntas</p>
      <div className="flex flex-col items-center gap-2">
        {reveal ? (
          <SpanishCard value={top <= 7 ? top : Math.min(top, 12)} suit={randSuit()} size={size} highlight />
        ) : (
          <SpanishCard value={1} suit="oros" hidden size={size} />
        )}
        <div className="flex gap-3">
          <SpanishCard value={a.value} suit={a.suit} size={size} />
          <SpanishCard value={b.value} suit={b.suit} size={size} />
        </div>
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={top} />
    </div>
  );
};

// 5. Ascensor
const Ascensor: React.FC<any> = ({ size, replayKey }) => {
  const start = useMemo(() => randCard(3, 7), [replayKey]);
  const ups = useMemo(() => randCards(1 + Math.floor(Math.random() * 2), 1, 4), [replayKey]);
  const downs = useMemo(() => randCards(1 + Math.floor(Math.random() * 2), 1, Math.max(1, start.value - 1)), [replayKey, start]);
  const final = start.value + ups.reduce((s, c) => s + c.value, 0) - downs.reduce((s, c) => s + c.value, 0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === final ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🛗 ¿En qué piso se para el ascensor?</p>
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl">⬆️ Sube</span>
        <div className="flex gap-2">{ups.map((c) => <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} />)}</div>
        <div className="px-3 py-1 rounded bg-primary/20 border border-primary/40 font-heading">Piso inicial</div>
        <SpanishCard value={start.value} suit={start.suit} size={size} highlight />
        <div className="flex gap-2">{downs.map((c) => <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} />)}</div>
        <span className="text-2xl">⬇️ Baja</span>
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={final} />
    </div>
  );
};

// 6. Parejas de Baile (suma X)
const Parejas: React.FC<any> = ({ size, replayKey }) => {
  const target = useMemo(() => 8 + Math.floor(Math.random() * 5), [replayKey]); // 8..12
  const cards = useMemo(() => {
    // Garantiza al menos una pareja
    const a = randVal(1, 7);
    const b = Math.max(1, Math.min(7, target - a));
    const base: Card[] = [newCard(a, randSuit()), newCard(b, randSuit())];
    while (base.length < 6) base.push(randCard(1, 7));
    return base.sort(() => Math.random() - 0.5);
  }, [replayKey]);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setSelected([]); setStatus("idle"); }, [replayKey]);

  const toggle = (id: string) => {
    if (status === "ok") return;
    setSelected((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= 2) return [p[1], id];
      return [...p, id];
    });
  };

  const check = () => {
    if (selected.length !== 2) return;
    const sum = selected.reduce((s, id) => s + (cards.find((c) => c.id === id)?.value || 0), 0);
    setStatus(sum === target ? "ok" : "ko");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">💃 Encuentra dos cartas que sumen <b className="text-primary">{target}</b></p>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-2xl">
        {cards.map((c) => (
          <SpanishCard
            key={c.id}
            value={c.value}
            suit={c.suit}
            size={size}
            highlight={selected.includes(c.id)}
            onClick={() => toggle(c.id)}
          />
        ))}
      </div>
      <button
        onClick={check}
        disabled={selected.length !== 2 || status === "ok"}
        className="bg-primary text-primary-foreground rounded-lg px-5 py-2 font-heading text-sm font-bold disabled:opacity-50 hover:opacity-90 transition active:scale-95"
      >
        Comprobar pareja
      </button>
      <Feedback status={status} correct={`suman ${target}`} />
    </div>
  );
};

// 7. Espejo Trucado (doble)
const Espejo: React.FC<any> = ({ size, replayKey }) => {
  const orig = useMemo(() => randCard(1, 6), [replayKey]);
  const expected = orig.value * 2;
  const [reveal, setReveal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setReveal(false); setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => {
    const ok = parseInt(answer) === expected;
    setStatus(ok ? "ok" : "ko");
    if (ok) setReveal(true);
  };

  const reflectVal = expected <= 12 ? (expected === 8 || expected === 9 ? 10 : expected) : 12;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🪞 El espejo refleja el <b className="text-primary">doble</b></p>
      <div className="flex items-center justify-center gap-3">
        <SpanishCard value={orig.value} suit={orig.suit} size={size} />
        <div className="w-2 h-32 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-[0_0_20px_cyan]" />
        {reveal ? (
          <SpanishCard value={reflectVal} suit={orig.suit} size={size} highlight />
        ) : (
          <SpanishCard value={1} suit="oros" hidden size={size} />
        )}
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={expected} />
    </div>
  );
};

// 8. Camino de Baldosas (suma camino)
const Camino: React.FC<any> = ({ size, replayKey }) => {
  const cards = useMemo(() => randCards(5, 1, 6), [replayKey]);
  const total = cards.reduce((s, c) => s + c.value, 0);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setStep(0); setAnswer(""); setStatus("idle"); }, [replayKey]);

  useEffect(() => {
    if (step >= cards.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [step, cards.length]);

  const submit = () => setStatus(parseInt(answer) === total ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🚶 Suma todo lo que pisa el caminante</p>
      <div className="flex flex-wrap items-center justify-center gap-2 relative">
        {cards.map((c, i) => (
          <div key={c.id} className="relative">
            <SpanishCard value={c.value} suit={c.suit} size={size} highlight={i === step - 1} />
            {i === step - 1 && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce">🐸</span>}
          </div>
        ))}
      </div>
      {step >= cards.length && (
        <>
          <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
          <Feedback status={status} correct={total} />
        </>
      )}
    </div>
  );
};

// 9. Carta Tímida (memoria)
const Timida: React.FC<any> = ({ size, replayKey }) => {
  const cards = useMemo(() => randCards(3, 1, 7), [replayKey]);
  const total = cards.reduce((s, c) => s + c.value, 0);
  const [revealed, setRevealed] = useState<number>(-1);
  const [done, setDone] = useState(false);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => {
    setRevealed(-1); setDone(false); setAnswer(""); setStatus("idle");
    let i = 0;
    const interval = setInterval(() => {
      setRevealed(i);
      i++;
      if (i > cards.length) {
        clearInterval(interval);
        setRevealed(-1);
        setDone(true);
      }
    }, 900);
    return () => clearInterval(interval);
  }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === total ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🙈 Memoriza y suma las tres cartas tímidas</p>
      <div className="flex items-center justify-center gap-3 min-h-[140px]">
        {cards.map((c, i) => (
          <SpanishCard key={c.id} value={c.value} suit={c.suit} hidden={revealed !== i} size={size} />
        ))}
      </div>
      {done && (
        <>
          <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
          <Feedback status={status} correct={total} />
        </>
      )}
    </div>
  );
};

// 10. Balanza
const Balanza: React.FC<any> = ({ size, replayKey }) => {
  const left = useMemo(() => [randCard(1, 6), randCard(1, 6)], [replayKey]);
  const total = left.reduce((s, c) => s + c.value, 0);
  const right1 = useMemo(() => randCard(1, Math.max(1, total - 1)), [replayKey, total]);
  const missing = total - right1.value;
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === missing ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">⚖️ Equilibra la balanza</p>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">{left.map((c) => <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} />)}</div>
          <div className="h-1 w-32 bg-muted-foreground/40 rounded" />
        </div>
        <span className="text-4xl">⚖️</span>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <SpanishCard value={right1.value} suit={right1.suit} size={size} />
            <SpanishCard value={1} suit="oros" hidden size={size} />
          </div>
          <div className="h-1 w-32 bg-muted-foreground/40 rounded" />
        </div>
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={missing} />
    </div>
  );
};

// 11. Cofre del Pirata (multiplicación)
const Cofre: React.FC<any> = ({ size, replayKey }) => {
  const a = useMemo(() => randCard(2, 5), [replayKey]);
  const b = useMemo(() => randCard(2, 5), [replayKey]);
  const product = a.value * b.value;
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === product ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🏴‍☠️ El cofre vale las dos cartas <b className="text-primary">multiplicadas</b></p>
      <div className="flex items-center justify-center gap-3">
        <SpanishCard value={a.value} suit={a.suit} size={size} />
        <span className="text-2xl font-bold text-primary">×</span>
        <SpanishCard value={b.value} suit={b.suit} size={size} />
        <span className="text-2xl font-bold text-primary">=</span>
        <span className="text-3xl">🪙</span>
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={product} />
    </div>
  );
};

// 12. Torre Inestable
const Torre: React.FC<any> = ({ size, replayKey }) => {
  const cards = useMemo(() => randCards(4, 1, 6), [replayKey]);
  const total = cards.reduce((s, c) => s + c.value, 0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === total ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🗼 ¿Cuánto pesa toda la torre?</p>
      <div className="flex flex-col items-center gap-1">
        {cards.map((c) => <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} />)}
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={total} />
    </div>
  );
};

// 13. Gemelos
const Gemelos: React.FC<any> = ({ size, replayKey }) => {
  const cards = useMemo(() => {
    // Garantizar 2 parejas
    const v1 = randVal(1, 7);
    let v2 = randVal(1, 7);
    while (v2 === v1) v2 = randVal(1, 7);
    const base: Card[] = [
      newCard(v1, "oros"), newCard(v1, "copas"),
      newCard(v2, "espadas"), newCard(v2, "bastos"),
    ];
    while (base.length < 6) {
      const v = randVal(1, 7);
      if (v !== v1 && v !== v2) base.push(newCard(v, randSuit()));
    }
    return base.sort(() => Math.random() - 0.5);
  }, [replayKey]);

  const correctPairs = 2;
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === correctPairs ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">👯 ¿Cuántas parejas (mismo número) hay?</p>
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
        {cards.map((c) => <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} />)}
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={correctPairs} />
    </div>
  );
};

// 14. Reloj de Arena
const Reloj: React.FC<any> = ({ size, replayKey }) => {
  const start = useMemo(() => 10 + Math.floor(Math.random() * 6), [replayKey]); // 10..15
  const subs = useMemo(() => {
    const s = [randCard(1, 4), randCard(1, 4), randCard(1, 4)];
    return s;
  }, [replayKey]);
  const total = start - subs.reduce((s, c) => s + c.value, 0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === total ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">⏳ Empiezan <b className="text-primary">{start}</b> granos. Van cayendo:</p>
      <div className="flex items-center justify-center gap-3">
        {subs.map((c, i) => (
          <div key={c.id} className="flex items-center gap-2">
            <span className="text-2xl text-red-500 font-bold">−</span>
            <SpanishCard value={c.value} suit={c.suit} size={size} />
          </div>
        ))}
      </div>
      <p className="text-foreground font-medium">¿Cuántos quedan?</p>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={total} />
    </div>
  );
};

// 15. Trébol (suma cruz)
const Trebol: React.FC<any> = ({ size, replayKey }) => {
  const cards = useMemo(() => randCards(5, 1, 6), [replayKey]);
  const total = cards.reduce((s, c) => s + c.value, 0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === total ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🍀 Suma todas las cartas del trébol</p>
      <div className="grid grid-cols-3 gap-2 items-center justify-items-center">
        <div /><SpanishCard value={cards[0].value} suit={cards[0].suit} size={size} /><div />
        <SpanishCard value={cards[1].value} suit={cards[1].suit} size={size} />
        <SpanishCard value={cards[2].value} suit={cards[2].suit} size={size} highlight />
        <SpanishCard value={cards[3].value} suit={cards[3].suit} size={size} />
        <div /><SpanishCard value={cards[4].value} suit={cards[4].suit} size={size} /><div />
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={total} />
    </div>
  );
};

// 16. Disfraz del Rey (figuras valor especial)
const Figuras: React.FC<any> = ({ size, replayKey }) => {
  const cards = useMemo(() => [
    newCard(10, randSuit()),
    newCard(11, randSuit()),
    newCard(12, randSuit()),
  ], [replayKey]);
  const total = 33;
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === total ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">👑 Sota=10, Caballo=11, Rey=12. ¿Cuánto suman?</p>
      <div className="flex items-center justify-center gap-3">
        {cards.map((c) => <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} />)}
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={total} />
    </div>
  );
};

// 17. Doble Espejo (×4)
const DobleEspejo: React.FC<any> = ({ size, replayKey }) => {
  const orig = useMemo(() => randCard(1, 3), [replayKey]);
  const expected = orig.value * 4;
  const [reveal, setReveal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setReveal(false); setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => {
    const ok = parseInt(answer) === expected;
    setStatus(ok ? "ok" : "ko");
    if (ok) setReveal(true);
  };

  const safeVal = expected <= 12 ? (expected === 8 || expected === 9 ? 10 : expected) : 12;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🪞🪞 Cada espejo dobla. ¿Qué hay tras el segundo?</p>
      <div className="flex items-center justify-center gap-2">
        <SpanishCard value={orig.value} suit={orig.suit} size={size} />
        <div className="w-1.5 h-28 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan]" />
        <SpanishCard value={1} suit="oros" hidden size={size} />
        <div className="w-1.5 h-28 bg-cyan-400 rounded-full shadow-[0_0_15px_cyan]" />
        {reveal ? (
          <SpanishCard value={safeVal} suit={orig.suit} size={size} highlight />
        ) : (
          <SpanishCard value={1} suit="oros" hidden size={size} />
        )}
      </div>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={expected} />
    </div>
  );
};

// 18. Caja Fuerte (combinación que suma X)
const Caja: React.FC<any> = ({ size, replayKey }) => {
  const target = useMemo(() => 12 + Math.floor(Math.random() * 6), [replayKey]); // 12..17
  const cards = useMemo(() => {
    // Crear 6 cartas que tengan al menos una combinación válida
    return randCards(6, 1, 7);
  }, [replayKey]);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setSelected([]); setStatus("idle"); }, [replayKey]);

  const toggle = (id: string) => {
    if (status === "ok") return;
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const sum = selected.reduce((s, id) => s + (cards.find((c) => c.id === id)?.value || 0), 0);
  const check = () => setStatus(sum === target ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🔐 Selecciona cartas que sumen exactamente <b className="text-primary">{target}</b></p>
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
        {cards.map((c) => (
          <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} highlight={selected.includes(c.id)} onClick={() => toggle(c.id)} />
        ))}
      </div>
      <p className="text-foreground font-mono">Suma actual: <b className={sum === target ? "text-green-500" : "text-primary"}>{sum}</b> / {target}</p>
      <button onClick={check} disabled={selected.length === 0 || status === "ok"} className="bg-primary text-primary-foreground rounded-lg px-5 py-2 font-heading text-sm font-bold disabled:opacity-50 hover:opacity-90">
        Abrir caja
      </button>
      <Feedback status={status} correct={`combinación que sume ${target}`} />
    </div>
  );
};

// 19. Reparto Justo (división)
const Reparto: React.FC<any> = ({ size, replayKey }) => {
  const divisor = useMemo(() => 2 + Math.floor(Math.random() * 3), [replayKey]); // 2..4
  const result = useMemo(() => 2 + Math.floor(Math.random() * 4), [replayKey]); // 2..5
  const total = divisor * result;
  const totalCard = total <= 7 ? total : total <= 12 ? Math.min(total, 12) : 12;
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setAnswer(""); setStatus("idle"); }, [replayKey]);

  const submit = () => setStatus(parseInt(answer) === result ? "ok" : "ko");

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🍰 Repartes <b className="text-primary">{total}</b> caramelos entre <b className="text-primary">{divisor}</b> amigos</p>
      <div className="flex items-center justify-center gap-3">
        <SpanishCard value={totalCard} suit="oros" size={size} />
        <span className="text-2xl font-bold text-primary">÷</span>
        <div className="flex gap-1">
          {Array.from({ length: divisor }).map((_, i) => <span key={i} className="text-3xl">🧒</span>)}
        </div>
      </div>
      <p className="text-foreground font-medium">¿Cuántos toca cada uno?</p>
      <NumberInput value={answer} onChange={setAnswer} onSubmit={submit} disabled={status === "ok"} />
      <Feedback status={status} correct={result} />
    </div>
  );
};

// 20. Carrera de Cartas (qué fila suma más)
const Carrera: React.FC<any> = ({ size, replayKey }) => {
  const rowA = useMemo(() => randCards(3, 1, 7), [replayKey]);
  const rowB = useMemo(() => randCards(3, 1, 7), [replayKey]);
  const sumA = rowA.reduce((s, c) => s + c.value, 0);
  const sumB = rowB.reduce((s, c) => s + c.value, 0);
  const winner = sumA === sumB ? "empate" : sumA > sumB ? "A" : "B";
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "ko">("idle");

  useEffect(() => { setPicked(null); setStatus("idle"); }, [replayKey]);

  const choose = (c: string) => {
    if (status === "ok") return;
    setPicked(c);
    setStatus(c === winner ? "ok" : "ko");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm sm:text-base text-foreground/80 text-center">🏁 ¿Qué fila gana (suma más)?</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-primary w-8">A</span>
          {rowA.map((c) => <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} />)}
          {status !== "idle" && <span className="font-mono text-foreground/70">= {sumA}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-primary w-8">B</span>
          {rowB.map((c) => <SpanishCard key={c.id} value={c.value} suit={c.suit} size={size} />)}
          {status !== "idle" && <span className="font-mono text-foreground/70">= {sumB}</span>}
        </div>
      </div>
      <div className="flex gap-2">
        {["A", "B", "empate"].map((opt) => (
          <button
            key={opt}
            onClick={() => choose(opt)}
            disabled={status === "ok"}
            className={`rounded-lg px-4 py-2 font-heading text-sm font-bold transition active:scale-95 disabled:opacity-50 ${
              picked === opt ? "bg-primary text-primary-foreground" : "glass-card text-foreground hover:opacity-80"
            }`}
          >
            {opt === "empate" ? "Empate" : `Fila ${opt}`}
          </button>
        ))}
      </div>
      <Feedback status={status} correct={winner === "empate" ? "empate" : `Fila ${winner}`} />
    </div>
  );
};

const GAMES: GameDef[] = [
  { id: "tren", title: "El Tren en el Túnel", emoji: "🚂", category: "Suma acumulativa", description: "Memoriza los pasajeros antes del túnel", Component: TrenTunel },
  { id: "ladron", title: "El Ladrón de Guante Blanco", emoji: "🕵️", category: "Resta inversa", description: "¿Qué carta robaron?", Component: Ladron },
  { id: "sandwich", title: "El Sándwich Numérico", emoji: "🥪", category: "Ecuación", description: "Adivina el relleno oculto", Component: Sandwich },
  { id: "piramide", title: "La Pirámide Mágica", emoji: "🔺", category: "Suma niveles", description: "Suma de las dos de abajo", Component: Piramide },
  { id: "ascensor", title: "El Ascensor", emoji: "🛗", category: "Suma y resta", description: "¿En qué piso para?", Component: Ascensor },
  { id: "parejas", title: "Las Parejas de Baile", emoji: "💃", category: "Búsqueda", description: "Encuentra la pareja que suma X", Component: Parejas },
  { id: "espejo", title: "El Espejo Trucado", emoji: "🪞", category: "Doble", description: "El reflejo vale el doble", Component: Espejo },
  { id: "camino", title: "El Camino de Baldosas", emoji: "🚶", category: "Recorrido", description: "Suma todo el camino", Component: Camino },
  { id: "timida", title: "La Carta Tímida", emoji: "🙈", category: "Memoria", description: "Memoriza y suma", Component: Timida },
  { id: "balanza", title: "La Balanza", emoji: "⚖️", category: "Igualación", description: "Equilibra los dos lados", Component: Balanza },
  { id: "cofre", title: "El Cofre del Pirata", emoji: "🏴‍☠️", category: "Multiplicación", description: "Cartas multiplicadas = botín", Component: Cofre },
  { id: "torre", title: "La Torre Inestable", emoji: "🗼", category: "Suma vertical", description: "Pesa la torre completa", Component: Torre },
  { id: "gemelos", title: "Los Gemelos", emoji: "👯", category: "Pares", description: "Cuenta las parejas", Component: Gemelos },
  { id: "reloj", title: "El Reloj de Arena", emoji: "⏳", category: "Resta", description: "¿Cuántos granos quedan?", Component: Reloj },
  { id: "trebol", title: "El Trébol", emoji: "🍀", category: "Suma en cruz", description: "Suma todas las cartas", Component: Trebol },
  { id: "figuras", title: "El Disfraz del Rey", emoji: "👑", category: "Figuras", description: "Sota, Caballo y Rey", Component: Figuras },
  { id: "doble-espejo", title: "El Doble Espejo", emoji: "🪞", category: "×4", description: "Dos espejos que doblan", Component: DobleEspejo },
  { id: "caja", title: "La Caja Fuerte", emoji: "🔐", category: "Combinación", description: "Suma exacta para abrir", Component: Caja },
  { id: "reparto", title: "El Reparto Justo", emoji: "🍰", category: "División", description: "Reparte por igual", Component: Reparto },
  { id: "carrera", title: "La Carrera", emoji: "🏁", category: "Comparación", description: "¿Qué fila suma más?", Component: Carrera },
];

// ============ Main component ============
export default function SpanishDeckGames() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const game = GAMES[current];
  const total = GAMES.length;
  const Game = game.Component;

  const go = (dir: number) => {
    setCurrent((p) => (p + dir + total) % total);
    setReplayKey((k) => k + 1);
  };

  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="font-heading text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 sm:mb-4">
        🃏 Juegos con Baraja Española
      </h2>

      <button
        onClick={() => { setOpen(true); setReplayKey((k) => k + 1); }}
        className="glass-card neon-border rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 hover:opacity-90 transition-all w-full sm:w-auto"
      >
        <span className="text-2xl sm:text-3xl">🃏</span>
        <div className="text-left">
          <span className="font-heading text-xs sm:text-sm font-bold text-foreground">20 Juegos con Baraja Española</span>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Mini-juegos interactivos con cartas reales</p>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 glass-card neon-border rounded-2xl bg-gradient-to-br from-card/95 to-background/95 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto transition-all flex flex-col ${
              expanded ? "w-[95vw] h-[95vh] max-w-none p-4 sm:p-8" : "w-full max-w-3xl max-h-[90vh] p-4 sm:p-6"
            }`}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-2xl sm:text-3xl">{game.emoji}</span>
                <div className="min-w-0">
                  <h3 className={`font-heading font-bold text-foreground truncate ${expanded ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}`}>
                    {game.title}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{game.category} · {current + 1}/{total}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button onClick={() => setReplayKey((k) => k + 1)} className="text-muted-foreground hover:text-foreground p-1" title="Nueva partida">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={() => setExpanded((e) => !e)} className="text-muted-foreground hover:text-foreground p-1" title={expanded ? "Reducir" : "Ampliar"}>
                  {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-lg leading-none px-1">✕</button>
              </div>
            </div>

            {/* Game area */}
            <div className="flex-1 flex items-center justify-center py-4">
              <Game expanded={expanded} size={expanded ? "lg" : "md"} replayKey={replayKey} />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2 mt-4 border-t border-border/50 pt-3">
              <button onClick={() => go(-1)} className="flex items-center gap-1 glass-card rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:opacity-80 transition active:scale-95">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
              <span className="text-xs text-muted-foreground hidden sm:inline">{game.description}</span>
              <button onClick={() => go(1)} className="flex items-center gap-1 glass-card rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:opacity-80 transition active:scale-95">
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1 mt-3 flex-wrap">
              {GAMES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setReplayKey((k) => k + 1); }}
                  className={`w-2 h-2 rounded-full transition ${i === current ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
