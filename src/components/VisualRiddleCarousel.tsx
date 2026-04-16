import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react";

interface VisualRiddle {
  question: string;
  answer: string;
  emoji: string;
  theme: string;
  category: string;
}

const RIDDLES: VisualRiddle[] = [
  // Animales y números
  { question: "Una araña tiene 8 patas. Si hay 3 arañas, ¿cuántas patas hay en total?", answer: "24 patas (3 × 8)", emoji: "🕷️", theme: "from-red-500/20 to-orange-500/10", category: "🐾 Animales" },
  { question: "Un pulpo tiene 8 tentáculos. ¿Cuántos tentáculos tienen 5 pulpos?", answer: "40 tentáculos (5 × 8)", emoji: "🐙", theme: "from-purple-500/20 to-blue-500/10", category: "🐾 Animales" },
  { question: "Si un gato tiene 4 patas y 1 cola, ¿cuántas patas y colas tienen 7 gatos?", answer: "28 patas y 7 colas", emoji: "🐱", theme: "from-amber-500/20 to-yellow-500/10", category: "🐾 Animales" },
  { question: "Las abejas tienen 6 patas. Si ves 10 abejas en una flor, ¿cuántas patas hay?", answer: "60 patas (10 × 6)", emoji: "🐝", theme: "from-yellow-500/20 to-amber-500/10", category: "🐾 Animales" },
  { question: "Un caballo tiene 4 patas y 2 orejas. ¿Qué tiene más: 3 caballos de patas o 7 caballos de orejas?", answer: "Más orejas: 14 > 12", emoji: "🐴", theme: "from-orange-500/20 to-red-500/10", category: "🐾 Animales" },
  // Comida y cocina
  { question: "Si una pizza se corta en 8 trozos y te comes 3, ¿qué fracción te has comido?", answer: "3/8 de la pizza", emoji: "🍕", theme: "from-red-500/20 to-yellow-500/10", category: "🍽️ Cocina" },
  { question: "Tienes 12 galletas y las repartes entre 4 amigos por igual. ¿Cuántas le tocan a cada uno?", answer: "3 galletas cada uno", emoji: "🍪", theme: "from-amber-500/20 to-orange-500/10", category: "🍽️ Cocina" },
  { question: "Una receta lleva 2 huevos para 4 personas. ¿Cuántos huevos necesitas para 12 personas?", answer: "6 huevos (12÷4 × 2)", emoji: "🥚", theme: "from-yellow-500/20 to-amber-500/10", category: "🍽️ Cocina" },
  { question: "Si un pastel pesa 1 kilo y medio, ¿cuánto pesan 4 pasteles iguales?", answer: "6 kilos (4 × 1.5)", emoji: "🎂", theme: "from-pink-500/20 to-rose-500/10", category: "🍽️ Cocina" },
  { question: "Compras 3 manzanas a 0.50€ cada una y 2 plátanos a 0.30€. ¿Cuánto pagas?", answer: "2.10€ (1.50 + 0.60)", emoji: "🍎", theme: "from-green-500/20 to-emerald-500/10", category: "🍽️ Cocina" },
  // Tiempo y relojes
  { question: "Si son las 3:45, ¿qué ángulo forman las agujas del reloj?", answer: "Aproximadamente 157.5°", emoji: "🕐", theme: "from-blue-500/20 to-indigo-500/10", category: "⏰ Tiempo" },
  { question: "Un partido de fútbol dura 90 minutos. ¿Cuántas horas y minutos son?", answer: "1 hora y 30 minutos", emoji: "⚽", theme: "from-green-500/20 to-lime-500/10", category: "⏰ Tiempo" },
  { question: "Si te acuestas a las 21:00 y pones el despertador a las 7:00, ¿cuántas horas duermes?", answer: "10 horas", emoji: "😴", theme: "from-indigo-500/20 to-purple-500/10", category: "⏰ Tiempo" },
  { question: "Un tren sale cada 15 minutos. Si el primero sale a las 8:00, ¿a qué hora sale el quinto?", answer: "A las 9:00 (8:00 + 4×15min)", emoji: "🚂", theme: "from-slate-500/20 to-zinc-500/10", category: "⏰ Tiempo" },
  { question: "¿Cuántos minutos hay en un día completo?", answer: "1.440 minutos (24 × 60)", emoji: "📅", theme: "from-cyan-500/20 to-blue-500/10", category: "⏰ Tiempo" },
  // Formas y geometría
  { question: "¿Cuántos triángulos puedes formar con 6 palillos sin romper ninguno?", answer: "2 triángulos (o 4 si haces un tetraedro)", emoji: "📐", theme: "from-teal-500/20 to-cyan-500/10", category: "📏 Geometría" },
  { question: "Un cuadrado tiene 4 lados iguales. Si cada lado mide 5 cm, ¿cuánto mide el perímetro?", answer: "20 cm (4 × 5)", emoji: "⬜", theme: "from-gray-500/20 to-slate-500/10", category: "📏 Geometría" },
  { question: "¿Cuántas esquinas tiene un cubo?", answer: "8 esquinas (vértices)", emoji: "🧊", theme: "from-sky-500/20 to-blue-500/10", category: "📏 Geometría" },
  { question: "Si un círculo tiene un radio de 7 cm, ¿cuánto mide su diámetro?", answer: "14 cm (7 × 2)", emoji: "⭕", theme: "from-rose-500/20 to-pink-500/10", category: "📏 Geometría" },
  { question: "¿Cuántas diagonales tiene un pentágono?", answer: "5 diagonales", emoji: "⬠", theme: "from-violet-500/20 to-purple-500/10", category: "📏 Geometría" },
  // Dinero y compras
  { question: "Tienes un billete de 20€ y compras algo de 13.75€. ¿Cuánto cambio recibes?", answer: "6.25€", emoji: "💶", theme: "from-green-500/20 to-emerald-500/10", category: "💰 Dinero" },
  { question: "Si ahorras 2€ al día, ¿cuánto tendrás después de un mes de 30 días?", answer: "60€ (30 × 2)", emoji: "🐷", theme: "from-pink-500/20 to-rose-500/10", category: "💰 Dinero" },
  { question: "Un juguete cuesta 15€ con un 20% de descuento. ¿Cuánto pagas?", answer: "12€ (15 - 3)", emoji: "🏷️", theme: "from-orange-500/20 to-amber-500/10", category: "💰 Dinero" },
  { question: "Si 3 caramelos cuestan 1.50€, ¿cuánto cuestan 10 caramelos?", answer: "5€ (10 × 0.50)", emoji: "🍬", theme: "from-red-500/20 to-pink-500/10", category: "💰 Dinero" },
  { question: "Tienes 5 monedas: dos de 2€, una de 1€ y dos de 50 céntimos. ¿Cuánto tienes?", answer: "6€ (4 + 1 + 1)", emoji: "🪙", theme: "from-yellow-500/20 to-amber-500/10", category: "💰 Dinero" },
  // Deportes y medidas
  { question: "Una piscina olímpica mide 50 metros. Si nadas 6 largos, ¿cuántos metros recorres?", answer: "300 metros (6 × 50)", emoji: "🏊", theme: "from-cyan-500/20 to-blue-500/10", category: "🏅 Deportes" },
  { question: "En baloncesto, un triple vale 3 puntos. Si metes 7 triples, ¿cuántos puntos sumas?", answer: "21 puntos (7 × 3)", emoji: "🏀", theme: "from-orange-500/20 to-red-500/10", category: "🏅 Deportes" },
  { question: "Una maratón son 42 km. Si llevas corridos 27 km, ¿cuántos te faltan?", answer: "15 km (42 - 27)", emoji: "🏃", theme: "from-green-500/20 to-teal-500/10", category: "🏅 Deportes" },
  { question: "Un campo de fútbol mide 100m × 70m. ¿Cuánto mide su perímetro?", answer: "340 metros (2×100 + 2×70)", emoji: "⚽", theme: "from-emerald-500/20 to-green-500/10", category: "🏅 Deportes" },
  { question: "Si en una carrera hay 30 corredores y adelantas al último, ¿en qué posición estás?", answer: "¡No puedes adelantar al último!", emoji: "🏁", theme: "from-slate-500/20 to-gray-500/10", category: "🏅 Deportes" },
  // Espacio y ciencia
  { question: "La Luna tarda 28 días en dar una vuelta a la Tierra. ¿Cuántas vueltas da en un año?", answer: "Aproximadamente 13 vueltas (365÷28)", emoji: "🌙", theme: "from-indigo-500/20 to-violet-500/10", category: "🚀 Espacio" },
  { question: "La luz tarda 8 minutos en llegar del Sol a la Tierra. ¿Cuántos segundos son?", answer: "480 segundos (8 × 60)", emoji: "☀️", theme: "from-yellow-500/20 to-orange-500/10", category: "🚀 Espacio" },
  { question: "Si un cohete viaja a 28.000 km/h, ¿cuántos km recorre en 1 minuto?", answer: "Unos 467 km (28.000÷60)", emoji: "🚀", theme: "from-blue-500/20 to-indigo-500/10", category: "🚀 Espacio" },
  { question: "Júpiter tiene 95 lunas conocidas. Saturno tiene 146. ¿Cuántas tienen juntos?", answer: "241 lunas", emoji: "🪐", theme: "from-amber-500/20 to-yellow-500/10", category: "🚀 Espacio" },
  { question: "Si tu peso en la Luna es 1/6 del de la Tierra y pesas 36 kg, ¿cuánto pesarías en la Luna?", answer: "6 kg (36 ÷ 6)", emoji: "🌕", theme: "from-gray-500/20 to-zinc-500/10", category: "🚀 Espacio" },
  // Trucos mentales
  { question: "¿Qué es más: sumar 1.000 + 40 + 1.000 + 30 + 1.000 + 20 + 1.000 + 10?", answer: "4.100 (¡no 5.000 como muchos dicen!)", emoji: "🧠", theme: "from-purple-500/20 to-pink-500/10", category: "🎭 Trucos" },
  { question: "Escribe el número once mil once cientos once. ¿Cuánto es?", answer: "12.111 (11.000 + 1.100 + 11)", emoji: "✏️", theme: "from-blue-500/20 to-cyan-500/10", category: "🎭 Trucos" },
  { question: "Si tienes una moneda de 50 céntimos y otra de 5 céntimos, y una NO es de 50 céntimos, ¿qué monedas son?", answer: "La que NO es de 50 es la de 5 — la otra SÍ es de 50", emoji: "🪄", theme: "from-violet-500/20 to-indigo-500/10", category: "🎭 Trucos" },
  { question: "¿Cuántos agujeros tiene una camiseta?", answer: "4 — cuello, cintura, y 2 mangas (o más si contamos otros)", emoji: "👕", theme: "from-sky-500/20 to-blue-500/10", category: "🎭 Trucos" },
  { question: "Si un avión se estrella justo en la frontera entre España y Francia, ¿dónde entierran a los supervivientes?", answer: "¡A los supervivientes no se les entierra!", emoji: "✈️", theme: "from-red-500/20 to-rose-500/10", category: "🎭 Trucos" },
  // Naturaleza y medidas
  { question: "Un árbol crece 30 cm al año. ¿Cuánto habrá crecido en una década?", answer: "3 metros (30 × 10)", emoji: "🌳", theme: "from-green-500/20 to-emerald-500/10", category: "🌿 Naturaleza" },
  { question: "Si llueven 5 litros por metro cuadrado y tu jardín mide 20 m², ¿cuántos litros caen?", answer: "100 litros (5 × 20)", emoji: "🌧️", theme: "from-blue-500/20 to-slate-500/10", category: "🌿 Naturaleza" },
  { question: "Una flor tiene 5 pétalos. Si plantas 8 flores, ¿cuántos pétalos hay en tu jardín?", answer: "40 pétalos (8 × 5)", emoji: "🌸", theme: "from-pink-500/20 to-rose-500/10", category: "🌿 Naturaleza" },
  { question: "Un caracol avanza 2 metros por hora. ¿Cuánto tarda en recorrer 10 metros?", answer: "5 horas (10 ÷ 2)", emoji: "🐌", theme: "from-lime-500/20 to-green-500/10", category: "🌿 Naturaleza" },
  { question: "Si una montaña tiene 2.500 metros y subes 400 metros al día, ¿cuántos días tardas?", answer: "Unos 7 días (2.500÷400 ≈ 6.25)", emoji: "⛰️", theme: "from-stone-500/20 to-slate-500/10", category: "🌿 Naturaleza" },
  // Música y arte
  { question: "Un piano tiene 88 teclas: 52 blancas y el resto negras. ¿Cuántas teclas negras hay?", answer: "36 teclas negras (88 - 52)", emoji: "🎹", theme: "from-zinc-500/20 to-gray-500/10", category: "🎵 Música" },
  { question: "Si una canción dura 3 minutos y 30 segundos, ¿cuántos segundos dura en total?", answer: "210 segundos (180 + 30)", emoji: "🎵", theme: "from-fuchsia-500/20 to-pink-500/10", category: "🎵 Música" },
  { question: "Una orquesta tiene 4 secciones. Si cada sección tiene 15 músicos, ¿cuántos músicos hay?", answer: "60 músicos (4 × 15)", emoji: "🎻", theme: "from-amber-500/20 to-orange-500/10", category: "🎵 Música" },
  { question: "Si pintas un cuadro de 40cm × 30cm, ¿cuánto mide su área?", answer: "1.200 cm² (40 × 30)", emoji: "🎨", theme: "from-rose-500/20 to-red-500/10", category: "🎵 Música" },
  { question: "En un pentagrama hay 5 líneas. Si tienes 3 pentagramas, ¿cuántas líneas hay?", answer: "15 líneas (3 × 5)", emoji: "🎼", theme: "from-indigo-500/20 to-blue-500/10", category: "🎵 Música" },
];

