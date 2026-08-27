import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { useProgreso } from "@/lib/progress";
import {
  AUTOR,
  DIMENSIONES,
  ESCALA,
  TEST_FINAL,
  TEST_INICIAL,
  type PreguntaTest,
} from "@/lib/riqsiy-gamification";

export const Route = createFileRoute("/test")({
  head: () => ({
    meta: [
      { title: `Test de valoración patrimonial — RIQSIY | Autor: ${AUTOR}` },
      {
        name: "description",
        content:
          "Diagnóstico inicial y test final de RIQSIY: mide conocimiento, valoración, interés, pertenencia e intención de conservación del patrimonio cusqueño.",
      },
      { property: "og:title", content: "Test de valoración patrimonial | RIQSIY" },
      {
        property: "og:description",
        content: "Instrumento educativo de 10 ítems que mide el cambio en la valoración del patrimonio.",
      },
    ],
  }),
  component: TestPage,
});

function Formulario({
  fase,
  preguntas,
}: {
  fase: "inicial" | "final";
  preguntas: PreguntaTest[];
}) {
  const { guardarTest, testInicial, testFinal } = useProgreso();
  const guardado = fase === "inicial" ? testInicial : testFinal;
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const completo = preguntas.every((p) => respuestas[p.id]);

  if (guardado) {
    return (
      <div className="rounded-xl border border-accent bg-accent/10 p-6">
        <p className="flex items-center gap-2 font-display text-lg">
          <Check className="h-5 w-5" /> Test {fase} registrado
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(guardado.fecha).toLocaleDateString("es-PE")}
        </p>
        <div className="mt-4 space-y-3">
          {DIMENSIONES.map((d) => (
            <div key={d.id}>
              <div className="flex justify-between text-sm">
                <span>{d.label}</span>
                <span className="font-semibold">{guardado.dimensiones[d.id]}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${guardado.dimensiones[d.id]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="space-y-5">
        {preguntas.map((p, i) => (
          <div key={p.id} className="border-b border-border/60 pb-4 last:border-none">
            <p className="text-sm font-medium">
              {i + 1}. {p.texto}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ESCALA.map((e) => (
                <button
                  key={e.valor}
                  type="button"
                  onClick={() => setRespuestas((r) => ({ ...r, [p.id]: e.valor }))}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    respuestas[p.id] === e.valor
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={!completo}
        onClick={() => guardarTest(fase, respuestas)}
        className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
      >
        Enviar test {fase} (+100 RIQSI-COINS)
      </button>
    </div>
  );
}

function TestPage() {
  const { hidratado } = useProgreso();
  const [fase, setFase] = useState<"inicial" | "final">("inicial");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <SectionTitle
        eyebrow="Instrumento de investigación"
        title="Test de valoración patrimonial"
        description="Diez afirmaciones en escala Likert (1–5) agrupadas en cinco dimensiones. Responde el diagnóstico antes de explorar y el test final al terminar tu recorrido: la diferencia es el dato central de la investigación."
      />

      <div className="mt-8 flex gap-2">
        {(["inicial", "final"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFase(f)}
            className={`rounded-md px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              fase === f ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"
            }`}
          >
            Test {f}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {hidratado ? (
          <Formulario fase={fase} preguntas={fase === "inicial" ? TEST_INICIAL : TEST_FINAL} />
        ) : (
          <p className="text-muted-foreground">Cargando test…</p>
        )}
      </div>
    </div>
  );
}
