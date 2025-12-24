// routes/controller/enviarPedidoWhatsappController.js
import { enviarPedido } from '../../main.js';

const crearPedido = async (req, res) => {
    try {
        await enviarPedido(req.body);
        res.status(201).json({
            success: true,
            message: 'Pedido enviado exitosamente.'
        });
    } catch (error) {
        console.error('Error en enviarPedidoWhatsappController:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Exportar función individual
export { crearPedido };