import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIAS, SITIOS, type Categoria } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { useProgreso } from "@/lib/progress";

export const Route = createFileRoute("/descubre/")({
  head: () => ({
    meta: [
      { title: "Descubre — Sitios arqueológicos del Cusco | RIQSIY" },
      {
        name: "description",
        content:
          "Elige un centro arqueológico del Cusco y conoce su historia, su ingeniería, sus relatos y su estado de conservación.",
      },
      { property: "og:title", content: "Descubre los sitios arqueológicos del Cusco" },
      {
        property: "og:description",
        content: "Historia breve, técnica constructiva, datos sorprendentes y retos para cada lugar.",
      },
    ],
  }),
  component: Descubre,
});

function Descubre() {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const { descubiertos, hidratado } = useProgreso();
  const lista = filtro === "todos" ? SITIOS : SITIOS.filter((s) => s.categoria === filtro);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <SectionTitle
        eyebrow="Función principal"
        title="Descubre"
        description="Selecciona un lugar. Lo has visto muchas veces; ahora vas a conocerlo."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltro("todos")}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            filtro === "todos" ? "border-primary bg-primary text-primary-foreground" : "border-border"
          }`}
        >
          Todos
        </button>
        {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFiltro(c)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filtro === c ? "border-primary bg-primary text-primary-foreground" : "border-border"
            }`}
          >
            {CATEGORIAS[c].icono} {CATEGORIAS[c].label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((s) => (
          <Link
            key={s.slug}
            to="/descubre/$slug"
            params={{ slug: s.slug }}
            className="shadow-stone group overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent"
          >
            <div className="relative">
              <img
                src={s.imagen}
                alt={s.nombre}
                loading="lazy"
                width={1280}
                height={853}
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium">
                {CATEGORIAS[s.categoria].icono} {CATEGORIAS[s.categoria].label}
              </span>
              {hidratado && descubiertos.includes(s.slug) && (
                <span className="absolute right-3 top-3 rounded-full bg-jade/90 px-2.5 py-1 text-xs font-semibold text-stone-deep-foreground">
                  Descubierto
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl">{s.nombre}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{s.ubicacion}</p>
              <p className="mt-3 text-sm">{s.resumen}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
