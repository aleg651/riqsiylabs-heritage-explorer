import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type * as THREE from "three";
import { ArrowRight, Eye, Compass, Gamepad2 } from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { AVISO_REFERENCIAL, FUENTES, PUNTOS_3D } from "@/lib/machu-muqu-3d";
import type { Control } from "@/components/riqsiy/MachuMuqu3D";
import { useProgreso } from "@/lib/progress";
import { EXPERIENCIA_MACHU_MUQU_3D_ID } from "@/lib/riqsiy-gamification";

const Escena3D = lazy(() => import("@/components/riqsiy/MachuMuqu3D"));

export const Route = createFileRoute("/machu-muqu-3d")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Explora Machu Muqu en 3D — RIQSIY" },
      {
        name: "description",
        content:
          "Recorrido 3D referencial de Machu Muqu, sitio arqueológico de nuestra comunidad, basado en nuestro propio registro fotográfico y audiovisual.",
      },
      { property: "og:title", content: "Explora Machu Muqu en 3D — RIQSIY" },
      {
        property: "og:description",
        content: "Camina una representación digital de Machu Muqu y descubre sus evidencias observadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MachuMuqu3DPage,
});

function MachuMuqu3DPage() {
  const { experiencias, completarExperiencia } = useProgreso();
  const control = useRef<Control>({ move: { x: 0, y: 0 }, yaw: 0, pitch: 0.15 });
  const teclas = useRef<Record<string, boolean>>({});
  const [calidadBaja, setCalidadBaja] = useState(false);
  const [puntoCerca, setPuntoCerca] = useState<number | null>(null);
  const [descubiertos, setDescubiertos] = useState<number[]>([]);
  const [abierto, setAbierto] = useState<number | null>(null);
  const [modoInvestigador, setModoInvestigador] = useState(false);
  const [vista, setVista] = useState<"3d" | "real">("3d");
  const [metros, setMetros] = useState(0);
  const ultima = useRef<THREE.Vector3 | null>(null);
  const yaCompletado = experiencias.includes(EXPERIENCIA_MACHU_MUQU_3D_ID);

  /* calidad según dispositivo */
  useEffect(() => {
    setCalidadBaja(window.innerWidth < 820 || navigator.hardwareConcurrency <= 4);
  }, []);

  /* teclado */
  useEffect(() => {
    const mapa: Record<string, string> = {
      KeyW: "ade", ArrowUp: "ade", KeyS: "atr", ArrowDown: "atr",
      KeyA: "izq", ArrowLeft: "izq", KeyD: "der", ArrowRight: "der",
      KeyQ: "giroIzq", KeyE: "giroDer",
    };
    const down = (e: KeyboardEvent) => {
      const k = mapa[e.code];
      if (k) { teclas.current[k] = true; e.preventDefault(); }
      if (e.code === "Space" && puntoCerca) { setAbierto(puntoCerca); e.preventDefault(); }
    };
    const up = (e: KeyboardEvent) => {
      const k = mapa[e.code];
      if (k) teclas.current[k] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [puntoCerca]);

  /* bucle de entrada del teclado */
  useEffect(() => {
    let raf = 0;
    let anterior = performance.now();
    const paso = (t: number) => {
      const dt = Math.min((t - anterior) / 1000, 0.05);
      anterior = t;
      const c = control.current;
      const k = teclas.current;
      if (!tactil.current) {
        c.move.y = (k["ade"] ? 1 : 0) - (k["atr"] ? 1 : 0);
        c.move.x = (k["der"] ? 1 : 0) - (k["izq"] ? 1 : 0);
      }
      if (k["giroIzq"]) c.yaw += 1.8 * dt;
      if (k["giroDer"]) c.yaw -= 1.8 * dt;
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* joystick táctil */
  const tactil = useRef(false);
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const mover = useCallback((e: React.PointerEvent) => {
    const el = base.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const rad = r.width / 2;
    let dx = (e.clientX - cx) / rad;
    let dy = (e.clientY - cy) / rad;
    const len = Math.hypot(dx, dy);
    if (len > 1) { dx /= len; dy /= len; }
    setKnob({ x: dx * rad * 0.5, y: dy * rad * 0.5 });
    tactil.current = true;
    control.current.move = { x: dx, y: -dy };
  }, []);

  const soltar = useCallback(() => {
    tactil.current = false;
    setKnob({ x: 0, y: 0 });
    control.current.move = { x: 0, y: 0 };
  }, []);

  /* giro de cámara arrastrando sobre el lienzo */
  const arrastre = useRef<{ x: number; y: number } | null>(null);
  const onCanvasDown = (e: React.PointerEvent) => { arrastre.current = { x: e.clientX, y: e.clientY }; };
  const onCanvasMove = (e: React.PointerEvent) => {
    const a = arrastre.current;
    if (!a) return;
    control.current.yaw -= (e.clientX - a.x) * 0.006;
    control.current.pitch = Math.max(-0.1, Math.min(0.7, control.current.pitch + (e.clientY - a.y) * 0.002));
    arrastre.current = { x: e.clientX, y: e.clientY };
  };
  const onCanvasUp = () => { arrastre.current = null; };

  const onAvance = useCallback((pos: THREE.Vector3) => {
    if (ultima.current) setMetros((m) => m + pos.distanceTo(ultima.current!));
    ultima.current = pos;
  }, []);

  const observar = () => {
    if (!puntoCerca) return;
    setAbierto(puntoCerca);
    setDescubiertos((d) => (d.includes(puntoCerca) ? d : [...d, puntoCerca]));
  };

  const completo = descubiertos.length >= PUNTOS_3D.length;
  useEffect(() => {
    if (completo && !yaCompletado) completarExperiencia(EXPERIENCIA_MACHU_MUQU_3D_ID, 200);
  }, [completo, yaCompletado, completarExperiencia]);

  const punto = useMemo(() => PUNTOS_3D.find((p) => p.n === abierto) ?? null, [abierto]);
  const cerca = useMemo(() => PUNTOS_3D.find((p) => p.n === puntoCerca) ?? null, [puntoCerca]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionTitle
        eyebrow="Patrimonio de nuestra comunidad"
        title="EXPLORA MACHU MUQU"
        description="Camina una representación digital referencial construida a partir de nuestras fotografías y videos. Observa, pregunta e investiga."
      />

      <p className="mt-4 rounded-lg border border-dashed border-muted-foreground/50 bg-muted p-3 text-xs text-muted-foreground">
        ⚠️ {AVISO_REFERENCIAL}
      </p>

      {/* Lienzo 3D */}
      <div
        className="relative mt-5 aspect-[4/3] w-full touch-none overflow-hidden rounded-2xl border border-border shadow-stone sm:aspect-[16/9]"
        onPointerDown={onCanvasDown}
        onPointerMove={onCanvasMove}
        onPointerUp={onCanvasUp}
        onPointerLeave={onCanvasUp}
      >
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-secondary text-sm text-muted-foreground">
              Cargando el terreno de Machu Muqu…
            </div>
          }
        >
          <Escena3D
            control={control}
            calidadBaja={calidadBaja}
            descubiertos={descubiertos}
            puntoCerca={puntoCerca}
            onCerca={setPuntoCerca}
            onAvance={onAvance}
          />
        </Suspense>

        {/* HUD */}
        <div className="pointer-events-none absolute inset-0 p-3">
          <div className="flex flex-wrap items-start gap-2">
            <span className="rounded-full bg-background/85 px-3 py-1 text-xs font-semibold backdrop-blur">
              🧭 Puntos observados: {descubiertos.length}/{PUNTOS_3D.length}
            </span>
            <span className="rounded-full bg-background/85 px-3 py-1 text-xs backdrop-blur">
              👣 {Math.round(metros)} m recorridos
            </span>
            <span className="hidden rounded-full bg-background/85 px-3 py-1 text-xs backdrop-blur sm:inline">
              WASD para caminar · arrastra para girar · Espacio para observar
            </span>
          </div>

          {cerca && !abierto && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
              <p className="mb-2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                Estás en: {cerca.n}. {cerca.titulo}
              </p>
              <button
                type="button"
                onClick={observar}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-stone"
              >
                <Eye className="h-4 w-4" /> OBSERVAR
              </button>
            </div>
          )}

          {/* joystick */}
          <div
            ref={base}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); mover(e); }}
            onPointerMove={(e) => { if (tactil.current) mover(e); }}
            onPointerUp={soltar}
            onPointerCancel={soltar}
            className="pointer-events-auto absolute bottom-3 left-3 h-28 w-28 rounded-full border border-border/70 bg-background/50 backdrop-blur xl:hidden"
          >
            <div
              className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80"
              style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
            />
          </div>
        </div>
      </div>

      {/* Controles auxiliares */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCalidadBaja((v) => !v)}
          className="rounded-full border border-border px-3 py-1.5 text-xs"
        >
          {calidadBaja ? "Calidad: ligera (móvil)" : "Calidad: detallada"}
        </button>
        <button
          type="button"
          onClick={() => setModoInvestigador((v) => !v)}
          className={`rounded-full border px-3 py-1.5 text-xs ${
            modoInvestigador ? "border-accent bg-accent/20 font-semibold" : "border-border"
          }`}
        >
          🔬 Modo investigador {modoInvestigador ? "activo" : "apagado"}
        </button>
        <span className="text-xs text-muted-foreground">
          El modo investigador añade la memoria oral y las referencias por contrastar.
        </span>
      </div>

      {/* Ficha del punto */}
      {punto && (
        <article className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-stone">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold">
              {punto.n}. {punto.titulo}
            </h2>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] ${FUENTES[punto.fuenteInfo].clase}`}>
              {FUENTES[punto.fuenteInfo].icono} {FUENTES[punto.fuenteInfo].label}
            </span>
          </div>

          {/* comparación REAL / 3D */}
          <div className="mt-4 flex gap-2">
            {(["3d", "real"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVista(v)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  vista === v ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                {v === "real" ? "REAL 📸" : "3D 🏛️"}
              </button>
            ))}
          </div>

          {vista === "real" ? (
            <figure className="mt-3">
              <img
                src={punto.foto}
                alt={`Registro propio del sector ${punto.titulo} en Machu Muqu`}
                className="w-full rounded-xl border border-border object-cover"
                loading="lazy"
              />
              <figcaption className="mt-2 text-xs text-muted-foreground">{punto.pieFoto}</figcaption>
            </figure>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-muted-foreground/50 bg-muted p-3 text-sm text-muted-foreground">
              Estás viendo la aproximación 3D de este sector en el lienzo de arriba. Cambia a REAL 📸 para comparar con
              nuestra fotografía.
            </p>
          )}

          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondary/50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">¿Qué observamos?</dt>
              <dd className="mt-1 text-sm">{punto.observacion}</dd>
            </div>
            <div className="rounded-xl border border-border bg-secondary/50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pregunta del punto</dt>
              <dd className="mt-1 text-sm">{punto.pregunta}</dd>
            </div>
            <div className="rounded-xl border border-border bg-secondary/50 p-3 sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Información disponible
              </dt>
              <dd className="mt-1 text-sm">{punto.info}</dd>
            </div>
            {modoInvestigador && (
              <>
                {punto.memoriaOral && (
                  <div className="rounded-xl border border-primary/40 bg-primary/5 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      🗣️ Memoria oral (no comprobada)
                    </dt>
                    <dd className="mt-1 text-sm">{punto.memoriaOral}</dd>
                  </div>
                )}
                {punto.historica && (
                  <div className="rounded-xl border border-border bg-muted p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      📚 Referencia por contrastar
                    </dt>
                    <dd className="mt-1 text-sm">{punto.historica}</dd>
                  </div>
                )}
              </>
            )}
          </dl>

          <button
            type="button"
            onClick={() => setAbierto(null)}
            className="mt-4 rounded-full border border-border px-4 py-1.5 text-xs font-semibold"
          >
            Seguir caminando
          </button>
        </article>
      )}

      {/* lista de puntos */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Puntos del recorrido</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PUNTOS_3D.map((p) => {
            const hecho = descubiertos.includes(p.n);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setAbierto(p.n)}
                  className={`w-full rounded-xl border p-3 text-left text-sm transition-colors ${
                    hecho ? "border-accent/60 bg-accent/10" : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <span className="font-semibold">
                    {hecho ? "✅" : "📍"} {p.n}. {p.titulo}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {FUENTES[p.fuenteInfo].icono} {FUENTES[p.fuenteInfo].label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* completado */}
      {completo && (
        <section className="mt-8 rounded-2xl border border-accent/50 bg-accent/10 p-5">
          <h2 className="font-display text-xl font-semibold">¡Recorriste Machu Muqu!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Observaste los 7 puntos y ganaste 200 RIQSI-COINS junto con la insignia 🧭 “Caminante de Machu Muqu”.
            Recuerda: observar no es lo mismo que conocer; lo que sigue es investigar con fuentes verificables.
          </p>
        </section>
      )}

      {/* CONOCER PARA VALORAR */}
      <section className="mt-8 rounded-2xl border border-border gradient-earth stone-grid p-5">
        <h2 className="font-display text-xl font-semibold">CONOCER PARA VALORAR</h2>
        <ol className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
          {["CAMINAR", "OBSERVAR", "DESCUBRIR", "INVESTIGAR", "APRENDER", "VALORAR", "PROTEGER"].map((s, i, arr) => (
            <li key={s} className="flex items-center gap-2">
              <span className="rounded-full border border-border bg-background/70 px-3 py-1">{s}</span>
              {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
            </li>
          ))}
        </ol>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/investigacion"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            CONOCE NUESTRA INVESTIGACIÓN <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/machu-muqu"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
          >
            <Compass className="h-4 w-4" /> Volver a la experiencia Machu Muqu
          </Link>
          <Link
            to="/juegos/$id"
            params={{ id: "encaja-la-piedra" }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
          >
            <Gamepad2 className="h-4 w-4" /> PIRQA: Maestro de la Piedra
          </Link>
          <Link
            to="/juegos/$id"
            params={{ id: "salva-el-agua" }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
          >
            <Gamepad2 className="h-4 w-4" /> Salva el agua: Guardián del Agua
          </Link>
        </div>
      </section>
    </div>
  );
}
