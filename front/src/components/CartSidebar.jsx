import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getSalonHours } from "../data/salonData";

function getToday() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function durationToMinutes(duration) {
  const hours = Number(duration?.match(/(\d+)\s*h/)?.[1] || 0);
  const minutes = Number(duration?.match(/(\d+)\s*min/)?.[1] || 0);
  return Math.max(30, hours * 60 + minutes);
}

function getAvailableTimesByDuration(items, currentItem, products) {
  const hours = getSalonHours(currentItem.appointment_date);
  if (!hours) return [];

  const openingMinutes = timeToMinutes(hours.openingTime);
  const closingMinutes = timeToMinutes(hours.closingTime);
  const getItemDuration = (item) =>
    durationToMinutes(
      item.product_duration ||
        products.find((product) => product.id === item.product_id)?.duration
    );

  const currentDuration = getItemDuration(currentItem);
  const sameDayItems = items.filter(
    (item) =>
      item.__backendId !== currentItem.__backendId &&
      item.appointment_date === currentItem.appointment_date &&
      item.appointment_time
  );
  const cartItems = items.filter((item) => !item.status);
  const currentIndex = cartItems.findIndex(
    (item) => item.__backendId === currentItem.__backendId
  );
  const earlierServices = cartItems.slice(0, currentIndex).filter(
    (item) =>
      item.appointment_date === currentItem.appointment_date &&
      item.appointment_time
  );
  const laterServices = cartItems.slice(currentIndex + 1).filter(
    (item) =>
      item.appointment_date === currentItem.appointment_date &&
      item.appointment_time
  );
  const now = new Date();
  const today = getToday();

  return Array.from(
    { length: (closingMinutes - openingMinutes) / 30 + 1 },
    (_, index) => openingMinutes + index * 30
  )
    .filter((start) => {
      const end = start + currentDuration;
      const isPast =
        currentItem.appointment_date === today &&
        start <= now.getHours() * 60 + now.getMinutes();

      if (isPast || end > closingMinutes) return false;

      const followsEarlierServices = earlierServices.every((item) => {
        const itemStart = timeToMinutes(item.appointment_time);
        return itemStart + getItemDuration(item) <= start;
      });
      const precedesLaterServices = laterServices.every((item) => {
        const itemStart = timeToMinutes(item.appointment_time);
        return end <= itemStart;
      });
      const avoidsConfirmedAppointments = sameDayItems
        .filter((item) => item.status)
        .every((item) => {
          const itemStart = timeToMinutes(item.appointment_time);
          const itemEnd = itemStart + getItemDuration(item);
          return end <= itemStart || start >= itemEnd;
        });

      return followsEarlierServices && precedesLaterServices && avoidsConfirmedAppointments;
    })
    .map((minutes) => {
      const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
      return `${hours}:${String(minutes % 60).padStart(2, "0")}`;
    });
}

