// routes/globalSettings.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controller/costoGlobalesController.js');

/**
 * Gestión de Configuración Global (IVA y Aumento) (Single Row)
 * Base: /api/settings/global
 */

// GET y PUT para la configuración principal
router.get('/', controller.get);      // OBTENER
router.put('/', controller.update);   // ACTUALIZAR

// Función de cálculo
// Uso: GET /api/settings/global/calculate?price=1000
router.get('/calculate', controller.calculatePrice);

module.exports = router;