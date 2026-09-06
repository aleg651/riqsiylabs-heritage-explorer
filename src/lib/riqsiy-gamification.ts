import { INSIGNIAS } from "./riqsiy-data";

export const AUTOR = "ALEXANDRO ROSMIL VASQUEZ QUISPE";

/* ---------------------------------- Niveles --------------------------------- */

export interface Nivel {
  n: number;
  nombre: string;
  min: number;
  icono: string;
}

export const NIVELES: Nivel[] = [
  { n: 1, nombre: "Curioso", min: 0, icono: "👀" },
  { n: 2, nombre: "Explorador", min: 200, icono: "🧭" },
  { n: 3, nombre: "Investigador", min: 500, icono: "🔬" },
  { n: 4, nombre: "Guardián de la memoria", min: 900, icono: "🧠" },
  { n: 5, nombre: "Protector del patrimonio", min: 1400, icono: "🛡️" },
  { n: 6, nombre: "Embajador RIQSIY", min: 2000, icono: "🏆" },
];

export function nivelDe(coins: number) {
  const actual = [...NIVELES].reverse().find((n) => coins >= n.min) ?? NIVELES[0]!;
  const siguiente = NIVELES.find((n) => n.min > coins) ?? null;
  const base = actual.min;
  const techo = siguiente ? siguiente.min : actual.min;
  const progreso = siguiente ? Math.round(((coins - base) / (techo - base)) * 100) : 100;
  return { actual, siguiente, progreso };
}

/* --------------------------------- Insignias -------------------------------- */

export const INSIGNIAS_JUEGOS = [
  { id: "maestro-piedra", nombre: "Maestro de la piedra", icono: "🧱", descripcion: "Completaste “Encaja la piedra”." },
  { id: "guardian-agua", nombre: "Guardián del agua", icono: "💧", descripcion: "Completaste “Salva el agua”." },
  { id: "sabio-andenes", nombre: "Sabio de los andenes", icono: "🌾", descripcion: "Completaste “Construye el andén”." },
  {
    id: "caminante",
    nombre: "Caminante del Qhapaq Ñan",
    icono: "🛤️",
    descripcion: "Completaste “El camino del Qhapaq Ñan”.",
  },
  { id: "observador-cielo", nombre: "Observador del cielo", icono: "☀️", descripcion: "Completaste “Sigue la sombra”." },
  {
    id: "diagnostico",
    nombre: "Voz de la investigación",
    icono: "📋",
    descripcion: "Respondiste el diagnóstico inicial.",
  },
];

export const INSIGNIAS_EXPERIENCIAS = [
  {
    id: "explorador-local",
    nombre: "Explorador del Patrimonio Local",
    icono: "🗺️",
    descripcion: "Completaste la experiencia “Descubriendo nuestro patrimonio local”.",
  },
  {
    id: "explorador-machu-muqu",
    nombre: "Guardián de la memoria de Machu Muqu",
    icono: "🌙",
    descripcion: "Completaste la experiencia “Machu Muqu: memoria, piedra y territorio”.",
  },
  {
    id: "caminante-machu-muqu",
    nombre: "Caminante de Machu Muqu",
    icono: "🧭",
    descripcion: "Recorriste los 7 puntos de la exploración 3D de Machu Muqu.",
  },
];

export const EXPERIENCIA_LOCAL_ID = "patrimonio-local";
export const EXPERIENCIA_MACHU_MUQU_ID = "machu-muqu";
export const EXPERIENCIA_MACHU_MUQU_3D_ID = "machu-muqu-3d";


export const ALL_INSIGNIAS = [...INSIGNIAS, ...INSIGNIAS_JUEGOS, ...INSIGNIAS_EXPERIENCIAS];

/* -------------------------------- Recompensas ------------------------------- */

export const RECOMPENSAS = [
  {
    id: "insignia-especial",
    costo: 500,
    titulo: "Insignia especial RIQSIY",
    detalle: "Insignia digital exclusiva dentro de la plataforma.",
    estado: "Disponible" as const,
    icono: "🎖️",
  },
  {
    id: "certificado",
    costo: 1000,
    titulo: "Certificado digital de participación",
    detalle: "Certificado generado por el proyecto RIQSIY (documento educativo, no oficial).",
    estado: "Disponible" as const,
    icono: "📜",
  },
  {
    id: "experiencia",
    costo: 2000,
    titulo: "Experiencia cultural o beneficio educativo",
    detalle: "Propuesta sujeta a convenio con una institución cultural o educativa.",
    estado: "Propuesta" as const,
    icono: "🎨",
  },
  {
    id: "cultural-especial",
    costo: 5000,
    titulo: "Recompensa cultural especial",
    detalle: "Posibilidad de participar, sujeta a disponibilidad y convenio institucional.",
    estado: "Propuesta" as const,
    icono: "✨",
  },
];

