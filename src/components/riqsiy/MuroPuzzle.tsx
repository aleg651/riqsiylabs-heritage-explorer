import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Award, Coins, Gamepad2, RotateCcw } from "lucide-react";
import { useProgreso } from "@/lib/progress";

/** Nivel 1: 6 huecos poligonales irregulares en un muro inca. */
interface Pieza {
  id: string;
  /** polígono en porcentaje del bounding box de la pieza */
  puntos: string;
  /** posición y tamaño del hueco dentro del muro (en %) */
  hueco: { x: number; y: number; w: number; h: number };
}

const PIEZAS: Pieza[] = [
  {
    id: "p1",
    puntos: "2% 18%, 30% 0%, 78% 6%, 100% 44%, 74% 96%, 22% 100%, 0% 62%",
    hueco: { x: 4, y: 8, w: 27, h: 40 },
  },
  {
    id: "p2",
    puntos: "0% 30%, 26% 2%, 100% 0%, 92% 58%, 100% 92%, 40% 100%, 6% 74%",
    hueco: { x: 34, y: 5, w: 30, h: 34 },
  },
  {
    id: "p3",
    puntos: "8% 0%, 100% 14%, 88% 60%, 96% 100%, 30% 92%, 0% 52%",
    hueco: { x: 67, y: 10, w: 28, h: 38 },
  },
  {
    id: "p4",
    puntos: "0% 12%, 44% 0%, 100% 26%, 82% 74%, 100% 100%, 26% 96%, 10% 56%",
    hueco: { x: 5, y: 52, w: 32, h: 40 },
  },
  {
    id: "p5",
    puntos: "14% 4%, 86% 0%, 100% 52%, 66% 100%, 8% 88%, 0% 34%",
    hueco: { x: 40, y: 45, w: 24, h: 45 },
  },
  {
    id: "p6",
    puntos: "0% 24%, 34% 0%, 100% 8%, 88% 46%, 100% 84%, 36% 100%, 4% 70%",
    hueco: { x: 67, y: 54, w: 29, h: 38 },
  },
];

/** bloques decorativos del muro (piedra ya colocada) */
const BLOQUES = [
  { x: 0, y: 0, w: 18, h: 22, p: "0% 20%, 24% 0%, 100% 8%, 92% 78%, 30% 100%, 0% 66%" },
  { x: 20, y: 0, w: 22, h: 14, p: "0% 30%, 40% 0%, 100% 12%, 88% 100%, 22% 92%" },
  { x: 44, y: 0, w: 26, h: 12, p: "0% 16%, 60% 0%, 100% 40%, 82% 100%, 10% 88%" },
  { x: 72, y: 0, w: 28, h: 16, p: "6% 0%, 100% 18%, 90% 92%, 26% 100%, 0% 46%" },
  { x: 0, y: 76, w: 22, h: 24, p: "0% 12%, 36% 0%, 100% 26%, 88% 100%, 18% 92%" },
  { x: 24, y: 84, w: 30, h: 16, p: "0% 24%, 44% 0%, 100% 20%, 92% 100%, 20% 88%" },
  { x: 58, y: 88, w: 20, h: 12, p: "0% 18%, 50% 0%, 100% 44%, 78% 100%, 12% 82%" },
  { x: 80, y: 84, w: 20, h: 16, p: "4% 8%, 100% 0%, 92% 86%, 40% 100%, 0% 54%" },
  { x: 30, y: 40, w: 8, h: 20, p: "0% 22%, 50% 0%, 100% 30%, 82% 100%, 14% 86%" },
];

const MONEDAS_PIEZA = 20;
const MONEDAS_NIVEL = 50;
const TOTAL = PIEZAS.length * MONEDAS_PIEZA + MONEDAS_NIVEL;

type Estado = "libre" | "colocada";

