export default function MetricCard({ title, value, icon: Icon }) {
  return (
    <div className="metric-card">
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
      <Icon size={34} />
    </div>
  );
}
