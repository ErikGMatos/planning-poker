import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home/Home').then(module => ({ default: module.Home })));
const Room = lazy(() => import('./pages/Room/Room').then(module => ({ default: module.Room })));
const WebsocketEmpresaRefatorado = lazy(() => import('./pages/WebsocketEmpresaRefatorado/Home/Home').then(module => ({ default: module.WebsocketEmpresaRefatorado })));
const RefatoradoRoom = lazy(() => import('./pages/WebsocketEmpresaRefatorado/Room/Room').then(module => ({ default: module.RefatoradoRoom })));

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
