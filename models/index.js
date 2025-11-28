const user = require("./users/user");
const cart = require("./carts/cart");
const category = require("./categories/categ");
const product = require("./products/product");
const ProductBought = require("./productBougth/productBougth");
const Recaudation = require("./recaudation/recaudation");
const reparacion = require("../models/reparaciones/reparaciones"); 
const PagoProducto = require("../models/pagosDeProductos/pagosDeProductos"); 

// ---> NUEVO: Carga del modelo RecaudacionFinal (debe ser CommonJS)
const RecaudacionFinal = require("./recaudacionFinal/recaudacionFinal.js"); 

const Sequelize = require("../dbconnection/db");


// ---------------------------------------------------------------------
// Definición de Relaciones (existentes)
// ---------------------------------------------------------------------

user.hasMany(cart, { onDelete: "CASCADE" });
cart.belongsTo(user, { onDelete: "CASCADE" });

category.hasMany(product, { onDelete: "CASCADE" });
product.belongsTo(category, { onDelete: "CASCADE" });

product.belongsToMany(cart, {
  onDelete: "CASCADE",
  through: "Product_cart",
  foreignKey: {
    name: "ProductID",
    allowNull: false,
    unique: true,
  },
});
cart.belongsToMany(product, {
  onDelete: "CASCADE",
  through: "Product_cart",
  foreignKey: {
    name: "ProductID",
    allowNull: false,
    unique: true,
  },
});

product.hasMany(ProductBought, { onDelete: "CASCADE" });
ProductBought.belongsTo(product, { onDelete: "CASCADE" });

// ---------------------------------------------------------------------
// Exportación
// ---------------------------------------------------------------------

const model = Sequelize.models;

// Se agrega RecaudacionFinal a la exportación principal.
module.exports = { 
    model, 
    Sequelize, 
    Recaudation, 
    reparacion, 
    PagoProducto,
    RecaudacionFinal, // <--- AÑADIDO
};