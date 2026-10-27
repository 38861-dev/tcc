import { useEffect, useMemo, useState } from "react";
import { getSalonHours } from "../data/salonData";
import {
  APPOINTMENTS_STORAGE_KEY,
  saveAppointments,
} from "../services/appointmentStorage";

function makeLocalId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

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

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getFirstAvailableDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  let dateValue;
  do {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    dateValue = `${date.getFullYear()}-${month}-${day}`;
    if (!getSalonHours(dateValue)) date.setDate(date.getDate() + 1);
  } while (!getSalonHours(dateValue));

  return dateValue;
}

export default function useSalonScheduling(products) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [historicoAgendamentos, setHistoricoAgendamentos] = useState(() => {
    const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    return storedAppointments ? JSON.parse(storedAppointments) : [];
  });
  const [currentCategory, setCurrentCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [hideBadgeUntilNextAdd, setHideBadgeUntilNextAdd] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [lastConfirmation, setLastConfirmation] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const filteredProducts = useMemo(() => {
    if (currentCategory === "all") return products;
    return products.filter((product) => product.category === currentCategory);
  }, [currentCategory, products]);

  const cartCount = useMemo(
    () => agendamentos.length,
    [agendamentos]
  );

  const cartTotal = useMemo(
    () => agendamentos.reduce((sum, item) => sum + item.price, 0),
    [agendamentos]
  );

  const confirmedCount = useMemo(
    () =>
      historicoAgendamentos.length,
    [historicoAgendamentos]
  );

  useEffect(() => {
    saveAppointments(historicoAgendamentos);
  }, [historicoAgendamentos]);

  const showToast = (message, type = "success") => {
    const id = makeLocalId();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 900);
  };

  const addToCart = (productId) => {
    setHideBadgeUntilNextAdd(false);
    const product = products.find((item) => item.id === productId);
    if (!product) {
      showToast("Serviço não encontrado", "error");
      return;
    }

    if (agendamentos.some((item) => item.product_id === product.id)) {
      showToast("Esse serviço já foi adicionado", "error");
      return;
    }

    setAgendamentos((prev) => [
      ...prev,
      {
        __backendId: makeLocalId(),
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        ...(product.priceRange ? { price_range: product.priceRange } : {}),
        product_image: product.image,
        product_duration: product.duration,
        appointment_date: getFirstAvailableDate(),
        appointment_time: "",
        added_at: new Date().toISOString(),
      },
    ]);
    showToast(`${product.name} agendado!`, "success");

  };

  const removeFromCart = (itemId) => {
    setAgendamentos((prev) => prev.filter((item) => item.__backendId !== itemId));
    showToast("Item removido", "success");
  };

  const updateAppointment = (itemId, field, value) => {
    setAgendamentos((prev) =>
      prev.map((item) =>
        item.__backendId === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const requestCancelAppointment = (itemId) => {
    setAppointmentToCancel(itemId);
  };

  const closeCancelAppointment = () => {
    setAppointmentToCancel(null);
  };

  const cancelAppointment = () => {
    if (!appointmentToCancel) return;
    setHistoricoAgendamentos((prev) =>
      prev.filter((item) => item.__backendId !== appointmentToCancel)
    );
    closeCancelAppointment();
    showToast("Agendamento cancelado", "success");
  };

  const finalizeScheduling = (customer) => {
    const phoneDigits = customer.phone.replace(/\D/g, "");

    if (!customer.name.trim() || phoneDigits.length < 10) {
      showToast("Informe seu nome e WhatsApp para finalizar", "error");
      return;
    }
    const missingSchedule = agendamentos.some(
      (item) => !item.appointment_date || !item.appointment_time
    );

    if (missingSchedule) {
      showToast("Escolha a data e o horário de cada serviço", "error");
      return;
    }

    const hasClosedDate = agendamentos.some(
      (item) => !getSalonHours(item.appointment_date)
    );

    if (hasClosedDate) {
      showToast("O salão atende de terça a sábado. Escolha uma data válida", "error");
      return;
    }

    const hasAppointmentOutsideHours = agendamentos.some((item) => {
      const hours = getSalonHours(item.appointment_date);
      const product = products.find((entry) => entry.id === item.product_id);
      const duration = durationToMinutes(item.product_duration || product?.duration);
      const [startHour, startMinute] = item.appointment_time.split(":").map(Number);
      const start = startHour * 60 + startMinute;
      const opening = hours.openingTime.split(":").map(Number);
      const closing = hours.closingTime.split(":").map(Number);
      const openingMinutes = opening[0] * 60 + opening[1];
      const closingMinutes = closing[0] * 60 + closing[1];

      return start < openingMinutes || start + duration > closingMinutes;
    });

    if (hasAppointmentOutsideHours) {
      showToast("O serviço precisa terminar até o fechamento. Escolha outro horário", "error");
      return;
    }

    const now = new Date();
    const today = getToday();
    const hasPastTime = agendamentos.some((item) => {
      if (item.appointment_date !== today) return false;
      const [hours, minutes] = item.appointment_time.split(":").map(Number);
      return hours * 60 + minutes <= now.getHours() * 60 + now.getMinutes();
    });

    if (hasPastTime) {
      showToast("Escolha um horário futuro para hoje", "error");
      return;
    }

    const hasInvalidServiceSequence = agendamentos.some((item, index) => {
      if (!item.appointment_time) return false;
      const itemStart = timeToMinutes(item.appointment_time);
      const product = products.find((entry) => entry.id === item.product_id);
      const itemEnd =
        itemStart + durationToMinutes(item.product_duration || product?.duration);

      return agendamentos.slice(index + 1).some((nextItem) => {
        if (
          nextItem.appointment_date !== item.appointment_date ||
          !nextItem.appointment_time
        ) {
          return false;
        }

        const nextStart = timeToMinutes(nextItem.appointment_time);
        return itemEnd > nextStart;
      });
    });

    if (hasInvalidServiceSequence) {
      showToast("Organize os serviços na sequência escolhida, respeitando a duração de cada um", "error");
      return;
    }

    const novosAgendamentos = agendamentos.map((item) => ({
      ...item,
      __backendId: makeLocalId(),
      status: "confirmado",
      customer_name: customer.name.trim(),
      customer_phone: phoneDigits,
    }));

    const whatsappMessage = [
      "Olá! Gostaria de confirmar meu agendamento na R.tual Hair Care.",
      "",
      `Cliente: ${customer.name.trim()}`,
      `WhatsApp: ${customer.phone.trim()}`,
      "",
      "Serviços:",
      ...novosAgendamentos.map(
        (item) =>
          `- ${item.product_name}: ${new Date(`${item.appointment_date}T12:00:00`).toLocaleDateString("pt-BR")} às ${item.appointment_time} - ${item.price_range ? `R$ ${item.price_range[0].toFixed(2).replace(".", ",")} a R$ ${item.price_range[1].toFixed(2).replace(".", ",")} (estimativa inicial: R$ ${item.price.toFixed(2).replace(".", ",")})` : `R$ ${item.price.toFixed(2).replace(".", ",")}`}`
      ),
      "",
      `Total: R$ ${cartTotal.toFixed(2).replace(".", ",")}`,
    ].join("\n");

    setHistoricoAgendamentos((prev) => [...novosAgendamentos, ...prev]);
    setLastConfirmation({
      appointments: novosAgendamentos,
      total: cartTotal,
      whatsappMessage,
    });

    setAgendamentos([]);
    setHideBadgeUntilNextAdd(true);
    showToast("Agendamento finalizado com sucesso!", "success");
    setIsCartOpen(false);
  };

  return {
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
    lastConfirmation,
    isCartOpen,
    isHistoryOpen,
    removeFromCart,
    setCurrentCategory,
    setIsCartOpen,
    setIsHistoryOpen,
    setLastConfirmation,
    setAppointmentToCancel,
    requestCancelAppointment,
    toasts,
    updateAppointment,
  };
}
