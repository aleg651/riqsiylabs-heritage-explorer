import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, Lock } from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { Button } from "@/components/ui/button";
import { AUTOR } from "@/lib/riqsiy-gamification";

export const Route = createFileRoute("/fencyt")({
  head: () => ({
    meta: [
      { title: `FENCYT — Proyecto de feria científica | RIQSIY · Autor: ${AUTOR}` },
      {
        name: "description",
        content:
          "Ficha oficial del proyecto RIQSIY para la feria de ciencia y tecnología (FENCYT): título, categoría, integrantes, objetivos y metodología.",
      },
      { property: "og:title", content: "RIQSIY en FENCYT" },
      { property: "og:description", content: "Ficha oficial del proyecto de feria científica RIQSIY." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Fencyt,
});

const FICHA = [
  { k: "Nombre del proyecto", v: "RIQSIY — Redescubre lo que siempre estuvo frente a ti" },
  { k: "Lema", v: "“Redescubre lo que siempre estuvo frente a ti.”" },
  { k: "Autor", v: AUTOR },
  { k: "Tipo de proyecto", v: "Proyecto de investigación — Ciencias Sociales / Tecnología educativa" },
  { k: "Área de intervención", v: "Cusco (Perú) — patrimonio arqueológico local" },
  { k: "Población de estudio", v: "Estudiantes cusqueños de educación secundaria" },
];

const CRONOGRAMA = [
  { fase: "1. Diagnóstico", detalle: "Test inicial de valoración patrimonial (10 ítems, 5 dimensiones)." },
  { fase: "2. Intervención", detalle: "Experiencia RIQSIY: Descubre, minijuegos, QR, mapa, retos e historias." },
  { fase: "3. Cierre", detalle: "Test final y comparativa por dimensiones." },
  { fase: "4. Análisis", detalle: "Panel del investigador: exportación anónima de resultados (RQ-XXXX)." },
];

const RESUMEN_JURADO = [
  { k: "Problema", v: "El patrimonio cercano puede pasar desapercibido o ser poco conocido por los jóvenes." },
  { k: "Pregunta", v: "¿En qué medida RIQSIY puede incrementar interés, conocimiento y valoración?" },
  { k: "Hipótesis", v: "La exploración y los minijuegos podrían fortalecer esas dimensiones y la protección." },
  { k: "Innovación", v: "Integra evidencia local, 3D, videojuegos, quechua y método científico." },
  { k: "Caso central", v: "Machu Moqo: registro propio, observación y preguntas todavía abiertas." },
  { k: "Resultados", v: "Pendientes de aplicación y análisis; no se muestran cifras ficticias." },
];

function Fencyt() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <SectionTitle
        eyebrow="Feria de Ciencia y Tecnología"
        title="RIQSIY en FENCYT"
        description="Ficha oficial del proyecto para la presentación en la feria científica escolar."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="shadow-stone rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Ficha del proyecto</h2>
          <dl className="mt-4 divide-y divide-border text-sm">
            {FICHA.map((f) => (
              <div key={f.k} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr]">
                <dt className="font-medium text-muted-foreground">{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="surface-deep rounded-xl p-6">
          <FlaskConical className="h-6 w-6 text-gold-soft" />
          <h3 className="mt-3 font-display text-xl">Demostración en vivo</h3>
          <p className="mt-2 text-sm opacity-85">
            Durante la feria, el jurado y el público pueden recorrer la plataforma completa: resolver retos,
            jugar los minijuegos, responder el test y ver cómo se actualizan los resultados.
          </p>
          <Link
            to="/investigacion"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          >
            Ver investigación <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Metodología en 4 fases</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CRONOGRAMA.map((c) => (
            <div key={c.fase} className="shadow-stone rounded-lg border border-border bg-card p-5">
              <p className="font-display text-lg text-primary">{c.fase}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.detalle}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 border-y border-border py-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase text-primary">Vista rápida para el jurado</p><h2 className="mt-1 font-display text-3xl">RIQSIY — Presentación FENCYT</h2></div><Button asChild><Link to="/modo-jurado">Abrir Modo Jurado <ArrowRight /></Link></Button></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{RESUMEN_JURADO.map((item) => <article key={item.k} className="border-l-2 border-accent pl-4"><h3 className="font-semibold">{item.k}</h3><p className="mt-1 text-sm text-muted-foreground">{item.v}</p></article>)}</div>
      </section>

      <div className="mt-10 flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-6">
        <div>
          <h3 className="flex items-center gap-2 font-display text-xl">
            <Lock className="h-4 w-4 text-primary" /> Panel del investigador
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Resultados agregados y exportación anónima de datos. Acceso restringido al autor.
          </p>
        </div>
        <Link
          to="/panel-investigador"
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          Ingresar <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
