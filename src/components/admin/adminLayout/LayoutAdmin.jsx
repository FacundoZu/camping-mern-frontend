import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUsers, FiSettings, FiActivity, FiHelpCircle } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import 'react-toastify/dist/ReactToastify.css'
import { RiLeafFill } from "react-icons/ri";

export const LayoutAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { auth, loading } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex">
        <button
          className={`text-2xl p-4 text-white lg:hidden fixed top-4 left-4 z-50 bg-gray-800 rounded-lg ${isSidebarOpen ? 'translate-x-64 transition-all' : 'transition-all duration-300'}`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>

        <aside
          className={`fixed inset-y-0 left-0 top-0 z-40 w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:transform-none`}
        >
          <div className="flex flex-col h-screen sticky justify-between top-0 p-4">
            <div>
              <h1 className='font-bold text-sm sm:text-xl flex items-center my-4'>
                <RiLeafFill className='text-lime-600 justify-center mr-1 h-8 w-8' />
                <span className='text-slate-300 text-sm sm:text-xl'>Camping</span>
                <span className='text-slate-500 text-sm sm:text-xl'>Cachi</span>
              </h1>
              <nav>
                <ul>
                  {auth.role === 'admin' && (
                    <>
                      <li className="mb-4">
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-all"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <FiHome className="mr-2" /> Dashboard
                        </Link>
                      </li>
                      <li className="mb-4">
                        <Link
                          to="/admin/usuarios"
                          className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-all"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <FiUsers className="mr-2" /> Usuarios
                        </Link>
                      </li>
                    </>
                  )}
                  {auth.role === 'admin' || auth.role === 'gerente' ? (
                    <>
                      <li className="mb-4">
                        <Link
                          to="/admin/cabañas"
                          className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-all"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <FiHome className="mr-2" /> Cabañas
                        </Link>
                      </li>
                      <li className="mb-4">
                        <Link
                          to="/admin/servicios"
                          className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-all"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <FiSettings className="mr-2" /> Servicios
                        </Link>
                      </li>
                      <li className="mb-4">
                        <Link
                          to="/admin/actividades"
                          className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-all"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <FiActivity className="mr-2" /> Actividades
                        </Link>
                      </li>
                      <li className="mb-4">
                        <Link
                          to="/admin/preguntas"
                          className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-all"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <FiHelpCircle className="mr-2" /> Preguntas
                        </Link>
                      </li>
                    </>
                  ) : null}
                </ul>
              </nav>
            </div>

            <div>
              <div className='pb-4 text-center'>
                <Link to="/" className="text-white hover:underline hidden sm:inline font-medium">
                  <p >Volver a la página</p>
                </Link>
              </div>
              <div className="flex items-center pt-4 border-t border-gray-700">
                <div className='m-auto flex gap-4'>
                  {auth.image ? (
                    <img
                      src={auth.image}
                      alt="Perfil"
                      className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                    />
                  ) : (
                    <FaUser className="w-9 h-9 p-1 rounded-full border border-gray-300 shadow-sm text-gray-400" />
                  )}
                  <p className="text-lime-600 font-medium text-sm m-auto">
                    {auth.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 py-6 px-4 bg-gray-100 overflow-y-auto ">
          <Outlet />
        </main>
      </div>


    </div>
  );
};