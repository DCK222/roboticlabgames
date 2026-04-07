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

const generateProblem = (variant: string): Problem => {
  const r = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  let question = "";
  let answer = 0;

  switch (variant) {
    case "add_basic": { const a = r(1,20), b = r(1,20); question = `${a} + ${b}`; answer = a+b; break; }
    case "sub_basic": { const a = r(10,30), b = r(1, 10); question = `${a} - ${b}`; answer = a-b; break; }
    case "mul_basic": { const a = r(2,10), b = r(2,10); question = `${a} × ${b}`; answer = a*b; break; }
    case "div_basic": { const b = r(2,10), ans = r(2,10); question = `${b*ans} ÷ ${b}`; answer = ans; break; }
    case "add_double": { const a = r(10,99), b = r(10,99); question = `${a} + ${b}`; answer = a+b; break; }
    case "sub_double": { const a = r(50,99), b = r(10,49); question = `${a} - ${b}`; answer = a-b; break; }
    case "mul_advanced": { const a = r(10,25), b = r(2,9); question = `${a} × ${b}`; answer = a*b; break; }
    case "div_advanced": { const b = r(2,9), ans = r(10,30); question = `${b*ans} ÷ ${b}`; answer = ans; break; }
    case "mystery": { const a = r(2,15), b = r(2,15); question = `${a} + ? = ${a+b}. ¿Cuánto es ?`; answer = b; break; }
    case "compare": { const a = r(2,10)*r(2,5), b = r(2,10)*r(2,5); question = `¿Cuál es mayor: ${a} o ${b}?`; answer = Math.max(a,b); break; }
    case "cards_add": { const a = r(1,10), b = r(1,10); question = `🃏${a} + 🃏${b}`; answer = a+b; break; }
    case "cards_sub": { const a = r(5,12), b = r(1,5); question = `🎴${a} - 🎴${b}`; answer = a-b; break; }
    case "cards_mul": { const a = r(2,8), b = r(2,6); question = `🂠${a} × 🂠${b}`; answer = a*b; break; }
    case "powers": { const base = r(2,6), exp = r(2,3); question = `${base}^${exp}`; answer = Math.pow(base, exp); break; }
    case "roots": { const n = r(2,12); question = `√${n*n}`; answer = n; break; }
    case "frac_add": { const d = r(2,6), n1 = r(1,d-1), n2 = r(1,d-1); question = `${n1}/${d} + ${n2}/${d} = ?/${d}`; answer = n1+n2; break; }
    case "percent": { const base = r(2,10)*10, pct = [10,20,25,50][r(0,3)]; question = `${pct}% de ${base}`; answer = base*pct/100; break; }
    case "equation": { const a = r(2,8), b = r(1,15); question = `${a}x = ${a*b}. x = ?`; answer = b; break; }
    case "parity": { const a = r(3,15), b = r(3,15); const res = a*b; question = `${a} × ${b} = ${res}. ¿Es par(0) o impar(1)?`; answer = res % 2; break; }
    case "rounding": { const n = r(11,99); const tens = Math.round(n/10)*10; question = `Redondea ${n} a la decena`; answer = tens; break; }
    case "mixed_ops": { const a = r(2,10), b = r(2,10), c = r(1,5); question = `${a} + ${b} × ${c}`; answer = a + b*c; break; }
    case "decimals": { const a = r(1,9), b = r(1,9); question = `${a}.5 + ${b}.5`; answer = a+b+1; break; }
    case "cards_color": { const a = r(1,10), b = r(1,10); question = `♠${a} (suma) + ♥${b} (resta) = ${a} - ${b}`; answer = a-b; break; }
    case "multiples": { const n = r(2,9), m = r(2,12); question = `¿${n*m} es múltiplo de ${n}? (1=Sí, 0=No)`; answer = 1; break; }
    case "divisors": { const n = r(2,9), m = r(2,9); question = `¿${n} divide a ${n*m}? (1=Sí, 0=No)`; answer = 1; break; }
    case "primes": { const primes = [2,3,5,7,11,13,17,19,23]; const notPrimes = [4,6,8,9,10,12,14,15]; const isPrime = r(0,1); const n = isPrime ? primes[r(0,primes.length-1)] : notPrimes[r(0,notPrimes.length-1)]; question = `¿${n} es primo? (1=Sí, 0=No)`; answer = isPrime; break; }
    case "riddle": {
      const riddles = [
        { q: "Tengo 3 cifras, soy par, mis cifras suman 6, y soy menor que 200", a: 132 },
        { q: "Soy el doble de 25 menos 10", a: 40 },
        { q: "Si me multiplicas por 0, ¿qué obtienes?", a: 0 },
        { q: "Soy la mitad de 100", a: 50 },
        { q: "Soy 3 al cubo", a: 27 },
      ];
      const rd = riddles[r(0, riddles.length-1)];
      question = rd.q; answer = rd.a; break;
    }
    case "chain_ops": { const a = r(2,8), b = r(1,5), c = r(1,3); question = `(${a} + ${b}) × ${c}`; answer = (a+b)*c; break; }
    case "countdown": { const target = r(10,50); const a = r(1,10); question = `Tienes ${a}. ¿× cuánto para llegar a ${a * r(2,5)}?`; const mult = Math.floor((a * r(2,5)) / a); answer = mult; question = `${a} × ? = ${a*mult}`; break; }
    case "true_false": { const a = r(2,12), b = r(2,12); const correct = a*b; const shown = r(0,1) ? correct : correct + r(-3,-1); question = `¿${a} × ${b} = ${shown}? (1=Sí, 0=No)`; answer = shown === correct ? 1 : 0; break; }
    default: { const a = r(1,10), b = r(1,10); question = `${a} + ${b}`; answer = a+b; }
  }

  const options = new Set<number>([answer]);
  while (options.size < 4) {
    options.add(answer + r(-5, 5) || answer + 1);
  }

  return { question, answer, options: [...options].sort(() => Math.random() - 0.5) };
};

const MathGame = ({ onComplete, variant = "add_basic" }: Props) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<Problem>(() => generateProblem(variant));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const totalRounds = 10;

  useEffect(() => {
    if (timeLeft <= 0) { onComplete(score); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, score, onComplete]);

  const handleAnswer = useCallback((val: number) => {
    if (feedback) return;
    const correct = val === problem.answer;
    setFeedback(correct ? "✅ ¡Correcto!" : `❌ Era ${problem.answer}`);
    if (correct) setScore(s => s + 10);

    setTimeout(() => {
      const next = round + 1;
      if (next >= totalRounds) {
        onComplete(score + (correct ? 10 : 0));
      } else {
        setRound(next);
        setProblem(generateProblem(variant));
        setFeedback(null);
      }
    }, 1000);
  }, [feedback, problem, round, score, variant, onComplete]);

  return (
    <div className="glass-card neon-border rounded-xl p-6 text-center">
      <div className="flex justify-between text-sm text-muted-foreground mb-4">
        <span>Ronda {round + 1}/{totalRounds}</span>
        <span>⏱️ {timeLeft}s</span>
        <span>⭐ {score}</span>
      </div>

      <div className="text-3xl font-heading font-bold text-foreground mb-6 min-h-[80px] flex items-center justify-center">
        {problem.question}
      </div>

      {feedback && (
        <div className="text-xl mb-4 font-semibold">{feedback}</div>
      )}

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

export default MathGame;
