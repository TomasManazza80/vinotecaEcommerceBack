const { DataTypes } = require("sequelize");
// Se ajusta el require para que coincida con la sintaxis de tu index.js
const SequelizeInstance = require("../../dbconnection/db"); 

// Asegúrate de que tu instancia de Sequelize se pasa correctamente a través del require
// Si el archivo db.js exporta solo la instancia:
// const SequelizeInstance = require("../../dbconnection/db"); 
// Si exporta un objeto con la instancia, ajusta según sea necesario.

const RecaudacionFinal = SequelizeInstance.define(
  "RecaudacionFinal",
  {
    // Unique identifier
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Array for e-commerce payments
    pagosEcommerce: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
      defaultValue: [],
    },
    // Array for local payments
    pagosLocal: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: true,
      defaultValue: [],
    },
    // Final total amount (DECIMAL for precision)
    totalFinal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    // Final e-commerce amount
    montoFinalEcommerce: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    // Final local amount
    montoFinalLocal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    // Optional string fields
    op1: { type: DataTypes.STRING, allowNull: true },
    op2: { type: DataTypes.STRING, allowNull: true },
    op3: { type: DataTypes.STRING, allowNull: true },
    op4: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: true,
    paranoid: true, 
    tableName: 'recaudacion_final', 
  }
);

module.exports = RecaudacionFinal;