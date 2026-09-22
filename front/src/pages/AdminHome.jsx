import { LogOut } from "lucide-react";
import "../styles/AdminHome.css";

export default function AdminHome({ setPage }) {
  return (
    <main className="admin-page">
      <section className="admin-card">
        <span className="tag">Painel interno</span>
        <h1>Área Administrativa</h1>
        <p>
          Bem-vindo(a) de volta! Aqui você vai acompanhar agendamentos,
          serviços e a organização do salão.
        </p>

        <button type="button" className="admin-logout" onClick={() => setPage("home")}>
          <LogOut size={18} />
          Sair
        </button>
      </section>
    </main>
  );
}
