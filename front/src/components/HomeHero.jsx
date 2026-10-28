import { CalendarClock, ChevronRight, MapPin, Phone } from "lucide-react";

export default function HomeHero({
  cartCount,
  hideBadgeUntilNextAdd,
  isHistoryOpen,
  onToggleHistory,
  onOpenCart,
  onOpenLogin,
  onOpenDashboard,
  onLogout,
  user,
}) {
  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand-wrap">
            <div className="brand-badge">
              <span className="brand-main">R.tual</span>
              <span className="brand-sub">Hair Care</span>
            </div>
            <div className="brand-copy">
              <p className="brand-kicker">Studio de beleza</p>
              <h1 className="brand-name">R.tual</h1>
            </div>
          </div>

          <div className="header-actions">
            <button className="cart-btn cart-btn-header" onClick={onOpenCart} type="button">
              <CalendarClock className="icon" />
              <span>Meus Agendamentos</span>
              {!hideBadgeUntilNextAdd && cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
            {user ? (
              <>
                {user.tipo === "administrador" && (
                  <button className="account-btn" onClick={onOpenDashboard} type="button">
                    Painel
                  </button>
                )}
                <span className="account-name">Olá, {user.nome || user.email}</span>
                <button className="account-btn" onClick={onLogout} type="button">
                  Sair
                </button>
              </>
            ) : (
              <button className="account-btn" onClick={onOpenLogin} type="button">
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-content">
          <h2>Transforme sua beleza com nossos serviços premium</h2>
          <p>Cortes, coloração e cuidados com a melhor qualidade e profissionais experientes</p>

          <div className="hero-tags">
            <button
              type="button"
              className="tag-pill clickable"
              aria-expanded={isHistoryOpen}
              onClick={onToggleHistory}
            >
              Nossa História
              <ChevronRight size={16} />
            </button>

            <button
              className="tag-pill clickable"
              onClick={() =>
                window.open(
                  "https://www.google.com/maps/search/?api=1&query=Alameda%20dos%20Vidoeiros%2C%20455%20loja%2033%20Gramado%20Mall",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              type="button"
            >
              <MapPin size={16} />
              Alameda dos Vidoeiros, 455 loja 33 Gramado Mall
            </button>
            <button
              className="tag-pill clickable"
              onClick={() =>
                window.open(
                  "https://wa.me/5519993895612",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              type="button"
            >
              <Phone size={16} />
              Fale conosco
            </button>
          </div>

          {isHistoryOpen && (
            <div className="history-panel">
              <p>
                O R.TUAL é fruto da visão de Rita Domingues, especialista há mais de 30 anos em cabelos,
                mechas e alongamentos, que sempre entendeu que beleza verdadeira começa pelo cuidado
                consciente. Ao lado de seu sócio e marido, Fabiano Gomes, esse espaço foi construído para
                transformar essa forma de pensar em uma experiência concreta para cada cliente.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
