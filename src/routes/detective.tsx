import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Eye, GitCompareArrows, Microscope, Search, ShieldCheck } from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { Button } from "@/components/ui/button";
import { useProgreso } from "@/lib/progress";
import { REGISTROS_CAMPO } from "@/lib/riqsiy-regional";

export const Route = createFileRoute("/detective")({
  head: () => ({ meta: [{ title: "Detective del Patrimonio — RIQSIY" }, { name: "description", content: "Cinco niveles de observación, relación, investigación, resolución y protección mediante evidencia real." }, { property: "og:title", content: "Detective del Patrimonio — RIQSIY" }, { property: "og:description", content: "Analiza pistas y aprende cuándo la evidencia permite concluir y cuándo exige investigar más." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Detective,
});

const NIVELES = [
  { titulo: "Observa", icono: Eye, consigna: "Selecciona únicamente lo que puede observarse directamente en la fotografía.", opciones: ["Se distinguen piedras superpuestas", "Fue un lugar ceremonial", "La vegetación cubre parte de la estructura"], correctas: [0, 2], explicacion: "La forma y la vegetación son observables. Una función ceremonial requeriría fuentes adicionales." },
  { titulo: "Relaciona", icono: GitCompareArrows, consigna: "¿Qué explicación es compatible con la evidencia sin presentarla como un hecho?", opciones: ["La disposición podría corresponder a una estructura", "Conocemos con certeza su antigüedad", "Sabemos quién la construyó"], correctas: [0], explicacion: "La fotografía permite proponer una posibilidad, pero no fechar ni atribuir la estructura." },
  { titulo: "Investiga", icono: Microscope, consigna: "¿Qué fuente ayudaría mejor a comprobar su antigüedad y contexto?", opciones: ["Una investigación arqueológica documentada", "Una publicación sin autor", "Una suposición basada solo en la forma"], correctas: [0], explicacion: "Una investigación documentada puede aportar contexto, método y evidencias contrastables." },
  { titulo: "Resuelve", icono: Search, consigna: "Con las pistas disponibles, elige la conclusión responsable.", opciones: ["Su función ya está demostrada", "No tenemos suficiente evidencia; todavía requiere investigación", "Toda estructura de piedra tuvo la misma función"], correctas: [1], explicacion: "Un buen investigador también sabe cuándo necesita investigar más." },
  { titulo: "Protege", icono: ShieldCheck, consigna: "Elige las dos acciones adecuadas durante una visita.", opciones: ["No mover ni extraer piedras", "Subir a los muros para observar mejor", "Registrar daños y avisar responsablemente"], correctas: [0, 2], explicacion: "Observar sin intervenir y comunicar daños ayuda a proteger el lugar." },
] as const;

function Detective() {
  const { casosResueltos, registrarHito } = useProgreso();
  const [nivel, setNivel] = useState(0);
  const [seleccion, setSeleccion] = useState<number[]>([]);
  const [revisado, setRevisado] = useState(false);
  const actual = NIVELES[nivel] ?? NIVELES[0];
  const correcto = useMemo(() => seleccion.length === actual.correctas.length && actual.correctas.every((i) => seleccion.includes(i)), [actual, seleccion]);
  const terminado = nivel === NIVELES.length - 1 && revisado && correcto;
  const elegir = (indice: number) => setSeleccion((prev) => prev.includes(indice) ? prev.filter((i) => i !== indice) : [...prev, indice]);
  const continuar = () => {
    if (terminado) {
      registrarHito("caso", "detective-cinco-niveles", 150);
      return;
    }
    setNivel((v) => Math.min(NIVELES.length - 1, v + 1));
    setSeleccion([]);
    setRevisado(false);
  };

  return <main className="mx-auto max-w-5xl px-4 py-14">
    <SectionTitle eyebrow="Minijuego basado en pistas" title="Detective del Patrimonio" description="Observa evidencia real, contrasta explicaciones y decide cuándo una afirmación todavía requiere investigación." />
    <div className="mt-8 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary transition-all" style={{ width: `${((nivel + (revisado && correcto ? 1 : 0)) / NIVELES.length) * 100}%` }} /></div>
    <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>Nivel {nivel + 1} de {NIVELES.length}</span><span>{actual.titulo}</span></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <figure className="overflow-hidden rounded-lg border border-border bg-card"><img src={REGISTROS_CAMPO[0]?.src} alt="Registro propio de una estructura de piedra en Machu Moqo" className="aspect-[4/3] h-full w-full object-cover" /><figcaption className="p-3 text-xs text-muted-foreground">Registro propio del equipo · Machu Moqo</figcaption></figure>
      <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
        <actual.icono className="h-7 w-7 text-primary" />
        <p className="mt-3 text-xs font-semibold uppercase text-primary">Nivel {nivel + 1} — {actual.titulo}</p>
        <h2 className="mt-2 font-display text-xl">{actual.consigna}</h2>
        <div className="mt-5 grid gap-3">{actual.opciones.map((opcion, indice) => <Button key={opcion} type="button" variant="outline" disabled={revisado} onClick={() => elegir(indice)} className={`h-auto min-h-14 justify-start whitespace-normal px-4 py-3 text-left ${seleccion.includes(indice) ? "border-primary bg-primary/10" : ""}`}>{opcion}</Button>)}</div>
        {!revisado && <Button className="mt-5 w-full" disabled={seleccion.length === 0} onClick={() => setRevisado(true)}>Analizar pistas</Button>}
        {revisado && <div className={`mt-5 rounded-md border p-4 text-sm ${correcto ? "border-jade bg-jade/10" : "border-accent bg-accent/10"}`}><p className="font-semibold">{correcto ? "Conclusión respaldada" : "Vuelve a revisar la evidencia"}</p><p className="mt-1 text-muted-foreground">{actual.explicacion}</p>{correcto && <Button className="mt-4 w-full" onClick={continuar}>{terminado ? "Registrar caso resuelto" : "Siguiente nivel"}</Button>}</div>}
      </section>
    </div>
    {terminado && casosResueltos.includes("detective-cinco-niveles") && <div className="mt-6 rounded-lg border border-jade bg-jade/10 p-5"><p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5" />Insignia Detective del Patrimonio obtenida</p><p className="mt-1 text-sm text-muted-foreground">Completaste los cinco niveles y recibiste 150 RIQSI-COINS.</p></div>}
  </main>;
}