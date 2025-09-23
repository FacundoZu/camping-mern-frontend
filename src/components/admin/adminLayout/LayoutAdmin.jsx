import React from 'react';
import 'react-toastify/dist/ReactToastify.css'
import { Outlet } from 'react-router-dom';

import AsideAdmin from './AsideAdmin';

export const LayoutAdmin = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo */}
      <AsideAdmin />

      {/* Contenido principal con scroll */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};
