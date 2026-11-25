import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import { ROUTES } from './routes';
import { toolById } from './data/tools';

// Each page and tool is its own code chunk: visitors download only what they open.
const pageModules = import.meta.glob(['./pages/*.jsx', '!./pages/Home.jsx']);
const toolModules = import.meta.glob('./tools/*/*/index.jsx');

const cache = {};
const lazyOnce = (key, loader) => (cache[key] ||= lazy(loader));

export const moduleKeyFor = (route) =>
  route.tool ? `src/tools/${toolById[route.tool].module}/index.jsx` : `src/pages/${route.page}.jsx`;

function elementFor(route) {
  if (route.page === 'Home') return <Home />;
  if (route.tool) {
    const { module } = toolById[route.tool];
    const Tool = lazyOnce(module, toolModules[`./tools/${module}/index.jsx`]);
    return <Tool />;
  }
  const Page = lazyOnce(route.page, pageModules[`./pages/${route.page}.jsx`]);
  return <Page {...route.props} />;
}

const NotFound = lazyOnce('NotFound', pageModules['./pages/NotFound.jsx']);

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {ROUTES.map((r) => <Route key={r.path} path={r.path} element={elementFor(r)} />)}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
