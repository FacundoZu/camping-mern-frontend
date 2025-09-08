import React, { useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';

import { CgDetailsMore } from "react-icons/cg";
import useAuth from '../../../hooks/useAuth';
import { MenuPerfil } from '../../utils/usuario/MenuPerfil';


export default function Header() {

  const [menu, setMenu] = useState(false);
  const { auth, loading } = useAuth();

  useEffect(() => {
    setMenu(false)
  }, [])

  const handleToggle = () => {
    setMenu(!menu)
  }

  return (
    <header className=' bg-gray-900 shadow-md'>
      <div className='text-balance p-3'>
        <ul className='flex items-center gap-6 relative justify-end container px-8 '>
          <Link to="/" className="text-white hover:underline hidden sm:inline font-medium">
            <li>Home</li>
          </Link>
          <Link to="/cabañas" className="text-white hover:underline hidden sm:inline font-medium">
            <li>Cabañas</li>
          </Link>

          <button onClick={handleToggle} className="text-white sm:hidden p-1 rounded-lg flex items-center justify-center bg-slate-300 active:bg-slate-400">
            <CgDetailsMore className='w-7 h-7' />
          </button>
          {menu && (
            <MenuPerfil handleToggle={handleToggle} />
          )}

          {auth && !loading && 

            <div onClick={handleToggle} className="flex items-center gap-4 cursor-pointer">

              <p  className="relative text-lime-600 font-medium text-sm hidden sm:inline">
                {auth.name}
              </p>
              <div className='hidden sm:inline'>
                {auth.image ? (
                  <img src={auth.image} alt="Perfil" className="w-10 h-10 rounded-full border border-gray-300 shadow-sm" />
                ) : (
                  <FaUser className="w-9 h-9 p-1 rounded-full border border-gray-300 shadow-sm text-gray-400" />
                )}
              </div>

            </div>}
        </ul>
      </div>
    </header>
  );
}
