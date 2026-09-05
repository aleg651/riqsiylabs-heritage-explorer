import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CATEGORIAS, SITIOS, type Categoria } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { useProgreso } from "@/lib/progress";
import { EXPERIENCIA_MACHU_MUQU_ID } from "@/lib/riqsiy-gamification";

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
  const { descubiertos, experiencias, hidratado } = useProgreso();
  const lista = filtro === "todos" ? SITIOS : SITIOS.filter((s) => s.categoria === filtro);
  const machuMuquHecho = hidratado && experiencias.includes(EXPERIENCIA_MACHU_MUQU_ID);

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

      {/* Machu Muqu — patrimonio de nuestra comunidad */}
      <Link
        to="/machu-muqu"
        className="shadow-stone group mt-8 grid overflow-hidden rounded-lg border border-accent/70 bg-card transition-all hover:-translate-y-1 hover:border-accent sm:grid-cols-[1.1fr_1fr]"
      >
        <div className="gradient-earth relative flex min-h-44 items-center justify-center text-stone-deep-foreground">
          <div className="stone-grid absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] opacity-80">
              Patrimonio de nuestra comunidad
            </p>
            <span className="mt-2 block font-display text-3xl font-semibold tracking-[0.18em] sm:text-4xl">
              MACHU MUQU
            </span>
            <span className="mt-2 block text-sm text-gold-soft">Memoria · piedra · territorio</span>
          </div>
          {machuMuquHecho && (
            <span className="absolute right-3 top-3 rounded-full bg-jade/90 px-2.5 py-1 text-xs font-semibold text-stone-deep-foreground">
              Descubierto
            </span>
          )}
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Experiencia especial RIQSIY</p>
          <h3 className="mt-1 font-display text-xl">Descubre Machu Muqu</h3>
          <p className="mt-3 text-sm">
            Un sitio arqueológico de nuestra comunidad, documentado con fotografías y videos propios. Observa sus
            evidencias, escucha la memoria de la comunidad y acompáñanos en lo que todavía falta investigar.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Explorar Machu Muqu <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

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
