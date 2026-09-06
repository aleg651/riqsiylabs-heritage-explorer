import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Eye,
  HelpCircle,
  ImageIcon,
  MapPin,
  Target,
  Video,
  X,
} from "lucide-react";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import { useProgreso } from "@/lib/progress";
import { EXPERIENCIA_MACHU_MUQU_ID } from "@/lib/riqsiy-gamification";

export const Route = createFileRoute("/machu-muqu")({
  head: () => ({
    meta: [
      { title: "Machu Muqu — Memoria, piedra y territorio | RIQSIY" },
      {
        name: "description",
        content:
          "Experiencia RIQSIY sobre Machu Muqu: registro propio, observación de evidencias, memoria oral de los gentiles y preguntas de investigación del patrimonio de nuestra comunidad.",
      },
      { property: "og:title", content: "Machu Muqu — Memoria, piedra y territorio | RIQSIY" },
      {
        property: "og:description",
        content:
          "Redescubre Machu Muqu: lo que observamos, la memoria oral de la comunidad y lo que todavía necesitamos investigar.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MachuMuqu,
});

/* ---------------------------------- Datos ---------------------------------- */

type Etiqueta = "oral" | "arqueologica" | "investigacion";

const ETIQUETAS: Record<Etiqueta, { label: string; clase: string }> = {
  oral: { label: "🗣️ TRADICIÓN ORAL", clase: "border-accent/60 bg-accent/15 text-foreground" },
  arqueologica: { label: "🏛️ EVIDENCIA ARQUEOLÓGICA", clase: "border-primary/50 bg-primary/10 text-foreground" },
  investigacion: { label: "🔎 EN INVESTIGACIÓN", clase: "border-border bg-secondary text-muted-foreground" },
};

function Chip({ tipo }: { tipo: Etiqueta }) {
  const e = ETIQUETAS[tipo];
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.12em] ${e.clase}`}>
      {e.label}
    </span>
  );
}

/** Categorías del registro propio. Cada entrada está preparada para recibir
 *  la fotografía real (`src`) tomada por el equipo durante la visita. */
const CATEGORIAS_FOTO = [
  { id: "vista-general", titulo: "Vista general", descripcion: "Panorámica del sitio tal como lo encontramos." },
  { id: "estructuras", titulo: "Estructuras de piedra", descripcion: "Conjuntos de piedra visibles en el terreno." },
  { id: "muros", titulo: "Muros y alineamientos", descripcion: "Alineamientos de piedras registrados en superficie." },
  { id: "detalles", titulo: "Detalles del sitio", descripcion: "Acercamientos a elementos puntuales observados." },
  { id: "entorno", titulo: "Entorno", descripcion: "Relación del sitio con el paisaje que lo rodea." },
  { id: "recorrido", titulo: "Recorrido", descripcion: "Registro del camino y accesos recorridos por el equipo." },
] as const;

type FotoCategoria = (typeof CATEGORIAS_FOTO)[number]["id"];

interface Foto {
  id: string;
  categoria: FotoCategoria;
  titulo: string;
  /** Descripción de lo observable, sin interpretación. */
  observable: string;
  /** Fotografía propia del sitio; se incorpora cuando esté disponible. */
  src?: string;
}

const FOTOS: Foto[] = [
  { id: "vg-1", categoria: "vista-general", titulo: "Machu Muqu desde el acceso", observable: "Vista amplia del área con afloramientos y piedras en superficie." },
  { id: "vg-2", categoria: "vista-general", titulo: "Panorámica del sector alto", observable: "Sector elevado con visibilidad hacia el valle." },
  { id: "es-1", categoria: "estructuras", titulo: "Conjunto de piedras", observable: "Agrupación de bloques de piedra de distintos tamaños." },
  { id: "es-2", categoria: "estructuras", titulo: "Estructura parcialmente visible", observable: "Estructura cubierta en parte por tierra y vegetación." },
  { id: "mu-1", categoria: "muros", titulo: "Alineamiento de piedras", observable: "Piedras dispuestas en línea a lo largo del terreno." },
  { id: "mu-2", categoria: "muros", titulo: "Paramento de piedra", observable: "Cara de piedras superpuestas, sin argamasa visible." },
  { id: "de-1", categoria: "detalles", titulo: "Detalle de una piedra grande", observable: "Bloque de gran tamaño respecto a las piedras del entorno." },
  { id: "en-1", categoria: "entorno", titulo: "Paisaje circundante", observable: "Laderas, quebradas y zonas de cultivo alrededor del sitio." },
  { id: "re-1", categoria: "recorrido", titulo: "Camino de acceso", observable: "Sendero utilizado por el equipo para llegar al sitio." },
];

const VIDEOS = [
  { id: "v1", titulo: "Recorrido general por Machu Muqu", nota: "Video grabado por el equipo durante la visita." },
  { id: "v2", titulo: "Detalle de las estructuras de piedra", nota: "Registro propio de los sectores con piedra visible." },
];

const OBSERVAMOS = [
  { icono: "🪨", titulo: "Estructuras de piedra", texto: "Conjuntos de piedras dispuestos en el terreno, visibles en superficie." },
  { icono: "🌿", titulo: "Sectores con vegetación", texto: "Áreas donde la vegetación cubre parcialmente las evidencias." },
  { icono: "🏞️", titulo: "Relación con el paisaje", texto: "El sitio se ubica en un punto con amplia visibilidad del entorno." },
  { icono: "🛤️", titulo: "Zonas de acceso y recorrido", texto: "Senderos y accesos utilizados para llegar y desplazarse en el área." },
  { icono: "🧱", titulo: "Muros o alineamientos", texto: "Piedras alineadas cuya función aún no podemos afirmar." },
];

const MEMORIA = [
  {
    tipo: "oral" as Etiqueta,
    titulo: "Memoria ancestral de Ccatccapampa",
    texto:
      "La reseña histórica del proyecto vincula Machu Muqu con la memoria ancestral de Ccatccapampa y con relatos sobre los “gentiles” transmitidos entre generaciones.",
  },
  {
    tipo: "investigacion" as Etiqueta,
    titulo: "Referencia temporal aproximada: 1000–1400 d.C.",
    texto:
      "La reseña menciona esta referencia y el período preincaico. Es una referencia por contrastar: no equivale a una datación comprobada del sitio.",
  },
  {
    tipo: "oral" as Etiqueta,
    titulo: "Los gentiles y la era anterior al Sol",
    texto:
      "La tradición oral los describe como antiguos habitantes de la tierra antes de la era del Sol, a quienes se atribuía gran fuerza y capacidad para mover grandes bloques de piedra.",
  },
  {
    tipo: "oral" as Etiqueta,
    titulo: "El cambio de era: Inti y el Pachakuti",
    texto:
      "La tradición relaciona el fin de esa era con la aparición del Sol (Inti) y con el Pachakuti, entendido como un giro o transformación del mundo.",
  },
  {
    tipo: "arqueologica" as Etiqueta,
    titulo: "Chullpas: estructuras funerarias de piedra",
    texto:
      "La reseña menciona estructuras funerarias de piedra conocidas como chullpas. Su presencia y características en el sitio deben verificarse con estudios especializados.",
  },
  {
    tipo: "investigacion" as Etiqueta,
    titulo: "Poblaciones preincaicas regionales",
    texto:
      "La reseña relaciona la figura de los gentiles con grupos preincaicos regionales, mencionando referencias como Pinahua, Muyna e influencia Lucre. Es una relación por investigar con fuentes.",
  },
];

const NARRATIVA = [
  { icono: "🌙", nombre: "KILLA", texto: "La era descrita por la tradición como el tiempo de la Luna." },
  { icono: "👥", nombre: "GENTILES", texto: "Antiguos habitantes de la tierra, según los relatos de la comunidad." },
  { icono: "☀️", nombre: "INTI", texto: "La aparición del Sol marca, en el relato, el inicio de una nueva era." },
  { icono: "🌎", nombre: "PACHAKUTI", texto: "El giro del mundo: transformación del tiempo y del orden anterior." },
];

const EVIDENCIAS = [
  {
    id: "ev-1",
    titulo: "Alineamiento de piedras",
    observamos: "Piedras dispuestas en línea, de tamaños distintos, sin mortero visible.",
    significado: "Podría corresponder a la base de una estructura. No podemos afirmarlo sin estudio arqueológico.",
    investigar: "Registro planimétrico, comparación con estructuras documentadas en la región y consulta de fuentes.",
  },
  {
    id: "ev-2",
    titulo: "Bloques de gran tamaño",
    observamos: "Bloques notoriamente mayores que las piedras del entorno inmediato.",
    significado:
      "La tradición oral atribuye a los gentiles la capacidad de mover grandes piedras; como explicación histórica, es un elemento por investigar.",
    investigar: "Origen de la piedra, posibles canteras cercanas y técnicas de traslado documentadas.",
  },
  {
    id: "ev-3",
    titulo: "Estructuras cubiertas por vegetación",
    observamos: "Sectores donde la vegetación impide observar la forma completa de las estructuras.",
    significado: "La forma y función solo podrán proponerse tras una observación autorizada y sistemática.",
    investigar: "Delimitación del área, estado de conservación y factores de deterioro.",
  },
  {
    id: "ev-4",
    titulo: "Ubicación y visibilidad",
    observamos: "El sitio ocupa un punto con amplia vista del territorio circundante.",
    significado: "La relación entre ubicación y uso del espacio es una hipótesis a contrastar.",
    investigar: "Análisis de visibilidad, cercanía a fuentes de agua y a zonas de cultivo.",
  },
];

const PREGUNTAS = [
  { q: "¿Quiénes habitaron este lugar?", a: "La tradición oral habla de los gentiles; la respuesta histórica requiere fuentes arqueológicas y etnohistóricas verificables." },
  { q: "¿Cuál fue su función?", a: "Por ahora solo describimos lo observable. La función es una hipótesis por contrastar." },
  { q: "¿Qué antigüedad tienen sus estructuras?", a: "La reseña menciona una referencia aproximada (1000–1400 d.C.), pero no existe datación comprobada del sitio." },
  { q: "¿Qué conocimientos tecnológicos fueron utilizados?", a: "Compararemos las técnicas observadas con estudios sobre construcción en piedra y manejo del territorio andino." },
  { q: "¿Qué relación tenía el sitio con el territorio?", a: "Analizaremos visibilidad, accesos, agua y zonas de cultivo del entorno." },
  { q: "¿Qué relación existe entre la memoria oral y las evidencias materiales?", a: "Es el eje de nuestra investigación: contrastar los relatos de la comunidad con lo que se observa y documenta." },
  { q: "¿Por qué Machu Muqu es poco conocido?", a: "Observamos ausencia de señalización interpretativa y poca difusión educativa del sitio." },
  { q: "¿Cómo podemos contribuir a su valoración y protección?", a: "Investigación escolar, difusión responsable y experiencias como RIQSIY, junto con las autoridades competentes." },
];

/** Puntos del recorrido. `punto3d` queda reservado para la futura versión 3D
 *  (coordenadas de cámara/escena); hoy solo usamos la posición 2D del esquema. */
interface PuntoRecorrido {
  n: number;
  titulo: string;
  observacion: string;
  pregunta: string;
  info: string;
  reto: string;
  mapa2d: { x: number; y: number };
  punto3d: null;
}

const RECORRIDO: PuntoRecorrido[] = [
  {
    n: 1,
    titulo: "Llegada",
    observacion: "Acceso al área y condiciones del terreno al momento de la visita.",
    pregunta: "¿Cómo se llega hoy al sitio y quién lo transita?",
    info: "Registro propio del equipo: fotografías y video del acceso.",
    reto: "Describe en una frase lo primero que verías al llegar.",
    mapa2d: { x: 14, y: 68 },
    punto3d: null,
  },
  {
    n: 2,
    titulo: "Primeras evidencias",
    observacion: "Piedras visibles en superficie desde el ingreso al área.",
    pregunta: "¿Están las piedras dispuestas al azar o siguen un orden?",
    info: "Observación directa; el orden aparente debe registrarse antes de interpretarlo.",
    reto: "Distingue una observación de una interpretación en lo que ves.",
    mapa2d: { x: 32, y: 58 },
    punto3d: null,
  },
  {
    n: 3,
    titulo: "Estructuras de piedra",
    observacion: "Conjuntos y alineamientos de piedra de distintos tamaños.",
    pregunta: "¿Qué técnica permitió sostener estas piedras sin mortero?",
    info: "La memoria oral atribuye a los gentiles la fuerza para mover grandes bloques.",
    reto: "Compáralo con lo que aprendes en el minijuego PIRQA.",
    mapa2d: { x: 48, y: 44 },
    punto3d: null,
  },
  {
    n: 4,
    titulo: "Sector con vegetación",
    observacion: "La vegetación cubre parcialmente las estructuras y limita la observación.",
    pregunta: "¿Qué parte del sitio todavía no podemos ver?",
    info: "El estado de conservación es un dato clave para su protección.",
    reto: "Propón una acción de cuidado que no altere el sitio.",
    mapa2d: { x: 62, y: 56 },
    punto3d: null,
  },
  {
    n: 5,
    titulo: "Vista del entorno",
    observacion: "Relación visual del sitio con laderas, quebradas y zonas de cultivo.",
    pregunta: "¿Por qué este lugar y no otro?",
    info: "La relación con el territorio se analiza con visibilidad, agua y suelos.",
    reto: "Dibuja el horizonte que se ve desde el sitio.",
    mapa2d: { x: 78, y: 38 },
    punto3d: null,
  },
  {
    n: 6,
    titulo: "Zona de investigación",
    observacion: "Evidencias cuyo origen, antigüedad y función no pueden afirmarse aún.",
    pregunta: "¿Qué necesitamos para pasar de observar a conocer?",
    info: "Fuentes verificables, acompañamiento especializado y autorizaciones.",
    reto: "Escribe la pregunta que llevarías a un arqueólogo.",
    mapa2d: { x: 90, y: 62 },
    punto3d: null,
  },
];

const ACCIONES = [
  { icono: "🔎", texto: "Investigar" },
  { icono: "📚", texto: "Aprender" },
  { icono: "🗣️", texto: "Difundir responsablemente" },
  { icono: "🚫", texto: "No dañar" },
  { icono: "🧹", texto: "Cuidar el entorno" },
  { icono: "🛡️", texto: "Proteger nuestro patrimonio" },
];

const EVIDENCIA_FASES = ["PRETEST", "USO DE RIQSIY", "POSTEST", "COMPARACIÓN DE RESULTADOS"];

/* -------------------------------- Componente -------------------------------- */

function MachuMuqu() {
  const { completarExperiencia, experiencias, hidratado } = useProgreso();
  const [categoria, setCategoria] = useState<FotoCategoria | "todas">("todas");
  const [zoom, setZoom] = useState<Foto | null>(null);
  const [visitados, setVisitados] = useState<number[]>([]);
  const [activo, setActivo] = useState(1);
  const [abiertas, setAbiertas] = useState<string[]>([]);

  const fotos = categoria === "todas" ? FOTOS : FOTOS.filter((f) => f.categoria === categoria);
  const punto = RECORRIDO.find((p) => p.n === activo) ?? RECORRIDO[0]!;
  const completada = hidratado && experiencias.includes(EXPERIENCIA_MACHU_MUQU_ID);
  const listo = visitados.length === RECORRIDO.length && abiertas.length >= 4;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      {/* Portada */}
      <header className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="gradient-earth p-8 text-stone-deep-foreground sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-80">
            Patrimonio de nuestra comunidad
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">MACHU MUQU</h1>
          <p className="mt-2 font-display text-lg text-gold-soft sm:text-2xl">Memoria, piedra y territorio</p>
          <p className="mt-5 max-w-2xl text-sm opacity-90 sm:text-base">
            En nuestra comunidad existe un lugar que guarda evidencias materiales y memorias transmitidas a través
            de generaciones. RIQSIY busca redescubrir Machu Muqu, conocer su historia, investigar sus evidencias y
            promover su valoración y protección.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#registro"
              className="inline-flex items-center gap-2 rounded-md bg-background/95 px-5 py-2.5 text-sm font-semibold text-foreground"
            >
              EXPLORAR MACHU MUQU <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/machu-muqu-3d"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              CAMINAR EN 3D <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/investigacion"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              CONOCE NUESTRA INVESTIGACIÓN
            </Link>
            <Link
              to="/mapa"
              className="inline-flex items-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              <MapPin className="h-4 w-4" /> UBICAR EN EL MAPA
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Nuestro registro */}
      <section id="registro" className="mt-14 scroll-mt-24">
        <SectionTitle
          eyebrow="Nuestro registro"
          title="Así encontramos Machu Muqu"
          description="Fotografías y videos obtenidos por el equipo durante nuestra visita al sitio. Este registro es propio: no se reemplaza con imágenes de otros sitios arqueológicos."
        />
        <div className="mt-7 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoria("todas")}
            className={`rounded-full border px-4 py-1.5 text-sm ${categoria === "todas" ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
          >
            Todas
          </button>
          {CATEGORIAS_FOTO.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoria(c.id)}
              className={`rounded-full border px-4 py-1.5 text-sm ${categoria === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
            >
              {c.titulo}
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setZoom(f)}
              className="shadow-stone group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-all hover:-translate-y-1 hover:border-accent"
            >
              {f.src ? (
                <img src={f.src} alt={f.titulo} loading="lazy" className="h-44 w-full object-cover" />
              ) : (
                <div className="stone-grid grid h-44 place-items-center bg-secondary">
                  <span className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-7 w-7" />
                    <span className="text-[11px] uppercase tracking-[0.2em]">Foto propia pendiente</span>
                  </span>
                </div>
              )}
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {CATEGORIAS_FOTO.find((c) => c.id === f.categoria)?.titulo}
                </p>
                <h3 className="mt-1 font-display text-lg">{f.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.observable}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {VIDEOS.map((v) => (
            <div key={v.id} className="shadow-stone overflow-hidden rounded-lg border border-border bg-card">
              <div className="stone-grid grid h-52 place-items-center bg-secondary">
                <span className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Video className="h-8 w-8" />
                  <span className="text-[11px] uppercase tracking-[0.2em]">Espacio para video propio</span>
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg">{v.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.nota}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Lo que observamos */}
      <section className="surface-deep mt-14 rounded-xl">
        <div className="p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-soft">Observación</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Lo que observamos</h2>
          <p className="mt-3 max-w-2xl text-sm opacity-85">
            Solo elementos identificables a la vista. Observar no es interpretar: no afirmamos la función de una
            estructura mientras no exista comprobación con fuentes arqueológicas.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OBSERVAMOS.map((o) => (
              <div key={o.titulo} className="rounded-lg border border-white/15 bg-white/5 p-5">
                <span className="text-2xl">{o.icono}</span>
                <div className="andean-fret my-3 h-1.5 w-14" />
                <h3 className="font-display text-lg">{o.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed opacity-85">{o.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Memoria histórica */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Memoria histórica"
          title="Memoria histórica de Machu Muqu"
          description="Basada en la reseña histórica del proyecto. Cada tarjeta señala si corresponde a tradición oral, a evidencia arqueológica o a un punto en investigación."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {MEMORIA.map((m) => (
            <article key={m.titulo} className="shadow-stone rounded-lg border border-border bg-card p-6">
              <Chip tipo={m.tipo} />
              <h3 className="mt-3 font-display text-xl">{m.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.texto}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 rounded-lg border border-accent/40 bg-accent/10 p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Nota:</strong> los relatos tradicionales se presentan como memoria de
          la comunidad, no como hechos arqueológicos comprobados.
        </p>
      </section>

      {/* 4. Los gentiles */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Tradición oral"
          title="Los gentiles: memoria de nuestros antepasados"
          description="La figura de los gentiles forma parte de la tradición oral andina y de la memoria transmitida por generaciones en nuestra comunidad. La compartimos con respeto, como relato y no como descripción científica."
        />
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {NARRATIVA.map((n, i) => (
            <li key={n.nombre} className="shadow-stone relative rounded-lg border border-border bg-card p-6">
              <span className="text-3xl">{n.icono}</span>
              <p className="mt-3 font-display text-xl tracking-[0.1em]">{n.nombre}</p>
              <p className="mt-2 text-sm text-muted-foreground">{n.texto}</p>
              {i < NARRATIVA.length - 1 && (
                <span className="mt-4 block text-center text-accent md:absolute md:-right-3 md:top-1/2 md:mt-0">
                  ↓
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Evidencia arqueológica */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Evidencia"
          title="La evidencia arqueológica"
          description="Cada fotografía real del sitio se acompaña de tres preguntas: qué observamos, qué podría significar y qué necesitamos investigar. No inventamos respuestas arqueológicas."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {EVIDENCIAS.map((e) => (
            <article key={e.id} className="shadow-stone overflow-hidden rounded-lg border border-border bg-card">
              <div className="stone-grid grid h-44 place-items-center bg-secondary">
                <span className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Camera className="h-7 w-7" />
                  <span className="text-[11px] uppercase tracking-[0.2em]">Fotografía real pendiente</span>
                </span>
              </div>
              <div className="grid gap-3 p-6">
                <h3 className="font-display text-xl">{e.titulo}</h3>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">¿Qué observamos?</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.observamos}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    ¿Qué podría significar?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.significado}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    ¿Qué necesitamos investigar?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.investigar}</p>
                </div>
                <Chip tipo="investigacion" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Preguntas */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Investigación"
          title="Preguntas que nos dejó Machu Muqu"
          description="RIQSIY no solo entrega respuestas: abre preguntas. Despliega cada una para ver cómo la abordaremos."
        />
        <div className="mt-8 grid gap-3">
          {PREGUNTAS.map((p) => {
            const open = abiertas.includes(p.q);
            return (
              <div key={p.q} className="shadow-stone rounded-lg border border-border bg-card">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setAbiertas((a) => (a.includes(p.q) ? a.filter((x) => x !== p.q) : [...a, p.q]))}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left"
                >
                  <HelpCircle className="h-4 w-4 shrink-0 text-primary" />
                  <span className="flex-1 font-medium">{p.q}</span>
                  <span className="text-sm text-muted-foreground">{open ? "−" : "+"}</span>
                </button>
                {open && <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">{p.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Explora Machu Muqu (recorrido 2D, preparado para 3D) */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Recorrido interactivo"
          title="Explora Machu Muqu"
          description="Recorrido en seis puntos. La estructura de datos ya está preparada para convertirse en un recorrido 3D más adelante."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="stone-grid relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/50">
            <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path
                d="M8 68 C 26 58, 40 46, 52 44 S 80 38, 94 62"
                fill="none"
                stroke="var(--earth)"
                strokeOpacity="0.4"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
            </svg>
            {RECORRIDO.map((p) => (
              <button
                key={p.n}
                type="button"
                onClick={() => {
                  setActivo(p.n);
                  setVisitados((v) => (v.includes(p.n) ? v : [...v, p.n]));
                }}
                style={{ left: `${p.mapa2d.x}%`, top: `${p.mapa2d.y}%` }}
                aria-label={`Punto ${p.n}: ${p.titulo}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border-2 font-display text-sm font-semibold transition-all ${
                  activo === p.n
                    ? "scale-110 border-accent bg-accent text-accent-foreground"
                    : visitados.includes(p.n)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-accent"
                }`}
              >
                {p.n}
              </button>
            ))}
          </div>

          <div className="shadow-stone rounded-lg border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Punto {punto.n} de {RECORRIDO.length}
            </p>
            <h3 className="mt-2 font-display text-2xl">
              PUNTO {punto.n} — {punto.titulo}
            </h3>
            <div className="andean-fret my-4 h-1.5 w-16" />
            <div className="stone-grid mb-4 grid h-32 place-items-center rounded-md bg-secondary">
              <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <ImageIcon className="h-4 w-4" /> Fotografía del punto
              </span>
            </div>
            <ul className="grid gap-3 text-sm">
              <li className="flex gap-2">
                <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong>Observación:</strong> {punto.observacion}
                </span>
              </li>
              <li className="flex gap-2">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong>Pregunta:</strong> {punto.pregunta}
                </span>
              </li>
              <li className="flex gap-2">
                <ImageIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong>Información disponible:</strong> {punto.info}
                </span>
              </li>
              <li className="flex gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                <span>
                  <strong>Reto:</strong> {punto.reto}
                </span>
              </li>
            </ul>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
              {visitados.includes(punto.n) ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Punto explorado
                </>
              ) : (
                <>Selecciona el punto en el esquema para explorarlo.</>
              )}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Puntos explorados: {visitados.length}/{RECORRIDO.length}
            </p>
          </div>
        </div>
      </section>

      {/* 8 + 9. Minijuegos y progreso */}
      <section className="mt-14">
        <div className="gradient-earth shadow-stone rounded-xl p-8 text-stone-deep-foreground sm:p-12">
          <h2 className="max-w-2xl font-display text-2xl sm:text-3xl">
            Ahora que conoces Machu Muqu, pon a prueba lo aprendido.
          </h2>
          <p className="mt-3 max-w-2xl text-sm opacity-85">
            Los minijuegos trabajan los conocimientos y tecnologías andinas que queremos investigar en el sitio: la
            construcción en piedra y el manejo del agua.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Link
              to="/juegos/$id"
              params={{ id: "encaja-la-piedra" }}
              className="rounded-lg border border-white/25 bg-white/10 p-5 transition-colors hover:bg-white/15"
            >
              <p className="font-display text-xl">🪨 PIRQA</p>
              <p className="mt-1 text-sm opacity-85">Maestro de la Piedra: levanta el muro, piedra sobre piedra.</p>
            </Link>
            <Link
              to="/juegos/$id"
              params={{ id: "salva-el-agua" }}
              className="rounded-lg border border-white/25 bg-white/10 p-5 transition-colors hover:bg-white/15"
            >
              <p className="font-display text-xl">💧 SALVA EL AGUA</p>
              <p className="mt-1 text-sm opacity-85">Guardián del Agua: conduce el agua como las obras andinas.</p>
            </Link>
          </div>

          <div className="mt-8 rounded-lg bg-background/95 p-6 text-foreground">
            {completada ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl">🏛️</span>
                <div>
                  <p className="font-display text-lg">Insignia obtenida: Explorador de Machu Muqu</p>
                  <p className="text-sm text-muted-foreground">
                    Tu avance quedó registrado en{" "}
                    <Link to="/progreso" className="font-semibold text-primary">
                      Mi progreso
                    </Link>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="font-display text-lg">Completa la experiencia Machu Muqu</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explora los 6 puntos del recorrido y abre al menos 4 preguntas de investigación para obtener{" "}
                  <strong>+150 RIQSI-COINS</strong> y la insignia “Explorador de Machu Muqu”.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Puntos explorados: {visitados.length}/6 · Preguntas abiertas: {Math.min(abiertas.length, 8)}/8
                </p>
                <button
                  type="button"
                  disabled={!listo}
                  onClick={() => completarExperiencia(EXPERIENCIA_MACHU_MUQU_ID, 150)}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Completar experiencia <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 10. Conocer para valorar */}
      <section className="mt-14">
        <SectionTitle
          eyebrow="Valoración y protección"
          title="Conocer para valorar"
          description="Conocer nuestro patrimonio es el primer paso para valorarlo. Valorarlo nos compromete a respetarlo y protegerlo."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACCIONES.map((a) => (
            <div
              key={a.texto}
              className="shadow-stone flex items-center gap-3 rounded-lg border border-border bg-card p-5"
            >
              <span className="text-2xl">{a.icono}</span>
              <span className="font-medium">{a.texto}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 11 + 12. Investigación y evidencia */}
      <section className="mt-14">
        <div className="shadow-stone rounded-xl border border-border bg-card p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-foreground/70">
            Conexión con la investigación
          </p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl">Machu Muqu como caso de estudio</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            RIQSIY nace de una problemática real: el patrimonio arqueológico puede encontrarse muy cerca de las
            comunidades sin que los jóvenes conozcan suficientemente su historia, su significado y su valor. Machu
            Muqu es un caso concreto que permite acercar la investigación y la tecnología al patrimonio local.
            Todavía no afirmamos resultados: dependen de los datos de pretest y postest.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-4">
            {EVIDENCIA_FASES.map((f, i) => (
              <div key={f} className="rounded-lg border border-dashed border-border bg-secondary/50 p-5 text-center">
                <p className="font-display text-sm tracking-[0.14em]">{f}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {i === 3 ? "Gráficos preparados, sin datos inventados." : "Espacio reservado para datos reales."}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/investigacion"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              CONOCE NUESTRA INVESTIGACIÓN <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/test"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Responder el test
            </Link>
          </div>
        </div>
      </section>

      {/* Mensaje central */}
      <section className="surface-deep mt-14 rounded-xl p-8 text-center sm:p-12">
        <p className="mx-auto max-w-3xl font-display text-2xl leading-snug sm:text-3xl">
          “Lo que está cerca de nosotros también merece ser conocido, investigado y valorado.”
        </p>
        <p className="mt-4 text-sm opacity-80">RIQSIY no busca que el joven solamente lea sobre su patrimonio: busca que lo descubra.</p>
      </section>

      {/* Visor ampliado */}
      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4"
          onClick={() => setZoom(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            {zoom.src ? (
              <img src={zoom.src} alt={zoom.titulo} className="max-h-[60vh] w-full object-contain bg-secondary" />
            ) : (
              <div className="stone-grid grid h-72 place-items-center bg-secondary">
                <span className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-9 w-9" />
                  <span className="text-[11px] uppercase tracking-[0.2em]">Vista ampliada · foto propia pendiente</span>
                </span>
              </div>
            )}
            <div className="flex items-start gap-4 p-5">
              <div className="min-w-0">
                <h3 className="font-display text-xl">{zoom.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{zoom.observable}</p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setZoom(null)}
                className="ml-auto rounded-md border border-border p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
