import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";

export const Route = createFileRoute("/por-que")({
  head: () => ({
    meta: [
      { title: "¿Por qué existe RIQSIY? — El problema de mirar sin ver" },
      {
        name: "description",
        content:
          "Muchos jóvenes cusqueños pasan a diario junto a sitios arqueológicos sin reconocer su valor. RIQSIY busca cambiar esa mirada.",
      },
      { property: "og:title", content: "¿Por qué existe RIQSIY?" },
      {
        property: "og:description",
        content: "El problema cultural de la costumbre: ver el patrimonio todos los días y dejar de mirarlo.",
      },
    ],
  }),
  component: PorQue,
});

const RAZONES = [
  {
    titulo: "La costumbre apaga la mirada",
    texto:
      "Cuando algo forma parte del paisaje diario deja de llamar la atención. El patrimonio se convierte en “el muro de siempre” o “las piedras del cerro”.",
  },
  {
    titulo: "Sin conocimiento no hay valoración",
    texto:
      "No se protege lo que no se comprende. Si nadie explica la ingeniería, la astronomía y la organización social detrás de cada sitio, se pierde su sentido.",
  },
  {
    titulo: "Sin valoración no hay conservación",
    texto:
      "El deterioro empieza con pequeños actos: basura, rayaduras, pisoteo. Detrás de cada uno hay una idea: “es solo una piedra”.",
  },
];

function PorQue() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <SectionTitle
        eyebrow="El origen del proyecto"
        title="¿Por qué existe RIQSIY?"
        description="Riqsiy significa “conocer, reconocer” en quechua. El proyecto nace de una observación simple en las calles y carreteras del Cusco."
      />

      <blockquote className="surface-deep mt-10 rounded-lg p-8 font-display text-2xl leading-snug">
        “Estamos acostumbrados a ver nuestro patrimonio, pero hemos dejado de mirarlo realmente.”
      </blockquote>

      <div className="mt-10 grid gap-4">
        {RAZONES.map((r, i) => (
          <article key={r.titulo} className="rounded-lg border border-border bg-card p-6">
            <span className="font-display text-3xl text-accent">0{i + 1}</span>
            <h3 className="mt-2 font-display text-xl">{r.titulo}</h3>
            <p className="mt-2 text-muted-foreground">{r.texto}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-accent/40 bg-accent/10 p-6">
        <h3 className="font-display text-xl">Qué NO es RIQSIY</h3>
        <p className="mt-2 text-muted-foreground">
          No es una aplicación turística ni un catálogo de fotos bonitas. Es una herramienta educativa con una
          pregunta de investigación detrás y una forma de medir si realmente cambia la valoración del
          patrimonio en estudiantes.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/descubre"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Comenzar a descubrir <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/investigacion"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold"
          >
            Ver la investigación
          </Link>
        </div>
      </div>
    </div>
  );
}
