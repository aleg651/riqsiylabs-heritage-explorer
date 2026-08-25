import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, MapPin } from "lucide-react";
import { CATEGORIAS, getSitio } from "@/lib/riqsiy-data";
import { RetosRiqsiy } from "@/components/riqsiy/RetosRiqsiy";
import { useProgreso } from "@/lib/progress";

export const Route = createFileRoute("/descubre/$slug")({
  loader: ({ params }) => {
    const sitio = getSitio(params.slug);
    if (!sitio) throw notFound();
    return { nombre: sitio.nombre, resumen: sitio.resumen };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Sitio no encontrado | RIQSIY" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.nombre} — Descubre | RIQSIY`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.resumen },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.resumen },
      ],
    };
  },
  component: SitioDetalle,
});

const NIVEL_ESTILO: Record<string, string> = {
  Bueno: "bg-jade/20 text-foreground border-jade/50",
  Vulnerable: "bg-accent/20 text-foreground border-accent/60",
  "En riesgo": "bg-destructive/15 text-foreground border-destructive/50",
};

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-stone">
      <h2 className="font-display text-xl">{titulo}</h2>
      <div className="mt-3 text-muted-foreground">{children}</div>
    </section>
  );
}

function SitioDetalle() {
  const { slug } = Route.useParams();
  const sitio = getSitio(slug)!;
  const { descubrir } = useProgreso();
  const [revelado, setRevelado] = useState(false);

  useEffect(() => {
    descubrir(slug);
  }, [slug, descubrir]);

  return (
    <article>
      <div className="relative isolate">
        <img
          src={sitio.imagen}
          alt={sitio.nombre}
          width={1280}
          height={853}
          className="h-[46vh] w-full object-cover"
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-4 pb-8 text-stone-deep-foreground">
          <Link to="/descubre" className="inline-flex items-center gap-1 text-sm opacity-85">
            <ArrowLeft className="h-4 w-4" /> Volver a Descubre
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-gold-soft">
            {CATEGORIAS[sitio.categoria].icono} {CATEGORIAS[sitio.categoria].label}
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold sm:text-5xl">{sitio.nombre}</h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm opacity-90">
            <MapPin className="h-4 w-4" /> {sitio.ubicacion}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-lg border border-accent/50 bg-accent/10 p-6">
          <button
            type="button"
            onClick={() => setRevelado((v) => !v)}
            className="shadow-gold inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            <Eye className="h-4 w-4" /> Lo veía, pero no lo conocía
          </button>
          {revelado && (
            <p className="animate-rise mt-5 font-display text-lg leading-relaxed">
              {sitio.loVeiaPeroNoLoConocia}
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Bloque titulo="Historia breve">
            <p>{sitio.historia}</p>
          </Bloque>
          <Bloque titulo="¿Para qué servía?">
            <p>{sitio.paraQueServia}</p>
          </Bloque>
          <Bloque titulo="¿Cómo fue construido?">
            <p>{sitio.comoFueConstruido}</p>
          </Bloque>
          <Bloque titulo="¿Qué conocimientos usaron nuestros antepasados?">
            <ul className="list-disc space-y-1.5 pl-5">
              {sitio.conocimientos.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Bloque>
        </div>

        <section className="surface-deep mt-5 rounded-lg p-6">
          <h2 className="font-display text-xl">Datos sorprendentes</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {sitio.datosSorprendentes.map((d) => (
              <li key={d} className="rounded-md border border-white/15 bg-white/5 p-4 text-sm">
                {d}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Bloque titulo="Historias y relatos">
            <div className="space-y-4">
              {sitio.relatos.map((r) => (
                <div key={r.titulo}>
                  <p className="font-semibold text-foreground">{r.titulo}</p>
                  <p className="mt-1">{r.texto}</p>
                </div>
              ))}
            </div>
          </Bloque>
          <Bloque titulo="Estado actual del patrimonio">
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${NIVEL_ESTILO[sitio.estadoActual.nivel]}`}
            >
              {sitio.estadoActual.nivel}
            </span>
            <p className="mt-3">{sitio.estadoActual.detalle}</p>
            <Link to="/antes-y-despues" className="mt-4 inline-block text-sm font-semibold text-primary">
              Ver antes y ahora →
            </Link>
          </Bloque>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Reto RIQSIY</h2>
          <p className="mt-1 text-muted-foreground">
            Demuestra lo que descubriste y gana Puntos de Identidad.
          </p>
          <div className="mt-6">
            <RetosRiqsiy slug={sitio.slug} retos={sitio.retos} />
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/compromiso"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Asumir mi compromiso
          </Link>
          <Link
            to="/descubre"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold"
          >
            Descubrir otro lugar
          </Link>
        </div>
      </div>
    </article>
  );
}
