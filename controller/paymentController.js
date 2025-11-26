const dotenv = require('dotenv');
const paymentService = require('../payment/paymentService');

dotenv.config();

const createPayment = async (req, res) => {
  const { product } = req.body;

  if (!product || !product.title || !product.unit_price || !product.quantity) {
    return res.status(400).json({ error: 'El producto debe tener título, precio y cantidad' });
  }

  try {
    console.log('Datos del producto:', product);

    const preference = await paymentService.createPreference(product, product.id);

    res.status(200).json({ init_point: preference.init_point }); 
    // init_point = URL de Checkout Pro
  } catch (error) {
    console.error('Error al crear el pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const webhookData = req.body;
    const result = await paymentService.processWebhookData(webhookData);

    res.status(200).json({
      message: 'Webhook procesado correctamente.',
      status: result.newStatus,
    });
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    res.status(500).send('Error al procesar el webhook');
  }
};

module.exports = { createPayment, handleWebhook };
