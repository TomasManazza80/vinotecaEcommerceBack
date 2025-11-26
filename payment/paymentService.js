const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-7009057186810051-112615-608007d836258edbf1abad926e0aa1c6-63250329", // ⚠️ usa variable de entorno
});

const createPreference = async (createPaymentDto, id) => {
  const preference = new Preference(client);

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

  const result = await preference.create({ body: preferenceData });
  return result; // contiene init_point
};

const processWebhookData = async (webhookData) => {
  try {
    const paymentId = webhookData.data.id; // viene del body del webhook
    const payment = new Payment(client);

    const result = await payment.get({ id: paymentId }); // ✅ método correcto

    console.log('Pago consultado:', result);

    switch (result.status) {
      case 'approved':
        console.log(`✅ Pago aprobado. Orden ${result.external_reference}`);
        break;
      case 'pending':
        console.log(`⏳ Pago pendiente. Orden ${result.external_reference}`);
        break;
      case 'rejected':
        console.log(`❌ Pago rechazado. Orden ${result.external_reference}`);
        break;
      default:
        console.log(`❓ Estado desconocido: ${result.status}`);
        break;
    }

    return { success: true, newStatus: result.status };
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    throw error;
  }
};

module.exports = {
  createPreference,
  processWebhookData,
};