export default function VisualRiddleCarousel() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const riddle = RIDDLES[current];
  const total = RIDDLES.length;

  const go = (dir: number) => {
    setRevealed(false);
    setCurrent((p) => (p + dir + total) % total);
  };

  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="font-heading text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 sm:mb-4">
        🎨 Adivinanzas Visuales con Números
      </h2>

      <button
        onClick={() => setOpen(true)}
        className="glass-card neon-border rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 hover:opacity-90 transition-all w-full sm:w-auto"
      >
        <span className="text-2xl sm:text-3xl">🎨</span>
        <div className="text-left">
          <span className="font-heading text-xs sm:text-sm font-bold text-foreground">50 Adivinanzas Visuales</span>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Retos matemáticos con ilustraciones temáticas</p>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 glass-card neon-border rounded-2xl bg-gradient-to-br ${riddle.theme} animate-in fade-in zoom-in-95 duration-200 overflow-y-auto transition-all flex flex-col ${expanded ? "w-[95vw] h-[95vh] max-w-none p-6 sm:p-10" : "w-full max-w-3xl max-h-[90vh] p-5 sm:p-8 md:p-10"}`}
          >
            {/* Close + Expand */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
              <button onClick={() => setExpanded((e) => !e)} className="text-muted-foreground hover:text-foreground transition-colors" title={expanded ? "Reducir" : "Ampliar"}>
                {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
            </div>

            {/* Category badge + counter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pr-10">
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground bg-background/50 rounded-full px-3 py-1">
                {riddle.category}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                {current + 1} / {total}
              </span>
            </div>

            {/* Big emoji illustration */}
            <div className={`flex items-center justify-center ${expanded ? "my-6" : "my-3 sm:my-4"}`}>
              <span className={`select-none drop-shadow-lg animate-in zoom-in-50 duration-500 ${expanded ? "text-[120px] sm:text-[160px]" : "text-6xl sm:text-8xl"}`}>
                {riddle.emoji}
              </span>
            </div>

            {/* Question */}
            <div className={`flex items-center justify-center flex-1 ${expanded ? "min-h-[120px]" : "min-h-[80px] sm:min-h-[100px]"}`}>
              <p className={`text-foreground text-center leading-relaxed font-medium max-w-2xl ${expanded ? "text-xl sm:text-2xl md:text-3xl" : "text-sm sm:text-base md:text-lg"}`}>
                {riddle.question}
              </p>
            </div>

            {/* Answer */}
            <div className="flex justify-center my-4 sm:my-6">
              {revealed ? (
                <div className={`glass-card rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-primary/30 animate-in fade-in zoom-in-95 duration-300 ${expanded ? "px-8 py-6" : ""}`}>
                  <p className={`text-primary font-heading text-center font-bold ${expanded ? "text-lg sm:text-xl md:text-2xl" : "text-sm sm:text-base md:text-lg"}`}>
                    ✅ {riddle.answer}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 font-heading text-xs sm:text-sm font-bold hover:opacity-90 transition-all active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  Resolver
                </button>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-2">
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

            {/* Category dots */}
            <div className="flex justify-center gap-1 mt-4 flex-wrap">
              {RIDDLES.map((_, i) => (
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
