import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SITIOS } from "@/lib/riqsiy-data";
import { REGISTROS_HISTORICOS } from "@/lib/riqsiy-historical";
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
  const sitiosConImagen = SITIOS.filter((s) => s.imagen);
  const sitioInicial = sitiosConImagen[0];
  const [slug, setSlug] = useState(sitioInicial?.slug ?? "");
  const sitio = SITIOS.find((s) => s.slug === slug) ?? sitioInicial;

  const [fase, setFase] = useState<0 | 1 | 2>(0);
  const [comparacion, setComparacion] = useState(50);

  if (!sitio) return null;

  const registroHistorico = REGISTROS_HISTORICOS[sitio.slug];

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
        {sitiosConImagen.map((s) => (
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
          {registroHistorico ? (
            <>
              <div className="shadow-stone relative h-72 overflow-hidden rounded-lg" aria-label="Comparación interactiva entre fotografía histórica y actual">
                <img src={sitio.imagen} alt={`${sitio.nombre}, registro actual`} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-accent" style={{ width: `${comparacion}%` }}>
                  <img src={registroHistorico.imagen} alt={`${sitio.nombre}, ${registroHistorico.tipo.toLowerCase()} de ${registroHistorico.fecha}`} className="h-full max-w-none object-cover" style={{ width: "500px" }} />
                </div>
                <span className="absolute left-3 top-3 rounded bg-background/85 px-2 py-1 text-xs">ANTES · {registroHistorico.fecha}</span>
                <span className="absolute right-3 top-3 rounded bg-background/85 px-2 py-1 text-xs">AHORA · fotografía</span>
              </div>
              <label className="mt-3 grid gap-2 text-xs">
                <span>Desliza para comparar ANTES ←→ AHORA</span>
                <input aria-label="Control de comparación" type="range" min="10" max="90" value={comparacion} onChange={(e) => setComparacion(Number(e.target.value))} />
              </label>
              <div className="mt-3 rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
                <p><span className="font-semibold text-foreground">Antes:</span> {registroHistorico.tipo}, {registroHistorico.fecha}. {registroHistorico.autor} · {registroHistorico.licencia}.</p>
                <a href={registroHistorico.fuente} target="_blank" rel="noreferrer" className="mt-1 inline-block font-semibold text-primary underline underline-offset-4">Consultar archivo y licencia</a>
                <p className="mt-2"><span className="font-semibold text-foreground">Ahora:</span> {sitio.imagenCredito}.</p>
                {sitio.imagenFuente && <a href={sitio.imagenFuente} target="_blank" rel="noreferrer" className="mt-1 inline-block font-semibold text-primary underline underline-offset-4">Consultar fotografía actual</a>}
              </div>
            </>
          ) : (
            <div className="shadow-stone grid h-72 place-items-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
              <div className="max-w-sm">
                <p className="font-semibold">Registro histórico pendiente de verificación</p>
                <p className="mt-2 text-sm text-muted-foreground">No mostraremos la misma fotografía con otro color ni una imagen sin fuente. La comparación se habilitará cuando exista un archivo antiguo auténtico y reutilizable de {sitio.nombre}.</p>
              </div>
            </div>
          )}
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
