import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Volume2 } from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { Button } from "@/components/ui/button";
import { useProgreso } from "@/lib/progress";

export const Route = createFileRoute("/yachay")({
  head: () => ({ meta: [
    { title: "RIQSIY Yachay — Quechua Cusco-Collao" },
    { name: "description", content: "Aprende vocabulario inicial de quechua Cusco-Collao relacionado con territorio, comunidad, naturaleza y patrimonio." },
    { property: "og:title", content: "RIQSIY Yachay — Quechua Cusco-Collao" },
    { property: "og:description", content: "Cinco unidades breves con vocabulario, práctica y progreso educativo." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: YachayPage,
});

const UNIDADES = [
  { n: 1, titulo: "Palabras de mi territorio", palabras: [["rumi", "piedra"], ["mayu", "río"], ["urqu", "cerro"]] },
  { n: 2, titulo: "Saludos y expresiones", palabras: [["rimaykullayki", "te saludo"], ["sulpayki", "gracias"], ["tupananchiskama", "hasta volvernos a encontrar"]] },
  { n: 3, titulo: "Mi comunidad", palabras: [["ayllu", "comunidad o familia extensa"], ["wasi", "casa"], ["llaqta", "pueblo o lugar habitado"]] },
  { n: 4, titulo: "Naturaleza y territorio", palabras: [["yaku", "agua"], ["inti", "sol"], ["killa", "luna"]] },
  { n: 5, titulo: "Patrimonio y cultura", palabras: [["yachay", "saber o aprendizaje"], ["ñan", "camino"], ["pacha", "mundo, tiempo o espacio según contexto"]] },
] as const;

function YachayPage() {
  const { palabrasAprendidas, registrarHito } = useProgreso();
  const [unidad, setUnidad] = useState(0);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const actual = UNIDADES[unidad] ?? UNIDADES[0];
  return <div className="mx-auto max-w-5xl px-4 py-14">
    <SectionTitle eyebrow="Quechua Cusco-Collao" title="RIQSIY Yachay" description="Aprende palabras vinculadas con tu territorio. Fuente lingüística de referencia: Diccionario Quechua Sureño del Ministerio de Educación del Perú; la pronunciación grabada queda pendiente de validación por hablantes competentes." />
    <div className="mt-6 rounded-lg border border-accent/50 bg-accent/10 p-4 text-sm"><strong>Uso responsable:</strong> el significado puede cambiar según contexto y comunidad. No usamos voz sintética como si fuera pronunciación validada.</div>
    <div className="mt-8 grid gap-3 sm:grid-cols-5">{UNIDADES.map((u,i)=><button key={u.n} onClick={()=>{setUnidad(i);setSeleccion(null)}} className={`rounded-lg border p-3 text-left ${unidad===i?'border-primary bg-primary/10':'border-border bg-card'}`}><span className="text-xs text-muted-foreground">UNIDAD {u.n}</span><span className="mt-1 block text-sm font-semibold">{u.titulo}</span></button>)}</div>
    <section className="mt-8 rounded-xl border border-border bg-card p-6"><h2 className="font-display text-2xl">{actual.titulo}</h2><p className="mt-2 text-sm text-muted-foreground">Escucha pendiente de validación · elige una palabra para practicar significado.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">{actual.palabras.map(([q,e])=><button key={q} onClick={()=>setSeleccion(q)} className={`rounded-lg border p-5 text-left ${seleccion===q?'border-accent bg-accent/10':'border-border'}`}><span className="font-display text-xl">{q}</span><span className="mt-2 block text-sm text-muted-foreground">{seleccion===q?e:"Toca para descubrir"}</span></button>)}</div>
      {seleccion && <div className="mt-5 flex flex-wrap items-center gap-3"><Button onClick={()=>registrarHito('palabra',seleccion,20)} disabled={palabrasAprendidas.includes(seleccion)}><CheckCircle2 />{palabrasAprendidas.includes(seleccion)?'Aprendida':'Marcar como aprendida (+20)'}</Button><span className="inline-flex items-center gap-2 text-xs text-muted-foreground"><Volume2 className="h-4 w-4" /> Audio pendiente de validación</span></div>}
    </section>
    <p className="mt-6 text-sm text-muted-foreground">Progreso: {palabrasAprendidas.length} palabras registradas · actividades de relacionar, completar y ordenar se habilitarán únicamente con contenido lingüístico revisado.</p>
  </div>;
}