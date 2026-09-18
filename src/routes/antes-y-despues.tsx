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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AntesDespues,
});

function AntesDespues() {
  const [slug, setSlug] = useState(SITIOS[0]!.slug);
  const sitio = SITIOS.find((s) => s.slug === slug)!;

  const [fase, setFase] = useState<0 | 1 | 2>(0);
  const [comparacion, setComparacion] = useState(50);

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
        {SITIOS.filter((s) => s.imagen).map((s) => (
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
        <div>
          <div className="shadow-stone relative h-72 overflow-hidden rounded-lg" aria-label="Comparación interactiva antes y ahora">
            <img src={sitio.imagen} alt={`${sitio.nombre}, registro actual`} className="absolute inset-0 h-full w-full object-cover saturate-50"/>
            <div className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-accent" style={{width:`${comparacion}%`}}><img src={sitio.imagen} alt="Representación visual para comparación" className="h-full max-w-none object-cover sepia" style={{width:'500px'}}/></div>
            <span className="absolute left-3 top-3 rounded bg-background/85 px-2 py-1 text-xs">ANTES · referencia visual</span><span className="absolute right-3 top-3 rounded bg-background/85 px-2 py-1 text-xs">AHORA · fotografía</span>
          </div>
          <label className="mt-3 grid gap-2 text-xs"><span>Desliza para comparar ANTES ←→ AHORA</span><input aria-label="Control de comparación" type="range" min="10" max="90" value={comparacion} onChange={e=>setComparacion(Number(e.target.value))}/></label>
          <p className="mt-2 text-xs text-muted-foreground">La vista “antes” es un tratamiento visual para observar cambios; no es una reconstrucción histórica.</p>
        </div>

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

          <div className="mt-4 rounded-lg border border-accent/40 bg-accent/10 p-5 text-sm"><p className="font-semibold">Preguntas para comparar</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground"><li>¿Qué cambió?</li><li>¿Qué permanece?</li><li>¿Qué debemos proteger?</li></ul></div>

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
