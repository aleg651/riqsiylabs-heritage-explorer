import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { SITIOS } from "./riqsiy-data";
import {
  ALL_INSIGNIAS,
  DIMENSIONES,
  TEST_FINAL,
  TEST_INICIAL,
  nivelDe,
  puntuarTest,
  type DimensionId,
} from "./riqsiy-gamification";
import { JUEGOS, INSIGNIA_POR_JUEGO, type JuegoId } from "./riqsiy-juegos";

export interface ResultadoTest {
  fecha: string;
  respuestas: Record<string, number>;
  dimensiones: Record<DimensionId, number>;
}

export interface Testimonio {
  id: string;
  lugar: string;
  historia: string;
  testimonio: string;
  compartidoPor: string;
  fuente: string;
  fecha: string;
  autorizado: boolean;
}

export interface ProgresoState {
  nombre: string;
  codigo: string;
  descubiertos: string[];
  retosCompletados: string[]; // `${slug}#${index}`
  juegosCompletados: string[]; // ids de minijuegos
  experiencias: string[]; // ids de experiencias completadas (ej. patrimonio-local)
  puntos: number; // RIQSI-COINS acumuladas (histórico)
  gastados: number;
  compromisos: string[];
  fechaCompromiso: string | null;
  testInicial: ResultadoTest | null;
  testFinal: ResultadoTest | null;
  testimonios: Testimonio[];
  canjeadas: string[];
}

function nuevoCodigo() {
  return `RQ-${Math.floor(1000 + Math.random() * 9000)}`;
}

const VACIO: ProgresoState = {
  nombre: "Estudiante RIQSIY",
  codigo: "RQ-0000",
  descubiertos: [],
  retosCompletados: [],
  juegosCompletados: [],
  experiencias: [],
  puntos: 0,
  gastados: 0,
  compromisos: [],
  fechaCompromiso: null,
  testInicial: null,
  testFinal: null,
  testimonios: [],
  canjeadas: [],
};

const KEY = "riqsiy-progreso-v2";

interface Ctx extends ProgresoState {
  hidratado: boolean;
  coins: number; // saldo disponible
  insignias: typeof ALL_INSIGNIAS;
  nivel: ReturnType<typeof nivelDe>;
  avance: number;
  setNombre: (n: string) => void;
  descubrir: (slug: string) => void;
  completarReto: (slug: string, index: number, puntos: number) => void;
  completarJuego: (id: JuegoId, puntos: number) => void;
  completarExperiencia: (id: string, puntos: number) => void;
  toggleCompromiso: (id: string) => void;
  confirmarCompromisos: () => void;
  guardarTest: (fase: "inicial" | "final", respuestas: Record<string, number>) => void;
  agregarTestimonio: (t: Omit<Testimonio, "id" | "fecha">) => void;
  canjear: (id: string, costo: number) => boolean;
  reiniciar: () => void;
}

const ProgresoContext = createContext<Ctx | null>(null);

function ganar(cantidad: number, motivo: string) {
  toast.success(`+${cantidad} RIQSI-COINS`, { description: motivo });
}

