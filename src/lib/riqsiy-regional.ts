import type { LucideIcon } from "lucide-react";
import {
  Binoculars,
  BookOpenCheck,
  Boxes,
  CircleHelp,
  ClipboardCheck,
  Compass,
  FlaskConical,
  Gamepad2,
  HeartHandshake,
  Languages,
  Map,
  Microscope,
  ShieldCheck,
} from "lucide-react";
import { MEDIA_MACHU_MUQU } from "./machu-muqu-media";

export type EstadoEvidencia = "verificada" | "observada" | "hipotesis" | "pendiente" | "tradicion-oral";

export const ESTADOS_EVIDENCIA: Record<
  EstadoEvidencia,
  { etiqueta: string; descripcion: string; clase: string }
> = {
  verificada: {
    etiqueta: "Información verificada",
    descripcion: "Contenido respaldado por una fuente identificada.",
    clase: "border-jade/50 bg-jade/10 text-foreground",
  },
  observada: {
    etiqueta: "Observación de campo",
    descripcion: "Descripción directa del registro del equipo, sin atribuir función o antigüedad.",
    clase: "border-primary/40 bg-primary/10 text-foreground",
  },
  hipotesis: {
    etiqueta: "Hipótesis",
    descripcion: "Explicación posible que debe contrastarse con evidencia y especialistas.",
    clase: "border-accent/60 bg-accent/15 text-foreground",
  },
  pendiente: {
    etiqueta: "Información en investigación",
    descripcion: "Todavía no existe respaldo suficiente para afirmarlo.",
    clase: "border-border bg-secondary text-muted-foreground",
  },
  "tradicion-oral": {
    etiqueta: "Tradición oral",
    descripcion: "Memoria transmitida por la comunidad; no equivale a un hecho arqueológico comprobado.",
    clase: "border-accent/60 bg-accent/10 text-foreground",
  },
};

export interface EtapaAventura {
  n: number;
  titulo: string;
  descripcion: string;
  icono: LucideIcon;
  to?:
    | "/por-que"
    | "/mapa"
    | "/machu-muqu"
    | "/machu-muqu-3d"
    | "/descubre"
    | "/investigacion"
    | "/historias"
    | "/antes-y-despues"
    | "/compromiso"
    | "/progreso";
    | "/yachay";
  juegoId?: "encaja-la-piedra" | "salva-el-agua";
  estado?: "disponible" | "proxima-fase";
}

export const AVENTURA_RIQSIY: EtapaAventura[] = [
  { n: 1, titulo: "Conoce el problema", descripcion: "Comprende por qué mirar no siempre significa conocer.", icono: CircleHelp, to: "/por-que" },
  { n: 2, titulo: "Explora tu entorno", descripcion: "Ubica y reconoce el patrimonio cercano sin inventar datos.", icono: Map, to: "/mapa" },
  { n: 3, titulo: "Descubre Machu Moqo", descripcion: "Distingue lo sabido, lo observado y lo que falta investigar.", icono: Binoculars, to: "/machu-muqu" },
  { n: 4, titulo: "Recorre el 3D", descripcion: "Camina por una reconstrucción digital referencial.", icono: Compass, to: "/machu-muqu-3d" },
  { n: 5, titulo: "Aprende", descripcion: "Conoce sitios, técnicas y memorias del patrimonio cusqueño.", icono: BookOpenCheck, to: "/descubre" },
  { n: 6, titulo: "Juega PIRQA", descripcion: "Resuelve el reto de construcción en piedra.", icono: Boxes, juegoId: "encaja-la-piedra" },
  { n: 7, titulo: "Juega Salva el Agua", descripcion: "Experimenta con el recorrido y manejo del agua.", icono: Gamepad2, juegoId: "salva-el-agua" },
  { n: 8, titulo: "Aprende quechua", descripcion: "RIQSIY Yachay usa quechua Cusco-Collao con fuente de referencia y límites explícitos.", icono: Languages, to: "/yachay" },
  { n: 9, titulo: "Investiga", descripcion: "Formula preguntas, hipótesis y un método verificable.", icono: Microscope, to: "/investigacion" },
  { n: 10, titulo: "Conoce a tu comunidad", descripcion: "Escucha y registra únicamente voces reales autorizadas.", icono: HeartHandshake, to: "/historias" },
  { n: 11, titulo: "Valora", descripcion: "Compara cambios y reconoce lo que debe permanecer.", icono: FlaskConical, to: "/antes-y-despues" },
  { n: 12, titulo: "Comprométete", descripcion: "Elige acciones concretas de cuidado y respeto.", icono: ClipboardCheck, to: "/compromiso" },
  { n: 13, titulo: "Conviértete en guardián", descripcion: "Revisa tu huella cultural y continúa protegiendo.", icono: ShieldCheck, to: "/progreso" },
];

export const REGISTROS_CAMPO = [
  {
    id: "muro",
    titulo: "Estructura de piedra",
    tipo: "Fotografía propia",
    src: MEDIA_MACHU_MUQU.muro,
    estado: "observada" as EstadoEvidencia,
    observacion: "Se distinguen piedras superpuestas y vegetación próxima a la estructura.",
    pregunta: "¿Cómo cambian la forma y el tamaño de las piedras entre sectores?",
  },
  {
    id: "terrazas",
    titulo: "Desniveles del terreno",
    tipo: "Fotografía propia",
    src: MEDIA_MACHU_MUQU.terrazas,
    estado: "observada" as EstadoEvidencia,
    observacion: "El terreno presenta cambios de nivel y sectores delimitados por piedra.",
    pregunta: "¿Los desniveles son naturales, modificados o una combinación de ambos?",
  },
  {
    id: "sector",
    titulo: "Vista general del sector",
    tipo: "Fotografía propia",
    src: MEDIA_MACHU_MUQU.sector,
    estado: "observada" as EstadoEvidencia,
    observacion: "El registro muestra la relación visual entre estructuras, relieve y vegetación.",
    pregunta: "¿Qué relaciones espaciales pueden documentarse sin atribuir todavía una función?",
  },
  {
    id: "bosque",
    titulo: "Entorno y vegetación",
    tipo: "Fotografía propia",
    src: MEDIA_MACHU_MUQU.bosque,
    estado: "observada" as EstadoEvidencia,
    observacion: "La vegetación cubre parcialmente algunas superficies y limita su lectura completa.",
    pregunta: "¿Qué cambios del entorno afectan la conservación y la observación del lugar?",
  },
] as const;

export const VIDEOS_CAMPO = [
  {
    id: "recorrido",
    titulo: "Recorrido general",
    src: MEDIA_MACHU_MUQU.videoRecorrido,
    descripcion: "Registro propio del desplazamiento, accesos, relieve y relación con el territorio.",
  },
  {
    id: "entorno",
    titulo: "Terreno, estructuras y entorno",
    src: MEDIA_MACHU_MUQU.videoEntorno,
    descripcion: "Registro propio de detalles visibles, desniveles, vegetación y estructuras de piedra.",
  },
] as const;

export const EXPERIENCIAS_REGIONALES = {
  "machu-muqu": { nombreVisible: "Machu Moqo", ruta: "/machu-muqu", recompensa: 150 },
  "machu-muqu-3d": { nombreVisible: "Explora Machu Moqo 3D", ruta: "/machu-muqu-3d", recompensa: 200 },
  "patrimonio-local": { nombreVisible: "Patrimonio local", ruta: "/patrimonio-local", recompensa: 120 },
} as const;