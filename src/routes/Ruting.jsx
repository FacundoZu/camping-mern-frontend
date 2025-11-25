import React from 'react'
import { Home } from '../components/views/home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import { Layout } from '../components/layout/Layout'
import { Login } from '../components/views/usuario/Login'
import { Register } from '../components/views/usuario/Register'
import { Cabaña } from '../components/views/cabañas/Cabaña'
import { Cabañas } from '../components/views/cabañas/Cabañas'
import { Perfil } from '../components/views/usuario/Perfil'
import { LayoutAdmin } from '../components/admin/adminLayout/LayoutAdmin'
import { AdminDashboard } from '../components/admin/views/AdminDashboard'
import { AdminCabaña } from '../components/admin/views/cabañas/AdminCabaña'
import { AdminCrearCabaña } from '../components/admin/views/cabañas/AdminCrearCabaña'
import { AdminEditarCabaña } from '../components/admin/views/cabañas/AdminEditarCabaña'
import { AdminServicios } from '../components/admin/views/servicios/AdminServicios'

import { AdminCrearServicio } from '../components/admin/views/servicios/AdminCrearServicio'
import { AdminEditarServicio } from '../components/admin/views/servicios/AdminEditarServicio'
import { AdminActividades } from '../components/admin/views/actividades/AdminActividades'
import { AdminCrearActividad } from '../components/admin/views/actividades/AdminCrearActividad'
import { AdminEditarActividad } from '../components/admin/views/actividades/AdminEditarActividad'
import { AdminPreguntas } from '../components/admin/views/preguntas/AdminPreguntas'
import { AdminCrearPregunta } from '../components/admin/views/preguntas/AdminCrearPregunta'
import { AdminEditarPregunta } from '../components/admin/views/preguntas/AdminEditarPregunta'

import AdminVerCabaña from '../components/admin/views/cabañas/AdminVerCabaña'
import { AdminUsuarios } from '../components/admin/views/usuarios/AdminUsuarios'
import { AdminEditarUsuario } from '../components/admin/views/usuarios/AdminEditarUsuario'
import { ToastContainer } from 'react-toastify'
import ReservaExitosa from '../components/views/pagoReserva/ReservaExitosa'
import ReservaFallida from '../components/views/pagoReserva/ReservaFallida'
import ReservaPendiente from '../components/views/pagoReserva/ReservaPendiente'
import { ResetPassword } from '../components/views/usuario/ResetPassword'
import { NewPasswordView } from '../components/views/usuario/NewPasswordView'
import { NewPasswordForm } from '../components/utils/auth/NewPasswordForm'
import AdminAcampantes from '../components/admin/views/acampantes/AdminAcampantes'
import AdminCrearAcampante from '../components/admin/views/acampantes/AdminCrearAcampante'
import AdminCrearReserva from '../components/admin/views/reserva/AdminCrearReserva'
import { AdminCrearCupon } from '../components/admin/views/cupones/AdminCrearCupon'
import { AdminCupones } from '../components/admin/views/cupones/AdminCupones'
import { AdminReservas } from '../components/admin/views/reservas/AdminReservas'
import AdminVerReserva from '../components/admin/views/reservas/AdminVerReserva'


export const Routing = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/cabañas' element={<Cabañas />} />
          <Route path='/cabaña/:id' element={<Cabaña />} />
          <Route path='/Perfil' element={<PrivateRoute ><Perfil /></PrivateRoute>} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/newPassword' element={<NewPasswordView />} />
        <Route path='/newPassword/:token' element={<NewPasswordForm />} />

        <Route path="/reserva-exitosa" element={<ReservaExitosa />} />
        <Route path="/reserva-fallida" element={<ReservaFallida />} />
        <Route path="/reserva-pendiente" element={<ReservaPendiente />} />

        <Route element={<PrivateRoute requiredRoles={['admin', 'gerente']}><LayoutAdmin /></PrivateRoute>}>

          <Route path="/admin/dashboard" element={<PrivateRoute requiredRoles={['admin']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/usuarios" element={<PrivateRoute requiredRoles={['admin']}><AdminUsuarios /></PrivateRoute>} />
          <Route path="/admin/EditarUsuario/:id" element={<PrivateRoute requiredRoles={['admin']}><AdminEditarUsuario /></PrivateRoute>} />

          <Route path="/admin/cabañas" element={<AdminCabaña />} />
          <Route path="/admin/CrearCabaña" element={<AdminCrearCabaña />} />
          <Route path="/admin/EditarCabaña/:id" element={<AdminEditarCabaña />} />
          <Route path="/admin/VerCabaña/:id" element={<AdminVerCabaña />} />

          <Route path="/admin/acampantes" element={<AdminAcampantes />} />
          <Route path="/admin/CrearAcampante" element={<AdminCrearAcampante />} />

          <Route path="/admin/reserva/:id" element={<AdminCrearReserva />} />

          <Route path="/admin/servicios" element={<AdminServicios />} />
          <Route path="/admin/CrearServicio" element={<AdminCrearServicio />} />
          <Route path="/admin/EditarServicio/:id" element={<AdminEditarServicio />} />

          <Route path="/admin/actividades" element={<AdminActividades />} />
          <Route path="/admin/CrearActividad" element={<AdminCrearActividad />} />
          <Route path="/admin/EditarActividad/:id" element={<AdminEditarActividad />} />

          <Route path="/admin/preguntas" element={<AdminPreguntas />} />
          <Route path="/admin/CrearPregunta" element={<AdminCrearPregunta />} />
          <Route path="/admin/EditarPregunta/:id" element={<AdminEditarPregunta />} />

          <Route path="/admin/cupones" element={<AdminCupones />} />
          <Route path="/admin/CrearCupon" element={<AdminCrearCupon />} />

          <Route path="/admin/reservas" element={<PrivateRoute requiredRoles={['admin']}><AdminReservas /></PrivateRoute>} />
          <Route path="/admin/VerReserva/:id" element={<PrivateRoute requiredRoles={['admin']}><AdminVerReserva /></PrivateRoute>} />
        </Route>

      </Routes>

      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />

    </BrowserRouter>
  )
}
