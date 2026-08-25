import heroSacsayhuaman from "@/assets/hero-sacsayhuaman.jpg";
import siteQenqo from "@/assets/site-qenqo.jpg";
import siteTambomachay from "@/assets/site-tambomachay.jpg";
import siteMoray from "@/assets/site-moray.jpg";
import siteTipon from "@/assets/site-tipon.jpg";
import siteHatunrumiyoc from "@/assets/site-hatunrumiyoc.jpg";
import sitePisac from "@/assets/site-pisac.jpg";

export type Categoria =
  | "centro"
  | "paisaje"
  | "hidraulica"
  | "camino"
  | "construccion"
  | "agricultura";

export const CATEGORIAS: Record<Categoria, { label: string; icono: string }> = {
  centro: { label: "Centros arqueológicos", icono: "🏛️" },
  paisaje: { label: "Paisajes culturales", icono: "🌄" },
  hidraulica: { label: "Obras hidráulicas", icono: "💧" },
  camino: { label: "Caminos", icono: "🛤️" },
  construccion: { label: "Construcciones", icono: "🧱" },
  agricultura: { label: "Espacios agrícolas", icono: "🌱" },
};

export type Reto =
  | {
      tipo: "opcion";
      pregunta: string;
      opciones: string[];
      correcta: number;
      explicacion: string;
      puntos: number;
    }
  | {
      tipo: "vf";
      pregunta: string;
      correcta: boolean;
      explicacion: string;
      puntos: number;
    }
  | {
      tipo: "detalle";
      pregunta: string;
      opciones: string[];
      correcta: number;
      explicacion: string;
      puntos: number;
    };

export interface Sitio {
  slug: string;
  nombre: string;
  categoria: Categoria;
  ubicacion: string;
  imagen: string;
  coord: { x: number; y: number }; // % sobre el mapa esquemático
  resumen: string;
  historia: string;
  paraQueServia: string;
  comoFueConstruido: string;
  conocimientos: string[];
  datosSorprendentes: string[];
  relatos: { titulo: string; texto: string }[];
  estadoActual: { nivel: "Bueno" | "Vulnerable" | "En riesgo"; detalle: string };
  loVeiaPeroNoLoConocia: string;
  antesDespues: { antes: string; ahora: string; queHacer: string };
  retos: Reto[];
}

