# Analytics Portal — React Micro Frontend (Webpack 5 Module Federation)

A two-app micro frontend setup:

| App | Role | Port | Federation name |
| --- | --- | --- | --- |
| `analytics-portal` | **Host** — shell, navigation, layout | 3000 | `analytics_portal` |
| `analytics-portal-mis` | **Remote** — MIS dashboard components | 3001 | `analytics_portal_mis` |

The host compiles **no MIS code**. It loads `remoteEntry.js` from the MIS app at
runtime, so a new `analytics-portal-mis` build shows up in `analytics-portal` on
the next page load — no host rebuild, no redeploy, no version bump.

## Quick start

```bash
npm install          # installs both workspaces
npm start            # runs the remote (:3001) and the host (:3000) together
```

Open http://localhost:3000. The MIS app also runs standalone at http://localhost:3001.

> Start order matters at page load, not at build time: if the remote is not up,
> the host still renders and shows a retry panel in the federated slot.

## What the remote exposes

`analytics-portal-mis/webpack.config.js`:

```js
exposes: {
  './MisDashboard': './src/components/MisDashboard.jsx', // full page
  './KpiCard':      './src/components/KpiCard.jsx',      // single component
  './RevenueTable': './src/components/RevenueTable.jsx',
  './misService':   './src/services/misService.js',      // non-component module
}
```

## How the host consumes it

`analytics-portal/webpack.config.js`:

```js
remotes: {
  analytics_portal_mis: `analytics_portal_mis@${MIS_REMOTE_URL}`,
}
```

`analytics-portal/src/remotes/misRemote.js` is the single place remote imports live:

```js
export const MisDashboard = lazy(() => import('analytics_portal_mis/MisDashboard'));
export const loadMisService = () => import('analytics_portal_mis/misService');
```

Every federated import is wrapped in `RemoteSlot` (`Suspense` + an error
boundary), so a remote that is down degrades one panel instead of the portal.

## See the live wiring

1. `npm start`
2. Open http://localhost:3000 (both the **Overview** and **MIS** tabs render remote components)
3. Edit `analytics-portal-mis/src/components/KpiCard.jsx` — change a colour or label
4. Save. The MIS dev server rebuilds; **reload :3000** and the change is there.

The host process is never restarted or rebuilt.

## Production

```bash
npm run build     # builds the remote, then the host
npm run serve     # serves both dist/ folders (:3001 remote, :3000 host)
```

Deploy them independently. Point the host at wherever the remote is published:

```bash
cp analytics-portal/.env.example analytics-portal/.env
# MIS_REMOTE_URL=https://mis.cdn.example.com/remoteEntry.js
```

Because the URL is resolved at runtime, re-publishing `remoteEntry.js` is the
whole deploy for a MIS-only change. Serve `remoteEntry.js` with permissive CORS
and short cache headers (the hashed chunks it points at can cache forever).

## Key mechanics worth knowing

- **Async boundary** — `src/index.js` in both apps is just `import('./bootstrap')`.
  Without it, `react` is pulled in before the shared scope is initialised and
  federation fails at runtime.
- **Shared singletons** — `react` and `react-dom` are `singleton: true` in both
  configs. Two React copies would break hooks the moment a remote component
  renders inside host state.
- **`publicPath: 'auto'`** — makes the remote's lazy chunks resolve against
  `:3001` instead of the host's origin.
- **Names must match** — the remote's `name` (`analytics_portal_mis`) is the key
  the host uses in `remotes` and the prefix in every `import`.

## Layout

```
merge-example/
├── analytics-portal/            # HOST
│   ├── src/remotes/misRemote.js     # all federated imports
│   ├── src/components/RemoteSlot.jsx
│   │   └── RemoteErrorBoundary.jsx
│   ├── src/components/HostOverview.jsx  # host page using remote KpiCard + misService
│   ├── src/components/MisPage.jsx       # host frame around remote MisDashboard
│   └── webpack.config.js            # remotes + shared
└── analytics-portal-mis/        # REMOTE
    ├── src/App.jsx                  # standalone dev shell
    ├── src/components/              # exposed components
    ├── src/services/misService.js   # exposed data module
    └── webpack.config.js            # exposes + shared
```
