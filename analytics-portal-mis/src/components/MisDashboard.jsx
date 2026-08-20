import { useMemo } from 'react';
import KpiCard from './KpiCard';
import RevenueTable from './RevenueTable';
import { getKpis, getRegionalRevenue } from '../services/misService';
import './mis-dashboard.css';

export default function MisDashboard({ title = 'MIS Overview' }) {
  const kpis = useMemo(() => getKpis(), []);
  const rows = useMemo(() => getRegionalRevenue(), []);

  return (
    <section className="mis-dashboard">
      <header className="mis-dashboard__head">
        <div>
          <h2 className="mis-dashboard__title">{title}</h2>
          <p className="mis-dashboard__subtitle">
            Served by <code>analytics-portal-mis</code> · Module Federation remote
          </p>
        </div>
        <span className="mis-dashboard__stamp">Rebuilt {new Date().toLocaleTimeString()}</span>
      </header>

      <div className="mis-dashboard__kpis">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id} label={kpi.label} value={kpi.value} delta={kpi.delta} />
        ))}
      </div>

      <RevenueTable rows={rows} />
    </section>
  );
}
