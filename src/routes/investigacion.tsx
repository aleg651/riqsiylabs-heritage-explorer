import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";

export const Route = createFileRoute("/investigacion")({
  head: () => ({
    meta: [
      { title: "Nuestra investigación — Metodología y resultados | RIQSIY" },
      {
        name: "description",
        content:
          "Problema, pregunta, hipótesis, variables y metodología de la investigación escolar RIQSIY, sin presentar resultados antes de su aplicación.",
      },
      { property: "og:title", content: "Nuestra investigación | RIQSIY" },
      {
        property: "og:description",
        content: "Diseño pretest, uso de RIQSIY, postest, comparación, análisis y conclusiones pendientes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Investigacion,
});

const ETAPAS = [
  {
    nombre: "Antes",
    detalle:
      "Se aplica un cuestionario de línea base a los estudiantes: cuánto conocen los sitios de su distrito, cuánto los valoran y qué intención de conservación declaran.",
    instrumento: "Cuestionario de 10 ítems (escala Likert 1–5). Instrumento escolar pendiente de validación psicométrica.",
  },
  {
    nombre: "Intervención",
    detalle:
      "Los estudiantes usan RIQSIY durante las sesiones: exploran Descubre, Mira más allá, Escanea y descubre, resuelven Retos RIQSIY y asumen un compromiso.",
    instrumento: "Sesiones guiadas con duración pendiente de definir + registro de RIQSI-COINS dentro de la app.",
  },
  {
    nombre: "Después",
    detalle:
      "Se vuelve a medir conocimiento, valoración, interés e intención de conservación con el mismo instrumento, más una reflexión escrita.",
    instrumento: "Postest equivalente de 10 ítems + comparación descriptiva por dimensión.",
  },
];

const RUTA_CIENTIFICA = [
  ["PROBLEMA", "Patrimonio cercano que puede pasar desapercibido o ser poco conocido."],
  ["PREGUNTA DE INVESTIGACIÓN", "Medir en qué medida RIQSIY puede incrementar interés, conocimiento y valoración."],
  ["HIPÓTESIS", "El uso de la experiencia podría fortalecer las dimensiones evaluadas."],
  ["VARIABLES", "Independiente: uso de RIQSIY. Dependientes: interés, conocimiento, valoración y protección."],
  ["METODOLOGÍA", "Diseño escolar de medición antes y después de la experiencia."],
  ["PRETEST", "Cuestionario inicial de 10 ítems; pendiente de aplicación real."],
  ["USO DE RIQSIY", "Exploración, evidencia, 3D, juegos, quechua, reflexión y protección."],
  ["POSTEST", "Cuestionario equivalente; pendiente de aplicación real."],
  ["ANÁLISIS", "Comparación por dimensión únicamente cuando existan datos reales."],
  ["CONCLUSIONES", "Pendientes de aplicación y análisis; no se anticipan resultados."],
] as const;

function Investigacion() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <SectionTitle
        eyebrow="Parte científica"
        title="Nuestra investigación"
        description="RIQSIY no es solamente una aplicación: es el instrumento de un estudio educativo con estudiantes cusqueños."
      />

      <div className="surface-deep mt-8 rounded-lg p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">Pregunta de investigación</p>
        <p className="mt-3 font-display text-2xl leading-snug">
          ¿En qué medida el uso de RIQSIY, una plataforma web interactiva basada en exploración, experiencias y
          minijuegos educativos, puede incrementar el interés, conocimiento y valoración del patrimonio arqueológico
          del Cusco en los jóvenes?
        </p>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {ETAPAS.map((e, i) => (
          <article key={e.nombre} className="shadow-stone rounded-lg border border-border bg-card p-6">
            <span className="font-display text-3xl text-accent">0{i + 1}</span>
            <h2 className="mt-2 font-display text-xl">{e.nombre}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{e.detalle}</p>
            <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">{e.instrumento}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2">
        <article className="border-l-2 border-primary pl-5">
          <p className="text-xs font-semibold uppercase text-primary">Problema</p>
          <p className="mt-2 text-sm text-muted-foreground">En diferentes comunidades del Cusco existen sitios arqueológicos y elementos patrimoniales que forman parte del entorno de los jóvenes, pero pueden pasar desapercibidos o ser poco conocidos.</p>
        </article>
        <article className="border-l-2 border-accent pl-5">
          <p className="text-xs font-semibold uppercase text-primary">Objetivo general</p>
          <p className="mt-2 text-sm text-muted-foreground">Determinar en qué medida el uso de RIQSIY contribuye a incrementar el interés, conocimiento y valoración del patrimonio arqueológico del Cusco en los jóvenes.</p>
        </article>
        <article className="border-l-2 border-primary pl-5 md:col-span-2">
          <p className="text-xs font-semibold uppercase text-primary">Hipótesis</p>
          <p className="mt-2 text-sm text-muted-foreground">Si los jóvenes utilizan RIQSIY, que integra exploración, experiencias y minijuegos educativos, entonces aumentarán su interés, conocimiento, valoración y actitud de protección del patrimonio de su entorno.</p>
        </article>
      </section>

      <section className="mt-12" aria-labelledby="ruta-cientifica">
        <h2 id="ruta-cientifica" className="font-display text-2xl">Ruta científica completa</h2>
        <p className="mt-2 text-sm text-muted-foreground">Del problema a las conclusiones, sin anticipar resultados.</p>
        <ol className="mt-6 grid gap-0">
          {RUTA_CIENTIFICA.map(([paso, detalle], index) => (
            <li key={paso} className="relative grid gap-2 border-l-2 border-accent pb-7 pl-8 sm:grid-cols-[12rem_1fr] sm:gap-4">
              <span className="absolute -left-[0.82rem] top-0 grid h-6 w-6 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{index + 1}</span>
              <h3 className="font-display text-lg">{paso}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{detalle}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-2xl">Laboratorio RIQSIY — Investigación</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['PROBLEMA','Baja conexión de estudiantes con el patrimonio local: formulación por contrastar en el diagnóstico.'],
            ['PREGUNTA','¿Puede RIQSIY aumentar la valoración patrimonial?'],
            ['HIPÓTESIS','La experiencia podría incrementar valoración e intención de conservación.'],
            ['VARIABLE INDEPENDIENTE','Uso de la experiencia educativa RIQSIY.'],
            ['VARIABLES DEPENDIENTES','Conocimiento, valoración, interés, pertenencia e intención de conservación.'],
            ['METODOLOGÍA','Diseño escolar pretest → intervención → postest; muestra y duración pendientes de definir.'],
            ['PRETEST','Instrumento de 10 ítems pendiente de validación psicométrica.'],
            ['INTERVENCIÓN','Exploración guiada de contenidos, 3D, juegos, quechua, comunidad y protección.'],
            ['POSTEST','Instrumento equivalente de 10 ítems.'],
            ['ANÁLISIS','Comparación descriptiva por dimensión; pendiente de aplicación real.'],
            ['CONCLUSIONES','PENDIENTE DE APLICACIÓN: todavía no existen resultados reales.'],
          ].map(([t,d])=><article key={t} className="rounded-md border border-border p-4"><span className="text-xs font-semibold text-primary">{t}</span><p className="mt-2 text-sm text-muted-foreground">{d}</p></article>)}
        </div>
      </section>

      <section className="mt-12 rounded-lg border border-accent/60 bg-accent/10 p-6">
        <span className="inline-flex rounded-full border border-accent/60 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">Estado actual</span>
        <h2 className="mt-3 font-display text-2xl">Resultados pendientes de aplicación y análisis</h2>
        <p className="mt-2 text-sm text-muted-foreground">Los gráficos se mostrarán únicamente cuando existan datos reales. Entonces podrán compararse pretest y postest por interés, conocimiento, valoración y protección.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Conocimiento", "Interés", "Valoración", "Actitud de protección"].map((dimension) => <article key={dimension} className="rounded-md border border-border bg-background p-4"><h3 className="font-semibold">{dimension}</h3><div className="mt-4 grid gap-2"><div className="h-3 rounded-full bg-secondary"/><div className="h-3 rounded-full bg-secondary"/></div><p className="mt-3 text-xs text-muted-foreground">Pretest y postest: datos pendientes.</p></article>)}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-accent/40 bg-accent/10 p-6">
        <h2 className="font-display text-xl">Hipótesis y siguientes pasos</h2>
        <p className="mt-2 text-muted-foreground">
          Hipótesis por contrastar: la experiencia interactiva podría incrementar la valoración y la intención de
          conservación. La aplicación, muestra, comparación y seguimiento permanecen pendientes de ejecución;
          todavía no existen resultados para aceptar o rechazar esta hipótesis.
        </p>
      </section>
    </div>
  );
}
