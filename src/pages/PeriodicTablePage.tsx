import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Element {
  z: number;
  sym: string;
  name: string;
  mass: string;
  category: string;
  group: number;
  period: number;
  color: string;
}

const ELEMENTS: Element[] = [
  { z:1, sym:"H", name:"Hidrógeno", mass:"1.008", category:"No metal", group:1, period:1, color:"bg-green-500/30" },
  { z:2, sym:"He", name:"Helio", mass:"4.003", category:"Gas noble", group:18, period:1, color:"bg-purple-500/30" },
  { z:3, sym:"Li", name:"Litio", mass:"6.941", category:"Alcalino", group:1, period:2, color:"bg-red-500/30" },
  { z:4, sym:"Be", name:"Berilio", mass:"9.012", category:"Alcalinotérreo", group:2, period:2, color:"bg-orange-500/30" },
  { z:5, sym:"B", name:"Boro", mass:"10.81", category:"Metaloide", group:13, period:2, color:"bg-teal-500/30" },
  { z:6, sym:"C", name:"Carbono", mass:"12.01", category:"No metal", group:14, period:2, color:"bg-green-500/30" },
  { z:7, sym:"N", name:"Nitrógeno", mass:"14.01", category:"No metal", group:15, period:2, color:"bg-green-500/30" },
  { z:8, sym:"O", name:"Oxígeno", mass:"16.00", category:"No metal", group:16, period:2, color:"bg-green-500/30" },
  { z:9, sym:"F", name:"Flúor", mass:"19.00", category:"Halógeno", group:17, period:2, color:"bg-yellow-500/30" },
  { z:10, sym:"Ne", name:"Neón", mass:"20.18", category:"Gas noble", group:18, period:2, color:"bg-purple-500/30" },
  { z:11, sym:"Na", name:"Sodio", mass:"22.99", category:"Alcalino", group:1, period:3, color:"bg-red-500/30" },
  { z:12, sym:"Mg", name:"Magnesio", mass:"24.31", category:"Alcalinotérreo", group:2, period:3, color:"bg-orange-500/30" },
  { z:13, sym:"Al", name:"Aluminio", mass:"26.98", category:"Metal", group:13, period:3, color:"bg-blue-500/30" },
  { z:14, sym:"Si", name:"Silicio", mass:"28.09", category:"Metaloide", group:14, period:3, color:"bg-teal-500/30" },
  { z:15, sym:"P", name:"Fósforo", mass:"30.97", category:"No metal", group:15, period:3, color:"bg-green-500/30" },
  { z:16, sym:"S", name:"Azufre", mass:"32.07", category:"No metal", group:16, period:3, color:"bg-green-500/30" },
  { z:17, sym:"Cl", name:"Cloro", mass:"35.45", category:"Halógeno", group:17, period:3, color:"bg-yellow-500/30" },
  { z:18, sym:"Ar", name:"Argón", mass:"39.95", category:"Gas noble", group:18, period:3, color:"bg-purple-500/30" },
  { z:19, sym:"K", name:"Potasio", mass:"39.10", category:"Alcalino", group:1, period:4, color:"bg-red-500/30" },
  { z:20, sym:"Ca", name:"Calcio", mass:"40.08", category:"Alcalinotérreo", group:2, period:4, color:"bg-orange-500/30" },
  { z:21, sym:"Sc", name:"Escandio", mass:"44.96", category:"Transición", group:3, period:4, color:"bg-sky-500/30" },
  { z:22, sym:"Ti", name:"Titanio", mass:"47.87", category:"Transición", group:4, period:4, color:"bg-sky-500/30" },
  { z:23, sym:"V", name:"Vanadio", mass:"50.94", category:"Transición", group:5, period:4, color:"bg-sky-500/30" },
  { z:24, sym:"Cr", name:"Cromo", mass:"52.00", category:"Transición", group:6, period:4, color:"bg-sky-500/30" },
  { z:25, sym:"Mn", name:"Manganeso", mass:"54.94", category:"Transición", group:7, period:4, color:"bg-sky-500/30" },
  { z:26, sym:"Fe", name:"Hierro", mass:"55.85", category:"Transición", group:8, period:4, color:"bg-sky-500/30" },
  { z:27, sym:"Co", name:"Cobalto", mass:"58.93", category:"Transición", group:9, period:4, color:"bg-sky-500/30" },
  { z:28, sym:"Ni", name:"Níquel", mass:"58.69", category:"Transición", group:10, period:4, color:"bg-sky-500/30" },
  { z:29, sym:"Cu", name:"Cobre", mass:"63.55", category:"Transición", group:11, period:4, color:"bg-sky-500/30" },
  { z:30, sym:"Zn", name:"Zinc", mass:"65.38", category:"Transición", group:12, period:4, color:"bg-sky-500/30" },
  { z:31, sym:"Ga", name:"Galio", mass:"69.72", category:"Metal", group:13, period:4, color:"bg-blue-500/30" },
  { z:32, sym:"Ge", name:"Germanio", mass:"72.63", category:"Metaloide", group:14, period:4, color:"bg-teal-500/30" },
  { z:33, sym:"As", name:"Arsénico", mass:"74.92", category:"Metaloide", group:15, period:4, color:"bg-teal-500/30" },
  { z:34, sym:"Se", name:"Selenio", mass:"78.97", category:"No metal", group:16, period:4, color:"bg-green-500/30" },
  { z:35, sym:"Br", name:"Bromo", mass:"79.90", category:"Halógeno", group:17, period:4, color:"bg-yellow-500/30" },
  { z:36, sym:"Kr", name:"Kriptón", mass:"83.80", category:"Gas noble", group:18, period:4, color:"bg-purple-500/30" },
  { z:37, sym:"Rb", name:"Rubidio", mass:"85.47", category:"Alcalino", group:1, period:5, color:"bg-red-500/30" },
  { z:38, sym:"Sr", name:"Estroncio", mass:"87.62", category:"Alcalinotérreo", group:2, period:5, color:"bg-orange-500/30" },
  { z:39, sym:"Y", name:"Itrio", mass:"88.91", category:"Transición", group:3, period:5, color:"bg-sky-500/30" },
  { z:40, sym:"Zr", name:"Circonio", mass:"91.22", category:"Transición", group:4, period:5, color:"bg-sky-500/30" },
  { z:41, sym:"Nb", name:"Niobio", mass:"92.91", category:"Transición", group:5, period:5, color:"bg-sky-500/30" },
  { z:42, sym:"Mo", name:"Molibdeno", mass:"95.95", category:"Transición", group:6, period:5, color:"bg-sky-500/30" },
  { z:43, sym:"Tc", name:"Tecnecio", mass:"(98)", category:"Transición", group:7, period:5, color:"bg-sky-500/30" },
  { z:44, sym:"Ru", name:"Rutenio", mass:"101.1", category:"Transición", group:8, period:5, color:"bg-sky-500/30" },
  { z:45, sym:"Rh", name:"Rodio", mass:"102.9", category:"Transición", group:9, period:5, color:"bg-sky-500/30" },
  { z:46, sym:"Pd", name:"Paladio", mass:"106.4", category:"Transición", group:10, period:5, color:"bg-sky-500/30" },
  { z:47, sym:"Ag", name:"Plata", mass:"107.9", category:"Transición", group:11, period:5, color:"bg-sky-500/30" },
  { z:48, sym:"Cd", name:"Cadmio", mass:"112.4", category:"Transición", group:12, period:5, color:"bg-sky-500/30" },
  { z:49, sym:"In", name:"Indio", mass:"114.8", category:"Metal", group:13, period:5, color:"bg-blue-500/30" },
  { z:50, sym:"Sn", name:"Estaño", mass:"118.7", category:"Metal", group:14, period:5, color:"bg-blue-500/30" },
  { z:51, sym:"Sb", name:"Antimonio", mass:"121.8", category:"Metaloide", group:15, period:5, color:"bg-teal-500/30" },
  { z:52, sym:"Te", name:"Telurio", mass:"127.6", category:"Metaloide", group:16, period:5, color:"bg-teal-500/30" },
  { z:53, sym:"I", name:"Yodo", mass:"126.9", category:"Halógeno", group:17, period:5, color:"bg-yellow-500/30" },
  { z:54, sym:"Xe", name:"Xenón", mass:"131.3", category:"Gas noble", group:18, period:5, color:"bg-purple-500/30" },
  { z:55, sym:"Cs", name:"Cesio", mass:"132.9", category:"Alcalino", group:1, period:6, color:"bg-red-500/30" },
  { z:56, sym:"Ba", name:"Bario", mass:"137.3", category:"Alcalinotérreo", group:2, period:6, color:"bg-orange-500/30" },
  { z:57, sym:"La", name:"Lantano", mass:"138.9", category:"Lantánido", group:3, period:6, color:"bg-pink-500/30" },
  { z:72, sym:"Hf", name:"Hafnio", mass:"178.5", category:"Transición", group:4, period:6, color:"bg-sky-500/30" },
  { z:73, sym:"Ta", name:"Tantalio", mass:"180.9", category:"Transición", group:5, period:6, color:"bg-sky-500/30" },
  { z:74, sym:"W", name:"Wolframio", mass:"183.8", category:"Transición", group:6, period:6, color:"bg-sky-500/30" },
  { z:75, sym:"Re", name:"Renio", mass:"186.2", category:"Transición", group:7, period:6, color:"bg-sky-500/30" },
  { z:76, sym:"Os", name:"Osmio", mass:"190.2", category:"Transición", group:8, period:6, color:"bg-sky-500/30" },
  { z:77, sym:"Ir", name:"Iridio", mass:"192.2", category:"Transición", group:9, period:6, color:"bg-sky-500/30" },
  { z:78, sym:"Pt", name:"Platino", mass:"195.1", category:"Transición", group:10, period:6, color:"bg-sky-500/30" },
  { z:79, sym:"Au", name:"Oro", mass:"197.0", category:"Transición", group:11, period:6, color:"bg-sky-500/30" },
  { z:80, sym:"Hg", name:"Mercurio", mass:"200.6", category:"Transición", group:12, period:6, color:"bg-sky-500/30" },
  { z:81, sym:"Tl", name:"Talio", mass:"204.4", category:"Metal", group:13, period:6, color:"bg-blue-500/30" },
  { z:82, sym:"Pb", name:"Plomo", mass:"207.2", category:"Metal", group:14, period:6, color:"bg-blue-500/30" },
  { z:83, sym:"Bi", name:"Bismuto", mass:"209.0", category:"Metal", group:15, period:6, color:"bg-blue-500/30" },
  { z:84, sym:"Po", name:"Polonio", mass:"(209)", category:"Metaloide", group:16, period:6, color:"bg-teal-500/30" },
  { z:85, sym:"At", name:"Astato", mass:"(210)", category:"Halógeno", group:17, period:6, color:"bg-yellow-500/30" },
  { z:86, sym:"Rn", name:"Radón", mass:"(222)", category:"Gas noble", group:18, period:6, color:"bg-purple-500/30" },
  { z:87, sym:"Fr", name:"Francio", mass:"(223)", category:"Alcalino", group:1, period:7, color:"bg-red-500/30" },
  { z:88, sym:"Ra", name:"Radio", mass:"(226)", category:"Alcalinotérreo", group:2, period:7, color:"bg-orange-500/30" },
  { z:89, sym:"Ac", name:"Actinio", mass:"(227)", category:"Actínido", group:3, period:7, color:"bg-rose-500/30" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Alcalino": "bg-red-500/40",
  "Alcalinotérreo": "bg-orange-500/40",
  "Transición": "bg-sky-500/40",
  "Metal": "bg-blue-500/40",
  "Metaloide": "bg-teal-500/40",
  "No metal": "bg-green-500/40",
  "Halógeno": "bg-yellow-500/40",
  "Gas noble": "bg-purple-500/40",
  "Lantánido": "bg-pink-500/40",
  "Actínido": "bg-rose-500/40",
};

const PeriodicTablePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Element | null>(null);

  // Build grid: 7 periods × 18 groups
  const grid: (Element | null)[][] = Array.from({ length: 7 }, () => Array(18).fill(null));
  ELEMENTS.forEach((el) => {
    if (el.period >= 1 && el.period <= 7 && el.group >= 1 && el.group <= 18) {
      grid[el.period - 1][el.group - 1] = el;
    }
  });

  return (
    <div className="min-h-screen p-4">
      <header className="flex items-center justify-between py-4 max-w-7xl mx-auto">
        <button onClick={() => navigate("/lobby")} className="text-muted-foreground hover:text-foreground transition-colors font-heading text-sm">
          ← Volver a juegos
        </button>
        <h1 className="font-heading text-xl font-bold neon-text text-primary">⚗️ Tabla Periódica Interactiva</h1>
        <div className="w-20" />
      </header>

      {/* Legend */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-wrap gap-2 justify-center">
        {Object.entries(CATEGORY_COLORS).map(([cat, clr]) => (
          <span key={cat} className={`${clr} rounded-md px-2 py-0.5 text-[10px] font-semibold text-foreground`}>{cat}</span>
        ))}
      </div>

      {/* Table Grid */}
      <div className="max-w-7xl mx-auto overflow-x-auto pb-4">
        <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: "repeat(18, minmax(52px, 1fr))" }}>
          {grid.map((row, ri) =>
            row.map((el, ci) => {
              if (!el) {
                return <div key={`${ri}-${ci}`} className="w-[52px] h-[52px]" />;
              }
              const isSelected = selected?.z === el.z;
              return (
                <button
                  key={el.z}
                  onClick={() => setSelected(isSelected ? null : el)}
                  className={`w-[52px] h-[52px] rounded-md flex flex-col items-center justify-center transition-all border ${
                    isSelected ? "neon-border scale-110 z-10" : "border-border/50 hover:border-primary/50"
                  } ${CATEGORY_COLORS[el.category] || "bg-secondary"}`}
                >
                  <span className="text-[9px] text-muted-foreground leading-none">{el.z}</span>
                  <span className="text-sm font-bold text-foreground leading-none">{el.sym}</span>
                  <span className="text-[7px] text-muted-foreground leading-none truncate w-full text-center">{el.name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="max-w-md mx-auto glass-card neon-border rounded-xl p-6 mt-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-4xl font-heading font-black text-primary">{selected.sym}</span>
              <h2 className="font-heading text-xl font-bold text-foreground">{selected.name}</h2>
            </div>
            <span className={`${CATEGORY_COLORS[selected.category]} rounded-lg px-3 py-1 text-xs font-semibold text-foreground`}>
              {selected.category}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="glass-card rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Número atómico</p>
              <p className="font-bold text-foreground">{selected.z}</p>
            </div>
            <div className="glass-card rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Masa atómica</p>
              <p className="font-bold text-foreground">{selected.mass}</p>
            </div>
            <div className="glass-card rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Grupo</p>
              <p className="font-bold text-foreground">{selected.group}</p>
            </div>
            <div className="glass-card rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Periodo</p>
              <p className="font-bold text-foreground">{selected.period}</p>
            </div>
          </div>
          <button onClick={() => setSelected(null)} className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cerrar ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default PeriodicTablePage;
