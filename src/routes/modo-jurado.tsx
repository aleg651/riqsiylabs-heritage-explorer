import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Mic2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/modo-jurado")({
  head: () => ({ meta: [{ title: "Modo Jurado — Presentación RIQSIY" }, { name: "description", content: "Presentación visual de RIQSIY para feria científica." }, { property: "og:title", content: "Modo Jurado — RIQSIY" }, { property: "og:description", content: "Problema, metodología, experiencias, evidencia, resultados e impacto de RIQSIY." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Jurado,
});

const P = [
  ["EL PROBLEMA", "Muchos jóvenes pueden pasar frente a su patrimonio sin llegar a conocerlo ni investigarlo."],
  ["PREGUNTA DE INVESTIGACIÓN", "¿En qué medida una experiencia interactiva puede incrementar interés, conocimiento y valoración?"],
  ["HIPÓTESIS", "El uso de RIQSIY podría fortalecer interés, conocimiento, valoración y actitud de protección."],
  ["RIQSIY", "Patrimonio + comunidad + tecnología + aprendizaje + investigación."],
  ["MACHU MOQO", "Caso central documentado con registros propios, observaciones y preguntas abiertas."],
  ["EXPERIENCIA 3D", "Recorrido digital referencial con siete puntos de observación y comparación REAL / 3D."],
  ["PIRQA", "Juego educativo de construcción y razonamiento espacial inspirado en principios observables."],
  ["SALVA EL AGUA", "Desafío sobre pendiente, recorrido, distribución y cuidado del agua."],
  ["RIQSIY YACHAY", "Aprendizaje gamificado de quechua Cusco-Collao con contenido validado."],
  ["EVIDENCIA", "Fotografías, videos, observaciones de campo y fuentes claramente identificadas."],
  ["METODOLOGÍA", "Pretest → uso de RIQSIY → postest → comparación → análisis → conclusiones."],
  ["RESULTADOS", "Pendientes de aplicación y análisis. No se presentan porcentajes ficticios."],
  ["CONCLUSIONES", "Se formularán únicamente después de analizar datos reales."],
  ["IMPACTO", "Acercar a los jóvenes al patrimonio para conocerlo, valorarlo y promover su protección."],
] as const;

function Jurado() {
  const [i, setI] = useState(0);
  const [exposicion, setExposicion] = useState(false);
  const x = P[i] ?? P[0];
  const progreso = ((i + 1) / P.length) * 100;
  return <div className={`surface-deep stone-grid flex min-h-[75vh] flex-col px-4 py-6 ${exposicion ? "fixed inset-0 z-[100] min-h-screen" : ""}`}>
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
      <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-gold-soft">MODO JURADO · {String(i + 1).padStart(2, "0")} / {P.length}</p><Button size="sm" variant="outline" onClick={() => setExposicion((v) => !v)}>{exposicion ? <Minimize2 /> : <Mic2 />}{exposicion ? "Salir" : "Modo exposición"}</Button></div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-border"><div className="h-full bg-accent transition-all" style={{ width: `${progreso}%` }} /></div>
      <div className="my-auto py-12 sm:py-16"><h1 className="font-display text-4xl sm:text-7xl">{x[0]}</h1><p className="mt-6 max-w-3xl text-lg opacity-85 sm:text-2xl">{x[1]}</p></div>
      <div className="flex items-center justify-between gap-3"><Button variant="outline" disabled={i === 0} onClick={() => setI((v) => v - 1)}><ArrowLeft />Anterior</Button>{i < P.length - 1 ? <Button onClick={() => setI((v) => v + 1)}>Siguiente<ArrowRight /></Button> : <Button asChild><Link to="/fencyt">Cerrar presentación<ArrowRight /></Link></Button>}</div>
    </div>
  </div>;
}