export const SITIOS: Sitio[] = [
  {
    slug: "sacsayhuaman",
    nombre: "Saqsaywaman",
    categoria: "centro",
    ubicacion: "Cusco, a 2 km del Centro Histórico · 3 700 m s. n. m.",
    imagen: heroSacsayhuaman,
    coord: { x: 44, y: 38 },
    resumen: "Tres murallas en zigzag con bloques de más de 100 toneladas.",
    historia:
      "Construido principalmente durante el gobierno de Pachacútec y continuado por sus sucesores, Saqsaywaman fue un gran conjunto ceremonial y administrativo en la cabecera del Cusco inca. Tras la invasión española, gran parte de sus piedras trabajadas fueron reutilizadas para levantar iglesias y casonas de la ciudad colonial.",
    paraQueServia:
      "No fue solo una fortaleza: funcionó como espacio ceremonial, depósito (qollqas), centro administrativo y lugar de grandes celebraciones del calendario andino, como el Inti Raymi.",
    comoFueConstruido:
      "Con bloques de caliza y diorita trasladados desde canteras cercanas mediante rampas, rodillos, sogas de fibra vegetal y trabajo comunitario organizado por mita. Las piedras se desbastaron y ajustaron por percusión y frotamiento hasta lograr un encaje sin mortero.",
    conocimientos: [
      "Geometría aplicada: los muros en zigzag distribuyen fuerzas y evitan planos de falla continuos.",
      "Ingeniería antisísmica: piedras poligonales con caras ligeramente inclinadas hacia adentro.",
      "Logística y organización social: la mita permitió coordinar miles de trabajadores por turnos.",
      "Astronomía y calendario: alineamientos vinculados a solsticios y fiestas agrícolas.",
    ],
    datosSorprendentes: [
      "El bloque mayor supera las 120 toneladas: más que 20 elefantes africanos adultos.",
      "Entre piedra y piedra no entra ni una hoja de papel, y no se usó ningún tipo de mezcla.",
      "Lo que hoy vemos sería menos del 30 % del conjunto original.",
    ],
    relatos: [
      {
        titulo: "La piedra cansada",
        texto:
          "Se cuenta que una enorme piedra fue arrastrada desde lejos y, al no poder llegar, 'lloró sangre' y se quedó donde está. El relato recuerda el esfuerzo humano detrás de cada bloque.",
      },
      {
        titulo: "El puma de piedra",
        texto:
          "La tradición dice que el Cusco tenía forma de puma y que Saqsaywaman era su cabeza; sus muros en zigzag serían los dientes.",
      },
    ],
    estadoActual: {
      nivel: "Vulnerable",
      detalle:
        "Presión turística, erosión por lluvias y pisoteo en zonas no señalizadas. Requiere mantenimiento constante de drenajes y control de visitantes.",
    },
    loVeiaPeroNoLoConocia:
      "Cada vez que pasas por la carretera a Saqsaywaman ves 'un muro grande'. En realidad estás viendo el resultado de décadas de trabajo comunitario, cálculo estructural sin herramientas de metal duro y una técnica antisísmica que hoy se estudia en universidades de ingeniería. Ese muro sigue en pie después de más de 500 años y de terremotos que derribaron construcciones modernas.",
    antesDespues: {
      antes:
        "Conjunto de tres plataformas, torreones circulares (Muyucmarca), depósitos y grandes plazas ceremoniales activas todo el año.",
      ahora:
        "Quedan las murallas y las bases de los torreones; el resto fue desmontado como cantera durante la Colonia. La erosión y el uso masivo del suelo avanzan.",
      queHacer:
        "Caminar solo por senderos señalizados, no subir a los muros, no rayar las piedras y exigir mantenimiento preventivo a las autoridades.",
    },
    retos: [
      {
        tipo: "opcion",
        pregunta: "¿Cuál era la función principal de Saqsaywaman?",
        opciones: [
          "Solo una fortaleza militar",
          "Un centro ceremonial, administrativo y de depósito",
          "Una vivienda familiar",
          "Un mercado colonial",
        ],
        correcta: 1,
        explicacion:
          "Aunque se le llama 'fortaleza', la evidencia muestra un uso ceremonial, administrativo y de almacenamiento.",
        puntos: 10,
      },
      {
        tipo: "vf",
        pregunta: "Las piedras de Saqsaywaman fueron unidas con cemento.",
        correcta: false,
        explicacion: "No se usó mortero: el ajuste es puramente mecánico, piedra contra piedra.",
        puntos: 10,
      },
      {
        tipo: "detalle",
        pregunta: "Observa el muro: ¿qué forma tiene su trazo en planta?",
        opciones: ["Recto", "Circular", "En zigzag", "En espiral"],
        correcta: 2,
        explicacion:
          "El zigzag aumenta la estabilidad y permite defender y distribuir esfuerzos en varias direcciones.",
        puntos: 15,
      },
      {
        tipo: "opcion",
        pregunta: "¿Qué acción ayuda a conservar el sitio?",
        opciones: [
          "Escalar los muros para tomar fotos",
          "Dejar mensajes escritos en la piedra",
          "Caminar por los senderos señalizados",
          "Mover piedras pequeñas de lugar",
        ],
        correcta: 2,
        explicacion: "El pisoteo fuera de sendero acelera la erosión del suelo y desestabiliza los muros.",
        puntos: 10,
      },
    ],
  },
  {
    slug: "qenqo",
    nombre: "Q'enqo",
    categoria: "centro",
    ubicacion: "Carretera Cusco – Pisac, a 4 km del Centro Histórico",
    imagen: siteQenqo,
    coord: { x: 50, y: 33 },
    resumen: "Un afloramiento rocoso tallado con canales, escalinatas y una cámara subterránea.",
    historia:
      "Q'enqo ('laberinto' o 'zigzag' en quechua) es una wak'a: una roca sagrada trabajada directamente en su lugar. Fue un espacio ritual vinculado al agua, la tierra y posiblemente a ceremonias de la élite cusqueña.",
    paraQueServia:
      "Para ceremonias, ofrendas y probablemente lecturas rituales del recorrido de líquidos (chicha o agua) por sus canales tallados en zigzag.",
    comoFueConstruido:
      "No se construyó: se esculpió. Los canteros tallaron la roca viva con percutores de piedra más dura, siguiendo la forma natural del afloramiento en lugar de imponerle una forma.",
    conocimientos: [
      "Talla en roca viva respetando la geología del lugar.",
      "Manejo de pendientes mínimas para controlar el flujo de líquidos.",
      "Astronomía: el intihuatana asociado marca posiciones solares.",
      "Cosmovisión: la wak'a como ser vivo, no como objeto.",
    ],
    datosSorprendentes: [
      "El canal en zigzag tiene una pendiente tan precisa que el líquido se divide en dos caminos distintos.",
      "La cámara interior mantiene temperatura estable todo el año.",
      "El nombre alude al movimiento del rayo y de la serpiente.",
    ],
    relatos: [
      {
        titulo: "La lectura del líquido",
        texto:
          "Se relata que por el canal se vertía chicha: si tomaba un camino, el augurio era favorable; si tomaba el otro, se anunciaba un año difícil.",
      },
    ],
    estadoActual: {
      nivel: "Vulnerable",
      detalle: "Desgaste de los tallados por contacto humano y lluvia ácida por contaminación vehicular cercana.",
    },
    loVeiaPeroNoLoConocia:
      "Parece 'una roca grande al lado de la pista'. Pero cada corte tiene intención: escalones, hornacinas, canales y una cámara subterránea trabajada con precisión milimétrica en piedra caliza, sin instrumentos de acero.",
    antesDespues: {
      antes: "Wak'a activa con ceremonias periódicas, tallados nítidos y entorno agrícola abierto.",
      ahora: "Tallados suavizados por la erosión, carretera a pocos metros y presión urbana creciente.",
      queHacer: "No tocar ni subirse a los tallados, no dejar residuos y apoyar el control del tránsito cercano.",
    },
    retos: [
      {
        tipo: "opcion",
        pregunta: "¿Qué es una wak'a?",
        opciones: [
          "Una casa de piedra",
          "Un lugar u objeto sagrado en la cosmovisión andina",
          "Un depósito de alimentos",
          "Un tipo de camino",
        ],
        correcta: 1,
        explicacion: "Las wak'as son entidades sagradas: rocas, manantiales, cerros o construcciones.",
        puntos: 10,
      },
      {
        tipo: "vf",
        pregunta: "Q'enqo fue tallado directamente sobre la roca del lugar.",
        correcta: true,
        explicacion: "Es escultura en roca viva, no una construcción con bloques traídos.",
        puntos: 10,
      },
      {
        tipo: "detalle",
        pregunta: "¿Qué forma sigue el canal principal?",
        opciones: ["Zigzag", "Círculo", "Cuadrado", "Cruz"],
        correcta: 0,
        explicacion: "De ahí el nombre Q'enqo, que alude al zigzag.",
        puntos: 15,
      },
    ],
  },
  {
    slug: "tambomachay",
    nombre: "Tambomachay",
    categoria: "hidraulica",
    ubicacion: "Carretera a Pisac, a 7 km del Cusco · 3 700 m s. n. m.",
    imagen: siteTambomachay,
    coord: { x: 55, y: 26 },
    resumen: "Fuentes ceremoniales que llevan más de 500 años sin dejar de correr.",
    historia:
      "Conocido como 'el baño del Inca', es un conjunto de terrazas, muros y fuentes vinculado al culto al agua. Su manantial nunca se ha secado.",
    paraQueServia:
      "Para ceremonias de purificación y culto al agua; también como lugar de descanso y control en el camino hacia el Antisuyo.",
    comoFueConstruido:
      "Con muros de sillería fina sobre terrazas escalonadas, canales subterráneos captados desde manantiales de altura y salidas calibradas para mantener un caudal constante.",
    conocimientos: [
      "Hidráulica: captación, conducción subterránea y distribución sin bombas.",
      "Cálculo de caudal: las dos salidas inferiores expulsan la misma cantidad de agua.",
      "Manejo de acuíferos y protección de la zona de recarga.",
      "Arquitectura integrada al relieve natural.",
    ],
    datosSorprendentes: [
      "El caudal se mantiene casi igual en época de lluvia y en época seca.",
      "Aún no se conoce con exactitud el recorrido completo del agua subterránea.",
      "Sigue funcionando sin ninguna intervención mecánica moderna.",
    ],
    relatos: [
      {
        titulo: "El agua que no se cansa",
        texto:
          "Los pobladores dicen que quien se lava el rostro en Tambomachay renueva su fuerza, porque el agua viene de un manantial que 'no aprende a secarse'.",
      },
    ],
    estadoActual: {
      nivel: "Bueno",
      detalle: "Estructura estable, aunque la urbanización en la zona alta amenaza la recarga del manantial.",
    },
    loVeiaPeroNoLoConocia:
      "Se ve 'un chorrito de agua entre piedras'. En realidad es un sistema hidráulico que capta un manantial, lo conduce bajo tierra y lo reparte con caudal constante desde hace más de cinco siglos, algo que muchas redes modernas no logran sostener.",
    antesDespues: {
      antes: "Santuario del agua con entorno de puna protegido y ceremonias regulares.",
      ahora: "Estructura conservada, pero rodeada por crecimiento urbano y tránsito de vehículos.",
      queHacer: "Proteger las cabeceras de cuenca, no contaminar el agua y difundir su valor hidráulico.",
    },
    retos: [
      {
        tipo: "opcion",
        pregunta: "¿Qué demuestra principalmente Tambomachay?",
        opciones: [
          "Conocimientos de hidráulica",
          "Uso de herramientas de hierro",
          "Comercio con Europa",
          "Escritura alfabética",
        ],
        correcta: 0,
        explicacion: "Es una obra hidráulica que aún funciona.",
        puntos: 10,
      },
      {
        tipo: "vf",
        pregunta: "El manantial de Tambomachay se seca en época de estiaje.",
        correcta: false,
        explicacion: "Su caudal se mantiene sorprendentemente estable todo el año.",
        puntos: 10,
      },
    ],
  },
  {
    slug: "tipon",
    nombre: "Tipón",
    categoria: "hidraulica",
    ubicacion: "Distrito de Oropesa, Quispicanchi · a 25 km del Cusco",
    imagen: siteTipon,
    coord: { x: 72, y: 62 },
    resumen: "Doce andenes con canales que aún riegan: ingeniería hidráulica de precisión.",
    historia:
      "Complejo agrícola y ceremonial atribuido al periodo inca imperial, posiblemente vinculado a la panaca de Wiracocha. Es considerado una obra maestra de la ingeniería hidráulica prehispánica.",
    paraQueServia:
      "Como centro de producción agrícola experimental y espacio ceremonial dedicado al agua.",
    comoFueConstruido:
      "Andenes con muros de contención, relleno drenante por capas (piedra, grava, tierra fértil) y canales tallados que distribuyen el agua por gravedad a cada terraza.",
    conocimientos: [
      "Diseño de canales con pendiente controlada y disipadores de energía.",
      "Drenaje por capas para evitar deslizamientos.",
      "Microclimas por altura de andén para diversificar cultivos.",
      "Cálculo de volúmenes de agua según superficie cultivada.",
    ],
    datosSorprendentes: [
      "La Sociedad Americana de Ingenieros Civiles lo declaró Hito de la Ingeniería.",
      "El sistema sigue irrigando terrenos hoy.",
      "Las caídas de agua están diseñadas para no erosionar la piedra.",
    ],
    relatos: [
      {
        titulo: "El jardín del agua",
        texto:
          "Se cuenta que Tipón fue el refugio del inca Wiracocha, un lugar donde el agua debía sonar siempre para acompañar a quien lo habitaba.",
      },
    ],
    estadoActual: {
      nivel: "Bueno",
      detalle: "Bien conservado y en uso, con riesgo de colmatación de canales por falta de limpieza periódica.",
    },
    loVeiaPeroNoLoConocia:
      "Parecen 'escaleras de tierra'. Son en realidad un sistema de ingeniería hidráulica y agronómica: cada andén es un microclima con su propio riego calculado, con drenajes internos que evitan derrumbes en una zona de lluvias intensas.",
    antesDespues: {
      antes: "Andenes plenamente cultivados, canales limpios y producción agrícola diversificada.",
      ahora: "Conservado, pero con parte de los andenes sin cultivo y canales que requieren mantenimiento.",
      queHacer: "Apoyar la agricultura tradicional local, no caminar sobre los muros y difundir su valor técnico.",
    },
    retos: [
      {
        tipo: "opcion",
        pregunta: "¿Por qué los andenes de Tipón no se derrumban con las lluvias?",
        opciones: [
          "Porque son de cemento",
          "Porque tienen relleno drenante por capas",
          "Porque están cubiertos con plástico",
          "Porque llueve poco",
        ],
        correcta: 1,
        explicacion: "El relleno de piedra, grava y tierra evacúa el agua y evita presiones internas.",
        puntos: 15,
      },
      {
        tipo: "vf",
        pregunta: "Los canales de Tipón todavía conducen agua.",
        correcta: true,
        explicacion: "Siguen funcionando por gravedad, sin bombas.",
        puntos: 10,
      },
    ],
  },
  {
    slug: "moray",
    nombre: "Moray",
    categoria: "agricultura",
    ubicacion: "Maras, Urubamba · Valle Sagrado",
    imagen: siteMoray,
    coord: { x: 24, y: 22 },
    resumen: "Andenes circulares con hasta 15 °C de diferencia entre el fondo y el borde.",
    historia:
      "Conjunto de andenes concéntricos construidos sobre depresiones naturales. La investigación arqueológica lo interpreta como un centro de experimentación agrícola y adaptación de cultivos.",
    paraQueServia:
      "Para probar cómo respondían distintas plantas a distintos microclimas antes de llevarlas a otras regiones del Tawantinsuyu.",
    comoFueConstruido:
      "Aprovechando hoyos kársticos naturales, ampliados con muros de contención circulares y rellenos con tierras traídas de diferentes pisos ecológicos.",
    conocimientos: [
      "Agronomía experimental y selección de semillas.",
      "Microclimas controlados por profundidad y orientación solar.",
      "Suelos: importación y mezcla de tierras de distintos pisos ecológicos.",
      "Drenaje subterráneo: los andenes nunca se inundan.",
    ],
    datosSorprendentes: [
      "Entre el andén más bajo y el más alto puede haber hasta 15 °C de diferencia.",
      "Equivale a simular varios pisos ecológicos en un mismo lugar.",
      "Nunca se ha visto el fondo inundado, incluso en lluvias fuertes.",
    ],
    relatos: [
      {
        titulo: "El laboratorio circular",
        texto:
          "Los comuneros de Maras cuentan que allí 'la tierra enseñaba': cada anillo era una lección sobre qué sembrar y cuándo.",
      },
    ],
    estadoActual: {
      nivel: "Vulnerable",
      detalle: "Erosión de muros por lluvias intensas y presión del turismo masivo en los bordes.",
    },
    loVeiaPeroNoLoConocia:
      "Se ven 'círculos bonitos para una foto'. Son un laboratorio agrícola a cielo abierto: una estación experimental que permitió adaptar cultivos a distintos climas siglos antes de que existiera la agronomía moderna.",
    antesDespues: {
      antes: "Andenes cultivados y en uso experimental permanente, con suelos renovados.",
      ahora: "Uso principalmente turístico, muros con desprendimientos y suelos compactados.",
      queHacer: "Respetar los miradores, no bajar por los muros y apoyar proyectos de recuperación de andenes.",
    },
    retos: [
      {
        tipo: "opcion",
        pregunta: "¿Cuál es la hipótesis más aceptada sobre Moray?",
        opciones: [
          "Fue un anfiteatro para espectáculos",
          "Fue un centro de experimentación agrícola",
          "Fue una mina de sal",
          "Fue un cementerio",
        ],
        correcta: 1,
        explicacion: "Los microclimas por anillo apoyan la hipótesis de estación experimental.",
        puntos: 10,
      },
      {
        tipo: "detalle",
        pregunta: "Observa la imagen: ¿qué forma tienen los andenes?",
        opciones: ["Rectangulares", "Concéntricos circulares", "Triangulares", "Irregulares"],
        correcta: 1,
        explicacion: "Los anillos concéntricos generan condiciones térmicas distintas por nivel.",
        puntos: 15,
      },
    ],
  },
  {
    slug: "pisac",
    nombre: "Parque Arqueológico de Pisac",
    categoria: "paisaje",
    ubicacion: "Pisac, Calca · Valle Sagrado del Urubamba",
    imagen: sitePisac,
    coord: { x: 66, y: 18 },
    resumen: "Un paisaje cultural completo: andenes, ciudad ritual, caminos y necrópolis.",
    historia:
      "Conjunto inca sobre la montaña que domina el valle del Vilcanota. Integra sectores agrícolas, urbanos, ceremoniales y funerarios en un solo paisaje diseñado.",
    paraQueServia:
      "Como centro administrativo, agrícola y ceremonial que controlaba el acceso al valle y organizaba la producción.",
    comoFueConstruido:
      "Andenes que siguen las curvas de nivel del cerro, muros de sillería en el sector ceremonial y caminos empedrados que conectan sectores a distintas alturas.",
    conocimientos: [
      "Lectura del paisaje: la arquitectura sigue la forma de la montaña.",
      "Ingeniería de andenes en pendientes muy pronunciadas.",
      "Astronomía: el Intihuatana marca ciclos solares.",
      "Organización territorial en pisos ecológicos.",
    ],
    datosSorprendentes: [
      "En sus laderas hubo una de las mayores necrópolis del mundo andino.",
      "Los andenes alcanzan cientos de metros de desnivel continuo.",
      "El diseño integra agua, cultivo, culto y vivienda en un solo sistema.",
    ],
    relatos: [
      {
        titulo: "La perdiz y el cerro",
        texto:
          "El nombre se asocia a la p'isaqa, una perdiz andina. Se dice que el trazado del sitio imita el vuelo del ave sobre el valle.",
      },
    ],
    estadoActual: {
      nivel: "En riesgo",
      detalle:
        "Deslizamientos en época de lluvias, saqueo histórico de tumbas y presión de la expansión urbana en el valle.",
    },
    loVeiaPeroNoLoConocia:
      "Desde la carretera parecen 'escalones en el cerro'. Es un paisaje cultural completo, diseñado como sistema: agua, suelo, cultivo, ritual y camino pensados juntos, algo que hoy llamaríamos planificación territorial sostenible.",
    antesDespues: {
      antes: "Andenes cultivados, tumbas intactas en los acantilados y caminos en pleno uso.",
      ahora: "Sectores erosionados, necrópolis saqueada desde el siglo XIX y andenes parcialmente abandonados.",
      queHacer: "No comprar piezas arqueológicas, denunciar el saqueo y participar en faenas de limpieza de andenes.",
    },
    retos: [
      {
        tipo: "vf",
        pregunta: "Pisac integra sectores agrícolas, urbanos y funerarios.",
        correcta: true,
        explicacion: "Por eso se considera un paisaje cultural, no un solo edificio.",
        puntos: 10,
      },
      {
        tipo: "opcion",
        pregunta: "¿Qué amenaza la conservación de Pisac?",
        opciones: ["Los deslizamientos y el saqueo", "El exceso de lluvia ácida marina", "La nieve permanente", "Nada"],
        correcta: 0,
        explicacion: "Las lluvias intensas y el saqueo histórico son los principales riesgos.",
        puntos: 10,
      },
    ],
  },
  {
    slug: "hatunrumiyoc",
    nombre: "Muro de Hatunrumiyoc",
    categoria: "construccion",
    ubicacion: "Calle Hatunrumiyoc, Centro Histórico del Cusco",
    imagen: siteHatunrumiyoc,
    coord: { x: 46, y: 55 },
    resumen: "La piedra de los doce ángulos: encaje perfecto en pleno centro de la ciudad.",
    historia:
      "Muro del antiguo palacio de Inca Roca, reutilizado como base del Palacio Arzobispal en la Colonia. Miles de personas pasan por su vereda cada día.",
    paraQueServia:
      "Como muro perimetral de un palacio real, símbolo del poder de la panaca que lo habitaba.",
    comoFueConstruido:
      "Con sillares de diorita ajustados uno a uno mediante desbaste por percusión y pruebas repetidas de encaje, sin argamasa, con caras ligeramente convexas y juntas cerradas.",
    conocimientos: [
      "Estereotomía: cada piedra es única y solo encaja en su lugar exacto.",
      "Estabilidad sísmica por trabazón poligonal.",
      "Control de calidad: la junta no admite ni una hoja de papel.",
      "Organización de talleres de canteros especializados.",
    ],
    datosSorprendentes: [
      "La piedra famosa tiene doce ángulos, pero en el mismo muro hay bloques con catorce.",
      "El muro resistió los terremotos de 1650 y 1950, que derribaron edificios coloniales encima.",
      "Se calcula que un solo bloque podía requerir semanas de ajuste.",
    ],
    relatos: [
      {
        titulo: "La piedra que todos tocan",
        texto:
          "Es el sitio arqueológico más fotografiado del centro y, a la vez, el más ignorado: cientos de personas pasan a diario sin levantar la vista.",
      },
    ],
    estadoActual: {
      nivel: "En riesgo",
      detalle:
        "Contacto humano constante, vibración del tránsito, grafitis y desgaste de la superficie de la piedra.",
    },
    loVeiaPeroNoLoConocia:
      "Es 'la pared por donde paso todos los días'. Cada bloque fue tallado a mano para encajar solo en un lugar: es una solución estructural que absorbe sismos y un trabajo de precisión que hoy exigiría maquinaria de corte controlada por computadora.",
    antesDespues: {
      antes: "Muro perimetral de un palacio inca, con superficie pulida y sin construcciones encima.",
      ahora: "Base de un edificio colonial, con desgaste por contacto, tránsito vehicular y grafitis ocasionales.",
      queHacer: "No tocar la piedra, no pegar afiches ni rayar, y pedir señalización y control de tránsito pesado.",
    },
    retos: [
      {
        tipo: "detalle",
        pregunta: "¿Cuántos ángulos tiene la piedra más famosa del muro?",
        opciones: ["8", "10", "12", "14"],
        correcta: 2,
        explicacion: "Es la célebre piedra de los doce ángulos.",
        puntos: 10,
      },
      {
        tipo: "vf",
        pregunta: "Tocar la piedra constantemente no le hace ningún daño.",
        correcta: false,
        explicacion: "La grasa de las manos y el roce desgastan y oscurecen la superficie con el tiempo.",
        puntos: 10,
      },
    ],
  },
  {
    slug: "qhapaq-nan",
    nombre: "Qhapaq Ñan – Tramo Cusco",
    categoria: "camino",
    ubicacion: "Tramos visibles en Cusco, Valle Sagrado y rutas hacia los cuatro suyos",
    imagen: heroSacsayhuaman,
    coord: { x: 34, y: 70 },
    resumen: "La red vial andina: más de 30 000 km que unieron seis países actuales.",
    historia:
      "Sistema vial construido y ampliado por los incas sobre caminos anteriores. Desde el Cusco partían los cuatro caminos hacia el Chinchaysuyu, Antisuyu, Qollasuyu y Kuntisuyu. Es Patrimonio Mundial de la UNESCO desde 2014.",
    paraQueServia:
      "Para trasladar ejércitos, productos, información (chaskis) y para integrar territorios muy distintos entre sí.",
    comoFueConstruido:
      "Con empedrados, escalinatas talladas, muros de contención, drenajes laterales, puentes de fibra y tambos cada cierta distancia para el descanso y el abastecimiento.",
    conocimientos: [
      "Trazado en pendientes extremas con escalinatas y zigzags.",
      "Drenaje: canaletas laterales que evitan que el camino se destruya con la lluvia.",
      "Logística: tambos y qollqas distribuidos según jornadas de camino.",
      "Comunicación: relevos de chaskis con quipus.",
    ],
    datosSorprendentes: [
      "Un mensaje podía recorrer cientos de kilómetros en pocos días mediante relevos.",
      "Varios tramos se siguen usando hoy como caminos de herradura comunales.",
      "Conecta seis países actuales: Perú, Ecuador, Colombia, Bolivia, Chile y Argentina.",
    ],
    relatos: [
      {
        titulo: "Los chaskis",
        texto:
          "Corredores jóvenes esperaban en puestos cercanos; al oír el pututu tomaban el mensaje y corrían al siguiente relevo sin detener la cadena.",
      },
    ],
    estadoActual: {
      nivel: "En riesgo",
      detalle:
        "Muchos tramos han sido cubiertos por carreteras modernas, cultivos o construcciones; otros se pierden por falta de mantenimiento.",
    },
    loVeiaPeroNoLoConocia:
      "Es 'un camino de piedras del campo'. En realidad puedes estar caminando sobre la infraestructura que sostuvo al estado más grande de América: un sistema vial con drenaje, señalización y logística planificada.",
    antesDespues: {
      antes: "Red vial mantenida por las comunidades, con tambos activos y tránsito permanente.",
      ahora: "Tramos fragmentados, cubiertos por vías modernas o erosionados por falta de uso y mantenimiento.",
      queHacer: "Identificar y reportar tramos, no extraer piedras del empedrado y apoyar su registro oficial.",
    },
    retos: [
      {
        tipo: "opcion",
        pregunta: "¿Quiénes llevaban los mensajes por el Qhapaq Ñan?",
        opciones: ["Los chaskis", "Los curacas", "Los mitmaqkuna", "Los yanaconas"],
        correcta: 0,
        explicacion: "Los chaskis funcionaban por relevos entre puestos cercanos.",
        puntos: 10,
      },
      {
        tipo: "vf",
        pregunta: "El Qhapaq Ñan es Patrimonio Mundial de la UNESCO.",
        correcta: true,
        explicacion: "Fue inscrito en 2014 como itinerario cultural compartido por seis países.",
        puntos: 10,
      },
    ],
  },
];

