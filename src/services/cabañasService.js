// Servicio para manejar operaciones relacionadas con cabañas

const API_URL = '/api/cabañas';

export class CabañasService {
    // Obtener todas las cabañas con filtros
    static async getAll(filtros = {}) {
        try {
            const params = new URLSearchParams();
            Object.entries(filtros).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });
            
            const response = await fetch(`${API_URL}?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Error al obtener las cabañas');
            }
            return response.json();
        } catch (error) {
            console.error('Error en getAll:', error);
            throw error;
        }
    }

    // Obtener una cabaña específica
    static async getById(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener la cabaña');
            }
            return response.json();
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    }

    // Crear una nueva cabaña
    static async create(cabañaData) {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cabañaData),
            });
            if (!response.ok) {
                throw new Error('Error al crear la cabaña');
            }
            return response.json();
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    // Actualizar una cabaña
    static async update(id, cabañaData) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cabañaData),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar la cabaña');
            }
            return response.json();
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    // Eliminar una cabaña
    static async delete(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar la cabaña');
            }
            return response.json();
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    // Verificar disponibilidad
    static async checkAvailability(id, fechaInicio, fechaFin) {
        try {
            const response = await fetch(`${API_URL}/${id}/availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fechaInicio, fechaFin }),
            });
            if (!response.ok) {
                throw new Error('Error al verificar disponibilidad');
            }
            return response.json();
        } catch (error) {
            console.error('Error en checkAvailability:', error);
            throw error;
        }
    }

    // Obtener opciones dinámicas para filtros
    static async getFilterOptions(todasLasCabañas) {
        try {
            const capacidades = [...new Set(todasLasCabañas.map((c) => c.cantidadPersonas))];
            const habitaciones = [...new Set(todasLasCabañas.map((c) => c.cantidadHabitaciones))];
            const baños = [...new Set(todasLasCabañas.map((c) => c.cantidadBaños))];

            return {
                capacidades: capacidades.sort((a, b) => a - b),
                habitaciones: habitaciones.sort((a, b) => a - b),
                baños: baños.sort((a, b) => a - b)
            };
        } catch (error) {
            console.error('Error en getFilterOptions:', error);
            throw error;
        }
    }

    // Filtrar cabañas por disponibilidad
    static async filterByAvailability(cabañas, fechaInicio, fechaFin) {
        try {
            const availableCabañas = await Promise.all(
                cabañas.map(async (cabaña) => {
                    const isAvailable = await this.checkAvailability(cabaña.id, fechaInicio, fechaFin);
                    return isAvailable ? cabaña : null;
                })
            );
            return availableCabañas.filter(Boolean);
        } catch (error) {
            console.error('Error en filterByAvailability:', error);
            throw error;
        }
    }
}
