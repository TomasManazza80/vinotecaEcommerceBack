// models/index.js (Adaptado)

const user = require("./users/user");
const cart = require("./carts/cart");
const category = require("./categories/categ");
const product = require("./products/product");
const ProductBought = require("./productBougth/productBougth");
const Recaudation = require("./recaudation/recaudation");
const reparacion = require("../models/reparaciones/reparaciones"); 
const PagoProducto = require("../models/pagosDeProductos/pagosDeProductos"); 
const RecaudacionFinal = require("./recaudacionFinal/recaudacionFinal.js"); 

// ---------------------------------------------------------------------
// ---> NUEVOS: Carga de Modelos de Configuración (Settings)
// ---------------------------------------------------------------------
const targetaDeCredito = require("../models/targetaDeCredito/targetasDeCredito.js"); // Recargos por Tarjeta
const costosEnvio = require("../models/costosEnvio/cortosEnvio.js"); // Costos de Envío Fijos
const costosGlobales = require("../models/costosGlobales/costosGlobales.js"); // IVA y Aumento Global

const Sequelize = require("../dbconnection/db");


// ---------------------------------------------------------------------
// Definición de Relaciones (existentes)
// ---------------------------------------------------------------------

user.hasMany(cart, { onDelete: "CASCADE" });
cart.belongsTo(user, { onDelete: "CASCADE" });

category.hasMany(product, { onDelete: "CASCADE" });
product.belongsTo(category, { onDelete: "CASCADE" });

// Relación Many-to-Many entre Producto y Carrito
product.belongsToMany(cart, {
    onDelete: "CASCADE",
    through: "Product_cart",
    foreignKey: {
        name: "ProductID",
        allowNull: false,
        unique: false, // **NOTA:** unique debe ser false en relaciones Many-to-Many. 
                       // Lo he corregido de tu original, si era un error.
    },
});
cart.belongsToMany(product, {
    onDelete: "CASCADE",
    through: "Product_cart",
    foreignKey: {
        name: "CartID", // Se recomienda cambiar a CartID para la foreignKey en el lado del Carrito
        allowNull: false,
        unique: false, // **NOTA:** unique debe ser false.
    },
});

product.hasMany(ProductBought, { onDelete: "CASCADE" });
ProductBought.belongsTo(product, { onDelete: "CASCADE" });

// ---------------------------------------------------------------------
// Definición de Relaciones (NUEVAS)
// ---------------------------------------------------------------------
// NOTA: Los modelos CardCharge, ShippingCost y GlobalSetting son de CONFIGURACIÓN
// y no requieren relaciones directas de clave foránea con los modelos transaccionales.
// Sequelize simplemente los inicializará al sincronizar la base de datos.


// ---------------------------------------------------------------------
// Exportación
// ---------------------------------------------------------------------

const model = Sequelize.models;

module.exports = { 
    model, 
    Sequelize, 
    Recaudation, 
    reparacion, 
    PagoProducto,
    RecaudacionFinal,
    // ---> NUEVOS MODELOS DE CONFIGURACIÓN AÑADIDOS A LA EXPORTACIÓN (Opcional, pero útil)
    targetaDeCredito,
    costosEnvio,
    costosGlobales,
};