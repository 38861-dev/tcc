import "../styles/Dashboard.css";

export default function Dashboard() {
  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <span>Painel interno</span>
        <h2>Salão</h2>
        <button type="button">Agenda</button>
        <button type="button">Serviços</button>
        <button type="button">Clientes</button>
        <button type="button">Sair</button>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <span className="tag">Controle do salão</span>
          <h1>Visão geral</h1>
          <p>
            Painel simples para acompanhar movimentos, serviços e organização
            do salão.
          </p>
        </header>

        <div className="metrics-grid">
          <article className="metric-card">
            <div>
              <span>Agendamentos</span>
              <strong>12</strong>
            </div>
          </article>
          <article className="metric-card">
            <div>
              <span>Clientes</span>
              <strong>08</strong>
            </div>
          </article>
          <article className="metric-card">
            <div>
              <span>Serviços</span>
              <strong>06</strong>
            </div>
          </article>
          <article className="metric-card">
            <div>
              <span>Faturamento</span>
              <strong>R$ 1.240</strong>
            </div>
          </article>
        </div>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Agenda do dia</h2>
            <input type="text" placeholder="Buscar agendamento" />
          </div>

          <div className="company-grid">
            <article className="company-card">
              <div className="company-icon">✦</div>
              <div>
                <h3>Mariana Silva</h3>
                <p>Corte + Escova</p>
              </div>
              <span>09:00</span>
            </article>
            <article className="company-card">
              <div className="company-icon">✦</div>
              <div>
                <h3>Juliana Costa</h3>
                <p>Hidratação</p>
              </div>
              <span>10:30</span>
            </article>
            <article className="company-card">
              <div className="company-icon">✦</div>
              <div>
                <h3>Paula Mendes</h3>
                <p>Coloração</p>
              </div>
              <span>13:00</span>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
