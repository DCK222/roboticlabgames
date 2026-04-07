import { useState, useEffect, useCallback } from "react";

interface Props {
  onComplete: (score: number) => void;
  variant?: string;
}

interface Problem {
  question: string;
  answer: string;
  options: string[];
}

const ELEMENTS = [
  { z: 1, sym: "H", name: "Hidrógeno", group: 1, period: 1, type: "no metal", state: "gas", mass: 1.008, noble: false, halogen: false, alkali: false, transition: false, valence: 1, flame: "-", discoverer: "Cavendish", use: "Combustible cohetes", radioactive: false, body: true },
  { z: 2, sym: "He", name: "Helio", group: 18, period: 1, type: "no metal", state: "gas", mass: 4.003, noble: true, halogen: false, alkali: false, transition: false, valence: 0, flame: "-", discoverer: "Janssen", use: "Globos", radioactive: false, body: false },
  { z: 3, sym: "Li", name: "Litio", group: 1, period: 2, type: "metal", state: "sólido", mass: 6.941, noble: false, halogen: false, alkali: true, transition: false, valence: 1, flame: "rojo carmesí", discoverer: "Arfwedson", use: "Baterías", radioactive: false, body: false },
  { z: 6, sym: "C", name: "Carbono", group: 14, period: 2, type: "no metal", state: "sólido", mass: 12.011, noble: false, halogen: false, alkali: false, transition: false, valence: 4, flame: "-", discoverer: "Antigüedad", use: "Grafito/diamante", radioactive: false, body: true },
  { z: 7, sym: "N", name: "Nitrógeno", group: 15, period: 2, type: "no metal", state: "gas", mass: 14.007, noble: false, halogen: false, alkali: false, transition: false, valence: 5, flame: "-", discoverer: "Rutherford", use: "Fertilizantes", radioactive: false, body: true },
  { z: 8, sym: "O", name: "Oxígeno", group: 16, period: 2, type: "no metal", state: "gas", mass: 15.999, noble: false, halogen: false, alkali: false, transition: false, valence: 6, flame: "-", discoverer: "Priestley", use: "Respiración", radioactive: false, body: true },
  { z: 9, sym: "F", name: "Flúor", group: 17, period: 2, type: "no metal", state: "gas", mass: 18.998, noble: false, halogen: true, alkali: false, transition: false, valence: 7, flame: "-", discoverer: "Moissan", use: "Pasta dental", radioactive: false, body: false },
  { z: 10, sym: "Ne", name: "Neón", group: 18, period: 2, type: "no metal", state: "gas", mass: 20.180, noble: true, halogen: false, alkali: false, transition: false, valence: 0, flame: "rojo-naranja", discoverer: "Ramsay", use: "Letreros luminosos", radioactive: false, body: false },
  { z: 11, sym: "Na", name: "Sodio", group: 1, period: 3, type: "metal", state: "sólido", mass: 22.990, noble: false, halogen: false, alkali: true, transition: false, valence: 1, flame: "amarillo", discoverer: "Davy", use: "Sal de cocina", radioactive: false, body: true },
  { z: 12, sym: "Mg", name: "Magnesio", group: 2, period: 3, type: "metal", state: "sólido", mass: 24.305, noble: false, halogen: false, alkali: false, transition: false, valence: 2, flame: "blanco brillante", discoverer: "Black", use: "Aleaciones", radioactive: false, body: true },
  { z: 13, sym: "Al", name: "Aluminio", group: 13, period: 3, type: "metal", state: "sólido", mass: 26.982, noble: false, halogen: false, alkali: false, transition: false, valence: 3, flame: "-", discoverer: "Ørsted", use: "Latas y papel aluminio", radioactive: false, body: false },
  { z: 14, sym: "Si", name: "Silicio", group: 14, period: 3, type: "metaloide", state: "sólido", mass: 28.086, noble: false, halogen: false, alkali: false, transition: false, valence: 4, flame: "-", discoverer: "Berzelius", use: "Chips electrónicos", radioactive: false, body: false },
  { z: 15, sym: "P", name: "Fósforo", group: 15, period: 3, type: "no metal", state: "sólido", mass: 30.974, noble: false, halogen: false, alkali: false, transition: false, valence: 5, flame: "-", discoverer: "Brand", use: "Cerillas", radioactive: false, body: true },
  { z: 16, sym: "S", name: "Azufre", group: 16, period: 3, type: "no metal", state: "sólido", mass: 32.065, noble: false, halogen: false, alkali: false, transition: false, valence: 6, flame: "azul", discoverer: "Antigüedad", use: "Pólvora", radioactive: false, body: true },
  { z: 17, sym: "Cl", name: "Cloro", group: 17, period: 3, type: "no metal", state: "gas", mass: 35.453, noble: false, halogen: true, alkali: false, transition: false, valence: 7, flame: "-", discoverer: "Scheele", use: "Desinfectante piscinas", radioactive: false, body: true },
  { z: 19, sym: "K", name: "Potasio", group: 1, period: 4, type: "metal", state: "sólido", mass: 39.098, noble: false, halogen: false, alkali: true, transition: false, valence: 1, flame: "violeta", discoverer: "Davy", use: "Fertilizantes", radioactive: false, body: true },
  { z: 20, sym: "Ca", name: "Calcio", group: 2, period: 4, type: "metal", state: "sólido", mass: 40.078, noble: false, halogen: false, alkali: false, transition: false, valence: 2, flame: "naranja-rojo", discoverer: "Davy", use: "Huesos y dientes", radioactive: false, body: true },
  { z: 26, sym: "Fe", name: "Hierro", group: 8, period: 4, type: "metal", state: "sólido", mass: 55.845, noble: false, halogen: false, alkali: false, transition: true, valence: 2, flame: "dorado", discoverer: "Antigüedad", use: "Construcción", radioactive: false, body: true },
  { z: 29, sym: "Cu", name: "Cobre", group: 11, period: 4, type: "metal", state: "sólido", mass: 63.546, noble: false, halogen: false, alkali: false, transition: true, valence: 1, flame: "verde-azul", discoverer: "Antigüedad", use: "Cables eléctricos", radioactive: false, body: true },
  { z: 30, sym: "Zn", name: "Zinc", group: 12, period: 4, type: "metal", state: "sólido", mass: 65.38, noble: false, halogen: false, alkali: false, transition: true, valence: 2, flame: "verde-azulado", discoverer: "Antigüedad", use: "Galvanización", radioactive: false, body: true },
  { z: 35, sym: "Br", name: "Bromo", group: 17, period: 4, type: "no metal", state: "líquido", mass: 79.904, noble: false, halogen: true, alkali: false, transition: false, valence: 7, flame: "-", discoverer: "Balard", use: "Retardantes de fuego", radioactive: false, body: false },
  { z: 36, sym: "Kr", name: "Kriptón", group: 18, period: 4, type: "no metal", state: "gas", mass: 83.798, noble: true, halogen: false, alkali: false, transition: false, valence: 0, flame: "-", discoverer: "Ramsay", use: "Iluminación", radioactive: false, body: false },
  { z: 47, sym: "Ag", name: "Plata", group: 11, period: 5, type: "metal", state: "sólido", mass: 107.868, noble: false, halogen: false, alkali: false, transition: true, valence: 1, flame: "-", discoverer: "Antigüedad", use: "Joyería", radioactive: false, body: false },
  { z: 50, sym: "Sn", name: "Estaño", group: 14, period: 5, type: "metal", state: "sólido", mass: 118.710, noble: false, halogen: false, alkali: false, transition: false, valence: 4, flame: "-", discoverer: "Antigüedad", use: "Soldaduras", radioactive: false, body: false },
  { z: 53, sym: "I", name: "Yodo", group: 17, period: 5, type: "no metal", state: "sólido", mass: 126.904, noble: false, halogen: true, alkali: false, transition: false, valence: 7, flame: "violeta", discoverer: "Courtois", use: "Desinfectante", radioactive: false, body: true },
  { z: 54, sym: "Xe", name: "Xenón", group: 18, period: 5, type: "no metal", state: "gas", mass: 131.293, noble: true, halogen: false, alkali: false, transition: false, valence: 0, flame: "azul", discoverer: "Ramsay", use: "Faros de coches", radioactive: false, body: false },
  { z: 79, sym: "Au", name: "Oro", group: 11, period: 6, type: "metal", state: "sólido", mass: 196.967, noble: false, halogen: false, alkali: false, transition: true, valence: 1, flame: "-", discoverer: "Antigüedad", use: "Joyería y electrónica", radioactive: false, body: false },
  { z: 80, sym: "Hg", name: "Mercurio", group: 12, period: 6, type: "metal", state: "líquido", mass: 200.592, noble: false, halogen: false, alkali: false, transition: true, valence: 2, flame: "-", discoverer: "Antigüedad", use: "Termómetros antiguos", radioactive: false, body: false },
  { z: 82, sym: "Pb", name: "Plomo", group: 14, period: 6, type: "metal", state: "sólido", mass: 207.2, noble: false, halogen: false, alkali: false, transition: false, valence: 4, flame: "azul pálido", discoverer: "Antigüedad", use: "Baterías", radioactive: false, body: false },
  { z: 92, sym: "U", name: "Uranio", group: 3, period: 7, type: "metal", state: "sólido", mass: 238.029, noble: false, halogen: false, alkali: false, transition: false, valence: 6, flame: "-", discoverer: "Klaproth", use: "Energía nuclear", radioactive: true, body: false },
];

