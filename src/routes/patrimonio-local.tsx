import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Eye,
  HelpCircle,
  ImageIcon,
  MapPin,
  Video,
  X,
} from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { useProgreso } from "@/lib/progress";
import { EXPERIENCIA_LOCAL_ID } from "@/lib/riqsiy-gamification";

export const Route = createFileRoute("/patrimonio-local")({
  head: () => ({
    meta: [
      { title: "Descubriendo nuestro patrimonio local | RIQSIY" },
      {
        name: "description",
        content:
          "Experiencia RIQSIY para observar, investigar y valorar un sitio arqueológico local documentado por el equipo del proyecto con fotografías y videos propios.",
      },
      { property: "og:title", content: "Descubriendo nuestro patrimonio local | RIQSIY" },
      {
        property: "og:description",
        content:
          "Observamos evidencias, formulamos preguntas de investigación y promovemos la valoración del patrimonio de nuestra comunidad.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PatrimonioLocal,
});

/* --------------------------------- Contenido -------------------------------- */

const RECORRIDO = [
  {
    n: 1,
    titulo: "Llegada al sitio",
    observacion:
      "Registro del acceso al lugar y de las condiciones del terreno al momento de la visita del equipo.",
  },
  {
    n: 2,
    titulo: "Primeras evidencias",
    observacion: "Presencia de piedras dispuestas en superficie, visibles desde el ingreso al área.",
  },
  {
    n: 3,
    titulo: "Estructuras de piedra",
    observacion: "Alineamientos y agrupaciones de piedra observables; su función es un elemento por investigar.",
  },
  {
    n: 4,
    titulo: "Sector con vegetación",
    observacion: "Sector donde la vegetación cubre parcialmente las estructuras y limita la observación.",
  },
  {
    n: 5,
    titulo: "Vista del entorno",
    observacion: "Relación visual del sitio con el paisaje circundante: laderas, quebradas y zonas de cultivo.",
  },
  {
    n: 6,
    titulo: "Elementos que requieren investigación",
    observacion: "Evidencias cuyo origen, antigüedad y función aún no pueden afirmarse sin fuentes verificables.",
  },
];

const OBSERVAMOS = [
  { icono: "🧱", texto: "Muros o alineamientos de piedra." },
  { icono: "🌿", texto: "Estructuras parcialmente cubiertas por vegetación." },
  { icono: "🪨", texto: "Diferentes concentraciones de piedras en el terreno." },
  { icono: "🏔️", texto: "Relación del sitio con el paisaje que lo rodea." },
  { icono: "🛤️", texto: "Caminos o accesos visibles hacia el área." },
];

const PREGUNTAS = [
  { q: "¿Quiénes construyeron estas estructuras?", a: "Elemento por investigar: requiere fuentes arqueológicas y bibliográficas verificables." },
  { q: "¿Para qué fueron utilizadas?", a: "Solo podemos describir lo observado; la función es una hipótesis a contrastar." },
  { q: "¿Qué antigüedad podrían tener?", a: "No es posible afirmar fechas sin estudios especializados." },
  { q: "¿Cómo se relacionaban con el territorio?", a: "Analizaremos la ubicación, la visibilidad y el acceso al agua y a zonas de cultivo." },
  { q: "¿Qué conocimientos tecnológicos fueron utilizados?", a: "Compararemos las técnicas observadas con estudios sobre tecnología andina." },
  { q: "¿Qué importancia tiene este sitio para nuestra comunidad?", a: "Recogeremos testimonios orales de vecinos y familias." },
  { q: "¿Por qué actualmente es poco conocido?", a: "Observamos poca o ninguna señalización interpretativa para visitantes." },
  { q: "¿Qué podemos hacer para promover su valoración y protección?", a: "Difusión responsable, señalización educativa y experiencias como RIQSIY." },
];

const VEO = ["Piedras", "Vegetación", "Paisaje", "Estructuras"];
const COMPRENDER = ["Historia", "Función", "Tecnología", "Relación con el territorio", "Significado cultural"];
const HACER = ["Investigar", "Valorar", "Proteger", "Difundir responsablemente"];

const GALERIA = [
  { id: "principal", titulo: "Vista general del sitio", descripcion: "Espacio reservado para la fotografía principal del recorrido." },
  { id: "f2", titulo: "Alineamiento de piedra", descripcion: "Espacio reservado para una fotografía de detalle de las estructuras." },
  { id: "f3", titulo: "Sector con vegetación", descripcion: "Espacio reservado para una fotografía del sector cubierto por vegetación." },
  { id: "f4", titulo: "Entorno y paisaje", descripcion: "Espacio reservado para una fotografía del entorno del sitio." },
  { id: "f5", titulo: "Acceso al sitio", descripcion: "Espacio reservado para una fotografía del camino o acceso observado." },
];

/* --------------------------------- Componente ------------------------------- */

function PatrimonioLocal() {
  const { completarExperiencia, experiencias, hidratado } = useProgreso();
  const [abiertas, setAbiertas] = useState<string[]>([]);
  const [visitados, setVisitados] = useState<number[]>([]);
  const [zoom, setZoom] = useState<(typeof GALERIA)[number] | null>(null);

  const completada = hidratado && experiencias.includes(EXPERIENCIA_LOCAL_ID);
  const listo = visitados.length === RECORRIDO.length && abiertas.length >= 4;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      {/* Encabezado */}
      <header className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="gradient-earth p-8 text-stone-deep-foreground sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-80">Patrimonio de nuestra comunidad</p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-5xl">
            Descubriendo nuestro patrimonio local
          </h1>
          <p className="mt-4 max-w-2xl text-base opacity-90">
            Una experiencia para observar, investigar y valorar lo que existe en nuestro propio territorio.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/investigacion"
              className="inline-flex items-center gap-2 rounded-md bg-background/95 px-5 py-2.5 text-sm font-semibold text-foreground"
            >
              ¿Por qué investigamos este sitio? <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/mapa"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              <MapPin className="h-4 w-4" /> UBICAR EN EL MAPA
            </Link>
          </div>
        </div>
      </header>

      {/* A. Introducción */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Introducción"
          title="Un sitio arqueológico local, identificado y recorrido por nosotros"
          description="El sitio fue identificado y recorrido por integrantes del proyecto RIQSIY, y documentado mediante fotografías y videos propios. Presenta estructuras de piedra y restos visibles en el terreno, con poca o ninguna señalización interpretativa para los visitantes."
        />
        <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-5 text-sm">
          <p className="font-semibold">Nota metodológica</p>
          <p className="mt-1 text-muted-foreground">
            Mientras no contemos con investigación y fuentes verificables, describimos únicamente la{" "}
            <strong>evidencia observada</strong>. No afirmamos el nombre histórico, la antigüedad, la cultura
            constructora ni la función de las estructuras: cada uno de esos puntos es un{" "}
            <strong>elemento por investigar</strong>.
          </p>
        </div>
      </section>

      {/* B. Galería */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Galería"
          title="Registro fotográfico del equipo"
          description="Espacios preparados para las fotografías reales del sitio. Toca una imagen para ver la vista ampliada y la descripción de lo observable."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {GALERIA.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setZoom(g)}
              className={`shadow-stone group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-all hover:-translate-y-1 hover:border-accent ${
                i === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div
                className={`stone-grid flex items-center justify-center bg-secondary ${i === 0 ? "h-64 lg:h-80" : "h-40"}`}
              >
                <span className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-7 w-7" />
                  <span className="text-[11px] uppercase tracking-[0.2em]">
                    {i === 0 ? "Fotografía principal" : "Fotografía del sitio"}
                  </span>
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg">{g.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{g.descripcion}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* C. Recorrido */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Recorrido"
          title="Seis puntos de observación"
          description="Marca cada punto que revises. Cada uno está preparado para incorporar después nuestras fotografías y videos."
        />
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {RECORRIDO.map((p) => {
            const visto = visitados.includes(p.n);
            return (
              <li
                key={p.n}
                className={`shadow-stone rounded-lg border bg-card p-5 transition-colors ${
                  visto ? "border-accent" : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                    {p.n}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg">
                      PUNTO {p.n} — {p.titulo}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.observacion}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded border border-dashed border-border px-2 py-1">
                        <Camera className="h-3 w-3" /> Foto pendiente
                      </span>
                      <span className="inline-flex items-center gap-1 rounded border border-dashed border-border px-2 py-1">
                        <Video className="h-3 w-3" /> Video pendiente
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVisitados((v) => (v.includes(p.n) ? v : [...v, p.n]))}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                    >
                      {visto ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Eye className="h-4 w-4" />}
                      {visto ? "Punto observado" : "Marcar como observado"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 3. Lo que observamos */}
      <section className="surface-deep mt-14 rounded-xl">
        <div className="p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">Lo que observamos</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">¿Qué observamos?</h2>
          <p className="mt-3 max-w-2xl text-sm opacity-85">
            Lenguaje de observación: describimos lo visible, sin afirmar origen, antigüedad ni función.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OBSERVAMOS.map((o) => (
              <div key={o.texto} className="rounded-lg border border-white/15 bg-white/5 p-5">
                <span className="text-2xl">{o.icono}</span>
                <div className="andean-fret my-3 h-1.5 w-14" />
                <p className="text-sm leading-relaxed">{o.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Preguntas */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Lo que queremos investigar"
          title="Preguntas que nos dejó el sitio"
          description="Abre cada pregunta para ver cómo la abordaremos en la investigación del proyecto."
        />
        <div className="mt-8 grid gap-3">
          {PREGUNTAS.map((p) => {
            const open = abiertas.includes(p.q);
            return (
              <div key={p.q} className="shadow-stone rounded-lg border border-border bg-card">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setAbiertas((a) => (a.includes(p.q) ? a.filter((x) => x !== p.q) : [...a, p.q]))}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left"
                >
                  <HelpCircle className="h-4 w-4 shrink-0 text-primary" />
                  <span className="flex-1 font-medium">{p.q}</span>
                  <span className="text-sm text-muted-foreground">{open ? "−" : "+"}</span>
                </button>
                {open && <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">{p.a}</p>}
              </div>
            );
          })}
        </div>
        <Link
          to="/investigacion"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          Continuar hacia la investigación <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* 5. Observar no es lo mismo que conocer */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Filosofía RIQSIY"
          title="Observar no es lo mismo que conocer"
          description="Tres momentos de la mirada: ver, comprender y actuar."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { titulo: "Lo que veo", items: VEO, tono: "border-border" },
            { titulo: "Lo que quiero comprender", items: COMPRENDER, tono: "border-primary/50" },
            { titulo: "Lo que puedo hacer", items: HACER, tono: "border-accent" },
          ].map((c) => (
            <div key={c.titulo} className={`shadow-stone rounded-lg border bg-card p-6 ${c.tono}`}>
              <h3 className="font-display text-xl">{c.titulo}</h3>
              <div className="andean-fret my-3 h-1.5 w-16" />
              <ul className="grid gap-2 text-sm text-muted-foreground">
                {c.items.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Videos */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Registro propio"
          title="Así encontramos el sitio"
          description="Nuestro recorrido permitió observar directamente las características del lugar y registrar evidencias mediante fotografías y videos."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {["Recorrido general del sitio", "Detalle de las estructuras de piedra"].map((t) => (
            <div key={t} className="shadow-stone overflow-hidden rounded-lg border border-border bg-card">
              <div className="stone-grid grid h-52 place-items-center bg-secondary">
                <span className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Video className="h-8 w-8" />
                  <span className="text-[11px] uppercase tracking-[0.2em]">Espacio para video propio</span>
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Se incorporará el video grabado por el equipo durante la visita.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Mapa */}
      <section className="mt-14">
        <div className="shadow-stone rounded-xl border border-border bg-card p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-foreground/70">Ubicación</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl">Marcador preparado, sin coordenadas</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            El sitio tendrá su marcador y recorrido interactivo en el mapa cuando confirmemos su ubicación con
            fuentes verificables y con la autorización correspondiente. No usamos coordenadas inventadas.
          </p>
          <Link
            to="/mapa"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <MapPin className="h-4 w-4" /> UBICAR EN EL MAPA
          </Link>
        </div>
      </section>

      {/* 9 + 10. Cierre: juegos y progreso */}
      <section className="mt-14">
        <div className="gradient-earth shadow-stone rounded-xl p-8 text-stone-deep-foreground sm:p-12">
          <h2 className="max-w-2xl font-display text-2xl sm:text-3xl">
            Ahora que conoces nuestro patrimonio, pon a prueba lo aprendido.
          </h2>
          <p className="mt-3 max-w-2xl text-sm opacity-85">
            Los minijuegos trabajan los conocimientos tecnológicos andinos que queremos investigar en el sitio:
            la construcción en piedra y el manejo del agua.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Link
              to="/juegos/$id"
              params={{ id: "encaja-la-piedra" }}
              className="rounded-lg border border-white/25 bg-white/10 p-5 transition-colors hover:bg-white/15"
            >
              <p className="font-display text-xl">🪨 PIRQA — Maestro de la Piedra</p>
              <p className="mt-1 text-sm opacity-85">Encaja los sillares y comprende la técnica constructiva.</p>
            </Link>
            <Link
              to="/juegos/$id"
              params={{ id: "salva-el-agua" }}
              className="rounded-lg border border-white/25 bg-white/10 p-5 transition-colors hover:bg-white/15"
            >
              <p className="font-display text-xl">💧 SALVA EL AGUA — Guardián del Agua</p>
              <p className="mt-1 text-sm opacity-85">Conduce el agua como lo hicieron las obras hidráulicas andinas.</p>
            </Link>
          </div>

          <div className="mt-8 rounded-lg bg-background/95 p-6 text-foreground">
            {completada ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl">🗺️</span>
                <div>
                  <p className="font-display text-lg">Insignia obtenida: Explorador del Patrimonio Local</p>
                  <p className="text-sm text-muted-foreground">
                    Tu avance quedó registrado en{" "}
                    <Link to="/progreso" className="font-semibold text-primary">
                      Mi progreso
                    </Link>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="font-display text-lg">Completa la experiencia</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Marca los 6 puntos del recorrido y abre al menos 4 preguntas de investigación para obtener{" "}
                  <strong>+120 RIQSI-COINS</strong> y la insignia “Explorador del Patrimonio Local”.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Puntos observados: {visitados.length}/6 · Preguntas abiertas: {Math.min(abiertas.length, 8)}/8
                </p>
                <button
                  type="button"
                  disabled={!listo}
                  onClick={() => completarExperiencia(EXPERIENCIA_LOCAL_ID, 120)}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Completar experiencia <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Vista ampliada */}
      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4"
          onClick={() => setZoom(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="stone-grid grid h-72 place-items-center bg-secondary">
              <span className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-9 w-9" />
                <span className="text-[11px] uppercase tracking-[0.2em]">Vista ampliada · foto real pendiente</span>
              </span>
            </div>
            <div className="flex items-start gap-4 p-5">
              <div className="min-w-0">
                <h3 className="font-display text-xl">{zoom.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{zoom.descripcion}</p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setZoom(null)}
                className="ml-auto rounded-md border border-border p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
