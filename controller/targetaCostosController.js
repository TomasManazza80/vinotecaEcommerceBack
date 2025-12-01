const CardChargeService = require('../services/targetaCreditoService');

class CardChargeController {
    // GET /api/charges
    async listAll(req, res) {
        try {
            const charges = await CardChargeService.findAll();
            res.json(charges);
        } catch (error) {
            // Manejo de error de Sequelize
            res.status(500).json({ message: 'Error al listar recargos.', error: error.message });
        }
    }

    // POST /api/charges
    async create(req, res) {
        try {
            const newCharge = await CardChargeService.create(req.body);
            res.status(201).json(newCharge);
        } catch (error) {
             // 409 Conflict si hay un duplicado (Sequelize UniqueConstraintError)
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'Ya existe una regla para este Banco y Cuotas.' });
            }
            res.status(500).json({ message: 'Error al crear la regla de recargo.', error: error.message });
        }
    }

    // PUT /api/charges/:id
    async update(req, res) {
        const { id } = req.params;
        try {
            const updatedCharge = await CardChargeService.update(id, req.body);
            if (!updatedCharge) return res.status(404).json({ message: 'Regla de recargo no encontrada.' });
            res.json(updatedCharge);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la regla.', error: error.message });
        }
    }

    // GET /api/charges/calculate?price=1000&bank=Santander&installments=3
    async calculate(req, res) {
        const { price, bank, installments } = req.query;
        const basePrice = parseFloat(price);
        const numInstallments = parseInt(installments);

        if (isNaN(basePrice) || !bank || isNaN(numInstallments)) {
             return res.status(400).json({ message: 'Parámetros de cálculo incompletos o inválidos.' });
        }

        try {
            const result = await CardChargeService.calculateFinalPrice(basePrice, bank, numInstallments);
            res.json({
                basePrice: basePrice,
                bank: bank,
                installments: numInstallments,
                ...result 
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al calcular el precio final con recargo.', error: error.message });
        }
    }
}

module.exports = new CardChargeController();