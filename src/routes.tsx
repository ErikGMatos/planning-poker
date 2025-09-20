import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Room } from './pages/Room';
import { WebsocketEmpresaRefatorado } from './pages/WebsocketEmpresaRefatorado/Home';
import { RefatoradoRoom } from './pages/WebsocketEmpresaRefatorado/Room/Room';

export const RoutesApp: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:id" element={<Room />} />
      <Route path="/refatorado" element={<WebsocketEmpresaRefatorado />} />
      <Route path="/refatorado-room/:id" element={<RefatoradoRoom />} />
    </Routes>
  );
};