export function ProgresoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgresoState>(VACIO);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ProgresoState>;
        setState({ ...VACIO, ...parsed, codigo: parsed.codigo || nuevoCodigo() });
      } else {
        setState({ ...VACIO, codigo: nuevoCodigo() });
      }
    } catch {
      /* almacenamiento no disponible */
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [state, hidratado]);

  const descubrir = useCallback((slug: string) => {
    setState((s) => {
      if (s.descubiertos.includes(slug)) return s;
      ganar(50, "Nuevo lugar descubierto");
      return { ...s, descubiertos: [...s.descubiertos, slug], puntos: s.puntos + 50 };
    });
  }, []);

  const completarReto = useCallback((slug: string, index: number, puntos: number) => {
    const id = `${slug}#${index}`;
    setState((s) => {
      if (s.retosCompletados.includes(id)) return s;
      ganar(puntos, "Reto RIQSIY resuelto");
      return { ...s, retosCompletados: [...s.retosCompletados, id], puntos: s.puntos + puntos };
    });
  }, []);

  const completarJuego = useCallback((id: JuegoId, puntos: number) => {
    setState((s) => {
      if (s.juegosCompletados.includes(id)) return s;
      ganar(puntos, "Minijuego completado");
      return { ...s, juegosCompletados: [...s.juegosCompletados, id], puntos: s.puntos + puntos };
    });
  }, []);

  const completarExperiencia = useCallback((id: string, puntos: number) => {
    setState((s) => {
      if (s.experiencias.includes(id)) return s;
      ganar(puntos, "Experiencia RIQSIY completada");
      return { ...s, experiencias: [...s.experiencias, id], puntos: s.puntos + puntos };
    });
  }, []);

  const toggleCompromiso = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      compromisos: s.compromisos.includes(id)
        ? s.compromisos.filter((c) => c !== id)
        : [...s.compromisos, id],
    }));
  }, []);

  const confirmarCompromisos = useCallback(() => {
    setState((s) => {
      if (!s.fechaCompromiso) ganar(75, "Compromiso asumido");
      return {
        ...s,
        fechaCompromiso: new Date().toISOString(),
        puntos: s.fechaCompromiso ? s.puntos : s.puntos + 75,
      };
    });
  }, []);

  const guardarTest = useCallback((fase: "inicial" | "final", respuestas: Record<string, number>) => {
    const preguntas = fase === "inicial" ? TEST_INICIAL : TEST_FINAL;
    const resultado: ResultadoTest = {
      fecha: new Date().toISOString(),
      respuestas,
      dimensiones: puntuarTest(preguntas, respuestas),
    };
    setState((s) => {
      const yaTenia = fase === "inicial" ? !!s.testInicial : !!s.testFinal;
      if (!yaTenia) ganar(100, fase === "inicial" ? "Diagnóstico inicial registrado" : "Test final registrado");
      return {
        ...s,
        [fase === "inicial" ? "testInicial" : "testFinal"]: resultado,
        puntos: yaTenia ? s.puntos : s.puntos + 100,
      };
    });
  }, []);

  const agregarTestimonio = useCallback((t: Omit<Testimonio, "id" | "fecha">) => {
    setState((s) => {
      ganar(60, "Historia de la comunidad registrada");
      return {
        ...s,
        puntos: s.puntos + 60,
        testimonios: [
          ...s.testimonios,
          { ...t, id: `t-${Date.now()}`, fecha: new Date().toISOString().slice(0, 10) },
        ],
      };
    });
  }, []);

  const saldo = state.puntos - state.gastados;

  const canjear = useCallback(
    (id: string, costo: number) => {
      if (saldo < costo || state.canjeadas.includes(id)) return false;
      setState((s) => ({ ...s, gastados: s.gastados + costo, canjeadas: [...s.canjeadas, id] }));
      toast.success("Recompensa canjeada", { description: `-${costo} RIQSI-COINS` });
      return true;
    },
    [saldo, state.canjeadas],
  );

  const insignias = useMemo(
    () =>
      ALL_INSIGNIAS.filter((i) => {
        switch (i.id) {
          case "primer-descubrimiento":
            return state.descubiertos.length >= 1;
          case "explorador":
            return state.descubiertos.length >= 3;
          case "guardian":
            return state.retosCompletados.length >= 5;
          case "protector":
            return state.compromisos.length >= 2 && !!state.fechaCompromiso;
          case "embajador":
            return state.puntos >= 2000;
          case "explorador-local":
            return state.experiencias.includes("patrimonio-local");
          case "diagnostico":
            return !!state.testInicial;
          default: {
            const juego = (Object.keys(INSIGNIA_POR_JUEGO) as JuegoId[]).find(
              (j) => INSIGNIA_POR_JUEGO[j] === i.id,
            );
            return !!juego && state.juegosCompletados.includes(juego);
          }
        }
      }),
    [state],
  );

  const avance = useMemo(() => {
    const total = TOTAL_SITIOS + TOTAL_RETOS + JUEGOS.length + 2 + 1;
    const hecho =
      state.descubiertos.length +
      state.retosCompletados.length +
      state.juegosCompletados.length +
      (state.testInicial ? 1 : 0) +
      (state.testFinal ? 1 : 0) +
      (state.fechaCompromiso ? 1 : 0);
    return Math.min(100, Math.round((hecho / total) * 100));
  }, [state]);

  const value: Ctx = {
    ...state,
    hidratado,
    coins: saldo,
    insignias,
    nivel: nivelDe(state.puntos),
    avance,
    setNombre: (nombre) => setState((s) => ({ ...s, nombre })),
    descubrir,
    completarReto,
    completarJuego,
    completarExperiencia,
    toggleCompromiso,
    confirmarCompromisos,
    guardarTest,
    agregarTestimonio,
    canjear,
    reiniciar: () => setState({ ...VACIO, codigo: nuevoCodigo() }),
  };

  return <ProgresoContext.Provider value={value}>{children}</ProgresoContext.Provider>;
}

export function useProgreso() {
  const ctx = useContext(ProgresoContext);
  if (!ctx) throw new Error("useProgreso debe usarse dentro de ProgresoProvider");
  return ctx;
}

export const TOTAL_SITIOS = SITIOS.length;
export const TOTAL_RETOS = SITIOS.reduce((acc, s) => acc + s.retos.length, 0);
export const TOTAL_JUEGOS = JUEGOS.length;
export const DIMENSIONES_TEST = DIMENSIONES;
