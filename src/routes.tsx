import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { WebsocketProvider } from './pages/planning-rooms/context/WebsocketContext';

const Home = lazy(() =>
  import('./pages/Home/Home').then(module => ({ default: module.Home }))
);
const Room = lazy(() =>
  import('./pages/Room/Room').then(module => ({ default: module.Room }))
);
const PlanningHome = lazy(() =>
  import('./pages/planning-rooms/pages/Home/Home').then(module => ({
    default: module.PlanningHome,
  }))
);
const PlanningRoom = lazy(() =>
  import('./pages/planning-rooms/pages/Room/Room').then(module => ({
    default: module.PlanningRoom,
  }))
);

export const RoutesApp: React.FC = () => {
  return (
    <WebsocketProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/planning" element={<PlanningHome />} />
        <Route path="/planning/room/:id" element={<PlanningRoom />} />
      </Routes>
    </WebsocketProvider>
  );
};