export const RECOMPENSA_PRINCIPAL = {
  id: "entrada",
  titulo: "🎟️ Entrada a un centro arqueológico",
  aviso: "Próximamente mediante alianzas con instituciones culturales.",
  nota:
    "RIQSIY no entrega entradas actualmente. Esta recompensa es una proyección del proyecto y requiere convenio con la institución responsable del sitio.",
};

/* ----------------------------------- Tests ---------------------------------- */

export type DimensionId = "conocimiento" | "valoracion" | "interes" | "pertenencia" | "conservacion";

export const DIMENSIONES: { id: DimensionId; label: string }[] = [
  { id: "conocimiento", label: "Conocimiento" },
  { id: "valoracion", label: "Valoración" },
  { id: "interes", label: "Interés" },
  { id: "pertenencia", label: "Sentido de pertenencia" },
  { id: "conservacion", label: "Intención de conservación" },
];

export interface PreguntaTest {
  id: string;
  dimension: DimensionId;
  texto: string;
}

export const TEST_INICIAL: PreguntaTest[] = [
  { id: "i1", dimension: "conocimiento", texto: "Puedo explicar para qué servía un centro arqueológico cercano a mi casa." },
  { id: "i2", dimension: "conocimiento", texto: "Conozco cómo se construían los muros incas y por qué resisten sismos." },
  { id: "i3", dimension: "valoracion", texto: "Considero que el patrimonio arqueológico del Cusco es muy valioso para mi vida." },
  { id: "i4", dimension: "valoracion", texto: "Creo que las estructuras antiguas de mi entorno merecen ser cuidadas y estudiadas." },
  { id: "i5", dimension: "interes", texto: "Me interesa investigar por mi cuenta la historia de los lugares que veo a diario." },
  { id: "i6", dimension: "interes", texto: "Me gustaría aprender más sobre ingeniería, agricultura y astronomía andinas." },
  { id: "i7", dimension: "pertenencia", texto: "Siento que el patrimonio arqueológico del Cusco es parte de mi identidad." },
  { id: "i8", dimension: "pertenencia", texto: "Hablo con orgullo de la historia de mi región cuando estoy con otras personas." },
  { id: "i9", dimension: "conservacion", texto: "Estoy dispuesto a participar en actividades de conservación del patrimonio." },
  { id: "i10", dimension: "conservacion", texto: "Cuido de no dañar ni ensuciar los espacios arqueológicos que visito." },
];

export const TEST_FINAL: PreguntaTest[] = [
  { id: "f1", dimension: "conocimiento", texto: "Ahora puedo describir la función original de una estructura arqueológica de mi entorno." },
  { id: "f2", dimension: "conocimiento", texto: "Sé explicar técnicas incas como el encaje poligonal, los andenes o los canales." },
  { id: "f3", dimension: "valoracion", texto: "Reconozco un valor importante en el patrimonio arqueológico que me rodea." },
  { id: "f4", dimension: "valoracion", texto: "Pienso que cuidar estas estructuras es una responsabilidad compartida." },
  { id: "f5", dimension: "interes", texto: "Después de esta experiencia quiero seguir investigando sobre estos lugares." },
  { id: "f6", dimension: "interes", texto: "Me llama la atención el conocimiento técnico y científico de las culturas andinas." },
  { id: "f7", dimension: "pertenencia", texto: "Siento una conexión personal con la historia del territorio donde vivo." },
  { id: "f8", dimension: "pertenencia", texto: "Me identifico con la memoria cultural de mi comunidad." },
  { id: "f9", dimension: "conservacion", texto: "Tengo la intención concreta de proteger el patrimonio en mi vida diaria." },
  { id: "f10", dimension: "conservacion", texto: "Invitaría a otras personas a respetar y cuidar los sitios arqueológicos." },
];

export const ESCALA = [
  { valor: 1, label: "Nada" },
  { valor: 2, label: "Poco" },
  { valor: 3, label: "Regular" },
  { valor: 4, label: "Bastante" },
  { valor: 5, label: "Mucho" },
];

/** Convierte respuestas Likert (1–5) en un puntaje 0–100 por dimensión. */
export function puntuarTest(preguntas: PreguntaTest[], respuestas: Record<string, number>) {
  const out = {} as Record<DimensionId, number>;
  for (const d of DIMENSIONES) {
    const items = preguntas.filter((p) => p.dimension === d.id);
    const vals = items.map((p) => respuestas[p.id]).filter((v): v is number => typeof v === "number");
    out[d.id] = vals.length ? Math.round(((vals.reduce((a, b) => a + b, 0) / vals.length - 1) / 4) * 100) : 0;
  }
  return out;
}
