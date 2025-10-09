import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { WebsocketProvider } from '@/planning-rooms/context/WebsocketContext';
import { PlanningHome } from '@/planning-rooms/pages/Home/Home';
import { PlanningRoom } from '@/planning-rooms/pages/Room/Room';

export const RoutesApp: React.FC = () => {
  return (
    <WebsocketProvider>
      <Routes>
        <Route path="/" element={<PlanningHome />} />
        <Route path="/home" element={<PlanningHome />} />
        <Route path="/room/:id" element={<PlanningRoom />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </WebsocketProvider>
  );
};
