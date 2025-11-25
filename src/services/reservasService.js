import { Peticion } from '../helpers/Peticion';
import { Global } from '../helpers/Global';

export const reservasService = {
    getAllReservations: async (page = 1, filtros = {}) => {
        let url = `${Global.url}reservation/getAllReservations?page=${page}&limit=9`;

        if (filtros.estado) url += `&estado=${filtros.estado}`;
        if (filtros.usuario) url += `&usuario=${filtros.usuario}`;

        const { datos } = await Peticion(url, 'GET', null, false, 'include');
        return datos;
    },

    getReservationById: async (id) => {
        const url = `${Global.url}reservation/getReservation/${id}`;
        const { datos } = await Peticion(url, 'GET', null, false, 'include');
        return datos;
    }
};
