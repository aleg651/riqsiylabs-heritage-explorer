import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { useProgreso } from "@/lib/progress";
import { SITIOS } from "@/lib/riqsiy-data";
import { AUTOR } from "@/lib/riqsiy-gamification";

export const Route = createFileRoute("/historias")({
  head: () => ({
    meta: [
      { title: `Historias de la comunidad — RIQSIY | Autor: ${AUTOR}` },
      {
        name: "description",
        content:
          "Registra y comparte relatos, memorias y testimonios orales de la comunidad sobre los sitios arqueológicos del Cusco.",
      },
      { property: "og:title", content: "Historias de la comunidad | RIQSIY" },
      {
        property: "og:description",
        content: "Archivo colaborativo de memoria oral sobre el patrimonio cusqueño.",
      },
    ],
  }),
  component: Historias,
});

function Historias() {
  const { testimonios, agregarTestimonio, hidratado } = useProgreso();
  const [form, setForm] = useState({
    lugar: SITIOS[0].nombre,
    historia: "",
    testimonio: "",
    compartidoPor: "",
    fuente: "",
    autorizado: false,
  });

  const valido = form.historia.trim().length > 20 && form.compartidoPor.trim() && form.autorizado;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <SectionTitle
        eyebrow="Memoria viva"
        title="Historias de la comunidad"
        description="El patrimonio no solo es piedra: también son los relatos que las familias cusqueñas guardan. Registra una historia escuchada en tu barrio o comunidad, siempre con autorización de quien la comparte."
      />

      <form
        className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valido) return;
          agregarTestimonio(form);
          setForm({ ...form, historia: "", testimonio: "", compartidoPor: "", fuente: "" });
        }}
      >
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Lugar</span>
          <select
            value={form.lugar}
            onChange={(e) => setForm({ ...form, lugar: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2"
          >
            {SITIOS.map((s) => (
              <option key={s.slug} value={s.nombre}>
                {s.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Historia o relato (mínimo 20 caracteres)</span>
          <textarea
            rows={4}
            value={form.historia}
            onChange={(e) => setForm({ ...form, historia: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2"
            placeholder="¿Qué se cuenta sobre este lugar en tu familia o comunidad?"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Frase textual del testimonio (opcional)</span>
          <input
            value={form.testimonio}
            onChange={(e) => setForm({ ...form, testimonio: e.target.value })}
            className="rounded-md border border-border bg-background px-3 py-2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Compartido por</span>
            <input
              value={form.compartidoPor}
              onChange={(e) => setForm({ ...form, compartidoPor: e.target.value })}
              className="rounded-md border border-border bg-background px-3 py-2"
              placeholder="Nombre o iniciales"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Fuente / contexto</span>
            <input
              value={form.fuente}
              onChange={(e) => setForm({ ...form, fuente: e.target.value })}
              className="rounded-md border border-border bg-background px-3 py-2"
              placeholder="Entrevista familiar, vecino, docente…"
            />
          </label>
        </div>

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={form.autorizado}
            onChange={(e) => setForm({ ...form, autorizado: e.target.checked })}
            className="mt-0.5"
          />
          <span>
            Confirmo que la persona autorizó compartir este relato con fines educativos. Los relatos orales son
            memoria cultural y no reemplazan la evidencia arqueológica.
          </span>
        </label>

        <button
          type="submit"
          disabled={!valido}
          className="justify-self-start rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          Registrar historia (+60 RIQSI-COINS)
        </button>
      </form>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Archivo registrado</h2>
        {!hidratado ? (
          <p className="mt-3 text-muted-foreground">Cargando…</p>
        ) : testimonios.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Todavía no hay historias registradas en este dispositivo.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {testimonios.map((t) => (
              <li key={t.id} className="shadow-stone rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {t.lugar} · {t.fecha}
                </p>
                <p className="mt-2 text-sm">{t.historia}</p>
                {t.testimonio && (
                  <p className="mt-3 border-l-2 border-accent pl-3 text-sm italic">“{t.testimonio}”</p>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Compartido por {t.compartidoPor}
                  {t.fuente ? ` · ${t.fuente}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
