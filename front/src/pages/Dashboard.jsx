import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Search,
  Scissors,
  UsersRound,
  Wallet,
} from "lucide-react";
import {
  readAppointments,
  saveAppointments,
} from "../services/appointmentStorage";
import "../styles/Dashboard.css";

const sections = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "appointments", label: "Agendamentos", icon: CalendarDays },
  { id: "customers", label: "Clientes", icon: UsersRound },
];

const statusLabels = {
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(date) {
  if (!date) return "Data não definida";
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR");
}

function getToday() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function getCustomers(appointments) {
  const customers = new Map();
  appointments.forEach((appointment) => {
    const key = appointment.customer_email || appointment.customer_phone || appointment.customer_name;
    if (key && !customers.has(key)) customers.set(key, appointment);
  });
  return [...customers.values()];
}

function AppointmentTable({ appointments, onStatusChange }) {
  if (appointments.length === 0) {
    return (
      <div className="dashboard-empty">
        <CalendarDays size={28} />
        <strong>Nenhum agendamento encontrado</strong>
        <span>Os novos horários aparecerão aqui quando forem reservados.</span>
      </div>
    );
  }

  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Data e horário</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.__backendId}>
              <td>
                <strong>{appointment.customer_name || "Cliente"}</strong>
                <span>{appointment.customer_email || appointment.customer_phone || "Contato não informado"}</span>
              </td>
              <td>{appointment.product_name}</td>
              <td>{formatDate(appointment.appointment_date)} às {appointment.appointment_time || "--:--"}</td>
              <td>{formatCurrency(appointment.price || 0)}</td>
              <td>
                <select
                  aria-label={`Status do agendamento de ${appointment.customer_name || "cliente"}`}
                  className={`status-select status-${appointment.status || "confirmado"}`}
                  onChange={(event) => onStatusChange(appointment.__backendId, event.target.value)}
                  value={appointment.status || "confirmado"}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard({ setPage, onLogout }) {
  const [appointments, setAppointments] = useState(readAppointments);
  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const refreshAppointments = () => setAppointments(readAppointments());
    window.addEventListener("rtual-appointments-updated", refreshAppointments);
    window.addEventListener("storage", refreshAppointments);
    return () => {
      window.removeEventListener("rtual-appointments-updated", refreshAppointments);
      window.removeEventListener("storage", refreshAppointments);
    };
  }, []);

  const customers = useMemo(() => getCustomers(appointments), [appointments]);
  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return appointments
      .filter((appointment) => {
        if (!query) return true;
        return [
          appointment.customer_name,
          appointment.customer_email,
          appointment.customer_phone,
          appointment.product_name,
        ].some((value) => value?.toLowerCase().includes(query));
      })
      .sort((first, second) =>
        `${first.appointment_date || ""} ${first.appointment_time || ""}`.localeCompare(
          `${second.appointment_date || ""} ${second.appointment_time || ""}`
        )
      );
  }, [appointments, search]);

  const todayCount = appointments.filter(
    (appointment) => appointment.appointment_date === getToday() && appointment.status !== "cancelado"
  ).length;
  const activeCount = appointments.filter((appointment) => appointment.status !== "cancelado").length;
  const revenue = appointments
    .filter((appointment) => appointment.status !== "cancelado")
    .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0);

  const changeStatus = (id, status) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.__backendId === id ? { ...appointment, status } : appointment
    );
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
  };

  const heading = sections.find((section) => section.id === activeSection)?.label || "Visão geral";

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">
            <span className="admin-brand-main">R.tual</span>
            <span className="admin-brand-sub">Hair Care</span>
          </span>
          <div><strong>R.tual</strong><small>Painel administrativo</small></div>
        </div>
        <span className="sidebar-caption">MENU PRINCIPAL</span>
        <nav className="sidebar-nav" aria-label="Navegação administrativa">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              className={activeSection === id ? "active" : ""}
              key={id}
              onClick={() => setActiveSection(id)}
              type="button"
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={onLogout || (() => setPage("home"))} type="button">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-breadcrumb">R.tual Hair Care / Painel</span>
            <h1>{heading}</h1>
          </div>
          <div className="dashboard-user">
            <span className="dashboard-avatar" aria-label="R.tual Hair Care">
              <span className="dashboard-avatar-main">R.tual</span>
              <span className="dashboard-avatar-sub">Hair Care</span>
            </span>
            <div><strong>Administrador</strong><small>Equipe R.tual</small></div>
          </div>
        </header>

        {activeSection === "overview" && (
          <>
            <div className="dashboard-welcome">
              <div>
                <p className="dashboard-overline">RESUMO DO SALÃO</p>
                <h2>Olá! Aqui está o movimento.</h2>
                <p>Acompanhe os atendimentos e as informações do seu salão.</p>
              </div>
              <button onClick={() => setActiveSection("appointments")} type="button">
                Ver agenda <CalendarDays size={17} />
              </button>
            </div>

            <div className="metrics-grid">
              <article className="metric-card">
                <span className="metric-icon"><CalendarDays size={20} /></span>
                <span>Atendimentos hoje</span>
                <strong>{todayCount}</strong>
                <small>Horários não cancelados</small>
              </article>
              <article className="metric-card">
                <span className="metric-icon"><UsersRound size={20} /></span>
                <span>Clientes cadastrados</span>
                <strong>{customers.length}</strong>
                <small>Com agendamento registrado</small>
              </article>
              <article className="metric-card">
                <span className="metric-icon"><Scissors size={20} /></span>
                <span>Agendamentos ativos</span>
                <strong>{activeCount}</strong>
                <small>Em todos os períodos</small>
              </article>
              <article className="metric-card">
                <span className="metric-icon"><Wallet size={20} /></span>
                <span>Valor agendado</span>
                <strong>{formatCurrency(revenue)}</strong>
                <small>Sem incluir cancelamentos</small>
              </article>
            </div>

            <section className="dashboard-panel">
              <div className="panel-header">
                <div><p className="dashboard-overline">ACOMPANHAMENTO</p><h2>Agendamentos recentes</h2></div>
                <button className="panel-link" onClick={() => setActiveSection("appointments")} type="button">Ver todos</button>
              </div>
              <AppointmentTable appointments={filteredAppointments.slice(0, 5)} onStatusChange={changeStatus} />
            </section>
          </>
        )}

        {activeSection === "appointments" && (
          <section className="dashboard-panel appointments-panel">
            <div className="panel-header">
              <div><p className="dashboard-overline">AGENDA</p><h2>Todos os agendamentos</h2></div>
              <label className="dashboard-search">
                <Search size={18} />
                <input
                  aria-label="Buscar agendamentos"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar cliente ou serviço"
                  value={search}
                />
              </label>
            </div>
            <AppointmentTable appointments={filteredAppointments} onStatusChange={changeStatus} />
          </section>
        )}

        {activeSection === "customers" && (
          <section className="dashboard-panel">
            <div className="panel-header">
              <div><p className="dashboard-overline">RELACIONAMENTO</p><h2>Clientes</h2></div>
              <span className="panel-count">{customers.length} cliente(s)</span>
            </div>
            {customers.length === 0 ? (
              <div className="dashboard-empty"><UsersRound size={28} /><strong>A lista ainda está vazia</strong><span>Os clientes aparecerão após o primeiro agendamento.</span></div>
            ) : (
              <div className="customer-list">
                {customers.map((customer) => (
                  <article className="customer-row" key={customer.customer_email || customer.customer_phone || customer.__backendId}>
                    <span className="customer-avatar">{(customer.customer_name || "C").charAt(0).toUpperCase()}</span>
                    <div><strong>{customer.customer_name || "Cliente"}</strong><span>{customer.customer_email || "E-mail não informado"}</span></div>
                    <span>{customer.customer_phone || "Telefone não informado"}</span>
                    <small>Último serviço: {customer.product_name}</small>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

      </section>
    </main>
  );
}
