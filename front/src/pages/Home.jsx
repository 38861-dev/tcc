import HomeHero from "../components/HomeHero";
import CategoryTabs from "../components/CategoryTabs";
import ServicesGrid from "../components/ServicesGrid";
import CartSidebar from "../components/CartSidebar";
import ToastStack from "../components/ToastStack";
import "../styles/Home.css";
import useSalonScheduling from "../hooks/useSalonScheduling";
import { categories, categoryNames, products } from "../data/salonData";

export default function Home({ setPage }) {
  const {
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
  } = useSalonScheduling(products);

  return (
    <div className="salon-app">
      <HomeHero
        cartCount={cartCount}
        hideBadgeUntilNextAdd={hideBadgeUntilNextAdd}
        isHistoryOpen={isHistoryOpen}
        onGoContact={() => setPage("contact")}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <CategoryTabs
        categories={categories}
        currentCategory={currentCategory}
        onChangeCategory={setCurrentCategory}
      />

      <ServicesGrid
        filteredProducts={filteredProducts}
        categoryNames={categoryNames}
        formatBRL={(value) => `R$ ${value.toFixed(2).replace(".", ",")}`}
        onAddToCart={addToCart}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        agendamentos={agendamentos}
        formatBRL={(value) => `R$ ${value.toFixed(2).replace(".", ",")}`}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        cartTotal={cartTotal}
        onFinalizeScheduling={finalizeScheduling}
      />

      <ToastStack toasts={toasts} />
    </div>
  );
}
