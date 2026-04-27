export function MetricCard({ icon: Icon, label, value, note, tone }) {
  return (
    <article className="metric-card">
      <div className="metric-head">
        <span>{label}</span>
        <span className={`metric-icon ${tone}`}>
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
      <p className="metric-value">{value}</p>
      <span className="metric-note">{note}</span>
    </article>
  );
}
