import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { MIRADAS } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";

export const Route = createFileRoute("/mira-mas-alla")({
  head: () => ({
    meta: [
      { title: "Mira más allá — Lo que veo vs. lo que significa | RIQSIY" },
      {
        name: "description",
        content:
          "Experiencia interactiva que contrasta la mirada cotidiana con el verdadero significado del patrimonio arqueológico cusqueño.",
      },
      { property: "og:title", content: "Mira más allá | RIQSIY" },
      {
        property: "og:description",
        content: "“Solo piedras” → una obra de ingeniería que sigue en pie después de 500 años.",
      },
    ],
  }),
  component: MiraMasAlla,
});

function MiraMasAlla() {
  const [abiertas, setAbiertas] = useState<number[]>([]);
  const toggle = (i: number) =>
    setAbiertas((a) => (a.includes(i) ? a.filter((x) => x !== i) : [...a, i]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <SectionTitle
        eyebrow="Experiencia interactiva"
        title="Mira más allá"
        description="Toca cada tarjeta para pasar de “lo que veo” a “lo que realmente significa”."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {MIRADAS.map((m, i) => {
          const abierta = abiertas.includes(i);
          return (
            <button
              key={m.loQueVeo}
              type="button"
              onClick={() => toggle(i)}
              className={`shadow-stone min-h-56 rounded-lg border p-6 text-left transition-all duration-300 ${
                abierta ? "surface-deep border-transparent" : "border-border bg-card hover:border-accent"
              }`}
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                {abierta ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {abierta ? "Lo que realmente significa" : "Lo que veo"}
              </span>
              <p className="mt-3 font-display text-xl leading-snug">
                {abierta ? m.loQueSignifica : m.loQueVeo}
              </p>
              {abierta && (
                <div className="animate-rise mt-4 space-y-3">
                  <p className="text-sm opacity-80">Pista de observación: {m.pista}</p>
                  {m.sitio && (
                    <Link
                      to="/descubre/$slug"
                      params={{ slug: m.sitio }}
                      className="inline-block text-sm font-semibold text-gold-soft underline underline-offset-4"
                    >
                      Conocer este lugar →
                    </Link>
                  )}
                </div>
              )}
              {!abierta && <p className="mt-3 text-sm text-muted-foreground">Toca para mirar de nuevo</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
