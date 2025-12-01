// Importa el modelo Sequelize
const GlobalSetting = require('../models/costosGlobales/costosGlobales'); 
const CONFIG_ID = 1;

class GlobalSettingService {
    async getSettings() {
        // 1. Busca la única fila de configuración (id=1)
        let settings = await GlobalSetting.findByPk(CONFIG_ID);
        
        // 2. Si no existe, se crea con valores por defecto (ej. IVA 21, Aumento 0)
        if (!settings) {
            settings = await GlobalSetting.create({ id: CONFIG_ID });
        }
        return settings;
    }

    async updateSettings(data) {
        // Actualiza (o crea si no existe) la fila con ID 1
        await GlobalSetting.upsert({ ...data, id: CONFIG_ID });
        return this.getSettings(); // Retorna los datos actualizados
    }

    // LÓGICA CLAVE: Aplicar IVA y Aumento Global al precio base
    async calculatePriceWithTaxes(basePrice) {
        const settings = await this.getSettings();
        const price = parseFloat(basePrice);

        if (!settings) {
            return price; 
        }
        
        // Convertimos los porcentajes de string (DECIMAL de Sequelize) a float
        const iva = parseFloat(settings.ivaPercentage) / 100;
        const globalIncrease = parseFloat(settings.globalPriceIncrease) / 100;

        // 1. Aplicar aumento global
        let priceAfterIncrease = price * (1 + globalIncrease);
        // 2. Aplicar IVA al nuevo precio base
        let finalPrice = priceAfterIncrease * (1 + iva);
        
        return finalPrice.toFixed(2);
    }
}

module.exports = new GlobalSettingService();