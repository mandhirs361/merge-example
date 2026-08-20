import { useEffect, useState } from 'react';
import RemoteSlot from './RemoteSlot';
import { KpiCard, loadMisService } from '../remotes/misRemote';

// Host-owned page that borrows two things from the remote: the KpiCard component
// and the MIS data service. Both arrive over the network at runtime.
export default function HostOverview() {
  const [kpis, setKpis] = useState(null);
  const [serviceError, setServiceError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadMisService()
      .then((mis) => {
        if (!cancelled) setKpis(mis.getKpis().slice(0, 3));
      })
      .catch((error) => {
        if (!cancelled) setServiceError(error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="ap-page">
      <h2 className="ap-page__title">Portfolio overview</h2>
      <p className="ap-page__lede">
        This page belongs to <code>analytics-portal</code>. The cards below are rendered with
        the <code>KpiCard</code> component and the <code>misService</code> data module, both
        federated from <code>analytics-portal-mis</code>.
      </p>

      {serviceError && (
        <p className="ap-inline-error">MIS data service unavailable: {String(serviceError.message)}</p>
      )}

      <RemoteSlot name="MIS KPI cards">
        <div className="ap-kpi-row">
          {(kpis ?? []).map((kpi) => (
            <KpiCard key={kpi.id} label={kpi.label} value={kpi.value} delta={kpi.delta} />
          ))}
        </div>
      </RemoteSlot>

      <div className="ap-note">
        <strong>Try it:</strong> edit <code>analytics-portal-mis/src/components/KpiCard.jsx</code>
        , then reload this page — the change shows up here without rebuilding the host.
      </div>
    </section>
  );
}
