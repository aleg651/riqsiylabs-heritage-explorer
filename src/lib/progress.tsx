import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { INSIGNIAS, SITIOS } from "./riqsiy-data";

export interface ProgresoState {
  nombre: string;
  descubiertos: string[];
  retosCompletados: string[]; // `${slug}#${index}`
  puntos: number;
  compromisos: string[];
  fechaCompromiso: string | null;
}

const VACIO: ProgresoState = {
  nombre: "Estudiante RIQSIY",
  descubiertos: [],
  retosCompletados: [],
  puntos: 0,
  compromisos: [],
  fechaCompromiso: null,
};

const KEY = "riqsiy-progreso-v1";

interface Ctx extends ProgresoState {
  hidratado: boolean;
  insignias: typeof INSIGNIAS;
  setNombre: (n: string) => void;
  descubrir: (slug: string) => void;
  completarReto: (slug: string, index: number, puntos: number) => void;
  toggleCompromiso: (id: string) => void;
  confirmarCompromisos: () => void;
  reiniciar: () => void;
}

const ProgresoContext = createContext<Ctx | null>(null);

export function ProgresoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgresoState>(VACIO);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...VACIO, ...(JSON.parse(raw) as Partial<ProgresoState>) });
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
    setState((s) =>
      s.descubiertos.includes(slug)
        ? s
        : { ...s, descubiertos: [...s.descubiertos, slug], puntos: s.puntos + 20 },
    );
  }, []);

  const completarReto = useCallback((slug: string, index: number, puntos: number) => {
    const id = `${slug}#${index}`;
    setState((s) =>
      s.retosCompletados.includes(id)
        ? s
        : { ...s, retosCompletados: [...s.retosCompletados, id], puntos: s.puntos + puntos },
    );
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
    setState((s) => ({
      ...s,
      fechaCompromiso: new Date().toISOString(),
      puntos: s.fechaCompromiso ? s.puntos : s.puntos + 25,
    }));
  }, []);

  const insignias = useMemo(
    () =>
      INSIGNIAS.filter((i) => {
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
            return state.puntos >= 150;
          default:
            return false;
        }
      }),
    [state],
  );

  const value: Ctx = {
    ...state,
    hidratado,
    insignias,
    setNombre: (nombre) => setState((s) => ({ ...s, nombre })),
    descubrir,
    completarReto,
    toggleCompromiso,
    confirmarCompromisos,
    reiniciar: () => setState(VACIO),
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
