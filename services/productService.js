const { model } = require("../models/index"); // Asumiendo Sequelize u ORM similar

const productService = {

    // NUEVO: Método para la creación de un solo producto (anteriormente createProduct)
    async createSingleProduct(producto) {
        console.log("Creando un solo producto:", producto.nombre);
        try {
            // El ORM mapea las propiedades del objeto 'producto' a la tabla
            const product = await model.product.create(producto);
            return product;
        } catch (error) {
            console.error('Error al crear un solo producto:', error);
            throw error;
        }
    },

    // NUEVO: Método para la Carga Masiva (Bulk Insert)
    async createBulkProducts(productos) {
        console.log(`Iniciando bulkCreate para ${productos.length} productos...`);
        try {
            // *** FUNCIÓN CLAVE: bulkCreate para una sola consulta optimizada. ***
            const createdProducts = await model.product.bulkCreate(productos, {
                validate: true // Opcional pero recomendado para verificar el esquema por producto
            }); 
            
            return createdProducts;
        } catch (error) {
            console.error('Error durante la carga masiva (bulkCreate):', error);
            throw error;
        }
    },

    async getAllProducts() {
        try {
            const products = await model.product.findAll();
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    },

    async getProductById(id) {
        try {
            const product = await model.product.findByPk(id);
            if (!product) {
                throw new Error('Producto no encontrado'); 
            }
            return product;
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    },

    // Método updateProduct refactorizado para recibir las actualizaciones como un objeto
    async updateProduct(id, updates) {
        try {
            const product = await model.product.findByPk(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            await product.update(updates); // Pasa el objeto de actualizaciones
            return product;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    },

    async updateQuantityProduct(productId, quantityToDiscount) {
        try {
            const product = await model.product.findByPk(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            
            if (product.cantidad < quantityToDiscount) {
                 throw new Error('Stock insuficiente para aplicar el descuento');
            }

            product.cantidad -= quantityToDiscount;
            await product.save();
            return product;
        } catch (error) {
            console.error('Error al actualizar cantidad del producto:', error);
            throw error;
        }
    },
    
    async deleteProduct(id) {
        try {
            const product = await model.product.findByPk(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            await product.destroy();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    },
};

// Renombrar el método original para mantener la compatibilidad con el controlador antiguo si fuera necesario
// productService.createProduct = productService.createSingleProduct; 
// Como modificamos el Controller, no es estrictamente necesario renombrar la exportación, pero lo dejamos claro:
module.exports = productService;