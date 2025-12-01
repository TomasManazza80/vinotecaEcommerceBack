const { DataTypes } = require("sequelize");
const Sequelize = require("../../dbconnection/db");

const constosEnvio = Sequelize.define(
    "constosEnvio",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            // No autoIncrement; forzaremos a que siempre sea 1
        },
        santaFeCity: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        santaFeArea: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        national: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        international: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
    },
    {
        timestamps: false, // No se necesita seguimiento de tiempo
        tableName: "shipping_costs",
    }
);

module.exports = constosEnvio;