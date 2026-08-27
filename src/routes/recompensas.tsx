import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { useProgreso } from "@/lib/progress";
import { AUTOR, NIVELES, RECOMPENSAS, RECOMPENSA_PRINCIPAL } from "@/lib/riqsiy-gamification";

export const Route = createFileRoute("/recompensas")({
  head: () => ({
    meta: [
      { title: `Recompensas y RIQSI-COINS — RIQSIY | Autor: ${AUTOR}` },
      {
        name: "description",
        content:
          "Canjea tus RIQSI-COINS por insignias y certificados digitales, y revisa los niveles del recorrido RIQSIY.",
      },
      { property: "og:title", content: "Recompensas y RIQSI-COINS | RIQSIY" },
      {
        property: "og:description",
        content: "Sistema de niveles y recompensas educativas del proyecto RIQSIY.",
      },
    ],
  }),
  component: Recompensas,
});

function Recompensas() {
  const { coins, puntos, canjeadas, canjear, nivel, hidratado } = useProgreso();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <SectionTitle
        eyebrow="Economía cultural"
        title="Recompensas RIQSI-COINS"
        description="Cada descubrimiento, reto y minijuego suma RIQSI-COINS. Úsalas para desbloquear reconocimientos del proyecto."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="shadow-stone rounded-xl border border-gold/50 bg-gold/15 p-6">
          <p className="font-display text-4xl">🟡 {hidratado ? coins : 0}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">Saldo disponible</p>
        </div>
        <div className="shadow-stone rounded-xl border border-border bg-card p-6">
          <p className="font-display text-4xl">{hidratado ? puntos : 0}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">Total histórico</p>
        </div>
        <div className="shadow-stone rounded-xl border border-border bg-card p-6">
          <p className="font-display text-2xl">
            {nivel.actual.icono} {nivel.actual.nombre}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-accent" style={{ width: `${nivel.progreso}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {nivel.siguiente
              ? `Faltan ${nivel.siguiente.min - puntos} coins para ${nivel.siguiente.nombre}`
              : "Nivel máximo alcanzado"}
          </p>
        </div>
      </div>

      <section className="mt-10 rounded-xl border border-dashed border-accent bg-accent/10 p-6">
        <h2 className="font-display text-xl">{RECOMPENSA_PRINCIPAL.titulo}</h2>
        <p className="mt-1 text-sm font-semibold">{RECOMPENSA_PRINCIPAL.aviso}</p>
        <p className="mt-2 text-xs text-muted-foreground">{RECOMPENSA_PRINCIPAL.nota}</p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Catálogo de canje</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {RECOMPENSAS.map((r) => {
            const canjeada = hidratado && canjeadas.includes(r.id);
            const alcanza = hidratado && coins >= r.costo;
            return (
              <div key={r.id} className="shadow-stone flex flex-col rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{r.icono}</span>
                  <span className="rounded-full border border-border px-2.5 py-1 text-xs">{r.estado}</span>
                </div>
                <h3 className="mt-3 font-display text-lg">{r.titulo}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.detalle}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-gold/25 px-3 py-1 text-sm font-semibold">🟡 {r.costo}</span>
                  <button
                    type="button"
                    disabled={canjeada || !alcanza}
                    onClick={() => canjear(r.id, r.costo)}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
                  >
                    {canjeada ? "Canjeada" : alcanza ? "Canjear" : "Insuficiente"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Niveles del recorrido</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NIVELES.map((n) => (
            <li
              key={n.n}
              className={`rounded-lg border p-4 ${
                hidratado && puntos >= n.min ? "border-accent bg-accent/10" : "border-dashed border-border bg-card"
              }`}
            >
              <p className="text-2xl">{n.icono}</p>
              <p className="mt-1 font-display text-lg">{n.nombre}</p>
              <p className="text-xs text-muted-foreground">Desde {n.min} RIQSI-COINS</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
