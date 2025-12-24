// routes/enviarPedidoWhatsappRoutes.js - Versión extendida (ES6)
import express from 'express';
import { crearPedido } from '../../controller/whatsappEnvio/envioWhatsappController.js';


const router = express.Router();

// Ruta POST para enviar pedidos
router.post('/pedido', crearPedido);

// Ruta GET para verificar estado
router.get('/estado', (req, res) => {
    try {
        const estado = verificarEstado();
        res.json({
            success: true,
            estado,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Ruta POST para forzar reconexión
router.post('/reconectar', async (req, res) => {
    try {
        const resultado = await reconectar();
        res.json({
            success: resultado.success,
            message: resultado.message || 'Reconexión iniciada',
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Opción 1: Exportar como default
export default router;

// Opción 2: Exportar nombrado
// export { router as pedidoRoutes };