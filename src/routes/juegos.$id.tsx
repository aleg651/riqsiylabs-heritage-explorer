import { createFileRoute, notFound } from "@tanstack/react-router";
import { JUEGOS } from "@/lib/riqsiy-juegos";
import { JuegoEngine } from "@/components/riqsiy/JuegoEngine";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { AUTOR } from "@/lib/riqsiy-gamification";

export const Route = createFileRoute("/juegos/$id")({
  loader: ({ params }) => {
    const juego = JUEGOS.find((j) => j.id === params.id);
    if (!juego) throw notFound();
    return { juego };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Minijuego no encontrado | RIQSIY" }, { name: "robots", content: "noindex" }],
      };
    }
    const { juego } = loaderData;
    const desc = `${juego.lema} Minijuego educativo RIQSIY sobre ${juego.tema.toLowerCase()} andina.`;
    return {
      meta: [
        { title: `${juego.titulo} — Minijuego RIQSIY | Autor: ${AUTOR}` },
        { name: "description", content: desc },
        { property: "og:title", content: `${juego.titulo} — Minijuego RIQSIY` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: JuegoPage,
  notFoundComponent: JuegoNoEncontrado,
});

function JuegoNoEncontrado() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl">Minijuego no encontrado</h1>
      <p className="mt-3 text-muted-foreground">Vuelve al listado y elige otro reto RIQSIY.</p>
    </div>
  );
}

function JuegoPage() {
  const { juego } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionTitle
        eyebrow={`${juego.icono} ${juego.tema}`}
        title={juego.titulo}
        description={juego.intro}
      />
      <div className="mt-8">
        <JuegoEngine juego={juego} />
      </div>
      {juego.nota && (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
          Nota académica: {juego.nota}
        </p>
      )}
    </div>
  );
}
