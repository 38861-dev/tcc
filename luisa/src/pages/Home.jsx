import HomeHero from "../components/HomeHero";
import CategoryTabs from "../components/CategoryTabs";
import ServicesGrid from "../components/ServicesGrid";
import SalonShowcase from "../components/SalonShowcase";
import SalonInfo from "../components/SalonInfo";
import CartSidebar from "../components/CartSidebar";
import ToastStack from "../components/ToastStack";
import "../styles/Home.css";
import useSalonScheduling from "../hooks/useSalonScheduling";
import { categories, categoryNames, categoryPhotoCards, products } from "../data/salonData";

export default function Home({ setPage }) {
  const {
    agendamentos,
    addToCart,
    appointmentToCancel,
    cancelAppointment,
    closeCancelAppointment,
    cartCount,
    cartTotal,
    confirmedCount,
    currentCategory,
    filteredProducts,
    finalizeScheduling,
    historicoAgendamentos,
    hideBadgeUntilNextAdd,
    isCartOpen,
    isHistoryOpen,
    lastConfirmation,
    removeFromCart,
    setCurrentCategory,
    setLastConfirmation,
    setIsCartOpen,
    setIsHistoryOpen,
    toasts,
    updateAppointment,
    requestCancelAppointment,
  } = useSalonScheduling(products);

  return (
    <div className="salon-app">
      <HomeHero
        cartCount={cartCount}
        hideBadgeUntilNextAdd={hideBadgeUntilNextAdd}
        isHistoryOpen={isHistoryOpen}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLogin={() => setPage("login")}
      />

      <CategoryTabs
        categories={categories}
        currentCategory={currentCategory}
        onChangeCategory={setCurrentCategory}
      />

      <ServicesGrid
        key={currentCategory}
        filteredProducts={filteredProducts}
        categoryPhotoCards={categoryPhotoCards.filter(
          (photo) => currentCategory === "all" || photo.category === currentCategory,
        )}
        categoryNames={categoryNames}
        formatBRL={(value) => `R$ ${value.toFixed(2).replace(".", ",")}`}
        onAddToCart={addToCart}
      />

      <SalonInfo />
      <SalonShowcase />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        agendamentos={agendamentos}
        historicoAgendamentos={historicoAgendamentos}
        products={products}
        formatBRL={(value) => `R$ ${value.toFixed(2).replace(".", ",")}`}
        onRemoveFromCart={removeFromCart}
        onCancelAppointment={requestCancelAppointment}
        appointmentToCancel={appointmentToCancel}
        onConfirmCancel={cancelAppointment}
        onCloseCancel={closeCancelAppointment}
        onUpdateAppointment={updateAppointment}
        cartTotal={cartTotal}
        confirmedCount={confirmedCount}
        onFinalizeScheduling={finalizeScheduling}
        lastConfirmation={lastConfirmation}
        onOpenWhatsApp={() => {
          const phone = "5519993895612";
          const message = encodeURIComponent(lastConfirmation?.whatsappMessage || "");
          window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
        }}
        onCloseConfirmation={() => setLastConfirmation(null)}
      />

      <ToastStack toasts={toasts} />
    </div>
  );
}
