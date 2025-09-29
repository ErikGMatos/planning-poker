import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { WebsocketProvider } from './planning-rooms/context/WebsocketContext';
import { PlanningHome } from './planning-rooms/pages/Home/Home';
import { PlanningRoom } from './planning-rooms/pages/Room/Room';
// import { Home } from './planning-rooms-liveblocks/Home/Home';
// import { Room } from './planning-rooms-liveblocks/Room/Room';

export const RoutesApp: React.FC = () => {
  return (
    <WebsocketProvider>
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} /> */}
        <Route path="/planning" element={<PlanningHome />} />
        <Route path="/planning/room/:id" element={<PlanningRoom />} />
        <Route path="*" element={<Navigate to="/planning" />} />
      </Routes>
    </WebsocketProvider>
  );
};
