import machuPicchuHistoricalAsset from "@/assets/heritage/historical/machu-picchu.jpg.asset.json";
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
  },
};
