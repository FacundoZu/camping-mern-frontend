import React, { useEffect, useState } from 'react'
import { RiLeafFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { MenuPerfil } from '../utils/usuario/MenuPerfil';
import { CgDetailsMore } from "react-icons/cg";
import { MdDashboardCustomize } from "react-icons/md";
import { IoLogIn } from "react-icons/io5";


export default function Header() {

  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const [menu, setMenu] = useState(false);
  const { auth, loading } = useAuth();

  useEffect(() => {
    setMenu(false)
  }, [])

  const handleToggle = () => {
    setMenu(!menu)
  }

  return (
    <header className='fixed w-full p-2 z-50'>
      <div className='flex items-center gap-6 sticky top-0 justify-between w-full md:w-5/6 mx-auto p-3 bg-white rounded-xl animate-fade-top'>
        <Link to="/">
          <h1 className='font-bold text-sm sm:text-xl flex items-center'>
            <RiLeafFill className='text-lime-600 justify-center mr-1 h-8 w-8' />
            <span className='text-slate-500 text-sm sm:text-xl'>Camping</span>
            <span className='text-slate-700 text-sm sm:text-xl'>Cachi</span>
          </h1>
        </Link>

        <ul className='relative flex items-center gap-1'>
          <>
            <a href="/#reservar" className="text-slate-600 hidden sm:inline font-medium">
              <div className='flex items-center border-[1.5px] border-transparent rounded-lg p-2 hover:border-gray-600 transition-all duration-400'>
                <li>Buscar Cabaña</li>
              </div>
            </a>

            <a href="/#eventos" className="text-slate-600 hidden sm:inline font-medium">
              <div className='flex items-center border-[1.5px] border-transparent rounded-lg p-2 hover:border-gray-600 transition-all duration-400'>
                <li>Eventos</li>
              </div>
            </a>

            <a href="/#ubicacion" className="text-slate-600 hidden sm:inline font-medium">
              <div className='flex items-center border-[1.5px] border-transparent rounded-lg p-2 hover:border-gray-600 transition-all duration-400'>
                <li>Ubicación</li>
              </div>
            </a>

            <a href="/#preguntas" className="text-slate-600 hidden sm:inline font-medium">
              <div className='flex items-center border-[1.5px] border-transparent rounded-lg p-2 hover:border-gray-600 transition-all duration-400'>
                <li>Preguntas</li>
              </div>
            </a>

            <a href="/#contacto" className="text-slate-600 hidden sm:inline font-medium">
              <div className='flex items-center border-[1.5px] border-transparent rounded-lg p-2 hover:border-gray-600 transition-all duration-400'>
                <li>Contacto</li>
              </div>
            </a>
          </>
        </ul>


        <div>
          <button onClick={handleToggle} className="text-slate-700 sm:hidden p-1 rounded-lg flex items-center justify-center bg-slate-300 active:bg-slate-400">
            <CgDetailsMore className='w-7 h-7' />
          </button>

          {menu && (
            <MenuPerfil handleToggle={handleToggle} />
          )}

          {auth && !loading ? (

            <div onClick={handleToggle} className="flex items-center gap-4 cursor-pointer">

              <p className="relative text-lime-600 font-bold text-sm hidden sm:inline">
                {auth.name}
              </p>
              <div className='hidden lg:inline sixe-10'>
                {auth.image ? (
                  <img src={auth.image} alt="Perfil" className="w-10 h-10 rounded-full border border-gray-300 shadow-sm" />
                ) : (
                  <FaUser className="w-9 h-9 p-1 rounded-full border border-gray-300 shadow-sm text-gray-400" />
                )}
              </div>

            </div>
          ) : (
            <ul className='relative flex items-center'>
              <Link to="/login" className="text-lime-600 font-bold hidden sm:inline transition duration-200 pr-2">
                <div className='flex items-center border-[1.5px] border-transparent rounded-lg py-2 px-2 hover:border-lime-600 transition-all duration-400'>
                  <IoLogIn className='mr-1' size={20} />
                  <li>Iniciar sesión</li>
                </div>
              </Link>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
