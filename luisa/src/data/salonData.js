import coloracaoImg from "../assets/coloracao.png";
import corteImg from "../assets/corte.png";
import corteReferencia3Img from "../assets/corte-referencia-3.png";
import corteReferencia4Img from "../assets/corte-referencia-4.png";
import escovaImg from "../assets/escova.png";
import hidratacaoImg from "../assets/hidratação.png";
import manicureImg from "../assets/manicure.png";
import pedicureImg from "../assets/pedicure.png";

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
  { id: "s1", name: "Corte Feminino", category: "cortes", price: 150.0, duration: "1h", image: corteImg },
  { id: "s3", name: "Coloração Completa", category: "coloracao", price: 1200.0, duration: "2h", image: coloracaoImg },
  { id: "s4", name: "Hidratação Capilar", category: "hidratacao", price: 120.0, duration: "1h 30min", image: hidratacaoImg },
  { id: "s5", name: "Manicure", category: "manicure", price: 40.0, duration: "45min", image: manicureImg },
  { id: "s6", name: "Pedicure", category: "pedicure", price: 45.0, duration: "1h", image: pedicureImg },
  { id: "s7", name: "Escova", category: "escova", price: 120.0, duration: "30min", image: escovaImg },
];

export const categoryPhotoCards = [
  {
    id: "corte-reference-3",
    category: "cortes",
    image: corteReferencia3Img,
    alt: "Referência de corte de cabelo em camadas longas",
  },
  {
    id: "corte-reference-4",
    category: "cortes",
    image: corteReferencia4Img,
    alt: "Referência de corte de cabelo em camadas na altura dos ombros",
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
];

export const categoryNames = {
  cortes: "Cortes",
  escova: "Escova",
  coloracao: "Coloração",
  hidratacao: "Hidratação",
  manicure: "Manicure",
  pedicure: "Pedicure",
};
