export default function ReadingCard({ reading }) {
  return (
    <div className="reading-card">
      <div>
        <strong>{reading.customer}</strong>
        <p>{reading.service.name}</p>
      </div>
      <div>
        <span>{reading.datetime}</span>
      </div>
    </div>
  );
}
