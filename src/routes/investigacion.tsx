import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { INVESTIGACION_DATA } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";

export const Route = createFileRoute("/investigacion")({
  head: () => ({
    meta: [
      { title: "Nuestra investigación — Metodología y resultados | RIQSIY" },
      {
        name: "description",
        content:
          "RIQSIY investiga si una experiencia educativa interactiva aumenta la valoración del patrimonio arqueológico local en estudiantes cusqueños.",
      },
      { property: "og:title", content: "Nuestra investigación | RIQSIY" },
      {
        property: "og:description",
        content: "Diseño pre-test / intervención / post-test con resultados de ejemplo.",
      },
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
          ¿Puede una experiencia educativa interactiva aumentar la valoración del patrimonio arqueológico local
          en estudiantes cusqueños?
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

      <section className="mt-12 rounded-lg border border-border bg-card p-6">
        <span className="inline-flex rounded-full border border-accent/60 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">Datos de demostración · no son resultados reales</span>
        <h2 className="mt-3 font-display text-2xl">Ejemplo de visualización de resultados</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Puntaje promedio sobre 100 en cada dimensión, antes y después de usar RIQSIY. Muestra piloto
          ficticia para comprobar la gráfica: 32 estudiantes de secundaria. No corresponde a una aplicación real.
        </p>
        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INVESTIGACION_DATA} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="dimension" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  color: "var(--foreground)",
                }}
              />
              <Legend />
              <Bar dataKey="antes" name="Antes" fill="var(--earth)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despues" name="Después" fill="var(--gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {INVESTIGACION_DATA.map((d) => (
            <div key={d.dimension} className="rounded-md border border-border p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{d.dimension}</p>
              <p className="mt-1 font-display text-2xl text-primary">+{d.despues - d.antes} pts</p>
              <p className="text-xs text-muted-foreground">
                {d.antes} → {d.despues}
              </p>
            </div>
          ))}
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
