import { HashRouter } from 'react-router-dom';

import './App.css';
import { ThemeToggle } from './components/ThemeToggle';
import { RoutesApp } from './routes';

export const App: React.FC = () => {
  return (
    <HashRouter
      // basename="/planning-poker/"
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <RoutesApp />
      <ThemeToggle />
    </HashRouter>
  );
};
