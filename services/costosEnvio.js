// Importa el modelo Sequelize
const ShippingCost = require('../models/costosEnvio/cortosEnvio.js'); 
const CONFIG_ID = 1;

class ShippingCostService {
    async getCosts() {
        let costs = await ShippingCost.findByPk(CONFIG_ID);
        
        if (!costs) {
            costs = await ShippingCost.create({ id: CONFIG_ID });
        }
        return costs;
    }

    async updateCosts(data) {
        // Actualiza (o crea si no existe) la fila con ID 1
        await ShippingCost.upsert({ ...data, id: CONFIG_ID });
        return this.getCosts();
    }

    // LÓGICA CLAVE: Obtener el costo por la zona solicitada
    async getCostByZone(zone) {
        const costs = await this.getCosts();
        if (!costs) return 0.00;

        let costValue;
        
        // Mapeamos la zona solicitada al nombre de la columna en el modelo
        switch (zone.toLowerCase()) {
            case 'santafeciudad':
                costValue = costs.santaFeCity;
                break;
            case 'alrededoresdesantafe':
                costValue = costs.santaFeArea;
                break;
            case 'nacionales':
                costValue = costs.national;
                break;
            case 'internacionales':
                costValue = costs.international;
                break;
            default:
                return 0.00; // Zona no encontrada
        }
        
        // Convertimos el valor (DECIMAL string) a float y aseguramos 2 decimales
        return parseFloat(costValue).toFixed(2);
    }
}

module.exports = new ShippingCostService();