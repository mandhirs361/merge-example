// Module Federation requires an async boundary before any shared module is
// touched, so the shared scope (react, react-dom) can be negotiated first.
import('./bootstrap');
