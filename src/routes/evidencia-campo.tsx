import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, FileQuestion, MapPinned, Video } from "lucide-react";
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

      <section className="mx-auto max-w-6xl px-4 py-14">
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

      <section className="bg-secondary/55 py-14">
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
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icono: MapPinned, titulo: "Recorrido", texto: "Acceso, terreno, desniveles, vegetación y relación visual con el entorno." },
            { icono: FileQuestion, titulo: "Preguntas", texto: "Origen, antigüedad, función y relación territorial permanecen abiertos hasta contar con respaldo." },
            { icono: Camera, titulo: "Documentación", texto: "Fotografías y videos propios permiten volver a observar sin convertir una impresión en un hecho." },
          ].map((item) => (
            <article key={item.titulo} className="border-t-2 border-accent pt-5"><item.icono className="h-6 w-6 text-primary" /><h2 className="mt-3 font-display text-xl">{item.titulo}</h2><p className="mt-2 text-sm text-muted-foreground">{item.texto}</p></article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild><Link to="/machu-muqu">Explorar Machu Moqo <ArrowRight /></Link></Button>
          <Button asChild variant="outline"><Link to="/investigacion">Continuar la investigación</Link></Button>
        </div>
      </section>
    </main>
  );
}