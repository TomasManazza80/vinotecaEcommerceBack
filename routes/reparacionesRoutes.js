

import express from 'express';

// Importa el objeto completo del controller porque fue exportado como default
import reparacionesController from '../controller/reparacionesController.js';

const router = express.Router();

// Extraemos las funciones del controller
const {
    createReparacion,
    getReparaciones,
    updateReparacionStatus,
    deleteReparacion,
} = reparacionesController;

// RUTAS
router.post('/', createReparacion);
router.get('/', getReparaciones);
router.patch('/:id/status', updateReparacionStatus);
router.delete('/:id', deleteReparacion);

export default router;
