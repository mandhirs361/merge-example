import './kpi-card.css';

export default function KpiCard({ label, value, delta }) {
  const trend = delta >= 0 ? 'up' : 'down';

  return (
    <article className="mis-kpi">
      <p className="mis-kpi__label">{label}</p>
      <p className="mis-kpi__value">{value}</p>
      {typeof delta === 'number' && (
        <p className={`mis-kpi__delta mis-kpi__delta--${trend}`}>
          {trend === 'up' ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}% vs last month
        </p>
      )}
    </article>
  );
}
