const vexor = require('vexor');
const dotenv = require('dotenv');
// ⚠️ Asegúrate de que esta ruta sea correcta:
const paymentService = require('../payment/paymentService'); 

dotenv.config();
const { Vexor } = vexor;

const vexorInstance = new Vexor({
  publishableKey: process.env.VEXOR_PUBLISHABLE_KEY,
  projectId: process.env.VEXOR_PROJECT_ID,
  apiKey: process.env.VEXOR_API_KEY,
});

// Log para depuración
console.log('Clave pública:', process.env.VEXOR_PUBLISHABLE_KEY);
console.log('ID del proyecto:', process.env.VEXOR_PROJECT_ID);
console.log('Clave API:', process.env.VEXOR_API_KEY);

const createPayment = async (req, res) => {
  const { product } = req.body;

  if (!product || !product.title || !product.unit_price || !product.quantity) {
    return res.status(400).json({ error: 'El producto debe tener título, precio y cantidad' });
  }

  try {
    console.log('Datos del producto:', product);
    
    const paymentResponse = await vexorInstance.pay.mercadopago({
      items: [
        {
          title: product.title,
          unit_price: product.unit_price,
          quantity: product.quantity,
        },
      ],
    });

    console.log('Respuesta de pago:', paymentResponse);

    if (paymentResponse && paymentResponse.payment_url) {
      res.status(200).json({ payment_url: paymentResponse.payment_url });
    } else {
      throw new Error('Respuesta de pago inválida');
    }
  } catch (error) {
    console.error('Error al crear el pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
};

const handleWebhook = async (req, res) => {
  try {
    // 1. Manejo del Webhook: Usamos try/catch y la instancia.
    // 💡 Si el error persiste, la llamada a 'webhooks.handleWebhook' debe cambiarse 
    // según la documentación oficial de Vexor. Esta es la estructura estándar.
    const vexorPayment = vexorInstance.webhooks.handleWebhook(req); 

    if (!vexorPayment) {
        // Esto puede suceder si la webhook es de un evento que Vexor no necesita procesar (ej. notificación interna de MP)
        return res.status(200).send('Webhook recibido, no procesado por Vexor.');
    }
    
    console.log('Webhook Vexor recibido y normalizado:', vexorPayment);
    
    // 2. Delegar el procesamiento de negocio al Service
    const result = await paymentService.processVexorWebhook(vexorPayment);
    
    // 3. Responder 200 OK
    res.status(200).json({ 
        message: 'Webhook de Vexor procesado correctamente.',
        status: result.newStatus 
    });
    
  } catch (error) {
    // 💡 Importante: Si la falla es por `Cannot read properties of undefined (reading 'handleWebhook')` 
    // significa que la inicialización de Vexor es incompleta.
    console.error('Error al procesar el webhook:', error); 
    
    // Usamos 500 para errores internos, pero 200 si es un evento que no se procesa (MP reintenta con 500)
    res.status(500).send('Error al procesar el webhook');
  }
};

module.exports = { createPayment, handleWebhook };