// Async boundary: the shared scope must be initialised before any shared module
// (react / react-dom) or any federated remote is imported.
import('./bootstrap');
