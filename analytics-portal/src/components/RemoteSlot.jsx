import { Suspense } from 'react';
import RemoteErrorBoundary from './RemoteErrorBoundary';

// Standard wrapper for anything federated: error boundary outside, Suspense in.
export default function RemoteSlot({ name, fallback, children }) {
  return (
    <RemoteErrorBoundary name={name}>
      <Suspense fallback={fallback ?? <div className="ap-skeleton">Loading {name}…</div>}>
        {children}
      </Suspense>
    </RemoteErrorBoundary>
  );
}
