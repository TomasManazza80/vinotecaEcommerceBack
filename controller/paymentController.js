const vexor = require('vexor');
const dotenv = require('dotenv');
// ⚠️ Importar el service para delegar el procesamiento
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
    // 1. Usar Vexor para manejar la solicitud, validar y obtener el objeto de pago normalizado
    const vexorPayment = vexorInstance.webhooks.handleWebhook(req); 

    if (!vexorPayment) {
        // Responder 200 si la webhook se recibió, pero Vexor determina que no es un evento procesable 
        // o que se ha manejado internamente.
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
    console.error('Error al procesar el webhook:', error.message);
    
    // Si Vexor arroja un error (ej: firma inválida), se debe responder 401 o 400.
    // Asumimos un nombre de error estándar para Vexor.
    if (error.name === 'VexorWebhookError') {
         return res.status(401).send('Firma de Webhook no válida.');
    }
    
    // Error interno del servidor
    res.status(500).send('Error al procesar el webhook');
  }
};

module.exports = { createPayment, handleWebhook };