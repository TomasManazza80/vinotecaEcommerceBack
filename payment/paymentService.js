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

// ⚠️ Función Obsoleta, ya no se usa directamente desde el controlador con Vexor. 
// La dejamos, pero la nueva lógica la reemplaza.
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
 * Nueva función para procesar el objeto de pago normalizado por Vexor.
 * @param {object} vexorPayment - Objeto de pago normalizado de Vexor.
 */
const processVexorWebhook = async (vexorPayment) => {
    // Vexor normaliza el estado del pago (approved, pending, rejected, etc.)
    const status = vexorPayment.status;
    // Vexor te debería dar el ID de tu orden interna
    const orderId = vexorPayment.externalId || vexorPayment.orderId; 
    
    console.log(`--- Procesando Pago Vexor ---`);
    console.log(`Estado: ${status}, ID de Orden Interna: ${orderId}`);

    switch (status) {
        case 'approved':
            console.log(`✅ PAGO APROBADO. Actualizando orden ${orderId} en tu BD.`);
            // Aquí iría la lógica para actualizar el estado en tu base de datos
            // y posiblemente llamar a la función 'success' si es necesario
            // await success(vexorPayment); 
            break;
        case 'pending':
            console.log(`⏳ PAGO PENDIENTE. La orden ${orderId} sigue en espera.`);
            break;
        case 'rejected':
        case 'failed':
            console.log(`❌ PAGO RECHAZADO/FALLIDO. Cancelando orden ${orderId}.`);
            break;
        default:
            console.log(`❓ Estatus desconocido (${status}) para orden ${orderId}.`);
            break;
    }
    
    return { success: true, newStatus: status };
};


const success = async (webhookData) => {
  const url = 'https://vineriabaco.com/';
  // ⚠️ La estructura de datos aquí está diseñada para un webhook directo de MP. 
  // Si usas Vexor, deberías adaptar 'data' para usar la estructura de 'vexorPayment'
  const data = {
    id: webhookData.id,
    type: webhookData.type,
    // ... adaptar al objeto normalizado de Vexor
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
  processWebhookData, // Se mantiene, pero es reemplazada por Vexor
  processVexorWebhook, // 👈 Función clave para Vexor
  success
};