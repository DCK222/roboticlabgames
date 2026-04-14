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
    case "riddle_double": { const n = r(3,25); question = `El doble de ${n} más 5 es...`; answer = n*2+5; break; }
    case "riddle_hidden": { const n = r(10,50); question = `Soy mayor que ${n-3} y menor que ${n+1}, soy par. ¿Quién soy?`; answer = n % 2 === 0 ? n : n-1; break; }
    case "riddle_sum": { const a2 = r(5,20), b2 = r(5,20); question = `Dos números suman ${a2+b2}. Uno es ${a2}. ¿Cuál es el otro?`; answer = b2; break; }
    case "riddle_age": { const age = r(5,15), diff = r(2,5); question = `Tengo ${age} años. Mi hermano tiene ${diff} más. ¿Cuántos tenemos juntos?`; answer = age*2+diff; break; }
    case "riddle_digits": { const d1 = r(1,4), d2 = r(5,9); question = `Con los dígitos ${d1} y ${d2}, ¿cuál es el número mayor?`; answer = d2*10+d1 > d1*10+d2 ? d2*10+d1 : d1*10+d2; break; }
    case "riddle_coins": { const price = r(3,15); question = `Un juguete cuesta ${price}€. Pagas con monedas de 2€. ¿Cuántas necesitas mínimo?`; answer = Math.ceil(price/2); break; }
    case "riddle_animals": { const dogs = r(1,5), cats = r(1,5); question = `${dogs} perros y ${cats} gatos. ¿Cuántas patas hay en total?`; answer = (dogs+cats)*4; break; }
    case "riddle_stairs": { const start = r(1,5), step = r(2,4), steps = r(3,5); question = `Empiezo en ${start} y subo ${step} cada peldaño. ¿En qué número estoy tras ${steps} peldaños?`; answer = start+step*steps; break; }
    case "riddle_clock": { const hour = r(1,12), add = r(1,12); const result = ((hour+add-1)%12)+1; question = `Son las ${hour}. ¿Qué hora será en ${add} horas?`; answer = result; break; }
    case "riddle_pizza": { const slices = r(2,4)*r(2,4), friends = r(2,4); question = `Una pizza tiene ${slices} porciones. Si somos ${friends}, ¿cuántas toca a cada uno?`; answer = Math.floor(slices/friends); break; }
    case "riddle_train": { const ini = r(20,40), bajan = r(5,15), suben = r(3,10); question = `Un tren lleva ${ini} pasajeros. Bajan ${bajan} y suben ${suben}. ¿Cuántos hay?`; answer = ini-bajan+suben; break; }
    case "riddle_fruit": { const apple = r(2,6), banana = r(1,5); question = `🍎=${apple}, 🍌=${banana}. ¿Cuánto es 🍎+🍌+🍎?`; answer = apple*2+banana; break; }
    case "riddle_box": { const x = r(3,12); question = `Una caja tiene el triple de ${x} menos 4. ¿Cuántos objetos tiene?`; answer = x*3-4; break; }
    case "riddle_mirror": { const num = r(10,30); question = `El espejo muestra un número al revés: ${String(num).split('').reverse().join('')}. ¿Cuál es el real?`; answer = num; break; }
    case "riddle_dice": { const d = r(7,12); const d1r = r(1,Math.min(6,d-1)); question = `Dos dados suman ${d}. Uno muestra ${d1r}. ¿Cuánto muestra el otro?`; answer = d-d1r; break; }
    case "riddle_code": { const c = r(2,5); question = `Código: A=1, B=2, C=3... ¿Qué número es la letra ${String.fromCharCode(64+c)}?`; answer = c; break; }
    case "riddle_weight": { const w1 = r(2,8), w2 = r(2,8), n = r(2,4); question = `${n} bolsas de ${w1}kg y 1 caja de ${w2}kg. ¿Peso total?`; answer = w1*n+w2; break; }
    case "riddle_triangle": { const side = r(6,15); question = `Un triángulo equilátero tiene perímetro ${side*3}. ¿Cuánto mide un lado?`; answer = side; break; }
    case "riddle_distance": { const vel = r(2,8), hrs = r(2,5); question = `Caminas ${vel} km/h durante ${hrs} horas. ¿Cuántos km recorres?`; answer = vel*hrs; break; }
    case "riddle_market": { const precio = r(3,15), pago = r(16,25); question = `Compras algo de ${precio}€ y pagas con ${pago}€. ¿Cuánto te devuelven?`; answer = pago-precio; break; }
    case "riddle_bricks": { const filas = r(3,6), por_fila = r(4,8); question = `Una pared tiene ${filas} filas de ${por_fila} ladrillos. ¿Cuántos ladrillos hay?`; answer = filas*por_fila; break; }
    case "riddle_ghost": { const n2 = r(100,500); const digits = String(n2).split(''); const idx = r(0,digits.length-1); const missing = Number(digits[idx]); digits[idx] = '?'; question = `El número es ${digits.join('')}. La cifra perdida hace que sume ${String(n2).split('').reduce((s,d)=>s+Number(d),0)}. ¿Cuál es?`; answer = missing; break; }
    case "riddle_bounce": { const h = r(2,5)*16; question = `Un balón cae desde ${h}m y rebota a la mitad. ¿Cuánto sube en el 2º bote?`; answer = h/4; break; }
    case "riddle_candy": { const dulces = r(3,8)*r(2,5), ninos = r(2,5); question = `Hay ${dulces} dulces para ${ninos} niños. ¿Cuántos le tocan a cada uno?`; answer = Math.floor(dulces/ninos); break; }
    case "riddle_eggs": { const docenas = r(1,4); question = `Compras ${docenas} docena(s) de huevos y se rompen 3. ¿Cuántos quedan?`; answer = docenas*12-3; break; }
    case "riddle_calendar": { const dia = r(1,7), add2 = r(7,21); question = `Hoy es día ${dia}. ¿Qué día del mes será en ${add2} días?`; answer = dia+add2; break; }
    case "riddle_cubes": { const layers = r(2,4); question = `Una pirámide de cubos: capa 1=${layers}², capa 2=${layers-1}²... ¿Total de cubos?`; let total=0; for(let i=layers;i>=1;i--) total+=i*i; answer = total; break; }
    case "riddle_ant": { const lados = r(3,6), lado = r(2,8); question = `Una hormiga recorre un polígono de ${lados} lados de ${lado}cm. ¿Cuánto recorre?`; answer = lados*lado; break; }
    case "riddle_garden": { const dias = r(2,5); question = `1 flor el día 1, se duplica cada día. ¿Cuántas flores el día ${dias}?`; answer = Math.pow(2, dias-1); break; }
    case "riddle_pirate": { const oro = r(4,10)*r(2,5), piratas = r(2,5); question = `${oro} monedas de oro entre ${piratas} piratas. ¿Cuántas le tocan a cada uno?`; answer = Math.floor(oro/piratas); break; }
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
