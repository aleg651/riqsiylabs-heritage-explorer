# Plan de transformación: RIQSIY Regional 2.0

## Objetivo
Evolucionar el proyecto actual por fases, conservando todas sus rutas, juegos, progreso, contenidos y diseño. La experiencia seguirá el recorrido **Explorar → Descubrir → Investigar → Aprender → Jugar → Aprender quechua → Conocer a la comunidad → Valorar → Proteger**.

## Decisiones confirmadas
- El nombre visible será **Machu Moqo**.
- Las rutas internas actuales `/machu-muqu` y `/machu-muqu-3d` se conservarán para no romper enlaces ni progreso guardado.
- RIQSIY Yachay utilizará **quechua Cusco-Collao**.
- No se publicarán traducciones, pronunciaciones, testimonios, resultados ni afirmaciones arqueológicas sin validación.

## Fase 0 — Blindaje y base regional
- Registrar el estado actual de rutas, progreso, insignias, juegos y experiencias antes de ampliarlo.
- Crear una capa de datos extensible para nuevas experiencias sin cambiar la clave actual del progreso guardado.
- Normalizar gradualmente el texto visible de “Machu Muqu” a “Machu Moqo”, manteniendo identificadores y direcciones compatibles.
- Corregir afirmaciones demasiado categóricas y rotular claramente contenido pendiente, observado, hipotético o verificado.

## Fase 1 — Machu Moqo y Aventura RIQSIY
- Convertir Machu Moqo en el caso central con tres bloques: **Lo que sabemos**, **Lo que observamos** y **Lo que todavía investigamos**.
- Integrar únicamente fotografías y videos propios disponibles; mantener espacios pendientes claramente rotulados.
- Crear la ruta visual de 13 etapas de Aventura RIQSIY, conectando páginas existentes sin duplicarlas.
- Crear Evidencia de Campo con registros, recorrido, observaciones, documentos y proceso de investigación.

## Fase 2 — Explora Machu Moqo 3D
- Conservar la escena actual y mejorar sus siete puntos como descubrimientos educativos.
- Cada punto podrá revelar foto real, observación, pregunta, reto, palabra validada y recompensa.
- Finalizar con “Exploración completada” y la insignia **Explorador del Patrimonio Local**.
- Mantener modo de baja calidad, controles táctiles y funcionamiento en computadora.

## Fase 3 — RIQSIY Yachay
- Crear cinco unidades para quechua Cusco-Collao: territorio; saludos; comunidad; naturaleza; patrimonio.
- Incorporar escuchar, elegir, relacionar, completar, ordenar y retos rápidos.
- Publicar contenido lingüístico solo después de documentar su fuente o validación competente.
- Integrar avance, monedas e insignia **Aprendiz de Quechua**.

## Fase 4 — Pasaporte y progreso regional
- Crear Pasaporte RIQSIY con sellos de sitios, juegos, 3D, quechua, comunidad e investigación.
- Ampliar el progreso actual de forma compatible con datos guardados: sellos, palabras aprendidas, casos resueltos, aportes, laboratorios y racha.
- Incorporar las seis nuevas insignias y mantener niveles, monedas, canjes e insignias actuales.

## Fase 5 — Nuevas experiencias interactivas
- Crear **Detective del Patrimonio** como investigación por fotografías, pistas, mapa, comparación, hipótesis y selección razonada de evidencias; no como cuestionario lineal.
- Crear **Construye como los Andes** con piedra, pendiente, base, drenaje y distribución.
- Crear **Laboratorio del Agua** con pendiente, caudal y recorrido visibles.
- Rotular ambos laboratorios como simulaciones educativas, no reconstrucciones históricas.

## Fase 6 — Comunidad y registro responsable
- Crear **Voces de mi comunidad** para material real autorizado, evitando datos personales innecesarios y protegiendo a menores.
- Crear **Descubre patrimonio cerca de ti** y su ficha de descubrimiento con fotografía, ubicación general, observación, pregunta, importancia posible y protección.
- Nunca clasificar un hallazgo como arqueológico sin verificación.

## Fase 7 — Yachaq RIQSIY
- Crear un guía educativo limitado al conocimiento documentado del proyecto.
- Etiquetar cada respuesta como **Información verificada**, **Observación**, **Hipótesis** o **Pregunta abierta**.
- Responder “Esto todavía requiere investigación” cuando no exista respaldo.

## Fase 8 — Laboratorio RIQSIY y Modo Jurado
- Consolidar problema, pregunta, hipótesis, variables, metodología, pretest, intervención, postest, análisis y conclusiones.
- Marcar resultados ausentes como **Pendiente de aplicación** y ejemplos como **Datos de demostración**.
- Crear el Modo Jurado de 16 pasos, rápido y visual, reutilizando evidencia real de las secciones existentes.

## Fase 9 — Protección y control de calidad
- Mejorar Antes y Ahora con comparación deslizante y preguntas de análisis.
- Ampliar Mi compromiso con las siete acciones solicitadas y reconocimiento de Guardián.
- Revisar navegación, formularios, videos, mapas, juegos y 3D en celular, tableta y computadora.
- Verificar accesibilidad, rendimiento, continuidad del progreso y ausencia de errores.

## Detalles técnicos
- Se crearán rutas independientes para las nuevas experiencias y se conservarán todas las actuales.
- No se modificará `__root` salvo que una necesidad global comprobada lo exija; la navegación puede ampliarse desde el encabezado existente.
- Los nuevos campos del progreso serán opcionales y tendrán valores iniciales seguros al cargar registros antiguos.
- El 3D conservará carga del lado del navegador, calidad adaptable y límites para equipos de menor potencia.
- Fotografías, audios y videos se almacenarán como recursos del proyecto; no se sustituirá evidencia propia por material genérico.
- Cada fase tendrá comprobación funcional y visual antes de iniciar la siguiente.

## Primer incremento recomendado
Implementar únicamente **Fase 0 y Fase 1**: compatibilidad del nombre Machu Moqo, clasificación científica de contenidos, Aventura RIQSIY y Evidencia de Campo. Esto crea la columna vertebral regional sin arriesgar juegos, 3D ni progreso.
