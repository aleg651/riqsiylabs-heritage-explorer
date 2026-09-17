import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIAS, SITIOS, type Categoria } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { GoogleHeritageMap } from "@/components/riqsiy/GoogleHeritageMap";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de nuestro patrimonio — Cusco | RIQSIY" },
      {
        name: "description",
        content:
          "Mapa interactivo con centros arqueológicos, paisajes culturales, obras hidráulicas, caminos, construcciones y andenes del Cusco.",
      },
      { property: "og:title", content: "Mapa de nuestro patrimonio | RIQSIY" },
      {
        property: "og:description",
        content: "Explora por categorías el patrimonio arqueológico cusqueño.",
      },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mapa,
});

function Mapa() {
  const [activo, setActivo] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<Categoria | "todos">("todos");
  const visibles = SITIOS.filter((s) => categoria === "todos" || s.categoria === categoria);
  const sitio = SITIOS.find((s) => s.slug === activo);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle
        eyebrow="Territorio"
        title="Mapa de nuestro patrimonio"
        description="Ubicaciones geográficas de lugares patrimoniales del Cusco. Selecciona un marcador para conocerlo."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => setCategoria("todos")}
          size="sm"
          variant={categoria === "todos" ? "default" : "outline"}
          className="rounded-full"
        >
          Todas las categorías
        </Button>
        {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => (
          <Button
            key={c}
            type="button"
            onClick={() => setCategoria(c)}
            size="sm"
            variant={categoria === c ? "default" : "outline"}
            className="rounded-full"
          >
            {CATEGORIAS[c].icono} {CATEGORIAS[c].label}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <GoogleHeritageMap sitios={visibles} activo={activo} onSelect={setActivo} />

        <aside className="rounded-lg border border-border bg-card p-6">
          {sitio ? (
            <div className="animate-rise">
              <img
                src={sitio.imagen}
                alt={sitio.nombre}
                loading="lazy"
                width={1280}
                height={853}
                className="h-40 w-full rounded-md object-cover"
              />
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {CATEGORIAS[sitio.categoria].icono} {CATEGORIAS[sitio.categoria].label}
              </p>
              <h3 className="mt-1 font-display text-2xl">{sitio.nombre}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{sitio.ubicacion}</p>
              {!sitio.coordenadas && (
                <p className="mt-2 text-xs font-medium text-primary">
                  Es una red de caminos: no se representa como un único punto.
                </p>
              )}
              <p className="mt-3 text-sm">{sitio.resumen}</p>
              <Link
                to="/descubre/$slug"
                params={{ slug: sitio.slug }}
                className="mt-5 inline-flex rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Descubrir este lugar
              </Link>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <p className="font-display text-xl text-foreground">Selecciona un punto</p>
              <p className="mt-2">
                Cada marcador representa un tipo de patrimonio distinto. Verás que muchos están a minutos de
                donde vives.
              </p>
              <ul className="mt-5 space-y-2">
                {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => (
                  <li key={c}>
                    {CATEGORIAS[c].icono} {CATEGORIAS[c].label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
