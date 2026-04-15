import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

interface Riddle {
  question: string;
  answer: string;
  level: number;
}

const RIDDLES: Riddle[] = [
  // Nivel 1: Formas de los números
  { question: "Redondo soy y es cosa anunciada, que a la derecha algo valgo, pero a la izquierda nada. ¿Quién soy?", answer: "El 0", level: 1 },
  { question: "Soy un palito muy derechito, y en la frente tengo un moñito. ¿Quién soy?", answer: "El 1", level: 1 },
  { question: "Tengo forma de patito, arqueado y muy bonito. ¿Qué número soy?", answer: "El 2", level: 1 },
  { question: "Tengo forma de serpiente, pero no muerdo a la gente. ¿Quién soy?", answer: "El 3", level: 1 },
  { question: "Soy como una sillita al revés, ¿adivinas qué número es?", answer: "El 4", level: 1 },
  { question: "Parezco un ganchito de pescar, o la mitad de unas tijeras al cortar. ¿Quién soy?", answer: "El 5", level: 1 },
  { question: "Parezco un silbato, o un caracolito. ¿Qué número soy?", answer: "El 6", level: 1 },
  { question: "Parezco un bastón, pero sin abuelito. ¿Qué número soy?", answer: "El 7", level: 1 },
  { question: "Parezco un reloj de arena o dos rosquetes pegados. ¿Quién soy?", answer: "El 8", level: 1 },
  { question: "Soy un globito atado a un hilo. ¿Qué número soy?", answer: "El 9", level: 1 },
  // Nivel 2: Lógica básica
  { question: "Empiezo por uno y termino en cero. ¿Qué número entero soy?", answer: "El 10", level: 2 },
  { question: "Cuéntate las manos o cuéntate los pies y enseguida sabrás qué número es.", answer: "El 10 (o el 20)", level: 2 },
  { question: "¿Qué número tiene el mismo número de letras que el valor que expresa?", answer: "El 5 — C-I-N-C-O tiene 5 letras", level: 2 },
  { question: "Soy más de uno sin llegar a tres, y llego a cuatro cuando dos me des.", answer: "El 2", level: 2 },
  { question: "Si me sumas a mí mismo, siempre daré un número par. ¿Quién soy?", answer: "Cualquier número entero (duplicar siempre da par)", level: 2 },
  { question: "¿Qué número impar, si le quitas una letra se vuelve par?", answer: "UNO → quitas la U → NO", level: 2 },
  { question: "Si me divides entre cualquier número, siempre daré el mismo resultado. ¿Quién soy?", answer: "El 0", level: 2 },
  { question: "Soy el primer número primo impar. ¿Quién soy?", answer: "El 3", level: 2 },
  { question: "Soy el único número primo par. ¿Quién soy?", answer: "El 2", level: 2 },
  { question: "Soy el resultado de multiplicar cualquier número por cero. ¿Quién soy?", answer: "El 0", level: 2 },
  // Nivel 3: Para los más despiertos
  { question: "Dos docenas y media de horas. ¿Qué número es?", answer: "60", level: 3 },
  { question: "¿Cuál es la mitad de dos más dos?", answer: "3 — La mitad de 2 es 1, más 2 son 3", level: 3 },
  { question: "Si un coche tiene 4 ruedas y un camión tiene 6, ¿cuántas ruedas tienen 2 coches y 1 camión juntos?", answer: "14 (8 + 6)", level: 3 },
  { question: "Tengo 3 manzanas. Si te doy 2, ¿cuántas manzanas tienes?", answer: "2 — las que te he dado", level: 3 },
  { question: "¿Qué número resulta si multiplicas todos los números del teclado de un teléfono?", answer: "0 — porque uno de los números es el cero", level: 3 },
  { question: "Si un pastor tiene 17 ovejas y se le escapan todas menos 9, ¿cuántas le quedan?", answer: "9 — las que no se escaparon", level: 3 },
  { question: "¿Cuántos meses del año tienen 28 días?", answer: "Los 12 — todos tienen al menos 28 días", level: 3 },
  { question: "Un ladrillo pesa un kilo más medio ladrillo. ¿Cuánto pesa el ladrillo?", answer: "2 kilos", level: 3 },
  { question: "Si tienes 5 velas encendidas y soplas 2, ¿cuántas velas tienes?", answer: "5 — no han desaparecido, solo se apagaron 2", level: 3 },
  { question: "¿Qué pesa más: un kilo de hierro o un kilo de plumas?", answer: "Pesan lo mismo — ambos pesan un kilo", level: 3 },
  // Nivel 4: Extras divertidos
  { question: "Soy el número que si me pones de cabeza valgo lo mismo. ¿Quién soy?", answer: "El 0 (o el 8)", level: 4 },
  { question: "Tres gatos en tres esquinas, cada gato ve dos gatos. ¿Cuántos gatos hay?", answer: "3 gatos", level: 4 },
  { question: "Un padre y un hijo van en coche. Tienen un accidente. El padre muere. Llevan al hijo al hospital y el cirujano dice: 'No puedo operarle, es mi hijo'. ¿Cómo es posible?", answer: "El cirujano es su madre", level: 4 },
  { question: "¿Cuántas veces se puede restar 5 de 25?", answer: "Una sola vez — después ya no es 25", level: 4 },
  { question: "Si hay 3 peces en un estanque y uno se ahoga, ¿cuántos quedan?", answer: "3 — los peces no se ahogan", level: 4 },
  { question: "Dos padres y dos hijos van a pescar y pescan 3 peces. Cada uno se lleva uno. ¿Cómo puede ser?", answer: "Son abuelo, padre e hijo — 3 personas", level: 4 },
  { question: "Tengo ciudades pero no casas, tengo bosques pero no árboles, tengo agua pero no peces. ¿Quién soy?", answer: "Un mapa", level: 4 },
  { question: "¿Qué número multiplicado por sí mismo da 12345678987654321?", answer: "111.111.111 × 111.111.111", level: 4 },
  { question: "Si 5 máquinas hacen 5 piezas en 5 minutos, ¿cuánto tardan 100 máquinas en hacer 100 piezas?", answer: "5 minutos", level: 4 },
  { question: "¿Cuántos segundos tiene un año?", answer: "12 — el 2 de enero, el 2 de febrero…", level: 4 },
  { question: "Un caracol sube por un pozo de 10 metros. Cada día sube 3 metros y por la noche baja 2. ¿Cuántos días tarda en salir?", answer: "8 días — el día 8 llega a 10m y sale", level: 4 },
  { question: "Si divido 30 entre ½ y le sumo 10, ¿cuánto da?", answer: "70 — dividir entre ½ es multiplicar por 2: 60 + 10", level: 4 },
  { question: "¿Cuántos huevos puedes poner en una cesta vacía?", answer: "Uno — después ya no está vacía", level: 4 },
  { question: "Soy un número de dos cifras. Mi cifra de las decenas es el triple de la de las unidades. La suma de mis cifras es 8. ¿Quién soy?", answer: "62 — 6 es triple de 2, y 6+2=8", level: 4 },
  { question: "Si en una carrera adelantas al segundo, ¿en qué posición quedas?", answer: "Segundo — ocupas su lugar", level: 4 },
  { question: "¿Cuántos triángulos puedes ver en una estrella de 5 puntas?", answer: "10 triángulos", level: 4 },
  { question: "¿Qué número romano representa la mitad de doce?", answer: "VII — pero si partes el XII por la mitad horizontalmente, obtienes VII arriba", level: 4 },
  { question: "Un reloj da 6 campanadas en 5 segundos. ¿Cuánto tarda en dar 12 campanadas?", answer: "11 segundos — hay 1 segundo entre cada campanada", level: 4 },
  { question: "¿Cuántas caras tiene un cubo?", answer: "6 caras", level: 4 },
  { question: "Soy menor que 100 y mayor que 50. Si me divides entre 7 no hay resto. Mis cifras suman 14. ¿Quién soy?", answer: "77 — 77÷7=11 y 7+7=14", level: 4 },
];

