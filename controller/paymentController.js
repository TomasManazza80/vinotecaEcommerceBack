const vexor = require('vexor');
const dotenv = require('dotenv');

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
    const webhookData = req.body;
    console.log('Webhook recibido:', webhookData);
    
    // Solo registrar el webhook, no procesar productos
    // Eliminada la llamada a paymentService.processWebhookData
    
    res.status(200).send('Webhook recibido correctamente');
  } catch (error) {
    console.error('Error al procesar el webhook:', error);
    res.status(500).send('Error al procesar el webhook');
  }
};

module.exports = { createPayment, handleWebhook };