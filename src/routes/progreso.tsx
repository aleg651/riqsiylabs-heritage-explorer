import { createFileRoute, Link } from "@tanstack/react-router";
import { COMPROMISOS, SITIOS } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { TOTAL_JUEGOS, TOTAL_RETOS, TOTAL_SITIOS, useProgreso } from "@/lib/progress";
import { ALL_INSIGNIAS, AUTOR, DIMENSIONES } from "@/lib/riqsiy-gamification";
import { JUEGOS } from "@/lib/riqsiy-juegos";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { title: `Mi progreso — RIQSI-COINS, niveles e insignias | RIQSIY · Autor: ${AUTOR}` },
      {
        name: "description",
        content:
          "Revisa tu nivel, RIQSI-COINS, huella cultural, lugares descubiertos, minijuegos, retos, compromisos e insignias en RIQSIY.",
      },
      { property: "og:title", content: "Mi progreso | RIQSIY" },
      { property: "og:description", content: "Tu recorrido como guardián del patrimonio cusqueño." },
    ],
  }),
  component: Progreso,
});

function Progreso() {
  const {
    nombre,
    codigo,
    setNombre,
    descubiertos,
    retosCompletados,
    juegosCompletados,
    puntos,
    coins,
    compromisos,
    insignias,
    nivel,
    avance,
    testInicial,
    testFinal,
    testimonios,
    hidratado,
    reiniciar,
  } = useProgreso();

  if (!hidratado) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-muted-foreground">Cargando tu progreso…</div>;
  }

  const stats = [
    { label: "Lugares descubiertos", valor: `${descubiertos.length}/${TOTAL_SITIOS}` },
    { label: "Retos completados", valor: `${retosCompletados.length}/${TOTAL_RETOS}` },
    { label: "Minijuegos", valor: `${juegosCompletados.length}/${TOTAL_JUEGOS}` },
    { label: "RIQSI-COINS disponibles", valor: coins },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <SectionTitle
        eyebrow="Perfil del estudiante"
        title="Mi progreso"
        description={`Código ${codigo} · Autor del proyecto: ${AUTOR}`}
      />

      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="shadow-stone rounded-xl border border-border bg-card p-6">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Mi nombre</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2"
            />
          </label>
          <div className="mt-5">
            <p className="font-display text-2xl">
              {nivel.actual.icono} {nivel.actual.nombre}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-accent" style={{ width: `${nivel.progreso}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {nivel.siguiente
                ? `Faltan ${nivel.siguiente.min - puntos} RIQSI-COINS para ${nivel.siguiente.nombre}`
                : "Nivel máximo alcanzado"}
            </p>
          </div>
        </div>

        <div className="shadow-stone rounded-xl border border-gold/50 bg-gold/10 p-6">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Huella cultural</p>
          <p className="font-display text-5xl text-primary">{avance}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${avance}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Total histórico: {puntos} RIQSI-COINS · {testimonios.length} historia(s) registrada(s)
          </p>
          <Link to="/recompensas" className="mt-4 inline-block text-sm font-semibold text-primary">
            Ver recompensas →
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          {ALL_INSIGNIAS.map((i) => {
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
          <h2 className="font-display text-xl">Minijuegos</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {JUEGOS.map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-2">
                <Link to="/juegos/$id" params={{ id: j.id }} className="text-primary">
                  {j.icono} {j.titulo}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {juegosCompletados.includes(j.id) ? "✔ completado" : "pendiente"}
                </span>
              </li>
            ))}
          </ul>
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

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-xl">Test de valoración</h2>
          {!testInicial && !testFinal ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Aún no respondes el diagnóstico.{" "}
              <Link to="/test" className="font-semibold text-primary">
                Responder ahora
              </Link>
              .
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {DIMENSIONES.map((d) => (
                <div key={d.id} className="text-sm">
                  <div className="flex justify-between">
                    <span>{d.label}</span>
                    <span className="font-semibold">
                      {testInicial ? `${testInicial.dimensiones[d.id]}%` : "—"} →{" "}
                      {testFinal ? `${testFinal.dimensiones[d.id]}%` : "—"}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(testFinal ?? testInicial)!.dimensiones[d.id]}%` }}
                    />
                  </div>
                </div>
              ))}
              <Link to="/test" className="inline-block text-sm font-semibold text-primary">
                Ir al test →
              </Link>
            </div>
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
