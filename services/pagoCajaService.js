// Importamos la referencia directa al constructor 'PagoProducto'
import { PagoProducto } from "../models/index.js"; // Se asume que '../models/index.js' usa export named

const pagoService = {

    /**
     * Crea un nuevo registro de pago en la base de datos.
     * @param {Object} data - Datos del pago a crear.
     * @returns {Promise<Object>} El objeto PagoProducto creado.
     */
    async createPago(data) {
        console.log("Creando un nuevo pago...");
        try {
            // Usamos la variable 'PagoProducto' importada directamente.
            const pago = await PagoProducto.create(data); 
            return pago;
        } catch (error) {
            console.error('Error al crear el pago:', error);
            throw error; 
        }
    },

    /**
     * Obtiene todos los pagos registrados.
     * @returns {Promise<Array<Object>>} Lista de todos los pagos.
     */
    async getAllPagos() {
        try {
            const pagos = await PagoProducto.findAll();
            return pagos;
        } catch (error) {
            console.error('Error al obtener todos los pagos:', error);
            throw error;
        }
    },

    /**
     * Obtiene un pago específico por su ID.
     * @param {number} id - ID del pago.
     * @returns {Promise<Object|null>} El objeto PagoProducto o null si no se encuentra.
     */
    async getPagoById(id) {
        try {
            const pago = await PagoProducto.findByPk(id);
            if (!pago) {
                throw new Error('Pago no encontrado');
            }
            return pago;
        } catch (error) {
            console.error(`Error al obtener el pago con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Actualiza un pago por su ID.
     * @param {number} id - ID del pago a actualizar.
     * @param {Object} updates - Objeto con los campos a actualizar.
     * @returns {Promise<Object>} El objeto PagoProducto actualizado.
     */
    async updatePago(id, updates) {
        try {
            const pago = await PagoProducto.findByPk(id);
            if (!pago) {
                throw new Error('Pago no encontrado');
            }
            // Actualiza el registro con los nuevos datos
            await pago.update(updates); 
            return pago;
        } catch (error) {
            console.error(`Error al actualizar el pago con ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina (o hace soft-delete) un pago por su ID.
     * @param {number} id - ID del pago a eliminar.
     */
    async deletePago(id) {
        try {
            const pago = await PagoProducto.findByPk(id);
            if (!pago) {
                throw new Error('Pago no encontrado');
            }
            // Usa destroy() que realiza soft-delete
            await pago.destroy();
        } catch (error) {
            console.error(`Error al eliminar el pago con ID ${id}:`, error);
            throw error;
        }
    },
};

export default pagoService;