export function MuroPuzzle() {
  const { completarJuego, coins } = useProgreso();
  const muroRef = useRef<HTMLDivElement>(null);
  const [colocadas, setColocadas] = useState<string[]>([]);
  const [orden, setOrden] = useState<Pieza[]>(PIEZAS);
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acierto, setAcierto] = useState<string | null>(null);
  const [ganadas, setGanadas] = useState(0);

  const completo = colocadas.length === PIEZAS.length;

  useEffect(() => {
    // mezcla inicial de la bandeja para que no coincida con el orden del muro
    setOrden([...PIEZAS].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (completo) {
      setGanadas(PIEZAS.length * MONEDAS_PIEZA + MONEDAS_NIVEL);
      completarJuego("encaja-la-piedra", TOTAL);
    }
  }, [completo, completarJuego]);

  const soltar = useCallback(
    (pieza: Pieza, clientX: number, clientY: number) => {
      const muro = muroRef.current?.getBoundingClientRect();
      setArrastrando(null);
      setPos(null);
      if (!muro) return;
      const px = ((clientX - muro.left) / muro.width) * 100;
      const py = ((clientY - muro.top) / muro.height) * 100;
      const cx = pieza.hueco.x + pieza.hueco.w / 2;
      const cy = pieza.hueco.y + pieza.hueco.h / 2;
      const dentro = Math.abs(px - cx) < pieza.hueco.w * 0.75 && Math.abs(py - cy) < pieza.hueco.h * 0.75;
      if (dentro) {
        setColocadas((c) => (c.includes(pieza.id) ? c : [...c, pieza.id]));
        setAcierto(pieza.id);
        setGanadas((g) => g + MONEDAS_PIEZA);
        window.setTimeout(() => setAcierto(null), 700);
      } else {
        setError(pieza.id);
        window.setTimeout(() => setError(null), 500);
      }
    },
    [],
  );

  const reiniciar = () => {
    setColocadas([]);
    setGanadas(0);
    setOrden([...PIEZAS].sort(() => Math.random() - 0.5));
  };

  const progreso = Math.round((colocadas.length / PIEZAS.length) * 100);

  return (
    <div className="space-y-6">
      {/* barra superior */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span>Muro reconstruido</span>
            <span>
              {colocadas.length}/{PIEZAS.length}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-accent transition-all duration-500"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-gold/25 px-3 py-1.5 text-sm font-semibold">
          <Coins className="h-4 w-4" /> +{ganadas}
        </span>
        <button
          type="button"
          onClick={reiniciar}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
        </button>
      </div>

      {completo ? (
        <PantallaFinal ganadas={ganadas} coins={coins} onJugar={reiniciar} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Arrastra cada piedra al hueco cuya forma coincida. Observa los ángulos: cada bloque inca tenía un único
          lugar posible.
        </p>
      )}

      {/* MURO */}
      <div
        ref={muroRef}
        className="shadow-stone relative aspect-[3/2] w-full overflow-hidden rounded-2xl border-2 border-border"
        style={{
          background:
            "linear-gradient(160deg, hsl(30 12% 26%), hsl(28 10% 18%))",
        }}
      >
        {/* piedras ya existentes del muro */}
        {BLOQUES.map((b, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              clipPath: `polygon(${b.p})`,
              background: "linear-gradient(150deg, hsl(30 10% 55%), hsl(28 9% 38%))",
              boxShadow: "inset 0 2px 6px rgba(255,255,255,.16)",
            }}
          />
        ))}

        {/* huecos */}
        {PIEZAS.map((p) => {
          const puesta = colocadas.includes(p.id);
          return (
            <div
              key={p.id}
              className={`absolute transition-all duration-500 ${acierto === p.id ? "animate-scale-in" : ""}`}
              style={{
                left: `${p.hueco.x}%`,
                top: `${p.hueco.y}%`,
                width: `${p.hueco.w}%`,
                height: `${p.hueco.h}%`,
                clipPath: `polygon(${p.puntos})`,
                background: puesta
                  ? "linear-gradient(150deg, hsl(38 45% 68%), hsl(28 35% 44%))"
                  : "linear-gradient(150deg, hsl(28 14% 12%), hsl(28 14% 8%))",
                boxShadow: puesta
                  ? "inset 0 2px 8px rgba(255,255,255,.28)"
                  : "inset 0 0 14px rgba(0,0,0,.7)",
              }}
            />
          );
        })}
        {acierto && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="animate-scale-in rounded-full bg-jade/90 px-4 py-1.5 text-sm font-bold text-background">
              ¡Encajó! +{MONEDAS_PIEZA}
            </span>
          </div>
        )}
      </div>

      {/* BANDEJA DE PIEDRAS */}
      <div className="rounded-2xl border border-border bg-secondary/40 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Piedras talladas
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {orden.map((p) => {
            const puesta = colocadas.includes(p.id);
            if (puesta) return null;
            const estaArrastrando = arrastrando === p.id;
            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                aria-label={`Piedra ${p.id}`}
                onPointerDown={(e) => {
                  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                  setArrastrando(p.id);
                  setPos({ x: e.clientX, y: e.clientY });
                }}
                onPointerMove={(e) => {
                  if (arrastrando === p.id) setPos({ x: e.clientX, y: e.clientY });
                }}
                onPointerUp={(e) => {
                  if (arrastrando === p.id) soltar(p, e.clientX, e.clientY);
                }}
                onPointerCancel={() => {
                  setArrastrando(null);
                  setPos(null);
                }}
                className={`relative cursor-grab select-none transition-transform duration-200 ${
                  error === p.id ? "animate-[pulse_.2s_ease-in-out_2] ring-2 ring-destructive" : ""
                } ${estaArrastrando ? "cursor-grabbing opacity-40" : "hover:scale-105"}`}
                style={{ width: 92, height: 78, touchAction: "none" }}
              >
                <PiedraForma puntos={p.puntos} />
              </div>
            );
          })}
          {colocadas.length === PIEZAS.length && (
            <p className="text-sm text-muted-foreground">No quedan piedras: el muro está completo.</p>
          )}
        </div>
      </div>

      {/* fantasma arrastrado */}
      {arrastrando && pos && (
        <div
          className="pointer-events-none fixed z-50"
          style={{ left: pos.x - 46, top: pos.y - 39, width: 92, height: 78 }}
        >
          <PiedraForma puntos={PIEZAS.find((p) => p.id === arrastrando)!.puntos} destacada />
        </div>
      )}
    </div>
  );
}

