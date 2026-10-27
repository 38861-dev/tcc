import { Building2, ChevronRight } from "lucide-react";

export default function CompanyCard({ company, onClick }) {
  return (
    <button className="company-card" onClick={() => onClick(company)}>
      <div className="company-icon">
        <Building2 size={28} />
      </div>

      <div>
        <h3>{company.name}</h3>
        <p>{company.description}</p>
        <span>{company.duration} • R$ {company.price.toFixed(2).replace('.', ',')}</span>
      </div>

      <ChevronRight />
    </button>
  );
}
