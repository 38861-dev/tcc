import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Preciso chegar com quanto tempo de antecedência?",
    answer: "Recomendamos chegar 10 minutos antes para começar sua experiência com calma.",
  },
  {
    question: "Posso agendar mais de um serviço?",
    answer: "Sim. Escolha os serviços desejados e selecione um horário disponível para cada um.",
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos dinheiro, cartões e Pix diretamente no salão.",
  },
];

export default function SalonShowcase() {
  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <section className="faq-section">
      <div className="container faq-layout">
        <div>
          <span className="section-kicker">Antes de chegar</span>
          <h3>Ficou alguma dúvida?</h3>
          <p>Reunimos as respostas mais importantes para sua visita ser tranquila.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <button
                className={isOpen ? "faq-item open" : "faq-item"}
                key={faq.question}
                onClick={() => setOpenFaq(isOpen ? -1 : index)}
                type="button"
              >
                <span>
                  <strong>{faq.question}</strong>
                  {isOpen && <small>{faq.answer}</small>}
                </span>
                <ChevronDown size={19} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
