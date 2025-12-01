const ShippingCostService = require('../services/costosEnvio');

class ShippingCostController {
    // GET /api/shipping
    async get(req, res) {
        try {
            const costs = await ShippingCostService.getCosts();
            res.json(costs);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los costos de envío.', error: error.message });
        }
    }

    // PUT /api/shipping
    async update(req, res) {
        try {
            const updated = await ShippingCostService.updateCosts(req.body);
            res.json(updated);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar los costos de envío.', error: error.message });
        }
    }

    // GET /api/shipping/cost?zone=nacionales
    async getCostByZone(req, res) {
        const { zone } = req.query;
        if (!zone) {
            return res.status(400).json({ message: 'Debe especificar la zona de envío (ej: SantaFeCiudad, Nacionales, etc.).' });
        }
        try {
            const cost = await ShippingCostService.getCostByZone(zone);
            res.json({ zone, cost });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el costo de envío por zona.', error: error.message });
        }
    }
}

module.exports = new ShippingCostController();