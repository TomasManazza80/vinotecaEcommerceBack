const Product = require('../models/products/product');
const sequelize = require('../dbconnection/db');

async function migrate() {
    console.log("Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("Conexión exitosa. Buscando productos antiguos...");

    try {
        console.log("Sincronizando modelos para asegurar que las tablas existan...");
        await sequelize.sync({ alter: { drop: false } });
        console.log("Tablas sincronizadas.");

        const productos = await Product.findAll();
        let actualizados = 0;

        for (const prod of productos) {
            // Si el producto no tiene variantes y sí tiene precioVenta (datos restaurados)
            const tieneVariantes = prod.variantes && Array.isArray(prod.variantes) && prod.variantes.length > 0;
            const precioAntiguo = Number(prod.precioVenta) || 0;

            if (!tieneVariantes && precioAntiguo > 0) {
                console.log(`Migrando producto ID: ${prod.id} - ${prod.nombre}`);
                
                const variante = {
                    color: 'Unico',
                    almacenamiento: 'Unico',
                    stock: Number(prod.cantidad) || 0,
                    precioAlPublico: precioAntiguo,
                    costoDeCompra: Number(prod.precioCompra) || 0,
                    precioMayorista: Number(prod.precioMayorista) || 0,
                    precioRevendedor: Number(prod.precioRevendedor) || 0
                };

                prod.variantes = [variante];
                await prod.save();
                actualizados++;
            }
        }

        console.log(`\n==============================================`);
        console.log(`¡MIGRACIÓN COMPLETADA!`);
        console.log(`Se actualizaron ${actualizados} productos al nuevo formato.`);
        console.log(`==============================================\n`);
        process.exit(0);

    } catch (error) {
        console.error("Error durante la migración:", error);
        process.exit(1);
    }
}

migrate();