function dateToValue(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function AppointmentDateField({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const triggerRef = useRef(null);
  const calendarRef = useRef(null);
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const date = value ? new Date(`${value}T12:00:00`) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const selectedDate = value ? new Date(`${value}T12:00:00`) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysInMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() + 1,
    0
  ).getDate();
  const firstOpenDay = Array.from({ length: daysInMonth }, (_, index) => index + 1)
    .find((day) => getSalonHours(dateToValue(new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth(),
      day
    ))));
  const firstWeekday = firstOpenDay
    ? new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), firstOpenDay).getDay() - 2
    : 0;
  const dates = [
    ...Array(Math.max(0, firstWeekday)).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1).flatMap((day) => {
      const date = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), day);
      if (!getSalonHours(dateToValue(date))) return [];
      return date < today ? [null] : [day];
    }),
  ];
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(displayedMonth);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !calendarRef.current) return undefined;

    const updatePosition = () => {
      const trigger = triggerRef.current.getBoundingClientRect();
      const calendar = calendarRef.current.getBoundingClientRect();
      const left = Math.max(
        12,
        Math.min(trigger.left, window.innerWidth - calendar.width - 12)
      );
      const maxHeight = Math.max(
        120,
        Math.min(calendar.height, trigger.top - 20, window.innerHeight - 24)
      );
      const top = Math.max(12, trigger.top - maxHeight - 8);

      setPosition({ top, left, maxHeight });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, displayedMonth]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (calendarRef.current?.contains(event.target) || triggerRef.current?.contains(event.target)) return;
      setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectDate = (day) => {
    const date = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth(),
      day
    );
    onChange(dateToValue(date));
    setIsOpen(false);
  };

  return (
    <div className="appointment-date-field">
      <span className="appointment-field-label">Data</span>
      <button
        aria-expanded={isOpen}
        aria-label={`Data: ${selectedDate ? selectedDate.toLocaleDateString("pt-BR") : "escolher data"}`}
        className="appointment-date-trigger"
        ref={triggerRef}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {selectedDate ? selectedDate.toLocaleDateString("pt-BR") : "Escolha uma data"}
      </button>
      {isOpen && createPortal(
        <div
          aria-label="Escolha uma data"
          className="appointment-calendar"
          ref={calendarRef}
          role="dialog"
          style={{
            left: position?.left ?? 0,
            top: position?.top ?? 0,
            maxHeight: position?.maxHeight,
            visibility: position ? "visible" : "hidden",
          }}
        >
          <div className="appointment-calendar-header">
            <button
              aria-label="Mês anterior"
              disabled={displayedMonth <= currentMonth}
              onClick={() =>
                setDisplayedMonth(
                  new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1)
                )
              }
              type="button"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <strong>{monthLabel}</strong>
            <button
              aria-label="Próximo mês"
              onClick={() =>
                setDisplayedMonth(
                  new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1)
                )
              }
              type="button"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
          <div className="appointment-calendar-grid">
            {["Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <span className="appointment-calendar-weekday" key={day}>{day}</span>
            ))}
            {dates.map((day, index) => {
              if (!day) {
                return <span aria-hidden="true" key={`empty-${index}`} />;
              }

              const date = new Date(
                displayedMonth.getFullYear(),
                displayedMonth.getMonth(),
                day
              );
              const dateValue = dateToValue(date);
              const isUnavailable = date < today || !getSalonHours(dateValue);

              return (
                <button
                  aria-label={date.toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  aria-pressed={dateValue === value}
                  className={`appointment-calendar-day${dateValue === value ? " selected" : ""}`}
                  key={dateValue}
                  onClick={() => selectDate(day)}
                  type="button"
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function CartSidebar({
  isOpen,
  onClose,
  agendamentos,
  historicoAgendamentos,
  products,
  confirmedCount,
  formatBRL,
  onRemoveFromCart,
  onCancelAppointment,
  appointmentToCancel,
  onConfirmCancel,
  onCloseCancel,
  onUpdateAppointment,
  cartTotal,
  onFinalizeScheduling,
  lastConfirmation,
  onOpenWhatsApp,
  onCloseConfirmation,
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setCustomerName("");
      setCustomerPhone("");
    }
  }, [isOpen]);

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
          {agendamentos.length === 0 && historicoAgendamentos.length === 0 && (
            <p className="empty-cart">Seus agendamentos estão vazios</p>
          )}

          {agendamentos.map((item) => {
            const scheduledItems = [...agendamentos, ...historicoAgendamentos];
            const productImage = item.product_image || products.find((product) => product.id === item.product_id)?.image;
            const availableTimes = getAvailableTimesByDuration(scheduledItems, item, products);

            return (
            <div className="cart-item" key={item.__backendId}>
              <div className="cart-thumb">
                <img src={productImage} alt={`Foto do serviço ${item.product_name}`} />
              </div>
              <div className="cart-info">
                <h4>{item.product_name}</h4>
                <p>
                  {item.price_range
                    ? `${formatBRL(item.price_range[0])} a ${formatBRL(item.price_range[1])} cada`
                    : `${formatBRL(item.price)} cada`}
                  {item.price_range && <small className="appointment-price-note">Valor final após avaliação</small>}
                </p>
                <div className="appointment-fields">
                  <AppointmentDateField
                    value={item.appointment_date || ""}
                    onChange={(date) => {
                      onUpdateAppointment(item.__backendId, "appointment_date", date);
                      onUpdateAppointment(item.__backendId, "appointment_time", "");
                    }}
                  />
                  <label>
                    Horário
                    <select
                      value={item.appointment_time || ""}
                      onChange={(event) =>
                        onUpdateAppointment(item.__backendId, "appointment_time", event.target.value)
                      }
                    >
                      <option value="">
                        {availableTimes.length === 0
                          ? getSalonHours(item.appointment_date)
                            ? "Sem horários disponíveis"
                            : "Fechado nesta data"
                          : "Selecione um horário"}
                      </option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="cart-actions">
                <strong>{formatBRL(item.price)}</strong>
                <button className="remove-btn" onClick={() => onRemoveFromCart(item.__backendId)} type="button">
                  Cancelar
                </button>
              </div>
            </div>
            );
          })}

          {historicoAgendamentos.length > 0 && (
            <section className="confirmed-appointments">
              <div className="confirmed-heading">
                <span>Meus Agendamentos</span>
                <small>{confirmedCount} confirmado(s)</small>
              </div>
              {historicoAgendamentos.map((item) => (
                <div className="confirmed-appointment" key={`confirmed-${item.__backendId}`}>
                  <strong>{item.product_name}</strong>
                  <span>
                    {new Date(`${item.appointment_date}T12:00:00`).toLocaleDateString("pt-BR")} às {item.appointment_time}
                  </span>
                  <small>Confirmacao recebida pelo WhatsApp.</small>
                    <button
                    className="cancel-appointment-btn"
                    onClick={() => onCancelAppointment(item.__backendId)}
                    type="button"
                  >
                    Cancelar agendamento
                  </button>
                </div>
              ))}
            </section>
          )}
        </div>

        {agendamentos.length > 0 && (
          <div className="cart-footer">
            <div className="customer-fields">
              <label>
                Seu nome
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Digite seu nome"
                  type="text"
                />
              </label>
              <label>
                WhatsApp
                <input
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  placeholder="(00) 00000-0000"
                  inputMode="tel"
                  type="tel"
                />
              </label>
            </div>
            <div className="cart-total">
              <span>
                Total:
                {agendamentos.some((item) => item.price_range) && (
                  <small className="appointment-price-note"> estimativa inicial</small>
                )}
              </span>
              <strong>{formatBRL(cartTotal)}</strong>
            </div>
            <button className="checkout-btn" onClick={() => onFinalizeScheduling({ name: customerName, phone: customerPhone })} type="button">
              Finalizar Agendamento
            </button>
          </div>
        )}
      </aside>

      {lastConfirmation && (
        <div className="confirmation-overlay" role="presentation">
          <section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
            <div className="confirmation-icon">✓</div>
            <p className="confirmation-kicker">Tudo certo</p>
            <h2 id="confirmation-title">Agendamento confirmado</h2>
            <p className="confirmation-copy">
              {lastConfirmation.appointments.length === 1
                ? "Seu horário foi reservado com sucesso. Recebemos sua confirmação pelo WhatsApp."
                : `${lastConfirmation.appointments.length} horários foram reservados com sucesso. Recebemos sua confirmação pelo WhatsApp.`}
            </p>
            <div className="confirmation-list">
              {lastConfirmation.appointments.map((item) => (
                <div className="confirmation-item" key={item.__backendId}>
                  <strong>{item.product_name}</strong>
                  <span>
                    {new Date(`${item.appointment_date}T12:00:00`).toLocaleDateString("pt-BR")} às {item.appointment_time}
                  </span>
                </div>
              ))}
            </div>
            <div className="confirmation-actions">
              <button className="confirmation-whatsapp" onClick={onOpenWhatsApp} type="button">
                Enviar pelo WhatsApp
              </button>
              <button className="confirmation-close" onClick={onCloseConfirmation} type="button">
                Entendi
              </button>
            </div>
          </section>
        </div>
      )}

      {appointmentToCancel && (
        <div className="confirmation-overlay" role="presentation">
          <section className="confirmation-modal cancel-confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
            <h2 id="cancel-title">Cancelar agendamento?</h2>
            <p className="confirmation-copy">Tem certeza que deseja cancelar?</p>
            <div className="cancel-actions">
              <button
                className="cancel-back-btn"
                onClick={(event) => {
                  event.stopPropagation();
                  onCloseCancel();
                }}
                type="button"
              >
                Voltar
              </button>
              <button className="cancel-confirm-btn" onClick={onConfirmCancel} type="button">
                Tenho certeza
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

  function timeToMinutes(time) {
    if (!time) return -1;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }
