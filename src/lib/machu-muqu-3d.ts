import { MEDIA_MACHU_MUQU } from "./machu-muqu-media";

/** Tipo de información asociada a cada punto: se etiqueta siempre su procedencia. */
export type FuenteInfo = "observacion" | "oral" | "arqueologica" | "investigacion";

export const FUENTES: Record<FuenteInfo, { label: string; icono: string; clase: string }> = {
  observacion: {
    label: "Observación propia",
    icono: "🔎",
    clase: "border-accent/50 bg-accent/15 text-foreground",
  },
  oral: {
    label: "Tradición oral",
    icono: "🗣️",
    clase: "border-primary/50 bg-primary/10 text-foreground",
  },
  arqueologica: {
    label: "Evidencia arqueológica",
    icono: "🏛️",
    clase: "border-border bg-secondary text-foreground",
  },
  investigacion: {
    label: "En investigación",
    icono: "❓",
    clase: "border-dashed border-muted-foreground/60 bg-muted text-muted-foreground",
  },
};

export interface Punto3D {
  n: number;
  id: string;
  titulo: string;
  /** Posición en el terreno (x, z). La altura la calcula `alturaTerreno`. */
  pos: [number, number];
  observacion: string;
  pregunta: string;
  /** Información disponible; si no hay evidencia suficiente se marca como en investigación. */
  info: string;
  fuenteInfo: FuenteInfo;
  /** Solo en modo investigador. */
  memoriaOral?: string;
  historica?: string;
  /** Fotografía real del sector (registro propio) para la comparación REAL / 3D. */
  foto: string;
  pieFoto: string;
}

