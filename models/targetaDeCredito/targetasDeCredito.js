const { DataTypes } = require("sequelize");
const Sequelize = require("../../dbconnection/db"); // Asumiendo que esta es tu conexión

const targetaDeCredito = Sequelize.define(
    "targetaDeCredito",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "bank_installments_unique", // Nombre para el índice compuesto
        },
        installments: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: "bank_installments_unique", // Parte del índice compuesto
        },
        chargePercentage: {
            // Utilizamos DECIMAL para precisión con números monetarios/porcentajes
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        timestamps: true,
        tableName: "card_charges", // Nombre de la tabla
    }
);

module.exports = targetaDeCredito;