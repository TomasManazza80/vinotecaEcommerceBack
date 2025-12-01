const GlobalSettingService = require('../services/costosGlobales');

class GlobalSettingController {
    // GET /api/settings/global
    async get(req, res) {
        try {
            const settings = await GlobalSettingService.getSettings();
            res.json(settings);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la configuración global.', error: error.message });
        }
    }

    // PUT /api/settings/global
    async update(req, res) {
        try {
            const updated = await GlobalSettingService.updateSettings(req.body);
            res.json(updated);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la configuración.', error: error.message });
        }
    }

    // GET /api/settings/global/calculate?price=1000
    async calculatePrice(req, res) {
        const basePrice = parseFloat(req.query.price);
        if (isNaN(basePrice)) {
            return res.status(400).json({ message: 'Precio base inválido.' });
        }
        try {
            const finalPrice = await GlobalSettingService.calculatePriceWithTaxes(basePrice);
            res.json({ basePrice, finalPrice });
        } catch (error) {
            res.status(500).json({ message: 'Error al calcular el precio con impuestos.', error: error.message });
        }
    }
}

module.exports = new GlobalSettingController();