export const PUNTOS_3D: Punto3D[] = [
  {
    n: 1,
    id: "entrada",
    titulo: "Entrada al sitio",
    pos: [0, 26],
    observacion:
      "Zona de acceso con pasto seco y pendiente suave; el sendero es el mismo que utilizamos para llegar.",
    pregunta: "¿Quiénes transitan hoy este acceso y cómo afecta al sitio?",
    info: "Registro propio del equipo: video y fotografías del acceso durante la visita.",
    fuenteInfo: "observacion",
    memoriaOral: "En la comunidad se conoce el lugar como Machu Muqu; el nombre se transmite de forma oral.",
    historica: "No contamos con documentación oficial del acceso. Elemento en investigación.",
    foto: MEDIA_MACHU_MUQU.terrazas,
    pieFoto: "Fotograma de nuestro video de recorrido: acceso y pendiente del terreno.",
  },
  {
    n: 2,
    id: "primeras-evidencias",
    titulo: "Primeras evidencias",
    pos: [-12, 14],
    observacion:
      "Piedras visibles en superficie, algunas sueltas y otras que parecen formar líneas dentro del pasto.",
    pregunta: "¿Las piedras están dispuestas al azar o siguen un orden?",
    info: "Elemento en investigación: el orden aparente debe registrarse antes de interpretarlo.",
    fuenteInfo: "investigacion",
    memoriaOral: "Se menciona que en el cerro “hay piedras de los antiguos”.",
    historica: "Sin publicaciones conocidas sobre este sector. Elemento en investigación.",
    foto: MEDIA_MACHU_MUQU.sector,
    pieFoto: "Fotograma propio: piedras en superficie entre pasto seco.",
  },
  {
    n: 3,
    id: "estructuras",
    titulo: "Estructuras de piedra",
    pos: [10, 2],
    observacion:
      "Muros de piedra sin argamasa visible, dispuestos en hiladas y escalonados en la ladera; algunas piedras tienen líquenes.",
    pregunta: "¿Qué función pudo haber tenido este muro?",
    info: "Elemento en investigación: no afirmamos función ni técnica constructiva sin verificación especializada.",
    fuenteInfo: "investigacion",
    memoriaOral: "Los relatos atribuyen a los “gentiles” la capacidad de mover y acomodar piedras grandes.",
    historica: "Los muros escalonados de la región se estudian con levantamiento y prospección autorizada.",
    foto: MEDIA_MACHU_MUQU.muro,
    pieFoto: "Fotografía propia: muros escalonados de piedra con líquenes.",
  },
  {
    n: 4,
    id: "vegetacion",
    titulo: "Sector con vegetación",
    pos: [-20, -8],
    observacion:
      "Pastos altos, arbustos y árboles cubren parcialmente las evidencias y limitan lo que podemos observar.",
    pregunta: "¿Qué parte del sitio todavía no podemos ver?",
    info: "Observación propia: el estado de conservación es un dato clave para su protección.",
    fuenteInfo: "observacion",
    memoriaOral: "Vecinos recuerdan que antes el sector tenía menos árboles.",
    historica: "La forestación reciente no está documentada en fuentes escritas que hayamos consultado.",
    foto: MEDIA_MACHU_MUQU.bosque,
    pieFoto: "Fotograma propio: bosque y pasto que cubren el sector.",
  },
  {
    n: 5,
    id: "entorno",
    titulo: "Vista del entorno",
    pos: [16, -22],
    observacion:
      "Desde el sector alto se observa una amplia visibilidad hacia laderas, quebradas y zonas de cultivo.",
    pregunta: "¿Por qué este lugar y no otro?",
    info: "En investigación: la relación con el territorio se analiza con visibilidad, agua y suelos.",
    fuenteInfo: "investigacion",
    memoriaOral: "La memoria de Ccatccapampa asocia los cerros altos con lugares de respeto.",
    historica: "La región cuenta con referencias regionales (Pinahua, Muyna, influencia Lucre) por contrastar.",
    foto: MEDIA_MACHU_MUQU.terrazas,
    pieFoto: "Fotograma propio: relación del sitio con el paisaje circundante.",
  },
  {
    n: 6,
    id: "memoria",
    titulo: "Memoria y tradición",
    pos: [-6, -26],
    observacion:
      "No hay un elemento material que represente esta parada: es un punto dedicado a la memoria de la comunidad.",
    pregunta: "¿Cómo cuidamos la memoria oral sin convertirla en dato arqueológico?",
    info: "Tradición oral: los relatos sobre los gentiles forman parte de la memoria cultural, no son hechos comprobados.",
    fuenteInfo: "oral",
    memoriaOral:
      "Se cuenta que antes del tiempo del sol vivieron los gentiles, y que al llegar Inti se retiraron. La secuencia que se narra es KILLA → GENTILES → INTI → PACHAKUTI.",
    historica: "No existe verificación arqueológica de estos relatos. Se presentan como memoria cultural.",
    foto: MEDIA_MACHU_MUQU.sector,
    pieFoto: "Fotograma propio del sector donde se comparten los relatos.",
  },
  {
    n: 7,
    id: "investigacion",
    titulo: "Zona de investigación",
    pos: [24, 14],
    observacion:
      "Evidencias cuyo origen, antigüedad y función no pueden afirmarse con lo registrado hasta hoy.",
    pregunta: "¿Qué necesitamos para pasar de observar a conocer?",
    info: "Elemento en investigación: se requieren fuentes verificables, acompañamiento especializado y autorizaciones.",
    fuenteInfo: "investigacion",
    memoriaOral: "La comunidad pide que el sitio sea estudiado y protegido.",
    historica: "Referencia temporal 1000–1400 d.C. mencionada en la reseña del proyecto: por contrastar.",
    foto: MEDIA_MACHU_MUQU.muro,
    pieFoto: "Fotografía propia del sector con mayor cantidad de piedra visible.",
  },
];

export const AVISO_REFERENCIAL =
  "Representación digital basada en el registro fotográfico y audiovisual realizado durante nuestra visita. Algunos elementos son aproximaciones visuales y no constituyen una reconstrucción arqueológica definitiva.";

/** Altura del terreno (laderas y terrazas observadas en el registro). */
export function alturaTerreno(x: number, z: number) {
  const ladera = -z * 0.16;
  const terrazas = Math.sin(z * 0.18) * 0.55 + Math.sin(z * 0.07 + 1.2) * 0.9;
  const ondas = Math.sin(x * 0.12) * 0.7 + Math.cos(x * 0.05 + z * 0.09) * 0.9;
  return ladera + terrazas + ondas;
}
