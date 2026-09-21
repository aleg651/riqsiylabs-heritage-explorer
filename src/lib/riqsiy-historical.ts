import espirituPampaHistoricalAsset from "@/assets/heritage/historical/espiritu-pampa.jpg.asset.json";
import hatunrumiyocHistoricalAsset from "@/assets/heritage/historical/hatunrumiyoc.jpg.asset.json";
import machuPicchuHistoricalAsset from "@/assets/heritage/historical/machu-picchu.jpg.asset.json";
import ollantaytamboHistoricalAsset from "@/assets/heritage/historical/ollantaytambo.jpg.asset.json";
import qorikanchaHistoricalAsset from "@/assets/heritage/historical/qorikancha.jpg.asset.json";
import sacsayhuamanHistoricalAsset from "@/assets/heritage/historical/sacsayhuaman.jpg.asset.json";

export interface RegistroHistorico {
  imagen: string;
  fecha: string;
  autor: string;
  licencia: string;
  fuente: string;
  tipo: "Fotografía histórica" | "Documento gráfico histórico";
  descripcion: string;
}

/**
 * Solo se incorporan registros cuya identidad, fecha y reutilización pudieron
 * comprobarse en la ficha del archivo de Wikimedia Commons.
 */
export const REGISTROS_HISTORICOS: Partial<Record<string, RegistroHistorico>> = {
  sacsayhuaman: {
    imagen: sacsayhuamanHistoricalAsset.url,
    fecha: "ca. 1930–1945",
    autor: "The Tichnor Brothers Collection",
    licencia: "Sin restricciones conocidas",
    fuente:
      "https://commons.wikimedia.org/wiki/File:Inca_ruins_of_Sacsayhuam%C3%A1n,_Cuzco,_Peru_%3D_Ruinas_Incaicas_de_Sacsayhuam%C3%A1n_-_Cuzco,_Per%C3%BA.jpg",
    tipo: "Fotografía histórica",
    descripcion: "La postal conserva una vista panorámica de las murallas y del terreno que las rodeaba durante la primera mitad del siglo XX.",
  },
  "machu-picchu": {
    imagen: machuPicchuHistoricalAsset.url,
    fecha: "1912",
    autor: "Hiram Bingham III",
    licencia: "Dominio público",
    fuente: "https://commons.wikimedia.org/wiki/File:Machu_Picchu.png",
    tipo: "Fotografía histórica",
    descripcion: "La toma de la expedición de 1912 documenta estructuras y vegetación durante las primeras investigaciones fotográficas del sitio.",
  },
  qorikancha: {
    imagen: qorikanchaHistoricalAsset.url,
    fecha: "década de 1940",
    autor: "Scarton",
    licencia: "Dominio público",
    fuente: "https://commons.wikimedia.org/wiki/File:OldCoricancha.jpg",
    tipo: "Fotografía histórica",
    descripcion: "La fotografía registra la convivencia visible entre los muros incas y el conjunto de Santo Domingo durante la década de 1940.",
  ollantaytambo: {
    imagen: ollantaytamboHistoricalAsset.url,
    fecha: "1877",
    autor: "Ephraim George Squier",
    licencia: "Dominio público (CC0)",
    fuente: "https://commons.wikimedia.org/wiki/File:Andenes_en_el_valle_de_Ollantaytambo_(Cusco).png",
    tipo: "Documento gráfico histórico",
    descripcion:
      "El grabado publicado en 1877 muestra cómo se veían las terrazas del valle antes de las intervenciones y del crecimiento urbano actual.",
  },
  hatunrumiyoc: {
    imagen: hatunrumiyocHistoricalAsset.url,
    fecha: "1907",
    autor: "Library of Congress (LCCN 90714640)",
    licencia: "Dominio público",
    fuente: "https://commons.wikimedia.org/wiki/File:Native_standing_by_Inca_masonry_wall,_Cuzco,_Peru_LCCN90714640.jpg",
    tipo: "Fotografía histórica",
    descripcion:
      "La fotografía de 1907 registra el muro de piedra de la calle y a una persona junto a él, lo que permite comparar el tamaño de los bloques y el estado de las juntas.",
  },
  "espiritu-pampa": {
    imagen: espirituPampaHistoricalAsset.url,
    fecha: "1911",
    autor: "Harry Ward Foote",
    licencia: "Dominio público",
    fuente: "https://commons.wikimedia.org/wiki/File:Hiram_Bingham_at_Espiritu_Pampa_ruins_1911.jpg",
    tipo: "Fotografía histórica",
    descripcion:
      "La toma de 1911 muestra las estructuras cubiertas por vegetación densa en el momento de las primeras exploraciones registradas del lugar.",
  },
};

