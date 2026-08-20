import MisDashboard from './components/MisDashboard';
import './styles.css';

// Standalone shell: lets the MIS team run this micro frontend on its own at
// http://localhost:3001 without booting the host portal.
export default function App() {
  return (
    <div className="mis-standalone">
      <header className="mis-standalone__bar">
        <span className="mis-standalone__badge">standalone</span>
        <strong>analytics-portal-mis</strong>
        <span className="mis-standalone__hint">
          served to the host as <code>analytics_portal_mis/MisDashboard</code>
        </span>
      </header>
      <MisDashboard />
    </div>
  );
}
