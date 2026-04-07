import { useState, useEffect, useCallback } from "react";

interface Props {
  onComplete: (score: number) => void;
  variant?: string;
}

interface Problem {
  question: string;
  answer: number;
  options: number[];
}

const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProblem = (variant: string): Problem => {
  let question = "";
  let answer = 0;

  switch (variant) {
    case "seq_num": {
      const start = r(2, 10), step = r(2, 5);
      const seq = Array.from({ length: 4 }, (_, i) => start + step * i);
      question = `${seq.join(", ")}, ?`;
      answer = start + step * 4;
      break;
    }
    case "sudoku": {
      const total = 10; const a = r(1, total - 3), b = r(1, total - a - 2);
      question = `${a} + ${b} + ? = ${total}. ¿Cuánto es ?`;
      answer = total - a - b;
      break;
    }
    case "hanoi": {
      const discs = r(2, 4);
      answer = Math.pow(2, discs) - 1;
      question = `Torres de Hanoi con ${discs} discos: ¿mínimo de movimientos?`;
      break;
    }
    case "pattern_color": {
      const patterns = [
        { q: "🔴🔵🔴🔵🔴?", a: 2, opts: [1, 2, 3, 4], labels: "1=🔴 2=🔵 3=🟢 4=🟡" },
        { q: "🟢🟡🟢🟡🟢?", a: 4, opts: [1, 2, 3, 4], labels: "1=🔴 2=🔵 3=🟢 4=🟡" },
      ];
      const p = patterns[r(0, patterns.length - 1)];
      question = `${p.q} ${p.labels}`;
      answer = p.a;
      break;
    }
    case "verbal": {
      const problems = [
        { q: "Si todos los gatos son animales y Mimi es gato, ¿Mimi es animal? (1=Sí, 0=No)", a: 1 },
        { q: "Si llueve, el suelo se moja. El suelo está mojado. ¿Seguro que llovió? (1=Sí, 0=No)", a: 0 },
        { q: "A>B y B>C. ¿A>C? (1=Sí, 0=No)", a: 1 },
      ];
      const p = problems[r(0, problems.length - 1)];
      question = p.q; answer = p.a;
      break;
    }
    case "hidden_num": {
      answer = r(1, 50);
      const hint1 = answer % 2 === 0 ? "par" : "impar";
      const hint2 = answer > 25 ? "mayor que 25" : "menor o igual que 25";
      question = `Soy ${hint1}, ${hint2}, y mis cifras suman ${String(answer).split("").reduce((s, d) => s + parseInt(d), 0)}`;
      break;
    }
    case "maze": {
      const a = r(2, 8), b = r(2, 8), c = r(2, 8);
      question = `${a} → +${b} → +${c} → ?`;
      answer = a + b + c;
      break;
    }
    case "cipher": {
      const shift = r(1, 5);
      const original = r(10, 50);
      question = `Código: número + ${shift} = cifrado. Si cifrado = ${original + shift}, ¿original?`;
      answer = original;
      break;
    }
    case "balance": {
      const left = r(3, 15);
      const rightPart = r(1, left - 1);
      question = `⚖️ ${left} = ${rightPart} + ?`;
      answer = left - rightPart;
      break;
    }
    case "fibonacci": {
      const a = r(1, 5), b = r(1, 5);
      const seq = [a, b, a + b, a + b + b];
      question = `${a}, ${b}, ${a + b}, ${a + 2 * b}, ?`;
      answer = a + 2 * b + (a + b);
      // Actually Fibonacci-like: each = sum of previous two
      const s = [a, b];
      for (let i = 2; i < 5; i++) s.push(s[i - 1] + s[i - 2]);
      question = `${s.slice(0, 4).join(", ")}, ?`;
      answer = s[4];
      break;
    }
    case "magic_square": {
      // 3x3 magic square, missing one number
      const magic = [[2, 7, 6], [9, 5, 1], [4, 3, 8]];
      const row = r(0, 2), col = r(0, 2);
      answer = magic[row][col];
      const display = magic.map((rr, ri) => rr.map((c, ci) => ri === row && ci === col ? "?" : c).join(" ")).join(" | ");
      question = `Cuadrado mágico (suma=15): ${display}`;
      break;
    }
    case "progression": {
      const type = r(0, 1);
      if (type === 0) {
        const start = r(2, 10), diff = r(2, 5);
        const seq = Array.from({ length: 4 }, (_, i) => start + diff * i);
        question = `${seq.join(", ")}, ?`;
        answer = start + diff * 4;
      } else {
        const start = r(2, 5), ratio = r(2, 3);
        const seq = Array.from({ length: 4 }, (_, i) => start * Math.pow(ratio, i));
        question = `${seq.join(", ")}, ?`;
        answer = start * Math.pow(ratio, 4);
      }
      break;
    }
    case "analogies": {
      const a = r(2, 8), b = a * 2;
      const c = r(2, 8);
      question = `${a} → ${b} como ${c} → ?`;
      answer = c * 2;
      break;
    }
    case "odd_one": {
      const base = r(2, 5);
      const multiples = [base * 2, base * 3, base * 4, base * 5];
      const intruder = base * 3 + 1;
      multiples[r(0, 3)] = intruder;
      question = `¿Cuál NO es múltiplo de ${base}? ${multiples.join(", ")}`;
      answer = intruder;
      break;
    }
    case "river": {
      const problems = [
        { q: "Un barquero cruza 3 personas. Cada viaje lleva 1. ¿Mínimo de viajes ida?", a: 3 },
        { q: "2 personas cruzan. La barca lleva 2 pero alguien debe traerla. ¿Viajes mínimos?", a: 1 },
      ];
      const p = problems[r(0, problems.length - 1)];
      question = p.q; answer = p.a;
      break;
    }
    case "missing_op": {
      const a = r(2, 10), b = r(2, 10);
      const ops = [
        { sym: "+", res: a + b, code: 1 },
        { sym: "-", res: a - b, code: 2 },
        { sym: "×", res: a * b, code: 3 },
      ];
      const chosen = ops[r(0, 2)];
      question = `${a} ? ${b} = ${chosen.res}. (1=+ 2=- 3=×)`;
      answer = chosen.code;
      break;
    }
    case "pyramid": {
      const a = r(1, 9), b = r(1, 9);
      question = `Pirámide: base [${a}] [${b}], siguiente nivel = suma → ?`;
      answer = a + b;
      break;
    }
    case "binary": {
      const n = r(1, 15);
      const binary = n.toString(2);
      question = `Binario ${binary} en decimal = ?`;
      answer = n;
      break;
    }
    case "dice": {
      // Opposite faces of a die sum to 7
      const top = r(1, 6);
      question = `Dado: si arriba hay ${top}, ¿qué hay abajo?`;
      answer = 7 - top;
      break;
    }
    case "double_seq": {
      const s1 = r(1, 5), s2 = r(10, 15);
      question = `${s1}, ${s2}, ${s1 + 2}, ${s2 + 2}, ${s1 + 4}, ?`;
      answer = s2 + 4;
      break;
    }
    case "crypto": {
      const a = r(1, 9), b = r(1, 9);
      question = `A=${a}, B=${b}. ¿AB + BA? (AB=${a}${b}, BA=${b}${a})`;
      answer = parseInt(`${a}${b}`) + parseInt(`${b}${a}`);
      break;
    }
    case "domino": {
      const start = r(1, 4);
      question = `Fichas: [${start}|${start + 1}] [${start + 1}|${start + 2}] [${start + 2}|?]`;
      answer = start + 3;
      break;
    }
    case "clock": {
      const h1 = r(1, 10), diff = r(1, 3);
      question = `Relojes: ${h1}:00, ${h1 + diff}:00, ${h1 + diff * 2}:00, ?:00`;
      answer = h1 + diff * 3;
      break;
    }
    case "queens": {
      question = `¿Cuántas soluciones tiene el problema de 4 reinas en tablero 4×4?`;
      answer = 2;
      break;
    }
    case "safe": {
      const code = r(1, 9);
      question = `Caja fuerte: el código es impar, menor que 8 y mayor que ${code - 1 > 0 ? code - 1 : 0}`;
      answer = code % 2 !== 0 ? code : code + 1 > 7 ? 7 : code + 1;
      // Simplify
      const safe = [1, 3, 5, 7][r(0, 3)];
      question = `Pista: es impar y está entre ${safe - 2} y ${safe + 2}`;
      answer = safe;
      break;
    }
    case "tangram": {
      const a = r(2, 8), b = r(2, 8), c = r(2, 8);
      question = `Piezas: ${a}, ${b}, ${c}. ¿Suma total?`;
      answer = a + b + c;
      break;
    }
    case "pair_rule": {
      const rule = r(2, 5);
      const a = r(1, 10);
      question = `Regla: (1→${rule}), (2→${rule * 2}), (${a}→?)`;
      answer = a * rule;
      break;
    }
    case "min_path": {
      const a = r(1, 5), b = r(1, 5), c = r(1, 5), d = r(1, 5);
      const path1 = a + c, path2 = b + d;
      question = `Camino A: ${a}+${c}=${path1}. Camino B: ${b}+${d}=${path2}. ¿Mínimo?`;
      answer = Math.min(path1, path2);
      break;
    }
    case "truth": {
      const problems = [
        { q: "A dice 'Soy mentiroso'. ¿Puede ser verdad? (1=Sí, 0=No)", a: 0 },
        { q: "Uno siempre miente, otro siempre dice verdad. Uno dice 'Él miente'. ¿Quién habla, el veraz(1) o el mentiroso(0)?", a: 0 },
      ];
      const p = problems[r(0, problems.length - 1)];
      question = p.q; answer = p.a;
      break;
    }
    case "board": {
      const start = r(1, 5), target = r(15, 30);
      const step = r(2, 5);
      const moves = Math.ceil((target - start) / step);
      question = `De ${start} a ${target} saltando de ${step} en ${step}. ¿Mínimo saltos?`;
      answer = moves;
      break;
    }
    default: {
      const start = r(2, 10), step = r(2, 5);
      const seq = Array.from({ length: 4 }, (_, i) => start + step * i);
      question = `${seq.join(", ")}, ?`;
      answer = start + step * 4;
    }
  }

  const options = new Set<number>([answer]);
  while (options.size < 4) {
    const offset = r(1, 10) * (r(0, 1) ? 1 : -1);
    options.add(answer + offset);
  }

  return { question, answer, options: [...options].sort(() => Math.random() - 0.5) };
};

