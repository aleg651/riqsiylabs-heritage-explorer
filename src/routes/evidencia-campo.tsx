import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Camera, Code2, Eye, FileQuestion, Video } from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { Button } from "@/components/ui/button";
import { ESTADOS_EVIDENCIA, REGISTROS_CAMPO, VIDEOS_CAMPO } from "@/lib/riqsiy-regional";

export const Route = createFileRoute("/evidencia-campo")({
  head: () => ({
    meta: [
      { title: "Evidencia de campo — Machu Moqo | RIQSIY" },
      { name: "description", content: "Fotografías, videos y observaciones propias del trabajo de campo de RIQSIY en Machu Moqo." },
      { property: "og:title", content: "Evidencia de campo — Machu Moqo | RIQSIY" },
      { property: "og:description", content: "Registro propio del territorio que separa observación, interpretación y preguntas abiertas." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EvidenciaCampoPage,
});

function EvidenciaCampoPage() {
  const secciones = [
    { href: "#fotografias", icono: Camera, texto: "Fotografías" },
    { href: "#videos", icono: Video, texto: "Videos" },
    { href: "#observaciones", icono: Eye, texto: "Observaciones" },
    { href: "#preguntas", icono: FileQuestion, texto: "Preguntas" },
    { href: "#fuentes", icono: BookOpen, texto: "Fuentes" },
    { href: "#proceso", icono: Code2, texto: "Proceso de desarrollo" },
  ];
  return (
    <main className="pb-10">
      <section className="surface-deep stone-grid">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">Trabajo de campo</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold sm:text-6xl">EVIDENCIA DE CAMPO</h1>
          <p className="mt-4 max-w-3xl text-base opacity-85 sm:text-lg">
            RIQSIY no solamente fue diseñado desde una computadora. Parte de la observación de nuestro propio territorio.
          </p>
        </div>
      </section>

      <nav aria-label="Secciones de evidencia" className="sticky top-[65px] z-30 overflow-x-auto border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-max max-w-6xl gap-2">
          {secciones.map((item) => <a key={item.href} href={item.href} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold"><item.icono className="h-4 w-4 text-primary" />{item.texto}</a>)}
        </div>
      </nav>

      <section id="fotografias" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-14">
        <SectionTitle
          eyebrow="Registro propio"
          title="Lo que documentamos en Machu Moqo"
          description="Las fotografías y videos pertenecen al registro del equipo. Las descripciones se limitan a lo visible y cada interpretación queda como pregunta por contrastar."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {REGISTROS_CAMPO.map((registro) => {
            const estado = ESTADOS_EVIDENCIA[registro.estado];
            return (
              <article key={registro.id} className="shadow-stone overflow-hidden rounded-lg border border-border bg-card">
                <img src={registro.src} alt={`Registro propio: ${registro.titulo}`} className="aspect-[16/10] w-full object-cover" loading="lazy" />
                <div className="p-5">
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${estado.clase}`}>{estado.etiqueta}</span>
                  <h2 className="mt-3 font-display text-xl">{registro.titulo}</h2>
                  <p className="mt-1 text-xs text-muted-foreground"><Camera className="mr-1 inline h-3.5 w-3.5" />{registro.tipo}</p>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div><dt className="font-semibold">¿Qué observamos?</dt><dd className="mt-1 text-muted-foreground">{registro.observacion}</dd></div>
                    <div><dt className="font-semibold">Pregunta abierta</dt><dd className="mt-1 text-muted-foreground">{registro.pregunta}</dd></div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="videos" className="scroll-mt-32 bg-secondary/55 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="Registro audiovisual" title="Recorrido y territorio" description="Videos propios conservados sin sustituirlos por material de internet." />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {VIDEOS_CAMPO.map((video) => (
              <article key={video.id} className="overflow-hidden rounded-lg border border-border bg-card">
                <video controls preload="metadata" className="aspect-video w-full bg-stone-deep" aria-label={video.titulo}>
                  <source src={video.src} type="video/mp4" />
                </video>
                <div className="p-5"><h2 className="flex items-center gap-2 font-display text-xl"><Video className="h-5 w-5 text-primary" />{video.titulo}</h2><p className="mt-2 text-sm text-muted-foreground">{video.descripcion}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { id: "observaciones", icono: Eye, titulo: "Observaciones", texto: "Acceso, terreno, desniveles, vegetación y relación visual con el entorno, descritos sin atribuir funciones." },
            { id: "preguntas", icono: FileQuestion, titulo: "Preguntas de investigación", texto: "Origen, antigüedad, función y relación territorial permanecen abiertos hasta contar con respaldo." },
            { id: "fuentes", icono: BookOpen, titulo: "Fuentes", texto: "Registro fotográfico y audiovisual propio. Las referencias históricas y arqueológicas especializadas todavía requieren investigación." },
          ].map((item) => (
            <article id={item.id} key={item.titulo} className="scroll-mt-32 border-t-2 border-accent pt-5"><item.icono className="h-6 w-6 text-primary" /><h2 className="mt-3 font-display text-xl">{item.titulo}</h2><p className="mt-2 text-sm text-muted-foreground">{item.texto}</p></article>
          ))}
        </div>
        <article id="proceso" className="mt-10 scroll-mt-32 border-t-2 border-primary pt-6">
          <Code2 className="h-6 w-6 text-primary" />
          <h2 className="mt-3 font-display text-2xl">Proceso de desarrollo</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">La experiencia conecta observación del territorio, organización de registros, formulación de preguntas, diseño de actividades y creación de una representación digital referencial.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["Observación y registro de campo", "Clasificación de evidencias", "Diseño de experiencias educativas", "Pruebas y mejora de RIQSIY"].map((paso, index) => <div key={paso} className="rounded-md border border-border bg-card p-4"><span className="text-xs font-semibold text-primary">PASO {index + 1}</span><p className="mt-2 text-sm font-medium">{paso}</p></div>)}
          </div>
          <p className="mt-4 rounded-md border border-dashed border-border bg-secondary/40 p-4 text-sm text-muted-foreground"><strong className="text-foreground">Evidencia pendiente de incorporación:</strong> capturas y documentos adicionales del proceso se añadirán únicamente cuando estén disponibles y verificados.</p>
        </article>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild><Link to="/machu-muqu">Explorar Machu Moqo <ArrowRight /></Link></Button>
          <Button asChild variant="outline"><Link to="/investigacion">Continuar la investigación</Link></Button>
        </div>
      </section>
    </main>
  );
}