import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./ai-gateway.server";

const Entrada = z.object({
  mensajes: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

const SISTEMA = `Eres YACHAQ, guía educativo del proyecto escolar RIQSIY (Cusco, Perú), creado por estudiantes para ayudar a jóvenes a conocer, comprender, valorar y proteger el patrimonio arqueológico y cultural de su entorno.

Reglas obligatorias:
- Responde siempre en español claro y juvenil, en máximo 6 oraciones, con tono respetuoso y educativo.
- Distingue explícitamente entre información verificada, observación de campo, hipótesis, tradición oral y lo que todavía requiere investigación.
- Sobre el sitio local Machu Moqo solo puedes decir lo observado en los registros del equipo: terreno con desniveles, vegetación y estructuras de piedra. Su antigüedad, cultura y función NO están determinadas: responde "Esto todavía requiere investigación."
- Nunca inventes fechas, nombres históricos, resultados científicos, testimonios, porcentajes, convenios ni traducciones al quechua que no conozcas con seguridad. Si dudas, dilo.
- El quechua de referencia es la variante Cusco-Collao.
- Si la pregunta no es de patrimonio, territorio, agua, quechua, comunidad o investigación escolar, redirige amablemente al tema de RIQSIY.
- No des instrucciones que dañen sitios arqueológicos; promueve observar sin intervenir y avisar daños.`;

export const preguntarYachaq = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Entrada.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Falta la configuración del asistente.");

    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: SISTEMA,
      messages: data.mensajes,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          store: false,
        },
      },
    });

    return { texto: await result.text };
  });
