const mercadopago = require('mercadopago');
const axios = require('axios');

const createPreference = async (createPaymentDto, id) => {
  const client = {
    access_token: 'APP_USR-8101026874292077-101721-08438cf8d2ed21fe5947641f4ae99cd8-2015493826',
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

const processWebhookData = async (webhookData) => {
  if (webhookData.data.product) {
    const productId = webhookData.data.product.id;
    const quantity = webhookData.data.product.quantity;
    // Debes tener la dependencia de productService para que esto funcione
    // await productService.updateQuantityProduct(productId, quantity); 
  } else {
    console.error('No se encontró información de producto en el webhook');
  }
};

/**
 * Función CLAVE para VEXOR: Procesa el objeto de pago normalizado.
 * @param {object} vexorPayment - Objeto de pago normalizado de Vexor.
 */
const processVexorWebhook = async (vexorPayment) => {
    // Vexor normaliza el estado del pago (approved, pending, rejected, etc.)
    const status = vexorPayment.status;
    // Usamos 'externalId' o 'orderId' que Vexor debería mantener de tu referencia externa
    const orderId = vexorPayment.externalId || vexorPayment.orderId; 
    
    console.log(`--- Procesando Pago Vexor ---`);
    console.log(`Estado: ${status}, ID de Orden Interna: ${orderId}`);

    switch (status) {
        case 'approved':
            console.log(`✅ PAGO APROBADO. Actualizando orden ${orderId} en tu BD.`);
            // Lógica: Actualizar estado de la orden a 'Pagado'.
            await success(vexorPayment); // Llamar a tu función 'success' si es necesario
            break;
        case 'pending':
            console.log(`⏳ PAGO PENDIENTE. La orden ${orderId} sigue en espera.`);
            // Lógica: Mantener estado en 'Pendiente de Pago'.
            break;
        case 'rejected':
        case 'failed':
            console.log(`❌ PAGO RECHAZADO/FALLIDO. Cancelando orden ${orderId}.`);
            // Lógica: Actualizar estado de la orden a 'Cancelado/Fallido'.
            break;
        default:
            console.log(`❓ Estatus desconocido (${status}) para orden ${orderId}.`);
            break;
    }
    
    return { success: true, newStatus: status };
};


const success = async (webhookData) => {
  const url = 'https://vineriabaco.com/';
  // ⚠️ Esta estructura debería adaptarse al objeto normalizado de Vexor
  const data = {
    id: webhookData.id,
    type: webhookData.type,
    // ... otros campos adaptados de 'vexorPayment'
    data: {
      id: webhookData.id, 
      status: webhookData.status, // Usar el campo normalizado
      amount: webhookData.amount, // Usar el campo normalizado
      // ... otros datos necesarios
    }
  };

  try {
    const response = await axios.post(url, data);
    console.log('Pago exitoso. Respuesta:', response.data);
  } catch (error) {
    console.error('Error al enviar pago exitoso:', error);
  }
};

module.exports = {
  createPreference,
  processWebhookData, 
  processVexorWebhook, // 👈 Función que usa el Controller
  success
};