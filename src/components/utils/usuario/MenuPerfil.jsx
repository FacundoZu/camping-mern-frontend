import React, { useState } from 'react'
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaUser } from "react-icons/fa";
import { TbLogout, TbHomeSearch } from "react-icons/tb";
import { IoHome } from "react-icons/io5";
import { MdDashboardCustomize } from 'react-icons/md';

export const MenuPerfil = ({ handleToggle = null }) => {

    const { auth } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        const response = await fetch('http://localhost:3900/api/user/logout', {
            method: 'GET',
            credentials: 'include',
        });
        if (response.status === 200) {
            navigate('/');
            window.location.reload();
        }
    };

    return (
        <div onClick={handleToggle} onMouseLeave={handleToggle} className='absolute top-20 right-2 bg-white rounded-xl p-3 z-50 shadow-lg animate-fade-top'>
            {auth && (
                <div className='flex flex-col'>

                    <div className='flex items-center pb-3'>
                        {auth.image ? (
                            <img
                                src={auth.image}
                                alt="Perfil"
                                className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
                            />
                        ) : (
                            <FaUser className="w-9 h-9 p-1 rounded-full border border-gray-300 shadow-sm text-gray-400" />
                        )}
                        <div className='flex flex-col ml-2 text-slate-700 w-44 box-border'>
                            <span className='text-slate-700 font-medium text-sm sm:text-base overflow-hidden whitespace-nowrap text-ellipsis'>
                                {auth.name}
                            </span>
                            <span className='text-slate-500 font-medium text-xs '>{auth.email}</span>
                        </div>
                    </div>

                    <hr />

                    {auth && auth.role == "admin" &&
                        <Link to='/admin/dashboard' className="menu-perfil-item">
                            <MdDashboardCustomize className='mr-1 text-slate-500 h-4 w-4' />
                            Dashboard
                        </Link>
                    }
                    <Link to='/perfil' className="menu-perfil-item">
                        <FaEdit className='mr-1 text-slate-500 h-4 w-4' />
                        Perfil
                    </Link>

                    <hr />

                    <button onClick={logout} className="menu-perfil-item">
                        <TbLogout className='mr-1 text-slate-500 h-4 w-4' />
                        Cerrar sesión
                    </button>
                </div>
            )}

        </div>
    );
}
