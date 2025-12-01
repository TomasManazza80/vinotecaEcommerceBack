const { DataTypes } = require("sequelize");
const Sequelize = require("../../dbconnection/db");

const costosGlobales = Sequelize.define(
    "costosGlobales",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            // No autoIncrement; forzaremos a que siempre sea 1
        },
        ivaPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 21.00,
        },
        globalPriceIncrease: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
    },
    {
        timestamps: true,
        tableName: "global_settings",
    }
);

module.exports = costosGlobales;