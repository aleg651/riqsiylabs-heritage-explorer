import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Flame, Heart, Lock, Star, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgreso } from "@/lib/progress";
import mascot from "@/assets/yachay-mascot.png";

export const Route = createFileRoute("/yachay")({
  head: () => ({
    meta: [
      { title: "RIQSIY Yachay — Aprende quechua Cusco-Collao jugando" },
      { name: "description", content: "Lecciones interactivas de quechua Cusco-Collao con retos breves, progreso, racha y RIQSI-COINS." },
      { property: "og:title", content: "RIQSIY Yachay — Quechua Cusco-Collao" },
      { property: "og:description", content: "Aprende palabras del territorio, la comunidad, la naturaleza y el patrimonio mediante lecciones interactivas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: YachayPage,
});

type Palabra = { quechua: string; espanol: string };
type Unidad = { n: number; titulo: string; detalle: string; palabras: readonly Palabra[] };

const UNIDADES: readonly Unidad[] = [
  { n: 1, titulo: "Mi territorio", detalle: "Piedra, río y cerro", palabras: [{ quechua: "rumi", espanol: "piedra" }, { quechua: "mayu", espanol: "río" }, { quechua: "urqu", espanol: "cerro" }] },
  { n: 2, titulo: "Nos saludamos", detalle: "Saludos y expresiones", palabras: [{ quechua: "rimaykullayki", espanol: "te saludo" }, { quechua: "sulpayki", espanol: "gracias" }, { quechua: "tupananchiskama", espanol: "hasta volvernos a encontrar" }] },
  { n: 3, titulo: "Mi comunidad", detalle: "Familia, casa y pueblo", palabras: [{ quechua: "ayllu", espanol: "comunidad o familia extensa" }, { quechua: "wasi", espanol: "casa" }, { quechua: "llaqta", espanol: "pueblo o lugar habitado" }] },
  { n: 4, titulo: "La naturaleza", detalle: "Agua, sol y luna", palabras: [{ quechua: "yaku", espanol: "agua" }, { quechua: "inti", espanol: "sol" }, { quechua: "killa", espanol: "luna" }] },
  { n: 5, titulo: "Nuestro patrimonio", detalle: "Saber, camino y mundo", palabras: [{ quechua: "yachay", espanol: "saber o aprendizaje" }, { quechua: "ñan", espanol: "camino" }, { quechua: "pacha", espanol: "mundo, tiempo o espacio según contexto" }] },
] as const;

function YachayPage() {
  const { palabrasAprendidas, registrarHito, racha, coins } = useProgreso();
  const [leccion, setLeccion] = useState<number | null>(null);
  const completadas = UNIDADES.map((unidad) => unidad.palabras.every((p) => palabrasAprendidas.includes(p.quechua)));
  const primeraPendiente = Math.max(0, completadas.findIndex((lista) => !lista));

  if (leccion !== null) {
    const unidad = UNIDADES[leccion];
    if (unidad) return <Leccion unidad={unidad} onCerrar={() => setLeccion(null)} registrar={registrarHito} />;
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase text-primary">Quechua Cusco-Collao</p>
            <h1 className="font-display text-xl font-bold">RIQSIY Yachay</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="inline-flex items-center gap-1 text-accent-foreground"><Flame className="text-accent" /> {racha}</span>
            <span className="inline-flex items-center gap-1 text-primary"><Star className="fill-current" /> {palabrasAprendidas.length * 20} XP</span>
            <span className="inline-flex items-center gap-1"><Heart className="fill-destructive text-destructive" /> 5</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 pt-6 md:grid-cols-[minmax(0,1fr)_280px]">
        <section aria-labelledby="ruta-yachay">
          <div className="rounded-lg bg-primary p-5 text-primary-foreground shadow-stone">
            <p className="text-xs font-bold uppercase">Sección 1 · Primeros pasos</p>
            <h2 id="ruta-yachay" className="mt-1 font-display text-2xl font-bold">Aprende desde tu territorio</h2>
            <p className="mt-1 text-sm text-primary-foreground/80">Completa cada lección para abrir la siguiente.</p>
          </div>

          <div className="relative mx-auto mt-8 flex max-w-md flex-col items-center gap-7 overflow-x-hidden py-3">
            <div className="absolute bottom-12 top-12 left-1/2 w-1 -translate-x-1/2 rounded-full bg-border" aria-hidden="true" />
            {UNIDADES.map((unidad, index) => {
              const terminada = completadas[index];
              const disponible = index <= primeraPendiente || terminada;
              const desplazamiento = index % 4 === 1 ? "-translate-x-12" : index % 4 === 3 ? "translate-x-12" : "";
              return (
                <div key={unidad.n} className={`relative z-10 flex flex-col items-center ${desplazamiento}`}>
                  <Button
                    type="button"
                    aria-label={`${unidad.titulo}${!disponible ? ", bloqueada" : ""}`}
                    disabled={!disponible}
                    onClick={() => setLeccion(index)}
                    className={`h-20 w-20 rounded-full border-b-8 p-0 shadow-stone ${terminada ? "border-jade/70 bg-jade text-primary-foreground hover:bg-jade/90" : disponible ? "border-primary/70 bg-primary hover:bg-primary/90" : "border-border bg-muted text-muted-foreground"}`}
                  >
                    {terminada ? <Check className="h-9 w-9" /> : disponible ? <Star className="h-9 w-9 fill-current" /> : <Lock className="h-8 w-8" />}
                  </Button>
                  <div className="mt-2 rounded-lg border border-border bg-card px-4 py-2 text-center shadow-stone">
                    <p className="text-sm font-bold">{unidad.titulo}</p>
                    <p className="text-xs text-muted-foreground">{unidad.detalle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4 md:sticky md:top-6 md:self-start">
          <div className="overflow-hidden rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2"><Flame className="text-accent" /><h2 className="font-display text-lg font-bold">Racha de {racha} días</h2></div>
            <p className="mt-2 text-sm text-muted-foreground">Practica cada día para mantener viva tu racha.</p>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
              {['L','M','M','J','V','S','D'].map((dia, i) => <span key={`${dia}-${i}`} className={`grid aspect-square place-items-center rounded-full ${i < Math.min(racha, 7) ? "bg-accent font-bold text-accent-foreground" : "bg-muted"}`}>{dia}</span>)}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 pb-0">
            <p className="text-xs font-bold uppercase text-primary">Tu compañero de aprendizaje</p>
            <p className="mt-2 max-w-[14rem] text-sm text-muted-foreground">¡Allin! Avancemos una palabra a la vez.</p>
            <img src={mascot} alt="Joven estudiante andino con un libro" width={1024} height={1024} className="mx-auto mt-2 h-52 w-52 object-contain object-bottom" />
          </div>
          <div className="rounded-lg border border-accent/50 bg-accent/10 p-4 text-xs text-muted-foreground">
            <strong className="text-foreground">Fuente lingüística:</strong> Diccionario Quechua Sureño del Ministerio de Educación del Perú. La voz de práctica es sintética y no reemplaza una pronunciación validada por hablantes competentes.
          </div>
          <p className="text-center text-sm font-bold">🟡 {coins} RIQSI-COINS</p>
        </aside>
      </div>
    </main>
  );
}

function Leccion({ unidad, onCerrar, registrar }: { unidad: Unidad; onCerrar: () => void; registrar: (tipo: "sello" | "palabra" | "caso" | "aporte" | "laboratorio", id: string, puntos: number) => void }) {
  const [paso, setPaso] = useState(0);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [comprobado, setComprobado] = useState(false);
  const [vidas, setVidas] = useState(5);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const palabra = unidad.palabras[paso];
  const opciones = useMemo(() => {
    if (!palabra) return [];
    const otras = UNIDADES.flatMap((u) => u.palabras).filter((p) => p.quechua !== palabra.quechua).slice(paso * 2, paso * 2 + 2);
    return [palabra, ...otras].sort((a, b) => a.espanol.localeCompare(b.espanol));
  }, [palabra, paso]);
  const correcta = seleccion === palabra?.espanol;
  const terminado = paso >= unidad.palabras.length;

  if (terminado) return (
    <main className="grid min-h-[75vh] place-items-center bg-background px-4 py-10">
      <div className="max-w-lg text-center">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-accent text-accent-foreground shadow-gold"><Star className="h-14 w-14 fill-current" /></div>
        <h1 className="mt-6 font-display text-4xl font-bold">¡Lección completada!</h1>
        <p className="mt-2 text-muted-foreground">Aprendiste tres palabras de {unidad.titulo.toLowerCase()}.</p>
        <div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-lg border border-border bg-card p-4"><p className="text-xs font-bold uppercase text-muted-foreground">Experiencia</p><p className="mt-1 text-2xl font-bold text-primary">+60 XP</p></div><div className="rounded-lg border border-border bg-card p-4"><p className="text-xs font-bold uppercase text-muted-foreground">Recompensa</p><p className="mt-1 text-2xl font-bold text-accent-foreground">+60 🟡</p></div></div>
        <Button size="lg" className="mt-7 w-full border-b-4 border-primary/70 font-bold uppercase" onClick={onCerrar}>Continuar</Button>
      </div>
    </main>
  );

  if (!palabra) return null;

  const comprobar = () => {
    if (!seleccion) return;
    setComprobado(true);
    if (!correcta) setVidas((v) => Math.max(0, v - 1));
    else registrar("palabra", palabra.quechua, 20);
  };
  const continuar = () => { if (correcta) setPaso((p) => p + 1); setSeleccion(null); setComprobado(false); };
  const reproducir = () => {
    if (!("speechSynthesis" in window)) {
      setAudioError(true);
      return;
    }
    window.speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(palabra.quechua);
    voz.lang = "es-PE";
    voz.rate = 0.72;
    voz.pitch = 1;
    voz.onstart = () => { setAudioError(false); setReproduciendo(true); };
    voz.onend = () => setReproduciendo(false);
    voz.onerror = () => { setReproduciendo(false); setAudioError(true); };
    window.speechSynthesis.speak(voz);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-5">
        <Button variant="ghost" size="icon" onClick={onCerrar} aria-label="Cerrar lección"><X /></Button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((paso + (comprobado && correcta ? 1 : 0)) / unidad.palabras.length) * 100}%` }} /></div>
        <span className="inline-flex items-center gap-1 font-bold text-destructive"><Heart className="fill-current" /> {vidas}</span>
      </div>
      <section className="mx-auto flex min-h-[65vh] max-w-2xl flex-col justify-center px-4 pb-28">
        <p className="text-sm font-bold uppercase text-primary">Lección {unidad.n} · Ejercicio {paso + 1} de {unidad.palabras.length}</p>
        <h1 className="mt-3 font-display text-3xl font-bold">¿Qué significa esta palabra?</h1>
        <div className="mt-8 flex items-center gap-4 rounded-lg border-2 border-border bg-card p-5">
          <img src={mascot} alt="Compañero andino de Yachay" width={1024} height={1024} className="h-28 w-28 shrink-0 object-contain" />
          <div className="relative flex-1 rounded-lg border-2 border-border p-5">
            <p className="font-display text-3xl font-bold">{palabra.quechua}</p>
            <Button type="button" variant="ghost" onClick={reproducir} className="mt-2 h-auto justify-start gap-2 p-0 text-xs text-muted-foreground hover:bg-transparent hover:text-primary" aria-label={`Escuchar ${palabra.quechua}`}>
              <Volume2 className={`h-5 w-5 ${reproduciendo ? "text-primary" : ""}`} />
              {reproduciendo ? "Reproduciendo…" : "Escuchar voz de práctica"}
            </Button>
            {audioError && <p role="alert" className="mt-2 text-xs text-destructive">El audio no está disponible en este navegador.</p>}
          </div>
        </div>
        <div className="mt-8 grid gap-3">
          {opciones.map((opcion, index) => <Button key={opcion.espanol} variant="outline" onClick={() => !comprobado && setSeleccion(opcion.espanol)} className={`h-auto min-h-16 justify-start border-2 px-5 py-4 text-left text-base font-bold whitespace-normal ${seleccion === opcion.espanol ? "border-primary bg-primary/10 text-foreground" : ""}`}><span className="mr-2 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border text-xs">{index + 1}</span>{opcion.espanol}</Button>)}
        </div>
      </section>
      <div className={`fixed inset-x-0 bottom-0 border-t border-border ${comprobado ? correcta ? "bg-jade/20" : "bg-destructive/10" : "bg-card"}`}>
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-5">
          <div>{comprobado && <><p className={`font-display text-xl font-bold ${correcta ? "text-jade" : "text-destructive"}`}>{correcta ? "¡Allin! Correcto" : "Inténtalo otra vez"}</p>{!correcta && <p className="text-sm text-muted-foreground">La respuesta correcta es: {palabra.espanol}</p>}</>}</div>
          <Button size="lg" disabled={!seleccion} onClick={comprobado ? continuar : comprobar} className="min-w-36 border-b-4 border-primary/70 font-bold uppercase">{comprobado ? correcta ? "Continuar" : "Reintentar" : "Comprobar"}</Button>
        </div>
      </div>
    </main>
  );
}