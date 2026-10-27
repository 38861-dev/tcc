import "../styles/AgendaPanel.css";

export default function AgendaPanel() {
  return (
    <main className="agenda-panel">
      <section className="agenda-hero">
        <span className="tag">Painel interno</span>
        <h1>Agenda do salão</h1>
        <p>
          Visual simples para organizar horários, serviços e atendimentos do
          dia.
        </p>
      </section>

      <section className="agenda-grid">
        <article className="agenda-card">
          <span>Horários de hoje</span>
          <strong>12</strong>
        </article>
        <article className="agenda-card">
          <span>Serviços agendados</span>
          <strong>08</strong>
        </article>
        <article className="agenda-card">
          <span>Clientes confirmados</span>
          <strong>09</strong>
        </article>
      </section>
    </main>
  );
}
