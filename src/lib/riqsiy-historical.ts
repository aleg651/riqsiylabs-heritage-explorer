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
  },
  "machu-picchu": {
    imagen: machuPicchuHistoricalAsset.url,
    fecha: "1912",
    autor: "Hiram Bingham III",
    licencia: "Dominio público",
    fuente: "https://commons.wikimedia.org/wiki/File:Machu_Picchu.png",
    tipo: "Fotografía histórica",
  },
  qorikancha: {
    imagen: qorikanchaHistoricalAsset.url,
    fecha: "década de 1940",
    autor: "Scarton",
    licencia: "Dominio público",
    fuente: "https://commons.wikimedia.org/wiki/File:OldCoricancha.jpg",
    tipo: "Fotografía histórica",
  },
};
