// routes/cardCharges.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controller/targetaCostosController.js');

/**
 * Gestión de Reglas de Recargo por Tarjeta y Cuotas
 * Base: /api/charges
 */

// CRUD para las reglas
router.get('/', controller.listAll);     // LISTAR TODAS
router.post('/', controller.create);     // CREAR NUEVA
router.put('/:id', controller.update);   // ACTUALIZAR POR ID
// router.delete('/:id', controller.remove);// ELIMINAR POR ID

// Función de cálculo
// Uso: GET /api/charges/calculate?price=1000&bank=Santander&installments=3
router.get('/calculate', controller.calculate);

module.exports = router;