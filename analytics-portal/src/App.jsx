import { useState } from 'react';
import HostOverview from './components/HostOverview';
import MisPage from './components/MisPage';
import { MIS_REMOTE_URL } from './remotes/misRemote';
import './styles.css';

const TABS = [
  { id: 'overview', label: 'Overview', render: () => <HostOverview /> },
  { id: 'mis', label: 'MIS', render: () => <MisPage /> },
];

export default function App() {
  const [active, setActive] = useState('overview');
  const tab = TABS.find((entry) => entry.id === active);

  return (
    <div className="ap-shell">
      <header className="ap-header">
        <div className="ap-header__brand">
          <span className="ap-header__mark">AP</span>
          <div>
            <h1 className="ap-header__title">Analytics Portal</h1>
            <p className="ap-header__sub">host application</p>
          </div>
        </div>

        <nav className="ap-nav">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`ap-nav__item${entry.id === active ? ' ap-nav__item--active' : ''}`}
              onClick={() => setActive(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="ap-main">{tab.render()}</main>

      <footer className="ap-footer">
        remote <code>analytics_portal_mis</code> → <code>{MIS_REMOTE_URL}</code>
      </footer>
    </div>
  );
}
