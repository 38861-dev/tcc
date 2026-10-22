import { MapPin } from "lucide-react";
import { salonHours } from "../data/salonData";

export default function SalonInfo() {
  return (
    <section className="salon-info-section" aria-labelledby="salon-info-title">
      <div className="container salon-info-grid">
        <div className="hours-panel">
          <div className="hours-heading">
            <h3 id="salon-info-title">Horários de funcionamento</h3>
          </div>
          <div className="hours-list">
            {salonHours.map((hours) => (
              <div className="hours-row" key={hours.label}>
                <span>{hours.label}</span>
                <strong>{hours.openingTime} - {hours.closingTime}</strong>
              </div>
            ))}
            <div className="hours-row"><span>Domingo</span><strong>Fechado</strong></div>
            <div className="hours-row"><span>Segunda</span><strong>Fechado</strong></div>
          </div>
          <a
            className="address-link"
            href="https://www.google.com/maps/search/?api=1&query=Alameda%20dos%20Vidoeiros%2C%20455%20loja%2033%20Gramado%20Mall"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin size={17} /> Alameda dos Vidoeiros, 455 loja 33, Gramado Mall
          </a>
        </div>
      </div>
    </section>
  );
}