function PiedraForma({ puntos, destacada }: { puntos: string; destacada?: boolean }) {
  return (
    <div
      className="h-full w-full"
      style={{
        clipPath: `polygon(${puntos})`,
        background: destacada
          ? "linear-gradient(150deg, hsl(38 55% 72%), hsl(28 38% 42%))"
          : "linear-gradient(150deg, hsl(32 20% 66%), hsl(28 16% 42%))",
        boxShadow: "inset 0 2px 8px rgba(255,255,255,.25), 0 6px 14px rgba(0,0,0,.35)",
      }}
    />
  );
}

function PantallaFinal({
  ganadas,
  coins,
  onJugar,
}: {
  ganadas: number;
  coins: number;
  onJugar: () => void;
}) {
  const total = useMemo(() => ganadas, [ganadas]);
  return (
    <div className="animate-scale-in rounded-2xl border-2 border-accent bg-card p-6 text-center">
      <h2 className="font-display text-3xl">¡Muro reconstruido!</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        Has aprendido cómo el encaje de piedras ayudaba a construir estructuras resistentes.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-gold/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">RIQSI-COINS</p>
          <p className="font-display text-2xl">+{total}</p>
        </div>
        <div className="rounded-xl bg-secondary p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Progreso</p>
          <p className="font-display text-2xl">100%</p>
        </div>
        <div className="rounded-xl bg-jade/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Insignia</p>
          <p className="inline-flex items-center gap-1.5 font-display text-lg">
            <Award className="h-4 w-4" /> Maestro de la Piedra
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Saldo disponible: 🟡 {coins}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onJugar}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-transform hover:scale-105"
        >
          <RotateCcw className="h-4 w-4" /> Jugar de nuevo
        </button>
        <Link
          to="/juegos"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-semibold transition-colors hover:bg-secondary"
        >
          <Gamepad2 className="h-4 w-4" /> Volver a minijuegos
        </Link>
      </div>
    </div>
  );
}
