import { Component } from 'react';

// A remote is a network dependency: if analytics-portal-mis is down or its
// remoteEntry.js moved, only this slot should fail — never the whole portal.
export default class RemoteErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[analytics-portal] remote failed to load', error, info);
  }

  render() {
    const { error } = this.state;
    const { name, children } = this.props;

    if (!error) return children;

    return (
      <div className="ap-remote-error">
        <h3 className="ap-remote-error__title">Could not load “{name}”</h3>
        <p className="ap-remote-error__body">
          The micro frontend did not respond. Make sure <code>analytics-portal-mis</code> is
          running and serving <code>remoteEntry.js</code>.
        </p>
        <pre className="ap-remote-error__detail">{String(error.message || error)}</pre>
        <button className="ap-btn" type="button" onClick={() => this.setState({ error: null })}>
          Retry
        </button>
      </div>
    );
  }
}
