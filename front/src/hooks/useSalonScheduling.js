import { useMemo, useState } from "react";

function makeLocalId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function useSalonScheduling(products) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [hideBadgeUntilNextAdd, setHideBadgeUntilNextAdd] = useState(false);
  const [toasts, setToasts] = useState([]);

  const filteredProducts = useMemo(() => {
    if (currentCategory === "all") return products;
    return products.filter((product) => product.category === currentCategory);
  }, [currentCategory, products]);

  const cartCount = useMemo(
    () => agendamentos.reduce((sum, item) => sum + item.quantity, 0),
    [agendamentos]
  );

  const cartTotal = useMemo(
    () => agendamentos.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [agendamentos]
  );

  const showToast = (message, type = "success") => {
    const id = makeLocalId();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const addToCart = (productId) => {
    setHideBadgeUntilNextAdd(false);
    const product = products.find((item) => item.id === productId);
    if (!product) {
      showToast("Serviço não encontrado", "error");
      return;
    }

    const existingItem = agendamentos.find((item) => item.product_id === productId);
    if (existingItem) {
      setAgendamentos((prev) =>
        prev.map((item) => {
          if (item.product_id !== productId) return item;
          return { ...item, quantity: item.quantity + 1 };
        })
      );
      showToast(`${product.name} atualizado!`, "success");
    } else {
      setAgendamentos((prev) => [
        ...prev,
        {
          __backendId: makeLocalId(),
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          price: product.price,
          added_at: new Date().toISOString(),
        },
      ]);
      showToast(`${product.name} agendado!`, "success");
    }

    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, delta) => {
    const target = agendamentos.find((item) => item.__backendId === itemId);
    if (!target) return;

    const nextQuantity = target.quantity + delta;
    if (nextQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setAgendamentos((prev) =>
      prev.map((item) => {
        if (item.__backendId !== itemId) return item;
        return { ...item, quantity: nextQuantity };
      })
    );
  };

  const removeFromCart = (itemId) => {
    setAgendamentos((prev) => prev.filter((item) => item.__backendId !== itemId));
    showToast("Item removido", "success");
  };

  const finalizeScheduling = () => {
    setHideBadgeUntilNextAdd(true);
    showToast("Agendamento finalizado com sucesso!", "success");
    setIsCartOpen(false);
  };

  return {
    agendamentos,
    addToCart,
    cartCount,
    cartTotal,
    currentCategory,
    filteredProducts,
    finalizeScheduling,
    hideBadgeUntilNextAdd,
    isCartOpen,
    isHistoryOpen,
    removeFromCart,
    setCurrentCategory,
    setIsCartOpen,
    setIsHistoryOpen,
    toasts,
    updateQuantity,
  };
}