const pick = () => ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
const pickN = (n: number) => {
  const shuffled = [...ELEMENTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

const generateProblem = (variant: string): Problem => {
  const el = pick();
  let question = "";
  let answer = "";
  let options: string[] = [];

  const others = () => pickN(3).filter(e => e.sym !== el.sym).slice(0, 3);

  switch (variant) {
    case "symbol_to_name": {
      question = `¿Qué elemento es "${el.sym}"?`;
      answer = el.name;
      options = [el.name, ...others().map(e => e.name)];
      break;
    }
    case "name_to_symbol": {
      question = `Símbolo de "${el.name}"`;
      answer = el.sym;
      options = [el.sym, ...others().map(e => e.sym)];
      break;
    }
    case "atomic_number": {
      question = `Número atómico del ${el.name} (${el.sym})`;
      answer = String(el.z);
      const oth = others();
      options = [String(el.z), ...oth.map(e => String(e.z))];
      break;
    }
    case "group": {
      question = `¿A qué grupo pertenece ${el.name}?`;
      answer = String(el.group);
      options = [String(el.group), ...new Set(others().map(e => String(e.group)))].slice(0, 4);
      break;
    }
    case "metal_nonmetal": {
      question = `${el.name} (${el.sym}) es...`;
      answer = el.type;
      options = ["metal", "no metal", "metaloide", "gas noble"];
      break;
    }
    case "pairs": {
      question = `¿Cuál es el símbolo de ${el.name}?`;
      answer = el.sym;
      options = [el.sym, ...others().map(e => e.sym)];
      break;
    }
    case "mass": {
      question = `¿Masa atómica aprox. de ${el.name}?`;
      answer = String(Math.round(el.mass));
      const oth = others();
      options = [String(Math.round(el.mass)), ...oth.map(e => String(Math.round(e.mass)))];
      break;
    }
    case "electrons": {
      question = `Electrones de valencia de ${el.name} (grupo ${el.group})`;
      answer = String(el.valence);
      options = ["0", "1", "2", "4", "5", "6", "7"].sort(() => Math.random() - 0.5).slice(0, 3);
      options.push(String(el.valence));
      break;
    }
    case "period": {
      question = `¿En qué periodo está ${el.name}?`;
      answer = String(el.period);
      options = ["1", "2", "3", "4", "5", "6", "7"].sort(() => Math.random() - 0.5).slice(0, 3);
      options.push(String(el.period));
      break;
    }
    case "state": {
      question = `Estado de ${el.name} a temp. ambiente`;
      answer = el.state;
      options = ["sólido", "líquido", "gas", "plasma"];
      break;
    }
    case "noble": {
      question = `¿${el.name} es un gas noble?`;
      answer = el.noble ? "Sí" : "No";
      options = ["Sí", "No", "A veces", "Depende"];
      break;
    }
    case "halogens": {
      question = `¿${el.name} es un halógeno?`;
      answer = el.halogen ? "Sí" : "No";
      options = ["Sí", "No", "Solo en compuestos", "Es semimetal"];
      break;
    }
    case "alkali": {
      question = `¿${el.name} es un metal alcalino?`;
      answer = el.alkali ? "Sí" : "No";
      options = ["Sí", "No", "Es alcalinotérreo", "Es de transición"];
      break;
    }
    case "transition": {
      question = `¿${el.name} es un metal de transición?`;
      answer = el.transition ? "Sí" : "No";
      options = ["Sí", "No", "Es representativo", "Es lantánido"];
      break;
    }
    case "formulas": {
      const compounds = [
        { q: "Fórmula del agua", a: "H₂O", opts: ["H₂O", "HO₂", "H₃O", "OH"] },
        { q: "Fórmula del dióxido de carbono", a: "CO₂", opts: ["CO₂", "C₂O", "CO", "C₂O₃"] },
        { q: "Fórmula de la sal común", a: "NaCl", opts: ["NaCl", "NaO", "KCl", "NaCl₂"] },
        { q: "Fórmula del metano", a: "CH₄", opts: ["CH₄", "C₂H₆", "CH₂", "CO₂"] },
      ];
      const c = compounds[Math.floor(Math.random() * compounds.length)];
      question = c.q; answer = c.a; options = c.opts;
      break;
    }
    case "isotopes": {
      question = `${el.name} tiene Z=${el.z} y A=${Math.round(el.mass)}. ¿Neutrones?`;
      answer = String(Math.round(el.mass) - el.z);
      const n = Math.round(el.mass) - el.z;
      options = [String(n), String(n + 1), String(n - 1), String(n + 2)];
      break;
    }
    case "electronegativity": {
      const el2 = pick();
      const higher = el.z < el2.z ? el : el2; // simplified
      question = `¿Cuál es más electronegativo: ${el.name} o ${el2.name}?`;
      // F is most electronegative, simplified logic
      const ans = el.group === 17 || (el.period < el2.period && el.group >= el2.group) ? el : el2;
      answer = ans.name;
      options = [el.name, el2.name, "Igual", "No se puede saber"];
      break;
    }
    case "config": {
      const configs: Record<number, string> = { 1: "1s¹", 2: "1s²", 6: "1s²2s²2p²", 8: "1s²2s²2p⁴", 11: "1s²2s²2p⁶3s¹" };
      const available = ELEMENTS.filter(e => configs[e.z]);
      const chosen = available[Math.floor(Math.random() * available.length)] || el;
      question = `Config. electrónica de ${chosen.name}`;
      answer = configs[chosen.z] || "1s¹";
      options = Object.values(configs).sort(() => Math.random() - 0.5).slice(0, 4);
      if (!options.includes(answer)) options[0] = answer;
      break;
    }
    case "bonds": {
      const bondTypes = [
        { q: "Enlace en NaCl", a: "Iónico" },
        { q: "Enlace en H₂O", a: "Covalente" },
        { q: "Enlace en Fe metálico", a: "Metálico" },
        { q: "Enlace en CO₂", a: "Covalente" },
      ];
      const b = bondTypes[Math.floor(Math.random() * bondTypes.length)];
      question = b.q; answer = b.a;
      options = ["Iónico", "Covalente", "Metálico", "Van der Waals"];
      break;
    }
    case "balance_eq": {
      const equations = [
        { q: "H₂ + O₂ → H₂O. Coeficiente de H₂", a: "2" },
        { q: "Na + Cl₂ → NaCl. Coeficiente de Na", a: "2" },
        { q: "Fe + O₂ → Fe₂O₃. Coeficiente de Fe", a: "4" },
      ];
      const eq = equations[Math.floor(Math.random() * equations.length)];
      question = eq.q; answer = eq.a;
      options = ["1", "2", "3", "4"];
      break;
    }
    case "blank_table": {
      question = `${el.name} está en periodo ${el.period}, grupo ${el.group}. ¿Su símbolo?`;
      answer = el.sym;
      options = [el.sym, ...others().map(e => e.sym)];
      break;
    }
    case "discoverer": {
      question = `¿Quién descubrió el ${el.name}?`;
      answer = el.discoverer;
      options = [el.discoverer, ...others().map(e => e.discoverer)];
      break;
    }
    case "daily_use": {
      question = `¿Para qué se usa ${el.name}?`;
      answer = el.use;
      options = [el.use, ...others().map(e => e.use)];
      break;
    }
    case "flame": {
      const withFlame = ELEMENTS.filter(e => e.flame !== "-");
      const chosen = withFlame[Math.floor(Math.random() * withFlame.length)];
      question = `¿De qué color arde ${chosen.name}?`;
      answer = chosen.flame;
      const allFlames = [...new Set(withFlame.map(e => e.flame))];
      options = [chosen.flame, ...allFlames.filter(f => f !== chosen.flame).slice(0, 3)];
      break;
    }
    case "density": {
      const light = ELEMENTS.filter(e => e.type === "no metal" && e.state === "gas");
      const heavy = ELEMENTS.filter(e => e.type === "metal" && e.state === "sólido");
      const isLight = Math.random() > 0.5 && light.length > 0;
      const chosen = isLight ? light[Math.floor(Math.random() * light.length)] : heavy[Math.floor(Math.random() * heavy.length)];
      question = `¿${chosen.name} (${chosen.state}) flota en agua?`;
      answer = chosen.state === "gas" ? "Sí (es gas)" : "No";
      options = ["Sí (es gas)", "No", "Depende", "Solo en frío"];
      break;
    }
    case "radioactive": {
      question = `¿${el.name} es radiactivo?`;
      answer = el.radioactive ? "Sí" : "No";
      options = ["Sí", "No", "Solo isótopos", "Es estable"];
      break;
    }
    case "body": {
      question = `¿${el.name} es esencial para el cuerpo humano?`;
      answer = el.body ? "Sí" : "No";
      options = ["Sí", "No", "Solo en trazas", "Es tóxico"];
      break;
    }
    case "chronology": {
      const el2 = pick();
      const ancient = ["Antigüedad"];
      const isEl1Older = ancient.includes(el.discoverer) && !ancient.includes(el2.discoverer);
      question = `¿Quién se descubrió antes: ${el.name} o ${el2.name}?`;
      answer = isEl1Older ? el.name : el2.name;
      options = [el.name, el2.name, "Al mismo tiempo", "Ninguno"];
      break;
    }
    case "speed_quiz": case "mystery": {
      question = `Elemento: Z=${el.z}, periodo ${el.period}, ${el.type}. ¿Cuál es?`;
      answer = el.name;
      options = [el.name, ...others().map(e => e.name)];
      break;
    }
    default: {
      question = `¿Qué elemento es "${el.sym}"?`;
      answer = el.name;
      options = [el.name, ...others().map(e => e.name)];
    }
  }

  // Ensure answer is in options and we have exactly 4
  if (!options.includes(answer)) options[0] = answer;
  const unique = [...new Set(options)];
  while (unique.length < 4) unique.push(`Opción ${unique.length + 1}`);
  return { question, answer, options: unique.slice(0, 4).sort(() => Math.random() - 0.5) };
};

const ChemistryGame = ({ onComplete, variant = "symbol_to_name" }: Props) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<Problem>(() => generateProblem(variant));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const totalRounds = 10;

  useEffect(() => {
    if (timeLeft <= 0) { onComplete(score); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, score, onComplete]);

  const handleAnswer = useCallback((val: string) => {
    if (feedback) return;
    const correct = val === problem.answer;
    setFeedback(correct ? "✅ ¡Correcto!" : `❌ Era: ${problem.answer}`);
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

      {feedback && <div className="text-lg mb-4 font-semibold">{feedback}</div>}

      <div className="grid grid-cols-2 gap-3">
        {problem.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            disabled={!!feedback}
            className="rounded-xl bg-secondary py-3 px-2 text-sm font-bold text-foreground hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChemistryGame;
