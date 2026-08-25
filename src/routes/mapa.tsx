import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIAS, SITIOS, type Categoria } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";

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
        description="Un esquema del valle del Cusco y sus alrededores. Selecciona un punto para conocer el lugar."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoria("todos")}
          className={`rounded-full border px-4 py-1.5 text-sm ${categoria === "todos" ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
        >
          Todas las categorías
        </button>
        {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategoria(c)}
            className={`rounded-full border px-4 py-1.5 text-sm ${categoria === c ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
          >
            {CATEGORIAS[c].icono} {CATEGORIAS[c].label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="stone-grid relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/50">
          <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path
              d="M4 46 C 22 30, 34 52, 50 40 S 78 22, 96 34"
              fill="none"
              stroke="var(--earth)"
              strokeOpacity="0.35"
              strokeWidth="1.2"
            />
            <path
              d="M10 66 C 30 60, 40 44, 58 46 S 84 60, 94 52"
              fill="none"
              stroke="var(--jade)"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </svg>

          {visibles.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setActivo(s.slug)}
              style={{ left: `${s.coord.x}%`, top: `${s.coord.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 px-2.5 py-1 text-xs font-semibold shadow-stone transition-all hover:scale-110 ${
                activo === s.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-accent bg-card text-foreground"
              }`}
            >
              {CATEGORIAS[s.categoria].icono}
              <span className="ml-1 hidden sm:inline">{s.nombre}</span>
            </button>
          ))}
          <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            Esquema referencial del territorio cusqueño
          </span>
        </div>

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
