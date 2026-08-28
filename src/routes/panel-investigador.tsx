import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Download } from "lucide-react";
import { toast } from "sonner";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { AUTOR, DIMENSIONES } from "@/lib/riqsiy-gamification";
import { useProgreso } from "@/lib/progress";

export const Route = createFileRoute("/panel-investigador")({
  head: () => ({
    meta: [
      { title: `Panel del investigador | RIQSIY · Autor: ${AUTOR}` },
      {
        name: "description",
        content: "Panel restringido del investigador: resultados agregados anónimos del proyecto RIQSIY.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Panel,
});

const CLAVE = "RIQSIY2026";

function Panel() {
  const [clave, setClave] = useState("");
  const [acceso, setAcceso] = useState(false);
  const progreso = useProgreso();

  const intentar = (e: React.FormEvent) => {
    e.preventDefault();
    if (clave.trim().toUpperCase() === CLAVE) {
      setAcceso(true);
      toast.success("Acceso concedido", { description: "Panel de investigación desbloqueado." });
    } else {
      toast.error("Clave incorrecta");
    }
  };

  if (!acceso) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <Lock className="h-10 w-10 text-primary" />
        <h1 className="mt-4 font-display text-3xl">Panel del investigador</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Zona restringida. Ingresa la clave de investigación (en la feria se muestra como demostración
          con la clave RIQSIY2026).
        </p>
        <form onSubmit={intentar} className="mt-6 flex w-full gap-2">
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Clave de investigación"
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  const { codigo, testInicial, testFinal, puntos, descubiertos, retosCompletados, juegosCompletados, testimonios, avance } =
    progreso;

  const exportar = () => {
    const datos = {
      proyecto: "RIQSIY — FENCYT",
      autor: AUTOR,
      participanteAnonimo: codigo,
      fechaExportacion: new Date().toISOString(),
      puntosTotales: puntos,
      huellaCultural: `${avance}%`,
      lugaresDescubiertos: descubiertos.length,
      retosCompletados: retosCompletados.length,
      juegosCompletados: juegosCompletados.length,
      testimoniosRegistrados: testimonios.length,
      testInicial,
      testFinal,
    };
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riqsiy-${codigo}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Datos exportados", { description: `Archivo riqsiy-${codigo}.json descargado.` });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <SectionTitle
        eyebrow="Investigación científica"
        title="Panel del investigador"
        description={`Resultados anónimos del participante ${codigo}. Autor: ${AUTOR}.`}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "RIQSI-COINS (histórico)", valor: puntos },
          { label: "Huella cultural", valor: `${avance}%` },
          { label: "Retos + juegos", valor: retosCompletados.length + juegosCompletados.length },
          { label: "Testimonios", valor: testimonios.length },
        ].map((s) => (
          <div key={s.label} className="shadow-stone rounded-lg border border-border bg-card p-5">
            <p className="font-display text-3xl text-primary">{s.valor}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl">Comparativa test inicial vs. final</h2>
        {!testInicial ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Sin datos aún. Responde el diagnóstico en la sección Test.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {DIMENSIONES.map((d) => {
              const ini = testInicial.dimensiones[d.id];
              const fin = testFinal?.dimensiones[d.id];
              return (
                <div key={d.id} className="text-sm">
                  <div className="flex justify-between">
                    <span>{d.label}</span>
                    <span className="font-semibold">
                      {ini}% {fin !== undefined ? `→ ${fin}%` : ""}
                    </span>
                  </div>
                  <div className="mt-1 grid h-2 grid-cols-2 gap-1">
                    <div className="overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-muted-foreground/50" style={{ width: `${ini}%` }} />
                    </div>
                    <div className="overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${fin ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={exportar}
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        <Download className="h-4 w-4" /> Exportar datos anónimos (JSON)
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        Los datos se identifican solo por el código anónimo {codigo}; nunca se exporta información personal.
      </p>
    </div>
  );
}
