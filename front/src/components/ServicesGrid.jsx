import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

const serviceDetails = {
  "Corte Feminino": {
    description: "Corte personalizado pensado para valorizar seu formato de rosto e sua rotina.",
    care: "Venha com os cabelos desembaraçados e conte ao profissional como costuma finalizar.",
  },
  "Coloração Completa": {
    description: "Uma transformação completa com avaliação cuidadosa e escolha de tom personalizada.",
    care: "Evite lavar os cabelos no dia e informe qualquer procedimento químico recente.",
  },
  "Hidratação Capilar": {
    description: "Tratamento para devolver maciez, brilho e movimento aos fios.",
    care: "O resultado dura mais com produtos adequados ao seu tipo de cabelo.",
  },
  Manicure: {
    description: "Cuidado completo para unhas bem cuidadas, com acabamento delicado e duradouro.",
    care: "Se possível, retire o esmalte antigo antes do atendimento.",
  },
  Pedicure: {
    description: "Um cuidado especial para pés e unhas, com acabamento confortável e elegante.",
    care: "Evite usar sapatos apertados logo após o atendimento.",
  },
  Escova: {
    description: "Finalização com movimento, brilho e acabamento escolhido para a ocasião.",
    care: "Traga uma referência do acabamento que você deseja para a escova.",
  },
  Penteado: {
    description: "Penteado personalizado para completar seu visual em uma ocasião especial.",
    care: "Venha com os cabelos limpos e secos e traga uma referência do estilo desejado.",
  },
};

export default function ServicesGrid({
  filteredProducts,
  categoryNames,
  formatBRL,
  onAddToCart,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImages, setActiveImages] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openProductDetails = (product, imageIndex) => {
    setSelectedProduct(product);
    setSelectedImageIndex(imageIndex);
  };

  const changeSelectedImage = (direction) => {
    const images = selectedProduct?.images;
    if (!images?.length) return;

    const nextIndex = (selectedImageIndex + direction + images.length) % images.length;
    setSelectedImageIndex(nextIndex);
    setActiveImages((current) => ({ ...current, [selectedProduct.id]: nextIndex }));
  };

  useEffect(() => {
    if (!selectedProduct) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedProduct(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedProduct]);

  return (
    <>
      <section className="services" id="services-section">
        <div className="container">
          <h3>Nossos Serviços</h3>
          <div className="services-grid">
            {filteredProducts.map((product) => {
              const images = product.images ?? [product.image];
              const activeImageIndex = activeImages[product.id] ?? 0;
              const activeImage = images[activeImageIndex];

              return (
                <article className="product-card" key={product.id}>
                  <div className="service-gallery">
                    <button
                      className="service-preview"
                      onClick={() => openProductDetails(product, activeImageIndex)}
                      type="button"
                      aria-label={`Ver detalhes de ${product.name}`}
                    >
                      <div
                        className="service-cover"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.1) 100%), url('${activeImage}')`,
                        }}
                      />
                    </button>
                    {images.length > 1 && (
                      <>
                        <button
                          className="service-gallery-arrow service-gallery-arrow-previous"
                          onClick={() =>
                            setActiveImages((current) => ({
                              ...current,
                              [product.id]: (activeImageIndex - 1 + images.length) % images.length,
                            }))
                          }
                          type="button"
                          aria-label={`Foto anterior de ${product.name}`}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          className="service-gallery-arrow service-gallery-arrow-next"
                          onClick={() =>
                            setActiveImages((current) => ({
                              ...current,
                              [product.id]: (activeImageIndex + 1) % images.length,
                            }))
                          }
                          type="button"
                          aria-label={`Próxima foto de ${product.name}`}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="card-content">
                    <span className="category-text">{categoryNames[product.category] || product.category}</span>
                    <h4>{product.name}</h4>
                    <p className="duration">{product.duration}</p>
                    <div className="card-bottom">
                      <strong>{formatBRL(product.price)}</strong>
                      <button onClick={() => onAddToCart(product.id)} type="button">
                        Agendar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="service-modal-overlay" onClick={() => setSelectedProduct(null)} role="presentation">
          <section
            className="service-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <button
              className="service-modal-close"
              onClick={() => setSelectedProduct(null)}
              type="button"
              aria-label="Fechar detalhes"
            >
              <X size={20} />
            </button>
            <div className="service-modal-gallery">
              <img
                src={selectedProduct.images?.[selectedImageIndex] ?? selectedProduct.image}
                alt={`Imagem de ${selectedProduct.name}`}
              />
              {selectedProduct.images?.length > 1 && (
                <>
                  <button
                    className="service-gallery-arrow service-gallery-arrow-previous"
                    onClick={() => changeSelectedImage(-1)}
                    type="button"
                    aria-label={`Foto anterior de ${selectedProduct.name}`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className="service-gallery-arrow service-gallery-arrow-next"
                    onClick={() => changeSelectedImage(1)}
                    type="button"
                    aria-label={`Próxima foto de ${selectedProduct.name}`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            <div>
              <span className="section-kicker">{categoryNames[selectedProduct.category]}</span>
              <h2 id="service-modal-title">{selectedProduct.name}</h2>
              <p>{serviceDetails[selectedProduct.name]?.description}</p>
              <div className="service-modal-meta">
                <strong>{formatBRL(selectedProduct.price)}</strong>
                <span>{selectedProduct.duration}</span>
              </div>
              <small>{serviceDetails[selectedProduct.name]?.care}</small>
              <button className="service-modal-action" onClick={() => onAddToCart(selectedProduct.id)} type="button">
                Agendar este serviço
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
