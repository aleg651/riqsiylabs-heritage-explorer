import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Reto } from "@/lib/riqsiy-data";
import { useProgreso } from "@/lib/progress";
import { Button } from "@/components/ui/button";

function tipoLabel(reto: Reto) {
  if (reto.tipo === "vf") return "Verdadero o falso";
  if (reto.tipo === "detalle") return "Encuentra el detalle";
  return "Opción múltiple";
}

export function RetosRiqsiy({ slug, retos }: { slug: string; retos: Reto[] }) {
  const { completarReto, retosCompletados } = useProgreso();
  const [respuestas, setRespuestas] = useState<Record<number, number | boolean>>({});

  return (
    <div className="grid gap-4">
      {retos.map((reto, i) => {
        const respondido = respuestas[i] !== undefined;
        const opciones: { label: string; value: number | boolean }[] =
          reto.tipo === "vf"
            ? [
                { label: "Verdadero", value: true },
                { label: "Falso", value: false },
              ]
            : reto.opciones.map((o, idx) => ({ label: o, value: idx }));
        const correcta = reto.tipo === "vf" ? reto.correcta : reto.correcta;
        const acerto = respondido && respuestas[i] === correcta;

        return (
          <article key={i} className="rounded-lg border border-border bg-card p-5 shadow-stone">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {tipoLabel(reto)}
              </span>
              <span className="text-xs font-semibold text-accent-foreground/80">+{reto.puntos} pts</span>
            </div>
            <p className="mt-3 font-display text-lg">{reto.pregunta}</p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {opciones.map((o) => {
                const elegido = respondido && respuestas[i] === o.value;
                const esCorrecta = o.value === correcta;
                const estilo = !respondido
                  ? "border-border hover:border-accent hover:bg-accent/10"
                  : esCorrecta
                    ? "border-jade bg-jade/15"
                    : elegido
                      ? "border-destructive bg-destructive/10"
                      : "border-border opacity-60";
                return (
                  <button
                    key={String(o.value)}
                    type="button"
                    disabled={respondido}
                    onClick={() => {
                      setRespuestas((r) => ({ ...r, [i]: o.value }));
                      if (o.value === correcta) completarReto(slug, i, reto.puntos);
                    }}
                    className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2.5 text-left text-sm transition-all ${estilo}`}
                  >
                    <span>{o.label}</span>
                    {respondido && esCorrecta && <Check className="h-4 w-4 shrink-0" />}
                    {respondido && elegido && !esCorrecta && <X className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {respondido && (
              <div className="animate-rise mt-4 rounded-md border-l-4 border-accent bg-secondary/60 p-3 text-sm">
                <p className="font-semibold">{acerto ? "¡Correcto!" : "Casi..."}</p>
                <p className="mt-1 text-muted-foreground">{reto.explicacion}</p>
                {!acerto && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 px-0"
                    onClick={() => setRespuestas((r) => ({ ...r, [i]: undefined as never }))}
                  >
                    Intentar otra vez
                  </Button>
                )}
              </div>
            )}
            {retosCompletados.includes(`${slug}#${i}`) && !respondido && (
              <p className="mt-3 text-xs text-jade">Ya resolviste este reto antes.</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
