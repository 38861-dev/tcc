export default function CartSidebar({
  isOpen,
  onClose,
  agendamentos,
  formatBRL,
  onUpdateQuantity,
  onRemoveFromCart,
  cartTotal,
  onFinalizeScheduling,
}) {
  return (
    <>
      <div className={isOpen ? "cart-overlay show" : "cart-overlay"} onClick={onClose} />

      <aside className={isOpen ? "cart-sidebar open" : "cart-sidebar"}>
        <div className="cart-header">
          <h3>Meus Agendamentos</h3>
          <button aria-label="Fechar painel" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="cart-items">
          {agendamentos.length === 0 && <p className="empty-cart">Seus agendamentos estão vazios</p>}

          {agendamentos.map((item) => (
            <div className="cart-item" key={item.__backendId}>
              <div className="cart-thumb">✦</div>
              <div className="cart-info">
                <h4>{item.product_name}</h4>
                <p>{formatBRL(item.price)} cada</p>
                <div className="quantity-controls">
                  <button onClick={() => onUpdateQuantity(item.__backendId, -1)} type="button">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.__backendId, 1)} type="button">
                    +
                  </button>
                </div>
              </div>
              <div className="cart-actions">
                <strong>{formatBRL(item.price * item.quantity)}</strong>
                <button className="remove-btn" onClick={() => onRemoveFromCart(item.__backendId)} type="button">
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        {agendamentos.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <strong>{formatBRL(cartTotal)}</strong>
            </div>
            <button className="checkout-btn" onClick={onFinalizeScheduling} type="button">
              Finalizar Agendamento
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
