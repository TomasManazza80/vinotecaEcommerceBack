// routes/shippingCosts.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controller/costosEnvioController.js');

/**
 * Gestión de Configuración de Costos de Envío Fijos (Single Row)
 * Base: /api/shipping
 */

// GET y PUT para la configuración principal
router.get('/', controller.get);    // OBTENER
router.put('/', controller.update); // ACTUALIZAR

// Función de consulta
// Uso: GET /api/shipping/cost?zone=nacionales
router.get('/cost', controller.getCostByZone);

module.exports = router;