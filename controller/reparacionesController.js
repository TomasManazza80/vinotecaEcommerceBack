// BACK/controller/reparacionesController.js

// Importamos las funciones específicas usando destructuring, y la extensión .js es OBLIGATORIA
import {
    createReparacionService,
    getReparacionesService,
    updateReparacionStatusService,
    deleteReparacionService,
} from '../services/reparacionesService.js';


/**
 * Maneja la creación de un nuevo registro de reparación (POST /).
 */
const createReparacion = async (req, res) => {
    try {
        const data = req.body;
        
        // Validación de campos obligatorios
        if (!data.nombreDueno || !data.celular || !data.nombreDispositivo || !data.descripcionProblema) {
            return res.status(400).json({ 
                error: 'Faltan campos obligatorios: dueño, celular, dispositivo o problema.' 
            });
        }

        const nuevaReparacion = await createReparacionService(data);
        
        res.status(201).json({ 
            message: 'Reparación cargada con éxito.', 
            data: nuevaReparacion 
        });

    } catch (error) {
        console.error('Error en createReparacion:', error.message);
        res.status(500).json({ 
            error: 'Error interno al cargar la reparación', 
            details: error.message 
        });
    }
};

/**
 * Maneja la obtención de todas las reparaciones (GET /).
 */
const getReparaciones = async (req, res) => {
    const { estado } = req.query; 
    
    try {
        const reparaciones = await getReparacionesService(estado);
        
        res.status(200).json(reparaciones);

    } catch (error) {
        console.error('Error en getReparaciones:', error.message);
        res.status(500).json({ 
            error: 'Error interno al obtener las reparaciones', 
            details: error.message 
        });
    }
};

/**
 * Maneja la actualización del estado de una reparación (PATCH /:id/status).
 */
const updateReparacionStatus = async (req, res) => {
    const { id } = req.params;
    const { newStatus, notaTecnica } = req.body;

    try {
        // Validación de estado
        if (!newStatus || !['Pendiente', 'Finalizado'].includes(newStatus)) {
            return res.status(400).json({ 
                error: 'Estado de actualización no válido. Debe ser "Pendiente" o "Finalizado".' 
            });
        }

        const result = await updateReparacionStatusService(id, newStatus, notaTecnica);
        
        res.status(200).json({
            message: `Reparación ${id} actualizada a estado: ${newStatus}`,
            data: result
        });

    } catch (error) {
        console.error('Error en updateReparacionStatus:', error.message);
        
        // Manejo específico para ID no encontrado (Error 404)
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Error interno al actualizar el estado de la reparación', 
            details: error.message 
        });
    }
};

/**
 * Maneja la eliminación de una reparación (DELETE /:id).
 */
const deleteReparacion = async (req, res) => {
    const { id } = req.params;

    try {
        await deleteReparacionService(id);
        
        res.status(200).json({
            message: `Reparación ID ${id} eliminada con éxito.`,
        });

    } catch (error) {
        console.error('Error en deleteReparacion:', error.message);
        
        if (error.message.includes('no encontrada')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ 
            error: 'Error interno al eliminar la reparación', 
            details: error.message 
        });
    }
};

// Exportación por defecto del objeto de controladores
export default {
    createReparacion,
    getReparaciones,
    updateReparacionStatus,
    deleteReparacion,
};