export function getSitio(slug: string) {
  return SITIOS.find((s) => s.slug === slug);
}

export const MIRADAS: {
  loQueVeo: string;
  loQueSignifica: string;
  pista: string;
  sitio?: string;
}[] = [
  {
    loQueVeo: "“Solo piedras”",
    loQueSignifica:
      "Una obra de ingeniería con encaje poligonal antisísmico que ha resistido más de cinco siglos y varios terremotos.",
    pista: "Mira las juntas: no hay mezcla, solo cálculo y ajuste.",
    sitio: "sacsayhuaman",
  },
  {
    loQueVeo: "“Una montaña cualquiera”",
    loQueSignifica:
      "Un apu: en la cosmovisión andina los cerros son seres protectores que ordenan el territorio y el calendario agrícola.",
    pista: "Pregunta a tus abuelos el nombre del cerro que ves desde tu casa.",
  },
  {
    loQueVeo: "“Un muro viejo del centro”",
    loQueSignifica:
      "El límite de un palacio inca, con bloques únicos tallados para encajar en un solo lugar posible.",
    pista: "Cuenta los ángulos de una sola piedra.",
    sitio: "hatunrumiyoc",
  },
  {
    loQueVeo: "“Escaleras de tierra en el cerro”",
    loQueSignifica:
      "Andenes: sistemas de suelo, drenaje y microclima que frenan la erosión y multiplican la tierra cultivable.",
    pista: "Fíjate en las capas internas cuando un andén está roto.",
    sitio: "tipon",
  },
  {
    loQueVeo: "“Un chorro de agua entre piedras”",
    loQueSignifica:
      "Un sistema hidráulico con captación subterránea y caudal calibrado que no se ha detenido en 500 años.",
    pista: "Compara las dos salidas: expulsan la misma cantidad de agua.",
    sitio: "tambomachay",
  },
  {
    loQueVeo: "“Un camino de tierra del campo”",
    loQueSignifica:
      "Un tramo del Qhapaq Ñan, la red vial que integró el Tawantinsuyu y hoy es Patrimonio Mundial.",
    pista: "Busca las canaletas laterales y los muros de contención.",
    sitio: "qhapaq-nan",
  },
];

