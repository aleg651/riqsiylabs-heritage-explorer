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
    instrumento: "Cuestionario de 20 ítems (escala Likert 1–5) + 3 preguntas abiertas.",
  },
  {
    nombre: "Intervención",
    detalle:
      "Los estudiantes usan RIQSIY durante las sesiones: exploran Descubre, Mira más allá, Escanea y descubre, resuelven Retos RIQSIY y asumen un compromiso.",
    instrumento: "Sesiones guiadas de 45 minutos + registro de Puntos de Identidad dentro de la app.",
  },
  {
    nombre: "Después",
    detalle:
      "Se vuelve a medir conocimiento, valoración, interés e intención de conservación con el mismo instrumento, más una reflexión escrita.",
    instrumento: "Post-test idéntico + comparación de medias por dimensión.",
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

      <section className="mt-12 rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-2xl">Resultados (datos de ejemplo)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Puntaje promedio sobre 100 en cada dimensión, antes y después de usar RIQSIY. Muestra piloto
          simulada: 32 estudiantes de secundaria.
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
          Hipótesis: la experiencia interactiva incrementa significativamente la valoración y la intención de
          conservación frente a una clase expositiva tradicional. Siguientes pasos: aplicar el estudio con
          grupo control, ampliar la muestra a tres instituciones educativas y medir la retención a los tres
          meses.
        </p>
      </section>
    </div>
  );
}
