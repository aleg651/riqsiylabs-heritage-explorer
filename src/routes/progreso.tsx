import { createFileRoute, Link } from "@tanstack/react-router";
import { COMPROMISOS, INSIGNIAS, SITIOS } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { TOTAL_RETOS, TOTAL_SITIOS, useProgreso } from "@/lib/progress";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { title: "Mi progreso — Puntos de Identidad e insignias | RIQSIY" },
      {
        name: "description",
        content:
          "Revisa tus lugares descubiertos, retos completados, Puntos de Identidad, compromisos e insignias en RIQSIY.",
      },
      { property: "og:title", content: "Mi progreso | RIQSIY" },
      { property: "og:description", content: "Tu recorrido como guardián del patrimonio cusqueño." },
    ],
  }),
  component: Progreso,
});

function Progreso() {
  const { nombre, descubiertos, retosCompletados, puntos, compromisos, insignias, hidratado, reiniciar } =
    useProgreso();

  if (!hidratado) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-muted-foreground">Cargando tu progreso…</div>;
  }

  const stats = [
    { label: "Lugares descubiertos", valor: `${descubiertos.length}/${TOTAL_SITIOS}` },
    { label: "Retos completados", valor: `${retosCompletados.length}/${TOTAL_RETOS}` },
    { label: "Puntos de Identidad", valor: puntos },
    { label: "Compromisos asumidos", valor: compromisos.length },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <SectionTitle eyebrow="Perfil del estudiante" title="Mi progreso" description={nombre} />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="shadow-stone rounded-lg border border-border bg-card p-5">
            <p className="font-display text-3xl text-primary">{s.valor}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Insignias</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INSIGNIAS.map((i) => {
            const obtenida = insignias.some((x) => x.id === i.id);
            return (
              <div
                key={i.id}
                className={`rounded-lg border p-5 transition-all ${
                  obtenida ? "border-accent bg-accent/15" : "border-dashed border-border bg-card opacity-60"
                }`}
              >
                <p className="text-2xl">{i.icono}</p>
                <p className="mt-2 font-display text-lg">{i.nombre}</p>
                <p className="mt-1 text-xs text-muted-foreground">{i.descripcion}</p>
                <p className="mt-2 text-xs font-semibold">{obtenida ? "Obtenida" : "Pendiente"}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-xl">Lugares descubiertos</h2>
          {descubiertos.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Aún no descubres ningún lugar.{" "}
              <Link to="/descubre" className="font-semibold text-primary">
                Comienza aquí
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {descubiertos.map((slug) => {
                const s = SITIOS.find((x) => x.slug === slug);
                if (!s) return null;
                return (
                  <li key={slug}>
                    <Link to="/descubre/$slug" params={{ slug }} className="text-primary">
                      {s.nombre}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-xl">Mis compromisos</h2>
          {compromisos.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Aún no eliges compromisos.{" "}
              <Link to="/compromiso" className="font-semibold text-primary">
                Elegir ahora
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {COMPROMISOS.filter((c) => compromisos.includes(c.id)).map((c) => (
                <li key={c.id}>
                  {c.icono} {c.texto}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={reiniciar}
        className="mt-10 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground"
      >
        Reiniciar progreso (demostración)
      </button>
    </div>
  );
}
