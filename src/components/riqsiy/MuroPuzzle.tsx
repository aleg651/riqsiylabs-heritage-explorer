import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Award, Coins, Gamepad2, RotateCcw, Trophy } from "lucide-react";
import { useProgreso } from "@/lib/progress";
import heroImg from "@/assets/hero-sacsayhuaman.jpg";
import stoneImg from "@/assets/site-hatunrumiyoc.jpg";


/**
 * PIRQA RIQSIY — rompecabezas estilo "Block Blast" con sillares incas.
 * Réplica de la app PIRQA del mismo autor, integrada al sistema de
 * progreso y RIQSI-COINS de RIQSIY.
 *
 * Arrastra la piedra al muro · o tócala y elige el nicho.
 * Completa hileras o columnas para consolidar el tramo y sumar puntos.
 */

const SIZE = 8;
const MEJOR_KEY = "riqsiy-pirqa-mejor";

type Celda = [number, number]; // [fila, columna] relativa
interface Pieza {
  id: number;
  celdas: Celda[];
  color: string; // gradiente css
}

const GRADIENTES = [
  "linear-gradient(150deg, hsl(38 45% 68%), hsl(28 35% 44%))", // piedra dorada
  "linear-gradient(150deg, hsl(32 20% 66%), hsl(28 16% 40%))", // granito
  "linear-gradient(150deg, hsl(12 45% 52%), hsl(15 40% 34%))", // rojo andino
  "linear-gradient(150deg, hsl(165 20% 48%), hsl(168 25% 32%))", // jade
  "linear-gradient(150deg, hsl(45 60% 62%), hsl(35 55% 42%))", // oro
];

/** biblioteca de formas (poliominós) */
const FORMAS: Celda[][] = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]], // cuadrado 2x2
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]], // 3x3
  [[0, 0], [1, 0], [1, 1]], // L chica
  [[0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 0]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]], // L grande
  [[0, 1], [1, 1], [2, 0], [2, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1]],
  [[0, 0], [0, 1], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [1, 1]], // T
  [[0, 1], [1, 0], [1, 1], [1, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]], // S/Z
  [[0, 1], [1, 0], [1, 1], [2, 0]],
];

const COINS_PIEZA = 10;
const COINS_LINEA = 30;

type Tablero = number[][]; // 0 vacío, 1 ocupado

function tableroInicial(): Tablero {
  const t: Tablero = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  // "ruinas": algunas piedras precolocadas en las esquinas
  const semillas: Celda[] = [
    [0, 0], [0, 1], [1, 0],
    [0, 7], [1, 7],
    [7, 0], [6, 0], [7, 1],
    [7, 7], [6, 7], [7, 6],
  ];
  for (const [r, c] of semillas) t[r]![c] = 1;
  return t;
}

function cabePieza(tablero: Tablero, celdas: Celda[], r0: number, c0: number): boolean {
  return celdas.every(([r, c]) => {
    const rr = r0 + r;
    const cc = c0 + c;
    return rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && tablero[rr]![cc] === 0;
  });
}

function hayJugada(tablero: Tablero, celdas: Celda[]): boolean {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (cabePieza(tablero, celdas, r, c)) return true;
  return false;
}

let piezaSeq = 1;
function nuevaPieza(): Pieza {
  const forma = FORMAS[Math.floor(Math.random() * FORMAS.length)]!;
  return {
    id: piezaSeq++,
    celdas: forma,
    color: GRADIENTES[Math.floor(Math.random() * GRADIENTES.length)]!,
  };
}

function boundingBox(celdas: Celda[]): { filas: number; cols: number } {
  return {
    filas: Math.max(...celdas.map((c) => c[0])) + 1,
    cols: Math.max(...celdas.map((c) => c[1])) + 1,
  };
}

function leerMejor(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(MEJOR_KEY) ?? 0) || 0;
}

