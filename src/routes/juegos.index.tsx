import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Gamepad2 } from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { JUEGOS } from "@/lib/riqsiy-juegos";
import { useProgreso } from "@/lib/progress";

export const Route = createFileRoute("/juegos/")({
  head: () => ({
    meta: [
      { title: "Minijuegos RIQSIY — Aprende jugando el patrimonio | Autor: A. Vásquez" },
      {
        name: "description",
        content:
          "Cinco minijuegos educativos sobre arquitectura inca, canales, andenes, el Qhapaq Ñan y observación solar. Gana RIQSI-COINS mientras aprendes.",
      },
      { property: "og:title", content: "Minijuegos RIQSIY" },
      {
        property: "og:description",
        content: "Encaja la piedra, Salva el agua, Construye el andén, Qhapaq Ñan y Sigue la sombra.",
      },
    ],
  }),
  component: JuegosIndex,
});

function JuegosIndex() {
  const { juegosCompletados, hidratado } = useProgreso();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <SectionTitle
        eyebrow="Jugar para comprender"
        title="Minijuegos RIQSIY"
        description="Cada minijuego enseña una tecnología real de los Andes: no son juegos genéricos, son experiencias de aprendizaje con recompensa en RIQSI-COINS."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {JUEGOS.map((j) => {
          const hecho = hidratado && juegosCompletados.includes(j.id);
          return (
            <Link
              key={j.id}
              to="/juegos/$id"
              params={{ id: j.id }}
              className="shadow-stone group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{j.icono}</span>
                {hecho && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-jade/20 px-2.5 py-1 text-xs font-semibold">
                    <Check className="h-3 w-3" /> Completado
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{j.tema}</p>
              <h3 className="mt-1 font-display text-xl">{j.titulo}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{j.lema}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="rounded-full bg-gold/25 px-3 py-1 font-semibold">🟡 +{j.recompensa}</span>
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  <Gamepad2 className="h-4 w-4" /> Jugar
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Los minijuegos presentan contenido educativo contextualizado. Cuando una función o interpretación está
        discutida por la arqueología, se indica dentro del juego.
      </p>
    </div>
  );
}
