import coloracaoImg from "../assets/coloracao.png";
import corteImg from "../assets/corte.png";
import escovaImg from "../assets/escova.png";
import hidratacaoImg from "../assets/hidratação.png";
import manicureImg from "../assets/manicure.png";
import pedicureImg from "../assets/pedicure.png";

export const products = [
  { id: "s1", name: "Corte Feminino", category: "cortes", price: 50.0, duration: "1h", image: corteImg },
  { id: "s3", name: "Coloração Completa", category: "coloracao", price: 120.0, duration: "2h", image: coloracaoImg },
  { id: "s4", name: "Hidratação Capilar", category: "hidratacao", price: 80.0, duration: "1h 30min", image: hidratacaoImg },
  { id: "s5", name: "Manicure", category: "manicure", price: 40.0, duration: "45min", image: manicureImg },
  { id: "s6", name: "Pedicure", category: "pedicure", price: 35.0, duration: "1h", image: pedicureImg },
  { id: "s7", name: "Escova", category: "cortes", price: 35.0, duration: "30min", image: escovaImg },
];

export const categories = [
  { id: "all", label: "Todos" },
  { id: "cortes", label: "Cortes" },
  { id: "coloracao", label: "Coloração" },
  { id: "hidratacao", label: "Hidratação" },
  { id: "manicure", label: "Manicure" },
  { id: "pedicure", label: "Pedicure" },
];

export const categoryNames = {
  cortes: "Cortes",
  coloracao: "Coloração",
  hidratacao: "Hidratação",
  manicure: "Manicure",
  pedicure: "Pedicure",
};
