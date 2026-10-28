import coloracaoImg from "../assets/coloracao.png";
import coloracaoReferencia1Img from "../assets/coloracao-referencia-1.png";
import coloracaoReferencia2Img from "../assets/coloracao-referencia-2.png";
import corteImg from "../assets/corte.png";
import corteReferencia3Img from "../assets/corte-referencia-3.png";
import corteReferencia4Img from "../assets/corte-referencia-4.png";
import escovaImg from "../assets/escova.png";
import hidratacaoImg from "../assets/hidratação.png";
import hidratacaoReferencia2Img from "../assets/hidratacao-referencia-2.png";
import hidratacaoReferencia3Img from "../assets/hidratacao-referencia-3.png";
import manicureImg from "../assets/manicure.png";
import manicureReferencia1Img from "../assets/manicure-referencia-1.png";
import manicureReferencia2Img from "../assets/manicure-referencia-2.png";
import manicureReferencia3Img from "../assets/manicure-referencia-3.png";
import pedicureImg from "../assets/pedicure.png";
import pedicureReferencia3Img from "../assets/pedicure-referencia-3.png";
import pedicureReferencia4Img from "../assets/pedicure-referencia-4.png";
import penteadoReferencia1Img from "../assets/penteado-referencia-1.png";
import penteadoReferencia2Img from "../assets/penteado-referencia-2.png";
import penteadoReferencia3Img from "../assets/penteado-referencia-3.png";

export const salonHours = [
  { days: [2, 3, 4, 5], label: "Terça a sexta", openingTime: "09:00", closingTime: "19:00" },
  { days: [6], label: "Sábado", openingTime: "09:00", closingTime: "18:00" },
];

export function getSalonHours(date) {
  if (!date) return null;

  const day = new Date(`${date}T12:00:00`).getDay();
  return salonHours.find((hours) => hours.days.includes(day)) || null;
}

export const products = [
  {
    id: "s1",
    name: "Corte Feminino",
    category: "cortes",
    price: 150.0,
    duration: "1h",
    image: corteImg,
    images: [corteImg, corteReferencia3Img, corteReferencia4Img],
  },
  {
    id: "s3",
    name: "Coloração Completa",
    category: "coloracao",
    price: 1200.0,
    duration: "2h",
    image: coloracaoImg,
    images: [coloracaoImg, coloracaoReferencia1Img, coloracaoReferencia2Img],
  },
  {
    id: "s4",
    name: "Hidratação Capilar",
    category: "hidratacao",
    price: 120.0,
    duration: "1h 30min",
    image: hidratacaoImg,
    images: [hidratacaoImg, hidratacaoReferencia2Img, hidratacaoReferencia3Img],
  },
  {
    id: "s5",
    name: "Manicure",
    category: "manicure",
    price: 40.0,
    duration: "45min",
    image: manicureImg,
    images: [manicureImg, manicureReferencia1Img, manicureReferencia2Img, manicureReferencia3Img],
  },
  {
    id: "s6",
    name: "Pedicure",
    category: "pedicure",
    price: 45.0,
    duration: "1h",
    image: pedicureImg,
    images: [pedicureImg, pedicureReferencia3Img, pedicureReferencia4Img],
  },
  { id: "s7", name: "Escova", category: "escova", price: 120.0, duration: "30min", image: escovaImg },
  {
    id: "s8",
    name: "Penteado",
    category: "penteados",
    price: 250,
    duration: "30 a 60 min",
    image: penteadoReferencia1Img,
    images: [penteadoReferencia1Img, penteadoReferencia2Img, penteadoReferencia3Img],
  },
];

export const categories = [
  { id: "all", label: "Todos" },
  { id: "cortes", label: "Cortes" },
  { id: "escova", label: "Escova" },
  { id: "coloracao", label: "Coloração" },
  { id: "hidratacao", label: "Hidratação" },
  { id: "manicure", label: "Manicure" },
  { id: "pedicure", label: "Pedicure" },
  { id: "penteados", label: "Penteados" },
];

export const categoryNames = {
  cortes: "Cortes",
  escova: "Escova",
  coloracao: "Coloração",
  hidratacao: "Hidratação",
  manicure: "Manicure",
  pedicure: "Pedicure",
  penteados: "Penteados",
};
