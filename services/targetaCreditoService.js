// Importa el modelo Sequelize
const CardCharge = require('../models/targetaDeCredito/targetasDeCredito'); 

class CardChargeService {
    // 1. CRUD BÁSICO
    async create(data) {
        // En Sequelize, usamos create() para insertar un nuevo registro.
        return CardCharge.create(data);
    }
    
    async findAll() {
        // En Sequelize, usamos findAll() para obtener todos los registros.
        return CardCharge.findAll();
    }

    async update(id, data) {
        // Actualiza el registro por ID. Retorna [1] si actualizó, [0] si no.
        await CardCharge.update(data, { where: { id } });
        // Busca y retorna el registro actualizado.
        return CardCharge.findByPk(id);
    }
    
    async remove(id) {
        // Elimina el registro por ID. Retorna el número de filas eliminadas (0 o 1).
        return CardCharge.destroy({ where: { id } });
    }

    // 2. LÓGICA CLAVE: Obtener el recargo y calcular el precio final
    async getChargeByRule(bankName, installments) {
        // Busca la regla por la combinación de Banco y Cuotas
        return CardCharge.findOne({ where: { bankName, installments, isActive: true } });
    }

    async calculateFinalPrice(basePrice, bankName, installments) {
        const rule = await this.getChargeByRule(bankName, installments);
        const price = parseFloat(basePrice);

        if (!rule) {
            return { price: price, chargeApplied: 0 };
        }

        // Sequelize devuelve DECIMAL como string, lo convertimos a número.
        const percentage = parseFloat(rule.chargePercentage) / 100;
        const finalPrice = price * (1 + percentage);
        
        return { price: finalPrice.toFixed(2), chargeApplied: parseFloat(rule.chargePercentage) };
    }
}

module.exports = new CardChargeService();