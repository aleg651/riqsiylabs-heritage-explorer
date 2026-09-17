import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { Button } from "@/components/ui/button";
import { AVENTURA_RIQSIY } from "@/lib/riqsiy-regional";

export const Route = createFileRoute("/aventura")({
  head: () => ({
    meta: [
      { title: "Aventura RIQSIY — Ruta regional de aprendizaje" },
      { name: "description", content: "Recorre trece etapas para descubrir, investigar, valorar y proteger el patrimonio cultural de tu comunidad." },
      { property: "og:title", content: "Aventura RIQSIY — Ruta regional de aprendizaje" },
      { property: "og:description", content: "Una ruta educativa de trece etapas que conecta territorio, Machu Moqo, juegos, comunidad e investigación." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AventuraPage,
});

function AventuraPage() {
  return (
    <main>
      <section className="surface-deep stone-grid">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">RIQSIY Regional 2.0</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold sm:text-6xl">AVENTURA RIQSIY</h1>
          <p className="mt-4 max-w-3xl text-base opacity-85 sm:text-lg">
            No queremos que solamente veas tu patrimonio. Recorre una experiencia que une territorio, tecnología,
            videojuegos, comunidad, investigación y protección.
          </p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold">
            {[
              "EXPLORAR", "DESCUBRIR", "INVESTIGAR", "APRENDER", "JUGAR", "VALORAR", "PROTEGER",
            ].map((paso) => (
              <span key={paso} className="rounded-full border border-border/30 bg-background/10 px-3 py-1.5">{paso}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle
          eyebrow="Tu recorrido"
          title="13 etapas para convertirte en guardián"
          description="Cada etapa abre una experiencia existente de RIQSIY. Tu avance, monedas e insignias continúan funcionando como antes."
        />
        <ol className="relative mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AVENTURA_RIQSIY.map((etapa) => {
            const Icono = etapa.icono;
            const disponible = etapa.estado !== "proxima-fase";
            return (
              <li key={etapa.n} className="shadow-stone flex min-h-56 flex-col rounded-lg border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-3xl text-accent">{String(etapa.n).padStart(2, "0")}</span>
                  <Icono className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h2 className="mt-5 font-display text-xl">{etapa.titulo}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{etapa.descripcion}</p>
                {etapa.juegoId ? (
                  <Button asChild className="mt-5 w-full">
                    <Link to="/juegos/$id" params={{ id: etapa.juegoId }}>
                      Empezar etapa <ArrowRight />
                    </Link>
                  </Button>
                ) : disponible && etapa.to ? (
                  <Button asChild className="mt-5 w-full">
                    <Link to={etapa.to}>
                      Empezar etapa <ArrowRight />
                    </Link>
                  </Button>
                ) : (
                  <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                    <LockKeyhole className="h-4 w-4" /> Próxima fase · contenido en validación
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}