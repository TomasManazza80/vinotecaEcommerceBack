// BACK/services/reparacionService.js

// --- Simulación de "Base de Datos" 
const reparacionesDB = [];
let nextId = 1;

// --- 1. Crear Nueva Reparación
export const createReparacionService = async (data) => {
    // Aquí se implementa la lógica de la "BD"
    const newReparacion = {
        id: nextId++,
        ...data,
        notaTecnica: data.notaTecnica || '',
        opcion1: data.opcion1 || null,
        opcion2: data.opcion2 || null,
        opcion3: data.opcion3 || null,
        fechaInicio: new Date().toISOString().slice(0, 10), // Formato YYYY-MM-DD
        fechaFinalizado: null,
        estado: 'Pendiente', // Estado inicial
    };

    reparacionesDB.push(newReparacion);
    console.log('DB: Nueva reparación creada.', newReparacion);
    return newReparacion;
};

// --- 2. Obtener Reparaciones (Filtrado opcional por estado)
export const getReparacionesService = async (estado) => {
    let results = reparacionesDB;

    // Lógica de filtrado
    if (estado) {
        const estadoValido = ['Pendiente', 'Finalizado'].includes(estado);
        if (estadoValido) {
            results = reparacionesDB.filter(rep => rep.estado === estado);
        }
    }
    
    // Ordenar por fechaInicio descendente
    results.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));

    console.log(`DB: Obteniendo ${results.length} reparaciones con estado: ${estado || 'TODOS'}`);
    return results;
};

// --- 3. Actualizar Estado de Reparación
export const updateReparacionStatusService = async (id, newStatus, notaTecnica) => {
    const reparacionId = parseInt(id);
    const reparacionIndex = reparacionesDB.findIndex(rep => rep.id === reparacionId);

    if (reparacionIndex === -1) {
        throw new Error(`Reparación con ID ${id} no encontrada.`); 
    }

    const reparacion = reparacionesDB[reparacionIndex];

    // Aplicar los cambios
    reparacion.estado = newStatus;
    reparacion.notaTecnica = notaTecnica || (newStatus === 'Finalizado' ? 'Servicio Finalizado.' : 'Revertido a pendiente.');

    if (newStatus === 'Finalizado') {
        reparacion.fechaFinalizado = new Date().toISOString().slice(0, 10);
    } else {
        reparacion.fechaFinalizado = null;
    }
    
    reparacionesDB[reparacionIndex] = reparacion;

    console.log(`DB: Estado actualizado para ID ${id} a ${newStatus}`);
    return reparacion;
};

// --- 4. Eliminar Reparación
export const deleteReparacionService = async (id) => {
    const reparacionId = parseInt(id);
    const index = reparacionesDB.findIndex(rep => rep.id === reparacionId);

    if (index === -1) {
        throw new Error(`Reparación con ID ${id} no encontrada.`);
    }

    reparacionesDB.splice(index, 1);
    
    console.log(`DB: Reparación ID ${id} eliminada.`);
    return true;
};