const LogicGame = ({ onComplete, variant = "seq_num" }: Props) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<Problem>(() => generateProblem(variant));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const totalRounds = 8;

  useEffect(() => {
    if (timeLeft <= 0) { onComplete(score); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, score, onComplete]);

  const handleAnswer = useCallback((val: number) => {
    if (feedback) return;
    const correct = val === problem.answer;
    setFeedback(correct ? "✅ ¡Correcto!" : `❌ Era ${problem.answer}`);
    if (correct) setScore(s => s + 15);

    setTimeout(() => {
      const next = round + 1;
      if (next >= totalRounds) {
        onComplete(score + (correct ? 15 : 0));
      } else {
        setRound(next);
        setProblem(generateProblem(variant));
        setFeedback(null);
      }
    }, 1200);
  }, [feedback, problem, round, score, variant, onComplete]);

  return (
    <div className="glass-card neon-border rounded-xl p-6 text-center">
      <div className="flex justify-between text-sm text-muted-foreground mb-4">
        <span>Ronda {round + 1}/{totalRounds}</span>
        <span>⏱️ {timeLeft}s</span>
        <span>⭐ {score}</span>
      </div>

      <div className="text-xl font-heading font-bold text-foreground mb-6 min-h-[80px] flex items-center justify-center px-2">
        {problem.question}
      </div>

      {feedback && <div className="text-xl mb-4 font-semibold">{feedback}</div>}

      <div className="grid grid-cols-2 gap-3">
        {problem.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            disabled={!!feedback}
            className="rounded-xl bg-secondary py-4 text-xl font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LogicGame;