export function MuroPuzzle() {
  const { completarJuego, coins } = useProgreso();
  const boardRef = useRef<HTMLDivElement>(null);

  const [tablero, setTablero] = useState<Tablero>(tableroInicial);
  const [bandeja, setBandeja] = useState<Pieza[]>(() => [nuevaPieza(), nuevaPieza(), nuevaPieza()]);
  const [arrastre, setArrastre] = useState<{ pieza: Pieza; x: number; y: number } | null>(null);
  const [seleccion, setSeleccion] = useState<Pieza | null>(null);
  const [preview, setPreview] = useState<{ r: number; c: number; ok: boolean } | null>(null);
  const [puntos, setPuntos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [mejor, setMejor] = useState(leerMejor);
  const [ganadas, setGanadas] = useState(0);
  const [lineas, setLineas] = useState(0);
  const [fin, setFin] = useState(false);
  const [flash, setFlash] = useState<Celda[]>([]);
  const [errorId, setErrorId] = useState<number | null>(null);
  const [registrado, setRegistrado] = useState(false);

  const celdaDesdePunto = useCallback((clientX: number, clientY: number, pieza: Pieza) => {
    const board = boardRef.current?.getBoundingClientRect();
    if (!board) return null;
    const cell = board.width / SIZE;
    const { cols } = boundingBox(pieza.celdas);
    // el fantasma se dibuja centrado bajo el cursor
    const left = clientX - (cols * cell) / 2;
    const top = clientY - cell * 3.2; // pieza flota sobre el dedo
    const c0 = Math.round((left - board.left) / cell);
    const r0 = Math.round((top - board.top) / cell);
    return { r: r0, c: c0 };
  }, []);

  const colocar = useCallback(
    (pieza: Pieza, r0: number, c0: number) => {
      setTablero((t) => {
        const nt = t.map((fila) => [...fila]);
        for (const [r, c] of pieza.celdas) nt[r0 + r]![c0 + c] = 1;
        // detectar líneas completas
        const filasFull = nt.map((fila, r) => (fila.every(Boolean) ? r : -1)).filter((r) => r >= 0);
        const colsFull: number[] = [];
        for (let c = 0; c < SIZE; c++) if (nt.every((fila) => fila[c])) colsFull.push(c);
        const totalLineas = filasFull.length + colsFull.length;

        const cerrarTurno = (tableroFinal: Tablero) => {
          setBandeja((b) => {
            const restantes = b.filter((p) => p.id !== pieza.id);
            const nueva = restantes.length === 0 ? [nuevaPieza(), nuevaPieza(), nuevaPieza()] : restantes;
            if (!nueva.some((p) => hayJugada(tableroFinal, p.celdas))) setFin(true);
            return nueva;
          });
        };

        if (totalLineas > 0) {
          const celdasFlash: Celda[] = [];
          for (const r of filasFull) for (let c = 0; c < SIZE; c++) celdasFlash.push([r, c]);
          for (const c of colsFull) for (let r = 0; r < SIZE; r++) celdasFlash.push([r, c]);
          setFlash(celdasFlash);
          window.setTimeout(() => {
            setTablero((tt) => {
              const limpio = tt.map((fila, r) =>
                fila.map((v, c) => (filasFull.includes(r) || colsFull.includes(c) ? 0 : v)),
              );
              cerrarTurno(limpio);
              return limpio;
            });
            setFlash([]);
          }, 450);
          // puntos: piedras colocadas + líneas con multiplicador de racha
          const nuevaRacha = racha + 1;
          setRacha(nuevaRacha);
          setPuntos((p) => p + pieza.celdas.length + 40 * totalLineas * nuevaRacha);
          setLineas((l) => l + totalLineas);
          setGanadas((g) => g + COINS_PIEZA + totalLineas * COINS_LINEA);
        } else {
          setRacha(0);
          setPuntos((p) => p + pieza.celdas.length);
          setGanadas((g) => g + COINS_PIEZA);
          cerrarTurno(nt);
        }
        return nt;
      });
    },
    [racha],
  );

  const soltar = useCallback(
    (pieza: Pieza, clientX: number, clientY: number) => {
      setArrastre(null);
      setPreview(null);
      const destino = celdaDesdePunto(clientX, clientY, pieza);
      if (!destino || !cabePieza(tablero, pieza.celdas, destino.r, destino.c)) {
        setErrorId(pieza.id);
        window.setTimeout(() => setErrorId(null), 400);
        return;
      }
      setSeleccion(null);
      colocar(pieza, destino.r, destino.c);
    },
    [tablero, celdaDesdePunto, colocar],
  );

  /** modo táctil alternativo: toca la piedra, luego toca el nicho */
  const tocarNicho = (r: number, c: number) => {
    if (!seleccion || fin) return;
    if (!cabePieza(tablero, seleccion.celdas, r, c)) {
      setErrorId(seleccion.id);
      window.setTimeout(() => setErrorId(null), 400);
      return;
    }
    const p = seleccion;
    setSeleccion(null);
    setPreview(null);
    colocar(p, r, c);
  };

  const reiniciar = () => {
    setTablero(tableroInicial());
    setBandeja([nuevaPieza(), nuevaPieza(), nuevaPieza()]);
    setPuntos(0);
    setRacha(0);
    setGanadas(0);
    setLineas(0);
    setFin(false);
    setRegistrado(false);
    setFlash([]);
    setSeleccion(null);
    setPreview(null);
  };

  useEffect(() => {
    if (fin) {
      if (puntos > mejor) {
        setMejor(puntos);
        window.localStorage.setItem(MEJOR_KEY, String(puntos));
      }
      if (!registrado) {
        setRegistrado(true);
        completarJuego("encaja-la-piedra", ganadas);
      }
    }
  }, [fin, registrado, ganadas, puntos, mejor, completarJuego]);

  // vista previa con la pieza seleccionada al pasar sobre el tablero
  const previewSel = useMemo(() => {
    if (!seleccion) return null;
    return preview;
  }, [seleccion, preview]);

  return (
    <section
      className="-mx-4 space-y-5 px-4 py-8 text-[hsl(38_30%_92%)] sm:-mx-6 sm:rounded-2xl sm:px-6"
      style={{
        backgroundImage: `linear-gradient(hsl(28 22% 10% / .9), hsl(28 22% 7% / .96)), url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* portada PIRQA */}
      <header className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-[hsl(38_22%_78%)]">
          Tahuantinsuyo
        </p>
        <h2 className="font-display text-5xl tracking-[0.14em] text-gold">PIRQA</h2>
        <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-[hsl(38_18%_76%)]">
          Levanta el muro · piedra sobre piedra
        </p>
      </header>

      {/* marcadores estilo PIRQA */}
      <div className="mx-auto grid max-w-xl grid-cols-3 gap-3">
        <div className="rounded-lg border border-[hsl(38_20%_40%/.5)] bg-[hsl(28_20%_14%/.75)] px-4 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[hsl(38_16%_72%)]">Puntos</p>
          <p className="font-display text-2xl text-gold">{puntos}</p>
        </div>
        <div className="rounded-lg border border-[hsl(38_20%_40%/.5)] bg-[hsl(28_20%_14%/.75)] px-4 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[hsl(38_16%_72%)]">Racha</p>
          <p className="font-display text-2xl">{racha > 0 ? `×${racha}` : "0"}</p>
        </div>
        <div className="rounded-lg border border-[hsl(38_20%_40%/.5)] bg-[hsl(28_20%_14%/.75)] px-4 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[hsl(38_16%_72%)]">Mejor</p>
          <p className="inline-flex items-center gap-1.5 font-display text-2xl">
            <Trophy className="h-4 w-4 text-gold" /> {Math.max(mejor, puntos)}
          </p>
        </div>
      </div>


      {/* TABLERO con marco de piedra */}
      <div className="mx-auto max-w-xl">
        <div
          className="rounded-xl p-2"
          style={{
            background:
              "linear-gradient(160deg, hsl(30 10% 42%), hsl(28 12% 24%) 40%, hsl(30 10% 36%))",
            boxShadow: "0 10px 30px rgba(0,0,0,.45), inset 0 2px 6px rgba(255,255,255,.15)",
          }}
        >
          <div
            ref={boardRef}
            className="relative grid aspect-square w-full grid-cols-8 gap-[3px] rounded-lg p-[6px]"
            style={{ background: "linear-gradient(160deg, hsl(30 12% 24%), hsl(28 10% 14%))" }}
            onPointerMove={(e) => {
              if (!seleccion || arrastre) return;
              const board = boardRef.current?.getBoundingClientRect();
              if (!board) return;
              const cell = board.width / SIZE;
              const c = Math.floor((e.clientX - board.left) / cell);
              const r = Math.floor((e.clientY - board.top) / cell);
              if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) {
                setPreview({ r, c, ok: cabePieza(tablero, seleccion.celdas, r, c) });
              } else setPreview(null);
            }}
          >
            {tablero.map((fila, r) =>
              fila.map((v, c) => {
                const esFlash = flash.some(([fr, fc]) => fr === r && fc === c);
                const piezaActiva = arrastre?.pieza ?? seleccion;
                const previewActivo = arrastre ? preview : previewSel;
                const enPreview =
                  piezaActiva &&
                  previewActivo &&
                  piezaActiva.celdas.some(
                    ([pr, pc]) => previewActivo.r + pr === r && previewActivo.c + pc === c,
                  );
                return (
                  <div
                    key={`${r}-${c}`}
                    onPointerUp={() => tocarNicho(r, c)}
                    className={`rounded-[3px] transition-all duration-200 ${
                      esFlash ? "animate-[pulse_.45s_ease-in-out]" : ""
                    } ${seleccion && !v ? "cursor-pointer" : ""}`}
                    style={{
                      background: v
                        ? esFlash
                          ? "linear-gradient(150deg, hsl(48 90% 70%), hsl(40 80% 55%))"
                          : "linear-gradient(150deg, hsl(32 18% 62%), hsl(28 14% 40%))"
                        : enPreview
                          ? previewActivo!.ok
                            ? "hsla(45, 70%, 60%, .45)"
                            : "hsla(0, 70%, 55%, .4)"
                          : "hsl(28 12% 18%)",
                      boxShadow: v
                        ? "inset 0 2px 4px rgba(255,255,255,.2), inset 0 -2px 4px rgba(0,0,0,.3)"
                        : "inset 0 0 6px rgba(0,0,0,.5)",
                    }}
                  />
                );
              }),
            )}
            {fin && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                <PantallaFinal
                  ganadas={ganadas}
                  lineas={lineas}
                  puntos={puntos}
                  mejor={Math.max(mejor, puntos)}
                  coins={coins}
                  onJugar={reiniciar}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BANDEJA */}
      {!fin && (
        <div
          className="mx-auto max-w-xl overflow-hidden rounded-xl border border-[hsl(38_20%_40%/.5)] p-4"
          style={{
            backgroundImage: `linear-gradient(hsl(28 18% 12% / .5), hsl(28 18% 10% / .65)), url(${stoneImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          <div className="flex flex-wrap items-center justify-center gap-6">
            {bandeja.map((p) => {
              const { filas, cols } = boundingBox(p.celdas);
              const esError = errorId === p.id;
              const activa = arrastre?.pieza.id === p.id;
              const elegida = seleccion?.id === p.id;
              const usable = hayJugada(tablero, p.celdas);
              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  aria-label="Sillar de piedra"
                  onPointerDown={(e) => {
                    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                    setArrastre({ pieza: p, x: e.clientX, y: e.clientY });
                  }}
                  onPointerMove={(e) => {
                    if (arrastre?.pieza.id !== p.id) return;
                    setArrastre({ pieza: p, x: e.clientX, y: e.clientY });
                    const d = celdaDesdePunto(e.clientX, e.clientY, p);
                    if (d) setPreview({ ...d, ok: cabePieza(tablero, p.celdas, d.r, d.c) });
                    else setPreview(null);
                  }}
                  onPointerUp={(e) => {
                    if (arrastre?.pieza.id !== p.id) return;
                    // si casi no se movió, es un toque: seleccionar en vez de soltar
                    const dx = Math.abs(e.clientX - arrastre.x);
                    const dy = Math.abs(e.clientY - arrastre.y);
                    if (dx < 8 && dy < 8) {
                      setArrastre(null);
                      setPreview(null);
                      setSeleccion((s) => (s?.id === p.id ? null : p));
                      return;
                    }
                    soltar(p, e.clientX, e.clientY);
                  }}
                  onPointerCancel={() => {
                    setArrastre(null);
                    setPreview(null);
                  }}
                  className={`cursor-grab touch-none select-none rounded-lg p-2 transition-all duration-200 ${
                    esError ? "animate-[pulse_.2s_ease-in-out_2] ring-2 ring-destructive" : ""
                  } ${activa ? "opacity-30" : "hover:scale-105"} ${
                    elegida ? "ring-2 ring-gold" : ""
                  } ${!usable ? "opacity-40 saturate-0" : ""}`}
                >
                  <div
                    className="grid gap-[3px]"
                    style={{
                      gridTemplateColumns: `repeat(${cols}, 22px)`,
                      gridTemplateRows: `repeat(${filas}, 22px)`,
                    }}
                  >
                    {Array.from({ length: filas * cols }).map((_, i) => {
                      const rr = Math.floor(i / cols);
                      const cc = i % cols;
                      const llena = p.celdas.some(([r, c]) => r === rr && c === cc);
                      return (
                        <div
                          key={i}
                          className="rounded-[3px]"
                          style={{
                            background: llena ? p.color : "transparent",
                            boxShadow: llena
                              ? "inset 0 2px 3px rgba(255,255,255,.25), inset 0 -2px 3px rgba(0,0,0,.3)"
                              : undefined,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

          </div>
          <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-[hsl(38_16%_74%)]">
            Arrastra la piedra al muro · o tócala y elige el nicho
          </p>
        </div>
      )}

      {/* acciones */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-gold/25 px-3 py-1.5 text-sm font-semibold">
          <Coins className="h-4 w-4" /> +{ganadas} RIQSI-COINS
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-jade/25 px-3 py-1.5 text-sm font-semibold">
          {lineas} hileras consolidadas
        </span>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={reiniciar}
          className="rounded-md border border-[hsl(38_30%_55%/.7)] px-10 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(38_25%_88%)] transition-colors hover:bg-[hsl(38_30%_55%/.15)]"
        >
          Nueva partida
        </button>
      </div>

      {/* fantasma de arrastre */}
      {arrastre && <Ghost arrastre={arrastre} boardRef={boardRef} />}
    </section>

  );
}

function Ghost({
  arrastre,
  boardRef,
}: {
  arrastre: { pieza: Pieza; x: number; y: number };
  boardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { pieza, x, y } = arrastre;
  const { filas, cols } = boundingBox(pieza.celdas);
  const board = boardRef.current?.getBoundingClientRect();
  const cell = board ? board.width / SIZE : 40;
  return (
    <div
      className="pointer-events-none fixed z-50 opacity-90"
      style={{
        left: x - (cols * cell) / 2,
        top: y - cell * 3.2,
      }}
    >
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cell - 3}px)`,
          gridTemplateRows: `repeat(${filas}, ${cell - 3}px)`,
        }}
      >
        {Array.from({ length: filas * cols }).map((_, i) => {
          const rr = Math.floor(i / cols);
          const cc = i % cols;
          const llena = pieza.celdas.some(([r, c]) => r === rr && c === cc);
          return (
            <div
              key={i}
              className="rounded-[4px]"
              style={{
                background: llena ? pieza.color : "transparent",
                boxShadow: llena ? "0 6px 14px rgba(0,0,0,.4), inset 0 2px 3px rgba(255,255,255,.3)" : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function PantallaFinal({
  ganadas,
  lineas,
  puntos,
  mejor,
  coins,
  onJugar,
}: {
  ganadas: number;
  lineas: number;
  puntos: number;
  mejor: number;
  coins: number;
  onJugar: () => void;
}) {
  return (
    <div className="animate-scale-in m-4 w-full max-w-md rounded-2xl border-2 border-accent bg-card p-6 text-center">
      <h2 className="font-display text-3xl">¡Muro reconstruido!</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        Has aprendido cómo el encaje de piedras ayudaba a construir estructuras resistentes.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-secondary p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Puntos</p>
          <p className="font-display text-2xl">{puntos}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Trophy className="h-3 w-3 text-gold" /> Mejor: {mejor}
          </p>
        </div>
        <div className="rounded-xl bg-gold/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">RIQSI-COINS</p>
          <p className="font-display text-2xl">+{ganadas}</p>
          <p className="mt-1 text-xs text-muted-foreground">{lineas} hileras · Saldo: 🟡 {coins}</p>
        </div>
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-jade/20 px-3 py-1.5 text-sm font-semibold">
        <Award className="h-4 w-4" /> Insignia: Maestro de la Piedra
      </p>
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
