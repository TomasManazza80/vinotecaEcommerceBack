const mercadopago = require('mercadopago');
const axios = require('axios');

const createPreference = async (createPaymentDto, id) => {
  const client = {
    access_token:"APP_USR-7009057186810051-112615-608007d836258edbf1abad926e0aa1c6-632503296", // ⚠️ Usa variable de entorno
  };

  mercadopago.configure(client);

  const preferenceData = {
    items: [
      {
        title: createPaymentDto.title,
        quantity: Number(createPaymentDto.quantity),
        unit_price: Number(createPaymentDto.price),
        currency_id: 'ARS',
      },
    ],
    back_urls: {
      success: 'https://ecommerceback-haed.onrender.com/confirmacionPago',
      failure: 'http://localhost:5173/user/allcredits',
      pending: 'http://localhost:5173/user/allcredits',
    },
    auto_return: 'approved',
    external_reference: id,
  };

  try {
    const preference = await mercadopago.preferences.create(preferenceData);
    return preference.body;
  } catch (error) {
    throw error;
  }
};

// Procesa el webhook directamente de Mercado Pago
const processWebhookData = async (webhookData) => {
  try {
    const paymentId = webhookData.data.id;

    // Consultar el pago en Mercado Pago
    const payment = await mercadopago.payment.findById(paymentId);

    console.log('Webhook recibido:', payment.body);

    switch (payment.body.status) {
      case 'approved':
        console.log(`✅ Pago aprobado. Actualizar orden ${payment.body.external_reference}`);
        // Lógica de negocio: actualizar orden en BD
        break;
      case 'pending':
        console.log(`⏳ Pago pendiente. Orden ${payment.body.external_reference}`);
        break;
      case 'rejected':
        console.log(`❌ Pago rechazado. Orden ${payment.body.external_reference}`);
        break;
      default:
        console.log(`❓ Estado desconocido: ${payment.body.status}`);
        break;
    }

    return { success: true, newStatus: payment.body.status };
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    throw error;
  }
};

module.exports = {
  createPreference,
  processWebhookData,
};
