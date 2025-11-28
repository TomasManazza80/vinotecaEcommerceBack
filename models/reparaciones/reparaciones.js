const { DataTypes } = require("sequelize");

// Asume que esta constante se importa desde tu archivo de configuración de base de datos
// const Sequelize = require("../../dbconnection/db"); 
// Usamos una variable placeholder 'db' para el ejemplo.

// NOTA: Reemplaza 'db' con tu objeto de conexión Sequelize importado si es diferente.
const Reparacion = (db) => db.define(
    "Reparacion",
    {
        // El ID de reparación (primary key autoincremental)
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // Información del Cliente
        nombreDueno: { // Mapea a nombre_dueno en PostgreSQL
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        celular: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        
        // Información del Dispositivo y Servicio
        nombreDispositivo: { // Mapea a nombre_dispositivo
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        montoAPagar: { // Mapea a monto_a_pagar
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        descripcionProblema: { // Mapea a descripcion_problema
            type: DataTypes.TEXT,
            allowNull: false,
        },
        notaTecnica: { // Mapea a nota_tecnica
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // Fechas
        fechaInicio: { // Mapea a fecha_inicio
            type: DataTypes.DATEONLY, // Usar DATEONLY para solo guardar la fecha sin hora
            defaultValue: DataTypes.NOW,
        },
        fechaFinalizado: { // Mapea a fecha_finalizado
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        // Estado
        estado: {
            type: DataTypes.ENUM('Pendiente', 'Finalizado'),
            allowNull: false,
            defaultValue: 'Pendiente',
        },

        // Atributos de future-proofing
        opcion1: { // Mapea a opcion_1
            type: DataTypes.TEXT,
            allowNull: true,
        },
        opcion2: { // Mapea a opcion_2
            type: DataTypes.TEXT,
            allowNull: true,
        },
        opcion3: { // Mapea a opcion_3
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        // Opciones del modelo
        tableName: 'reparaciones', // Asegura que se mapee a la tabla SQL existente
        timestamps: true, // Agrega createdAt y updatedAt
        // paranoid: true, // Descomentar si deseas usar soft-deletes (deletedAt)
    }
);

// Ejemplo de exportación si usas el patrón de inyección de conexión
// module.exports = Reparacion; 

// Si usas el patrón de tu ejemplo:
// const Sequelize = require("..."); // Tu conexión
// module.exports = Reparacion(Sequelize);