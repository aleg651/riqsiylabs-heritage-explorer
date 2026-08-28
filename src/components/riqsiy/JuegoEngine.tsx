import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Info, RotateCcw, X } from "lucide-react";
import type { Juego } from "@/lib/riqsiy-juegos";
import { useProgreso } from "@/lib/progress";

function Escena({ juego, paso, acierto }: { juego: Juego; paso: number; acierto: boolean | null }) {
  const avance = Math.min(paso, juego.pasos.length);

  if (juego.escena === "muro") {
    return (
      <div className="flex flex-col-reverse gap-1.5">
        {[0, 1, 2, 3].map((fila) => (
          <div key={fila} className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((col) => {
              const puesta = fila < avance;
              return (
                <div
                  key={col}
                  className={`h-8 flex-1 rounded-sm transition-all duration-500 ${
                    puesta ? "bg-earth shadow-stone" : "border border-dashed border-border bg-muted/40"
                  }`}
                  style={{ marginLeft: puesta ? `${(fila % 2) * 6}px` : undefined }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  if (juego.escena === "canal") {
    return (
      <div className="space-y-2">
        {juego.pasos.map((_, i) => (
          <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${i * 8}%` }}>
            <div
              className={`h-3 flex-1 rounded-full transition-all duration-500 ${
                i < avance ? "bg-primary/80" : "bg-muted"
              }`}
            />
            <span className="text-xs">{i < avance ? "💧" : "·"}</span>
          </div>
        ))}
        <p className="pt-1 text-right text-xs text-muted-foreground">🌾 zona agrícola</p>
      </div>
    );
  }

  if (juego.escena === "anden") {
    return (
      <div className="flex flex-col gap-1.5">
        {juego.pasos.map((_, i) => {
          const idx = juego.pasos.length - 1 - i;
          const puesto = idx < avance;
          return (
            <div
              key={idx}
              className={`h-8 rounded-sm transition-all duration-500 ${
                puesto ? "bg-earth/90" : "border border-dashed border-border bg-muted/40"
              }`}
              style={{ width: `${55 + idx * 9}%` }}
            />
          );
        })}
      </div>
    );
  }

  if (juego.escena === "ruta") {
    return (
      <div className="flex items-center gap-1">
        {juego.pasos.map((_, i) => (
          <div key={i} className="flex flex-1 items-center gap-1">
            <span className={`text-lg ${i < avance ? "" : "opacity-30"}`}>{["🏘️", "⛰️", "🌊", "🏔️", "🏛️"][i] ?? "•"}</span>
            <div className={`h-1 flex-1 rounded-full ${i < avance ? "bg-accent" : "bg-muted"}`} />
          </div>
        ))}
        <span className={avance >= juego.pasos.length ? "text-lg" : "text-lg opacity-30"}>🎯</span>
      </div>
    );
  }

  // sombra
  const angulos = [-70, -35, 0, 30, 65];
  const ang = angulos[Math.min(avance, angulos.length - 1)] ?? 0;
  return (
    <div className="relative h-32 overflow-hidden rounded-md bg-gradient-to-b from-primary/15 to-earth/25">
      <div
        className="absolute left-1/2 top-4 h-6 w-6 -translate-x-1/2 rounded-full bg-gold transition-transform duration-700"
        style={{ transform: `translateX(-50%) translateX(${ang * 1.4}px)` }}
      />
      <div className="absolute bottom-6 left-1/2 h-16 w-1.5 -translate-x-1/2 rounded bg-foreground/80" />
      <div
        className="absolute bottom-6 left-1/2 h-1.5 origin-left rounded bg-foreground/40 transition-all duration-700"
        style={{ width: `${40 + Math.abs(ang)}px`, transform: `rotate(${ang > 0 ? 180 : 0}deg)` }}
      />
      <div className="absolute bottom-0 h-6 w-full bg-earth/50" />
      {acierto === false && <div className="absolute inset-0 bg-destructive/10" />}
    </div>
  );
}

export function JuegoEngine({ juego }: { juego: Juego }) {
  const { completarJuego, juegosCompletados } = useProgreso();
  const [paso, setPaso] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const actual = juego.pasos[paso] ?? juego.pasos[0]!;
  const acierto = elegida === null ? null : elegida === actual.correcta;

  const elegir = (i: number) => {
    if (elegida !== null) return;
    setElegida(i);
    setIntentos((n) => n + 1);
    if (i === actual.correcta) setAciertos((n) => n + 1);
  };

  const siguiente = () => {
    if (paso + 1 >= juego.pasos.length) {
      setTerminado(true);
      completarJuego(juego.id, juego.recompensa);
      return;
    }
    setPaso((p) => p + 1);
    setElegida(null);
  };

  const reiniciar = () => {
    setPaso(0);
    setElegida(null);
    setAciertos(0);
    setIntentos(0);
    setTerminado(false);
  };

  if (terminado) {
    const precision = intentos ? Math.round((aciertos / intentos) * 100) : 0;
    return (
      <div className="animate-rise shadow-stone rounded-xl border border-accent bg-accent/10 p-8 text-center">
        <p className="text-5xl">{juego.icono}</p>
        <h2 className="mt-4 font-display text-3xl">¡Juego completado!</h2>
        <p className="mt-2 text-muted-foreground">{juego.cierre}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <span className="rounded-full bg-gold/25 px-4 py-2 font-semibold">
            🟡 +{juegosCompletados.includes(juego.id) ? juego.recompensa : juego.recompensa} RIQSI-COINS
          </span>
          <span className="rounded-full border border-border px-4 py-2">Precisión: {precision}%</span>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reiniciar}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold"
          >
            <RotateCcw className="h-4 w-4" /> Jugar de nuevo
          </button>
          <Link
            to="/descubre/$slug"
            params={{ slug: juego.sitio }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Aprender más del sitio <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/juegos"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Otros minijuegos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="shadow-stone rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Paso {paso + 1} de {juego.pasos.length}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${(paso / juego.pasos.length) * 100}%` }}
          />
        </div>
        <div className="mt-6">
          <Escena juego={juego} paso={paso + (acierto ? 1 : 0)} acierto={acierto} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {juego.aprendizajes.map((a) => (
            <span key={a} className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="shadow-stone rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl">{actual.enunciado}</h2>
        {actual.contexto && <p className="mt-2 text-sm text-muted-foreground">{actual.contexto}</p>}
        <div className="mt-5 grid gap-3">
          {actual.opciones.map((o, i) => {
            const esta = elegida === i;
            const correcta = elegida !== null && i === actual.correcta;
            return (
              <button
                key={o.label}
                type="button"
                onClick={() => elegir(i)}
                disabled={elegida !== null}
                className={`rounded-lg border p-4 text-left transition-all ${
                  correcta
                    ? "border-jade bg-jade/15"
                    : esta
                      ? "border-destructive bg-destructive/10"
                      : "border-border hover:-translate-y-0.5 hover:border-accent"
                }`}
              >
                <span className="flex items-center justify-between gap-2 font-medium">
                  {o.label}
                  {correcta && <Check className="h-4 w-4 text-jade" />}
                  {esta && !correcta && <X className="h-4 w-4 text-destructive" />}
                </span>
                {o.detalle && <span className="mt-1 block text-xs text-muted-foreground">{o.detalle}</span>}
              </button>
            );
          })}
        </div>

        {elegida !== null && (
          <div className="animate-rise mt-5 rounded-lg border border-border bg-secondary/60 p-4 text-sm">
            <p className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{actual.explicacion}</span>
            </p>
            <button
              type="button"
              onClick={siguiente}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              {paso + 1 >= juego.pasos.length ? "Terminar" : "Continuar"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
