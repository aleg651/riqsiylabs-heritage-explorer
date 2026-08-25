import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SITIOS } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";

export const Route = createFileRoute("/antes-y-despues")({
  head: () => ({
    meta: [
      { title: "Antes y ahora — Conservación del patrimonio | RIQSIY" },
      {
        name: "description",
        content:
          "Compara cómo era originalmente cada sitio arqueológico cusqueño, cómo se encuentra hoy y qué podemos hacer para conservarlo.",
      },
      { property: "og:title", content: "Antes y ahora | RIQSIY" },
      { property: "og:description", content: "ANTES → AHORA → ¿QUÉ PODEMOS HACER?" },
    ],
  }),
  component: AntesDespues,
});

function AntesDespues() {
  const [slug, setSlug] = useState(SITIOS[0]!.slug);
  const sitio = SITIOS.find((s) => s.slug === slug)!;

  const [fase, setFase] = useState<0 | 1 | 2>(0);

  const fases = [
    { label: "Antes", texto: sitio.antesDespues.antes, clase: "bg-secondary" },
    { label: "Ahora", texto: sitio.antesDespues.ahora, clase: "bg-accent/15" },
    { label: "¿Qué podemos hacer?", texto: sitio.antesDespues.queHacer, clase: "bg-jade/15" },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <SectionTitle
        eyebrow="Conciencia"
        title="Antes y ahora"
        description="El deterioro no es una noticia lejana: ocurre en los lugares por donde pasamos todos los días."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {SITIOS.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => {
              setSlug(s.slug);
              setFase(0);
            }}
            className={`rounded-full border px-4 py-1.5 text-sm ${slug === s.slug ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
          >
            {s.nombre}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <img
          src={sitio.imagen}
          alt={sitio.nombre}
          loading="lazy"
          width={1280}
          height={853}
          className="shadow-stone h-64 w-full rounded-lg object-cover md:h-full"
        />

        <div>
          <div className="flex gap-2">
            {fases.map((f, i) => (
              <button
                key={f.label}
                type="button"
                onClick={() => setFase(i as 0 | 1 | 2)}
                className={`flex-1 rounded-md border px-3 py-2 text-xs font-semibold transition-colors ${
                  fase === i ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className={`animate-rise mt-4 rounded-lg border border-border p-6 ${fases[fase].clase}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {fases[fase].label}
            </p>
            <p className="mt-3 leading-relaxed">{fases[fase].texto}</p>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-card p-5 text-sm">
            <p className="font-semibold">Estado actual: {sitio.estadoActual.nivel}</p>
            <p className="mt-1 text-muted-foreground">{sitio.estadoActual.detalle}</p>
          </div>

          <Link
            to="/compromiso"
            className="mt-5 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Yo quiero comprometerme
          </Link>
        </div>
      </div>
    </div>
  );
}
