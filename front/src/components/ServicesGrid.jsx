export default function ServicesGrid({
  filteredProducts,
  categoryNames,
  formatBRL,
  onAddToCart,
}) {
  return (
    <section className="services">
      <div className="container">
        <h3>Nossos Serviços</h3>
        <div className="services-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div
                className="service-cover"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.1) 100%), url('${product.image}')`,
                }}
              />
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
          ))}
        </div>
      </div>
    </section>
  );
}
