require('dotenv').config();
const { Client } = require('pg');

async function migrateData() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Conectado a la base de datos original...");

        // Get all products from the old table
        const res = await client.query('SELECT * FROM "products"');
        const oldProducts = res.rows;
        console.log(`Encontrados ${oldProducts.length} productos en la tabla vieja ('products').`);

        if (oldProducts.length === 0) {
            console.log("No hay nada que migrar.");
            return;
        }

        let migradas = 0;

        for (const row of oldProducts) {
            // Check if it already exists in the new table by name (to avoid duplicates if run multiple times)
            const existsRes = await client.query('SELECT id FROM "productos" WHERE "nombre" = $1', [row.nombre]);
            if (existsRes.rows.length > 0) {
                console.log(`El producto '${row.nombre}' ya existe en la nueva tabla, ignorando...`);
                continue;
            }

            // Create the new variantes array
            const variante = {
                color: "Único",
                almacenamiento: "Único",
                stock: row.cantidad ? parseInt(row.cantidad) : 0,
                precioAlPublico: row.precio ? parseFloat(row.precio) : 0,
                precioRevendedor: row.precio ? parseFloat(row.precio) : 0,
                precioMayorista: row.precio ? parseFloat(row.precio) : 0,
                costoDeCompra: row.talle ? parseFloat(row.talle) : 0
            };

            const variantesJSON = JSON.stringify([variante]);
            
            // Fix images
            let imagenesJSON = "[]";
            if (row.imagenes) {
                if (typeof row.imagenes === 'string') {
                    try {
                        // Sometimes it's a stringified array
                        const parsed = JSON.parse(row.imagenes);
                        imagenesJSON = JSON.stringify(Array.isArray(parsed) ? parsed : [parsed]);
                    } catch (e) {
                        imagenesJSON = JSON.stringify([row.imagenes]);
                    }
                } else if (Array.isArray(row.imagenes)) {
                    imagenesJSON = JSON.stringify(row.imagenes);
                }
            }

            const insertQuery = `
                INSERT INTO "productos" (
                    "nombre", "marca", "categoria", "descripcion", 
                    "imagenes", "variantes", "cantidad", "precioVenta",
                    "createdAt", "updatedAt"
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `;

            const values = [
                row.nombre,
                row.marca || '',
                row.categoria || '',
                row.descripcion || '',
                imagenesJSON,
                variantesJSON,
                row.cantidad ? parseInt(row.cantidad) : 0,
                row.precio ? parseFloat(row.precio) : 0,
                row.createdAt || new Date(),
                row.updatedAt || new Date()
            ];

            await client.query(insertQuery, values);
            migradas++;
        }

        console.log(`==============================================`);
        console.log(`¡MIGRACIÓN COMPLETADA!`);
        console.log(`Se migraron ${migradas} productos desde 'products' hacia 'productos'.`);
        console.log(`==============================================`);

    } catch (e) {
        console.error("Error migrando datos:", e);
    } finally {
        await client.end();
    }
}

migrateData();
