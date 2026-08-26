export type JuegoId = "encaja-la-piedra" | "salva-el-agua" | "construye-el-anden" | "qhapaq-nan" | "sigue-la-sombra";

export interface PasoJuego {
  enunciado: string;
  contexto?: string;
  opciones: { label: string; detalle?: string; icono?: string }[];
  correcta: number;
  explicacion: string;
}

export interface Juego {
  id: JuegoId;
  titulo: string;
  lema: string;
  icono: string;
  tema: string;
  sitio: string; // slug relacionado
  recompensa: number;
  aprendizajes: string[];
  intro: string;
  escena: "muro" | "canal" | "anden" | "ruta" | "sombra";
  pasos: PasoJuego[];
  cierre: string;
  nota?: string;
}

export const JUEGOS: Juego[] = [
  {
    id: "encaja-la-piedra",
    titulo: "Encaja la piedra",
    lema: "Construye un muro que resista el tiempo y los sismos.",
    icono: "🧱",
    tema: "Arquitectura",
    sitio: "sacsayhuaman",
    recompensa: 100,
    aprendizajes: ["Encaje poligonal", "Estabilidad estructural", "Muros en talud", "Trabajo sin mortero"],
    intro:
      "Vas a completar un muro inca. En cada hueco elige la piedra que encaja y da estabilidad, tal como lo hacían los canteros con cuñas, plantillas y ajuste por percusión.",
    escena: "muro",
    pasos: [
      {
        enunciado: "Hueco 1: el espacio tiene cinco lados irregulares. ¿Qué piedra colocas?",
        opciones: [
          { label: "Bloque rectangular estándar", detalle: "Rápido, pero deja vacíos" },
          { label: "Piedra poligonal tallada para ese hueco", detalle: "Cada cara ajustada al vecino" },
          { label: "Piedras pequeñas con barro", detalle: "Relleno improvisado" },
        ],
        correcta: 1,
        explicacion:
          "El encaje poligonal talla cada bloque para un único lugar posible. Sin vacíos ni mortero, las fuerzas se transmiten por contacto directo entre piedras.",
      },
      {
        enunciado: "¿Cómo orientas las caras del bloque para que el muro no se abra?",
        opciones: [
          { label: "Caras planas hacia afuera y ángulos entrantes hacia adentro" },
          { label: "La cara más lisa hacia adentro" },
          { label: "Da igual: el peso lo sostiene todo" },
        ],
        correcta: 0,
        explicacion:
          "Los ángulos entrantes trabajan como trabas internas: al moverse el suelo, las piedras se aprietan entre sí en lugar de separarse.",
      },
      {
        enunciado: "El muro es alto. ¿Con qué inclinación lo levantas?",
        opciones: [
          { label: "Perfectamente vertical" },
          { label: "Ligeramente inclinado hacia adentro (talud)" },
          { label: "Inclinado hacia afuera para ganar espacio" },
        ],
        correcta: 1,
        explicacion:
          "El talud baja el centro de gravedad y devuelve el empuje hacia el interior del muro: una de las razones por las que estas estructuras han resistido siglos de sismos.",
      },
      {
        enunciado: "Última hilada: ¿cómo colocas las juntas respecto a la hilada de abajo?",
        opciones: [
          { label: "Juntas alineadas en columna, más ordenado" },
          { label: "Juntas desplazadas (traba) respecto a la hilada inferior" },
          { label: "Sellando todo con mezcla de cemento" },
        ],
        correcta: 1,
        explicacion:
          "Las juntas trabadas cortan las líneas de falla: una grieta no puede recorrer el muro de arriba abajo. El cemento moderno, además, daña la piedra original.",
      },
    ],
    cierre: "Tu muro quedó estable: encaje poligonal + talud + juntas trabadas. Así se construyó lo que hoy sigue en pie.",
  },
  {
    id: "salva-el-agua",
    titulo: "Salva el agua",
    lema: "Lleva el agua desde el manante hasta los andenes sin perder una gota.",
    icono: "💧",
    tema: "Ingeniería hidráulica",
    sitio: "tipon",
    recompensa: 150,
    aprendizajes: ["Captación de manantes", "Pendiente y caudal", "Canales revestidos", "Riego de andenes"],
    intro:
      "Diseñarás el recorrido de un canal. Cada decisión afecta la velocidad del agua, la erosión y cuánta agua llega al cultivo.",
    escena: "canal",
    pasos: [
      {
        enunciado: "Empiezas en el manante. ¿Dónde inicias la captación?",
        opciones: [
          { label: "En la salida del manante, protegida con piedra" },
          { label: "Más abajo, donde el agua ya se dispersó" },
          { label: "En el río del fondo del valle" },
        ],
        correcta: 0,
        explicacion:
          "Captar en el origen y proteger la boca del manante evita pérdidas por infiltración y contaminación, y permite controlar el caudal desde el inicio.",
      },
      {
        enunciado: "El terreno cae fuerte. ¿Qué pendiente le das al canal?",
        opciones: [
          { label: "Muy inclinada: el agua llega rápido" },
          { label: "Suave y constante, siguiendo la curva de nivel" },
          { label: "Plana: así el agua no se escapa" },
        ],
        correcta: 1,
        explicacion:
          "Demasiada pendiente erosiona y desborda; sin pendiente el agua se estanca. La solución andina fue una caída suave y continua siguiendo las curvas del cerro.",
      },
      {
        enunciado: "Un tramo baja un desnivel de varios metros. ¿Cómo lo resuelves?",
        opciones: [
          { label: "Caída libre sobre la tierra" },
          { label: "Saltos escalonados y pozas que disipan la energía" },
          { label: "Un tubo cerrado a presión" },
        ],
        correcta: 1,
        explicacion:
          "Las caídas escalonadas con pozas amortiguadoras rompen la fuerza del agua y evitan que socave el canal. En Tipón se observan soluciones de este tipo.",
      },
      {
        enunciado: "¿Cómo revistes el canal para reducir pérdidas?",
        opciones: [
          { label: "Piedra labrada bien ajustada en el fondo y las paredes" },
          { label: "Solo tierra compactada" },
          { label: "Ramas y hojas" },
        ],
        correcta: 0,
        explicacion:
          "El revestimiento de piedra reduce la infiltración y la erosión, y mantiene la sección del canal estable durante siglos.",
      },
      {
        enunciado: "Llegas a los andenes. ¿Cómo distribuyes el agua?",
        opciones: [
          { label: "Todo el caudal al primer andén" },
          { label: "Repartidores que dosifican por terraza, de arriba hacia abajo" },
          { label: "Inundando desde el andén más bajo" },
        ],
        correcta: 1,
        explicacion:
          "Los repartidores dividen el caudal y el riego desciende por gravedad, aprovechando el drenaje interno de cada terraza sin saturar el suelo.",
      },
    ],
    cierre: "El agua llegó al cultivo con caudal controlado: captación, pendiente, disipación, revestimiento y reparto.",
  },
  {
    id: "construye-el-anden",
    titulo: "Construye el andén",
    lema: "Organiza las capas de una terraza agrícola que no se derrumbe.",
    icono: "🌾",
    tema: "Agricultura",
    sitio: "moray",
    recompensa: 150,
    aprendizajes: ["Muro de contención", "Drenaje por capas", "Suelo fértil", "Microclimas y cultivos"],
    intro:
      "Un andén no es solo tierra apilada: es un sistema de capas. Ármalo en el orden correcto y decide qué cultivar.",
    escena: "anden",
    pasos: [
      {
        enunciado: "Capa 1, al fondo del andén. ¿Qué colocas primero?",
        opciones: [
          { label: "Tierra fértil de cultivo" },
          { label: "Piedra gruesa para drenaje" },
          { label: "Arcilla impermeable" },
        ],
        correcta: 1,
        explicacion:
          "La piedra gruesa del fondo drena el exceso de agua y evita que la terraza se sature y colapse en época de lluvias.",
      },
      {
        enunciado: "Capa 2, encima del drenaje:",
        opciones: [
          { label: "Grava y arena, como filtro intermedio" },
          { label: "Directamente la tierra de cultivo" },
          { label: "Más piedra grande" },
        ],
        correcta: 0,
        explicacion:
          "El filtro de grava y arena impide que la tierra fina baje y tape el drenaje: el sistema sigue funcionando por décadas.",
      },
      {
        enunciado: "Capa 3, la superficie donde se siembra:",
        opciones: [
          { label: "Tierra fértil traída y mejorada" },
          { label: "La misma tierra pedregosa del cerro" },
          { label: "Arena" },
        ],
        correcta: 0,
        explicacion:
          "La capa superior es suelo agrícola seleccionado y mejorado; en varios sitios se trasladó tierra de otras zonas para mejorar la fertilidad.",
      },
      {
        enunciado: "¿Cómo enfrentas la pendiente del cerro?",
        opciones: [
          { label: "Muro de contención de piedra ligeramente inclinado hacia adentro" },
          { label: "Un talud de tierra sin muro" },
          { label: "Cortando el cerro en vertical" },
        ],
        correcta: 0,
        explicacion:
          "El muro inclinado contiene el empuje del terreno, frena la erosión y convierte una ladera inútil en superficie cultivable.",
      },
      {
        enunciado: "Los andenes bajos son más cálidos que los altos. ¿Qué haces con esa diferencia?",
        opciones: [
          { label: "Sembrar lo mismo en todos los niveles" },
          { label: "Aprovechar cada nivel como microclima para cultivos distintos" },
          { label: "Cerrar los niveles altos" },
        ],
        correcta: 1,
        explicacion:
          "La piedra acumula calor y cada terraza tiene su propio microclima. En Moray se interpreta este escalonamiento como un espacio donde se aprovechaban esas diferencias para el manejo agrícola.",
      },
    ],
    cierre: "Tu andén tiene drenaje, filtro, suelo fértil y muro estable: tecnología agrícola de altura.",
    nota:
      "La función exacta de Moray sigue siendo objeto de interpretación arqueológica; aquí se presenta como contenido educativo contextualizado.",
  },
  {
    id: "qhapaq-nan",
    titulo: "El camino del Qhapaq Ñan",
    lema: "Traza la mejor ruta entre comunidades del Tawantinsuyu.",
    icono: "🛤️",
    tema: "Caminos",
    sitio: "qhapaq-nan",
    recompensa: 200,
    aprendizajes: ["Red vial andina", "Chaskis y tambos", "Relieve y ríos", "Logística del Estado inca"],
    intro:
      "Eres parte del equipo que planifica un tramo de camino. Decide ruta por ruta considerando relieve, agua, distancia y mantenimiento.",
    escena: "ruta",
    pasos: [
      {
        enunciado: "Tramo 1: unir dos poblados separados por un cerro alto.",
        opciones: [
          { label: "Subir en línea recta por la máxima pendiente" },
          { label: "Ascender en zigzag con escalinatas donde la pendiente es fuerte" },
          { label: "Rodear el cerro duplicando la distancia" },
        ],
        correcta: 1,
        explicacion:
          "El zigzag y las escalinatas hacen transitable la pendiente para personas y llamas cargadas, sin multiplicar la distancia.",
      },
      {
        enunciado: "Tramo 2: hay que cruzar un río caudaloso.",
        opciones: [
          { label: "Vadear por el punto más ancho" },
          { label: "Puente de fibras vegetales en el paso más estrecho y firme" },
          { label: "Evitar el río y no conectar el poblado" },
        ],
        correcta: 1,
        explicacion:
          "Los puentes de fibra (como el q’eswachaka, que aún se renueva cada año) permitían cruces permanentes en los estrechamientos, mantenidos por las comunidades.",
      },
      {
        enunciado: "Tramo 3: zona con lluvias intensas.",
        opciones: [
          { label: "Camino con canaletas laterales y empedrado" },
          { label: "Camino de tierra plana" },
          { label: "Camino por el fondo de la quebrada" },
        ],
        correcta: 0,
        explicacion:
          "El drenaje lateral y el empedrado evitan que el agua destruya la calzada. Sin drenaje, un camino de tierra desaparece en una temporada.",
      },
      {
        enunciado: "Tramo 4: el recorrido total toma varios días de marcha.",
        opciones: [
          { label: "Colocar tambos y puestos de chaskis a distancias regulares" },
          { label: "Una sola gran estación al final" },
          { label: "Sin estaciones: los viajeros se organizan" },
        ],
        correcta: 0,
        explicacion:
          "Los tambos (depósito y descanso) y los puestos de chaskis por relevos eran la logística que hacía funcionar el camino como sistema de Estado.",
      },
      {
        enunciado: "El tramo ya funciona. ¿Quién lo mantiene?",
        opciones: [
          { label: "Nadie: la piedra no se malogra" },
          { label: "Las comunidades locales, con trabajo organizado por turnos" },
          { label: "Solo viajeros extranjeros" },
        ],
        correcta: 1,
        explicacion:
          "El mantenimiento comunitario fue clave, y hoy sigue siendo el factor que decide si un tramo del Qhapaq Ñan se conserva o se pierde.",
      },
    ],
    cierre: "Tu ruta conecta comunidades con pendiente manejable, cruces seguros, drenaje y logística. Eso es infraestructura.",
  },
  {
    id: "sigue-la-sombra",
    titulo: "Sigue la sombra",
    lema: "Observa el cielo como se hacía desde el suelo: midiendo sombras.",
    icono: "☀️",
    tema: "Observación solar",
    sitio: "qenqo",
    recompensa: 150,
    aprendizajes: ["Movimiento aparente del Sol", "Solsticios", "Calendario agrícola", "Observación sistemática"],
    intro:
      "Una vara vertical y su sombra bastan para leer el año. Interpreta las sombras y resuelve los desafíos.",
    escena: "sombra",
    pasos: [
      {
        enunciado: "La sombra de la vara apunta hacia el oeste y es larga. ¿En qué momento del día estás?",
        opciones: [{ label: "Amanecer" }, { label: "Mediodía" }, { label: "Atardecer" }],
        correcta: 0,
        explicacion:
          "Al amanecer el Sol está bajo y hacia el este, así que la sombra se proyecta larga hacia el oeste. Al atardecer ocurre lo contrario.",
      },
      {
        enunciado: "Durante el día, la sombra alcanza su menor longitud. ¿Qué indica ese instante?",
        opciones: [
          { label: "El mediodía solar del lugar" },
          { label: "El inicio del año" },
          { label: "Un eclipse" },
        ],
        correcta: 0,
        explicacion:
          "La sombra mínima marca el mediodía solar: el Sol pasa por su punto más alto. Es la observación más simple y precisa sin instrumentos.",
      },
      {
        enunciado: "Anotas la sombra del mediodía cada semana. Durante meses se va alargando y luego se detiene y vuelve. ¿Qué acabas de registrar?",
        opciones: [
          { label: "Un error de medición" },
          { label: "Un solsticio: el Sol llega a su extremo y regresa" },
          { label: "Un cambio de la vara" },
        ],
        correcta: 1,
        explicacion:
          "El punto donde la sombra deja de crecer y retrocede corresponde a un solsticio. Repetir la observación permite construir un calendario.",
      },
      {
        enunciado: "¿Para qué le servía a una comunidad agrícola llevar este registro?",
        opciones: [
          { label: "Para predecir la suerte de cada persona" },
          { label: "Para ordenar siembras, cosechas y ceremonias en el año" },
          { label: "Para medir la altura de los cerros" },
        ],
        correcta: 1,
        explicacion:
          "Saber en qué parte del año estás define cuándo sembrar y cosechar. La observación del cielo era, ante todo, una herramienta productiva y ritual.",
      },
      {
        enunciado: "Encuentras una piedra tallada junto a un sitio arqueológico. ¿Qué afirmación es correcta?",
        opciones: [
          { label: "“Es un observatorio astronómico comprobado”" },
          { label: "“Podría relacionarse con observación solar; requiere evidencia arqueológica para afirmarlo”" },
          { label: "“No tiene ninguna relación con el cielo”" },
        ],
        correcta: 1,
        explicacion:
          "Existen sitios con alineamientos estudiados, pero no toda piedra tallada es un observatorio. Distinguir hecho, interpretación y suposición es parte del pensamiento científico.",
      },
    ],
    cierre: "Aprendiste a leer el año con una vara y una sombra… y a no afirmar más de lo que la evidencia sostiene.",
    nota:
      "Contenido educativo sobre observación solar andina. No se afirma una función astronómica específica para un sitio concreto sin evidencia arqueológica suficiente.",
  },
];

export function getJuego(id: string) {
  return JUEGOS.find((j) => j.id === id);
}

export const INSIGNIA_POR_JUEGO: Record<JuegoId, string> = {
  "encaja-la-piedra": "maestro-piedra",
  "salva-el-agua": "guardian-agua",
  "construye-el-anden": "sabio-andenes",
  "qhapaq-nan": "caminante",
  "sigue-la-sombra": "observador-cielo",
};