const LEVEL_LABELS: Record<number, string> = {
  1: "🔢 Nivel 1 — Formas de los números",
  2: "🧠 Nivel 2 — Para pensar un poco",
  3: "🚀 Nivel 3 — Para los más despiertos",
  4: "🌟 Nivel 4 — Retos extra",
};

const LEVEL_COLORS: Record<number, string> = {
  1: "from-green-500/20 to-emerald-500/10",
  2: "from-blue-500/20 to-cyan-500/10",
  3: "from-orange-500/20 to-amber-500/10",
  4: "from-purple-500/20 to-pink-500/10",
};

export default function RiddleCarousel() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const riddle = RIDDLES[current];
  const total = RIDDLES.length;

  const go = (dir: number) => {
    setRevealed(false);
    setCurrent((p) => (p + dir + total) % total);
  };

  return (
    <div className="mb-8 sm:mb-10">
      <h2 className="font-heading text-xs sm:text-sm uppercase tracking-widest text-primary mb-3 sm:mb-4">
        🎯 Adivinanzas con Números
      </h2>

      <button
        onClick={() => setOpen(true)}
        className="glass-card neon-border rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 hover:opacity-90 transition-all w-full sm:w-auto"
      >
        <span className="text-2xl sm:text-3xl">🎯</span>
        <div className="text-left">
          <span className="font-heading text-xs sm:text-sm font-bold text-foreground">50 Adivinanzas con Números</span>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Pon a prueba tu ingenio con acertijos matemáticos</p>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" onClick={() => setOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 w-full max-w-3xl glass-card neon-border rounded-2xl p-5 sm:p-8 md:p-10 bg-gradient-to-br ${LEVEL_COLORS[riddle.level]} animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto`}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-lg leading-none"
            >
              ✕
            </button>

            {/* Level badge + counter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pr-6">
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground bg-background/50 rounded-full px-3 py-1">
                {LEVEL_LABELS[riddle.level]}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                {current + 1} / {total}
              </span>
            </div>

            {/* Question */}
            <div className="min-h-[100px] sm:min-h-[120px] flex items-center justify-center">
              <p className="text-sm sm:text-base md:text-lg text-foreground text-center leading-relaxed font-medium">
                {riddle.question}
              </p>
            </div>

            {/* Answer */}
            <div className="flex justify-center my-4 sm:my-6">
              {revealed ? (
                <div className="glass-card rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-primary/30 animate-in fade-in zoom-in-95 duration-300">
                  <p className="text-primary font-heading text-sm sm:text-base md:text-lg text-center font-bold">
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
              <button
                onClick={() => go(-1)}
                className="flex items-center gap-1 glass-card rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:opacity-80 transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {revealed && (
                <button
                  onClick={() => setRevealed(false)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <EyeOff className="w-3 h-3" />
                  Ocultar
                </button>
              )}

              <button
                onClick={() => go(1)}
                className="flex items-center gap-1 glass-card rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:opacity-80 transition-all active:scale-95"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dots */}
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
