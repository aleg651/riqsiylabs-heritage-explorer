import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SectionTitle } from "@/components/riqsiy/SectionTitle";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { preguntarYachaq } from "@/lib/yachaq.functions";
import logo from "@/assets/logo-riqsiy.png";

export const Route = createFileRoute("/yachaq")({
  head: () => ({
    meta: [
      { title: "Yachaq RIQSIY — Guía educativa con IA" },
      {
        name: "description",
        content:
          "Conversa con Yachaq, la guía educativa de RIQSIY que diferencia información verificada, observación, hipótesis y preguntas abiertas.",
      },
      { property: "og:title", content: "Yachaq RIQSIY — Guía educativa con IA" },
      {
        property: "og:description",
        content: "Pregunta sobre patrimonio, territorio, agua, quechua, comunidad e investigación escolar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Yachaq,
});

const TEMAS = [
  { k: "Machu Moqo", e: "OBSERVACIÓN", r: "Los registros propios muestran terreno con desniveles, vegetación y estructuras de piedra. Su antigüedad y función todavía requieren investigación.", to: "/machu-muqu" as const },
  { k: "Arquitectura", e: "INFORMACIÓN VERIFICADA", r: "En RIQSIY se distinguen rasgos visibles de las interpretaciones. Una forma constructiva no permite asignar una función sin fuentes.", to: "/mira-mas-alla" as const },
  { k: "Agua", e: "HIPÓTESIS EDUCATIVA", r: "La pendiente y el caudal influyen en el flujo. El laboratorio permite experimentar, pero no reconstruye un sistema arqueológico concreto.", to: "/laboratorio-agua" as const },
  { k: "Quechua", e: "INFORMACIÓN VERIFICADA", r: "RIQSIY usa la variante Cusco-Collao y publica solo vocabulario con referencia lingüística.", to: "/yachay" as const },
  { k: "Comunidad", e: "PREGUNTA ABIERTA", r: "Las memorias de la comunidad son valiosas como tradición oral; no sustituyen evidencia arqueológica.", to: "/historias" as const },
  { k: "Investigación", e: "INFORMACIÓN VERIFICADA", r: "El estudio propone pretest, intervención y postest. Los resultados reales están pendientes de aplicación.", to: "/investigacion" as const },
];

const SUGERENCIAS = [
  "¿Qué se observa en Machu Moqo y qué falta investigar?",
  "¿Por qué observar no es lo mismo que conocer?",
  "¿Cómo puedo cuidar un sitio arqueológico durante una visita?",
  "¿Qué significa la palabra quechua «pirqa»?",
];

type Turno = { role: "user" | "assistant"; content: string };

function Yachaq() {
  const enviar = useServerFn(preguntarYachaq);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const areaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!cargando) areaRef.current?.focus();
  }, [cargando]);

  const preguntar = async (texto: string) => {
    const limpio = texto.trim();
    if (!limpio || cargando) return;
    const historial: Turno[] = [...turnos, { role: "user", content: limpio }];
    setTurnos(historial);
    setCargando(true);
    setError(null);
    try {
      const respuesta = await enviar({ data: { mensajes: historial } });
      setTurnos([...historial, { role: "assistant", content: respuesta.texto }]);
    } catch {
      setError("Yachaq no pudo responder en este momento. Vuelve a intentarlo en unos segundos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <SectionTitle
        eyebrow="Guía educativa con inteligencia artificial"
        title="Yachaq RIQSIY"
        description="Conversa con Yachaq y revisa siempre qué tipo de conocimiento respalda cada respuesta: verificado, observado, hipótesis, tradición oral o pendiente de investigación."
      />

      <section className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <img src={logo} alt="Yachaq RIQSIY" className="h-9 w-9 rounded-full border border-border" />
          <div className="leading-tight">
            <p className="font-display text-base">Yachaq</p>
            <p className="text-xs text-muted-foreground">Responde solo con contenido educativo y sin inventar datos.</p>
          </div>
        </div>

        <Conversation className="h-[26rem]">
          <ConversationContent>
            {turnos.length === 0 && !cargando && (
              <ConversationEmptyState
                title="Pregunta lo que quieras aprender"
                description="Patrimonio, territorio, agua, quechua Cusco-Collao, comunidad o investigación escolar."
              />
            )}
            {turnos.map((t, i) => (
              <Message key={`${t.role}-${i}`} from={t.role}>
                <MessageContent>
                  {t.role === "assistant" ? <MessageResponse>{t.content}</MessageResponse> : <p>{t.content}</p>}
                </MessageContent>
              </Message>
            ))}
            {cargando && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer>Yachaq está pensando…</Shimmer>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border p-4">
          {error && (
            <p className="mb-3 rounded-md border border-accent bg-accent/10 p-3 text-sm">{error}</p>
          )}
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGERENCIAS.map((s) => (
              <Button
                key={s}
                type="button"
                variant="outline"
                size="sm"
                disabled={cargando}
                onClick={() => void preguntar(s)}
                className="h-auto whitespace-normal py-2 text-left text-xs"
              >
                {s}
              </Button>
            ))}
          </div>
          <PromptInput
            onSubmit={(mensaje) => {
              void preguntar(mensaje.text ?? "");
            }}
          >
            <PromptInputTextarea ref={areaRef} placeholder="Escribe tu pregunta para Yachaq…" />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={cargando ? "submitted" : undefined} disabled={cargando} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-3 text-xs text-muted-foreground">
            Yachaq es una guía educativa asistida por inteligencia artificial. Puede equivocarse: verifica siempre con
            tus fuentes, tu docente y la sección de Investigación.
          </p>
        </div>
      </section>

      <h2 className="mt-12 font-display text-2xl">Temas base de RIQSIY</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {TEMAS.map((t) => (
          <article key={t.k} className="rounded-lg border border-border bg-card p-5">
            <span className="text-xs font-semibold text-primary">{t.e}</span>
            <h3 className="mt-2 font-display text-xl">{t.k}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.r}</p>
            <Link to={t.to} className="mt-4 inline-block text-sm font-semibold text-primary">
              Profundizar →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
