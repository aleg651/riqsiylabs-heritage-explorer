import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, MapPin, QrCode, Sparkles } from "lucide-react";
import hero from "@/assets/hero-sacsayhuaman.jpg";
import logo from "@/assets/logo-riqsiy.png";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { SITIOS, MIRADAS } from "@/lib/riqsiy-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RIQSIY — Redescubre lo que siempre estuvo frente a ti" },
      {
        name: "description",
        content:
          "RIQSIY es una experiencia educativa interactiva para que estudiantes cusqueños vuelvan a mirar, conocer y proteger su patrimonio arqueológico.",
      },
      { property: "og:title", content: "RIQSIY — Redescubre lo que siempre estuvo frente a ti" },
      {
        property: "og:description",
        content:
          "Descubre, observa, resuelve retos y comprométete con el patrimonio arqueológico del Cusco.",
      },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="Muros megalíticos de Saqsaywaman al atardecer, Cusco"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 text-stone-deep-foreground">
          <div className="animate-rise max-w-3xl">
            <img src={logo} alt="Logo RIQSIY" width={72} height={72} className="h-16 w-16" />
            <h1 className="mt-6 font-display text-6xl font-semibold tracking-[0.12em] sm:text-8xl">
              RIQSIY
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.4em] text-gold-soft">
              conocer · reconocer · redescubrir
            </p>
            <p className="mt-6 font-display text-2xl leading-snug sm:text-4xl">
              “Redescubre lo que siempre estuvo frente a ti.”
            </p>
            <p className="mt-4 max-w-xl text-base opacity-85">
              Estamos acostumbrados a ver nuestro patrimonio, pero hemos dejado de mirarlo realmente.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/descubre"
                className="shadow-gold inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Comenzar a descubrir <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/por-que"
                className="inline-flex items-center gap-2 rounded-md border border-white/40 px-6 py-3 font-semibold backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                ¿Por qué existe RIQSIY?
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="stone-grid mx-auto max-w-6xl px-4 py-20">
        <SectionTitle
          eyebrow="La experiencia"
          title="Cuatro formas de volver a mirar"
          description="RIQSIY no es una guía turística: es una experiencia educativa que cambia la manera en que observas lo cotidiano."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Eye,
              titulo: "Descubre",
              texto: "Historia, ingeniería y relatos de cada sitio, con el botón “Lo veía, pero no lo conocía”.",
              to: "/descubre" as const,
            },
            {
              icon: Sparkles,
              titulo: "Mira más allá",
              texto: "Compara lo que ves con lo que realmente significa.",
              to: "/mira-mas-alla" as const,
            },
            {
              icon: QrCode,
              titulo: "Escanea y descubre",
              texto: "Cada sitio con su código QR: historia, curiosidad, reto y reflexión.",
              to: "/escanea" as const,
            },
            {
              icon: MapPin,
              titulo: "Mapa del patrimonio",
              texto: "Explora centros, paisajes, obras hidráulicas, caminos y andenes.",
              to: "/mapa" as const,
            },
          ].map((c) => (
            <Link
              key={c.titulo}
              to={c.to}
              className="shadow-stone group rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent"
            >
              <c.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-display text-xl">{c.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.texto}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Entrar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="surface-deep">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">Mira más allá</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Lo que veo · lo que realmente significa</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {MIRADAS.slice(0, 3).map((m) => (
              <div key={m.loQueVeo} className="rounded-lg border border-white/15 bg-white/5 p-6">
                <p className="font-display text-xl opacity-70">{m.loQueVeo}</p>
                <div className="andean-fret my-4 h-1.5 w-16" />
                <p className="text-sm leading-relaxed">{m.loQueSignifica}</p>
              </div>
            ))}
          </div>
          <Link
            to="/mira-mas-alla"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-soft"
          >
            Ver toda la experiencia <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle
          eyebrow="Descubre"
          title="Sitios listos para explorar"
          description={`${SITIOS.length} lugares del Cusco con historia, técnica constructiva, relatos y retos.`}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SITIOS.slice(0, 3).map((s) => (
            <Link
              key={s.slug}
              to="/descubre/$slug"
              params={{ slug: s.slug }}
              className="shadow-stone group overflow-hidden rounded-lg border border-border bg-card"
            >
              <img
                src={s.imagen}
                alt={s.nombre}
                loading="lazy"
                width={1280}
                height={853}
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-5">
                <h3 className="font-display text-xl">{s.nombre}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.ubicacion}</p>
                <p className="mt-3 text-sm">{s.resumen}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <SectionTitle
          eyebrow="Gamificación"
          title="Juega, gana RIQSI-COINS y sube de nivel"
          description="Cinco minijuegos, retos, insignias y recompensas por valorar el patrimonio cusqueño."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/juegos" as const, titulo: "Minijuegos", texto: "Encaja la piedra, Salva el agua, el andén, el Qhapaq Ñan y la sombra del Intihuatana." },
            { to: "/recompensas" as const, titulo: "Recompensas", texto: "Canjea tus RIQSI-COINS por insignias y certificados (convenios institucionales)." },
            { to: "/test" as const, titulo: "Test de valoración", texto: "Diagnóstico inicial y final: parte de la investigación científica del proyecto." },
            { to: "/historias" as const, titulo: "Historias", texto: "Registra testimonios orales de tu familia y comunidad sobre el patrimonio." },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="shadow-stone group rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent"
            >
              <h3 className="font-display text-xl">{c.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.texto}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Entrar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="gradient-earth shadow-stone rounded-xl p-8 text-stone-deep-foreground sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-80">Parte científica</p>
          <h2 className="mt-3 max-w-3xl font-display text-2xl sm:text-3xl">
            ¿Puede una experiencia educativa interactiva aumentar la valoración del patrimonio arqueológico
            local en estudiantes cusqueños?
          </h2>
          <Link
            to="/investigacion"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-background/95 px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            Ver nuestra investigación <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
