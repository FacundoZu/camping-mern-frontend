import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';

const locales = {
    es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const obtenerUsuarioPorId = async (usuarioId) => {
    try {
        const urlUser = `${Global.url}user/profile/${usuarioId}`;
        const response = await Peticion(urlUser, "GET", '', false, 'include');

        if (response.datos.status === 'success') {
            return response.datos.user.email;
        }
        return 'Usuario desconocido';
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return 'Usuario desconocido';
    }
};

export const CalendarioConReservas = ({ reservas }) => {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        const obtenerEventos = async () => {
            if (!reservas || reservas.length === 0) {
                setEventos([]);
                return;
            }

            const eventosFormateados = await Promise.all(reservas.map(async (reserva) => {
                const emailUsuario = await obtenerUsuarioPorId(reserva.usuarioId);

                return {
                    title: `Reservado`,
                    usuario: emailUsuario,
                    start: new Date(reserva.fechaInicio),
                    end: new Date(reserva.fechaFinal),
                    allDay: true,
                };
            }));
            setEventos(eventosFormateados);
        };

        obtenerEventos();
    }, [reservas]);

    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: '#47569',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
        };
        return {
            style,
        };
    };

    const renderEventContent = (event) => {

        return (
            <div>
                <strong>{event.title}</strong>
                <br />
                <span>Usuario: {event.event.usuario}</span>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-6">Calendario de Reservas</h2>
            <div className="p-4">
                <div className="h-[500px] lg:h-[600px] md:h-[500px] sm:h-[400px] xs:h-[350px]">
                    <Calendar
                        localizer={localizer}
                        events={eventos}
                        startAccessor="start"
                        endAccessor="end"
                        views={['month']}
                        defaultView="month"
                        culture="es"
                        messages={{
                            next: 'Sig',
                            previous: 'Ant',
                            today: 'Hoy',
                            month: 'Mes',
                            week: 'Semana',
                            day: 'Día',
                            agenda: 'Agenda',
                            date: 'Fecha',
                            time: 'Hora',
                            event: 'Evento',
                            noEventsInRange: 'No hay eventos en este rango.',
                        }}
                        eventPropGetter={eventStyleGetter}
                        selectable={false}
                        components={{
                            event: renderEventContent,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
