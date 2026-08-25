import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { COMPROMISOS } from "@/lib/riqsiy-data";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { useProgreso } from "@/lib/progress";
import logo from "@/assets/logo-riqsiy.png";

export const Route = createFileRoute("/compromiso")({
  head: () => ({
    meta: [
      { title: "Mi compromiso — Tarjeta digital | RIQSIY" },
      {
        name: "description",
        content:
          "Elige tus compromisos con el patrimonio arqueológico cusqueño y genera tu tarjeta digital de compromiso.",
      },
      { property: "og:title", content: "Mi compromiso | RIQSIY" },
      { property: "og:description", content: "Yo me comprometo a cuidar el patrimonio de mi comunidad." },
    ],
  }),
  component: Compromiso,
});

function Compromiso() {
  const { compromisos, toggleCompromiso, confirmarCompromisos, fechaCompromiso, nombre, setNombre, hidratado } =
    useProgreso();

  const elegidos = COMPROMISOS.filter((c) => compromisos.includes(c.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <SectionTitle
        eyebrow="Después de la experiencia"
        title="Mi compromiso"
        description="Conocer no basta. Elige qué vas a hacer con lo que ahora sabes."
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {COMPROMISOS.map((c) => {
          const activo = hidratado && compromisos.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCompromiso(c.id)}
              className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                activo ? "border-primary bg-primary/10" : "border-border bg-card hover:border-accent"
              }`}
            >
              <span className="text-2xl">{c.icono}</span>
              <span className="text-sm font-medium">{c.texto}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <label htmlFor="nombre" className="text-sm font-medium">
          Tu nombre para la tarjeta
        </label>
        <input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          placeholder="Escribe tu nombre"
        />
        <button
          type="button"
          disabled={compromisos.length === 0}
          onClick={() => {
            confirmarCompromisos();
            toast.success("¡Compromiso registrado! Se generó tu tarjeta digital.");
          }}
          className="shadow-gold mt-4 rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground disabled:opacity-50"
        >
          Yo me comprometo
        </button>
        {compromisos.length === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">Selecciona al menos un compromiso.</p>
        )}
      </div>

      {hidratado && fechaCompromiso && elegidos.length > 0 && (
        <div className="animate-rise surface-deep shadow-stone mt-10 overflow-hidden rounded-xl">
          <div className="andean-fret h-2 w-full" />
          <div className="p-8">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo RIQSIY" width={48} height={48} className="h-11 w-11" loading="lazy" />
              <div>
                <p className="font-display text-lg tracking-[0.2em]">RIQSIY</p>
                <p className="text-xs opacity-70">Tarjeta digital de compromiso</p>
              </div>
            </div>
            <p className="mt-6 font-display text-2xl">{nombre}</p>
            <p className="mt-1 text-sm opacity-80">
              me comprometo con el patrimonio arqueológico de mi comunidad a:
            </p>
            <ul className="mt-4 space-y-2">
              {elegidos.map((c) => (
                <li key={c.id} className="rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm">
                  {c.icono} {c.texto}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs opacity-60">
              Registrado el {new Date(fechaCompromiso).toLocaleDateString("es-PE", { dateStyle: "long" })} ·
              Cusco, Perú
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