export const COMPROMISOS = [
  { id: "respetar", texto: "Respetar los sitios arqueológicos", icono: "🏛️" },
  { id: "basura", texto: "No arrojar basura", icono: "🚯" },
  { id: "estructuras", texto: "No dañar las estructuras", icono: "🧱" },
  { id: "compartir", texto: "Compartir la historia con otra persona", icono: "🗣️" },
  { id: "conservacion", texto: "Participar en actividades de conservación", icono: "🤝" },
  { id: "investigar", texto: "Investigar sobre otro sitio arqueológico", icono: "🔍" },
];

export const INSIGNIAS = [
  {
    id: "primer-descubrimiento",
    nombre: "Primer descubrimiento",
    icono: "🏛️",
    descripcion: "Descubriste tu primer sitio.",
  },
  {
    id: "explorador",
    nombre: "Explorador del patrimonio",
    icono: "🔎",
    descripcion: "Descubriste 3 sitios distintos.",
  },
  {
    id: "guardian",
    nombre: "Guardián de la memoria",
    icono: "🧠",
    descripcion: "Completaste 5 retos.",
  },
  {
    id: "protector",
    nombre: "Protector del patrimonio",
    icono: "🌎",
    descripcion: "Asumiste al menos 2 compromisos.",
  },
  {
    id: "embajador",
    nombre: "Embajador RIQSIY",
    icono: "🏆",
    descripcion: "Alcanzaste 150 Puntos de Identidad.",
  },
];

export const INVESTIGACION_DATA = [
  { dimension: "Conocimiento", antes: 38, despues: 79 },
  { dimension: "Valoración", antes: 46, despues: 88 },
  { dimension: "Interés", antes: 41, despues: 84 },
  { dimension: "Compromiso", antes: 33, despues: 76 },
];
