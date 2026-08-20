import { lazy } from 'react';

// Every import below is resolved at runtime from analytics-portal-mis's
// remoteEntry.js. Nothing from the MIS bundle is compiled into this host — a new
// MIS build is picked up on the next page load.
export const MisDashboard = lazy(() => import('analytics_portal_mis/MisDashboard'));
export const KpiCard = lazy(() => import('analytics_portal_mis/KpiCard'));
export const RevenueTable = lazy(() => import('analytics_portal_mis/RevenueTable'));

// Non-component modules can be federated too — this pulls the MIS domain logic
// so the host renders the exact same numbers without reimplementing them.
export const loadMisService = () => import('analytics_portal_mis/misService');

export const MIS_REMOTE_URL = process.env.MIS_REMOTE_URL;
