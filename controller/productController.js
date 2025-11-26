const AllValidation = require("../validation/AllValidation"); // Importación original, usaremos validación interna.
const productService = require('../services/productService');

const productController = {

  // Método unificado para creación simple o masiva
  async createProduct(req, res) {
    try {
      const payload = req.body;
      let result;

      // 1. Verificación del Payload para Carga Masiva
      if (Array.isArray(payload)) {
        if (payload.length === 0) {
            return res.status(400).json({ message: 'El arreglo de productos está vacío.' });
        }
        
        console.log(`Iniciando carga masiva de ${payload.length} productos...`);
        // Llama a la función de inserción masiva en el servicio
        result = await productService.createBulkProducts(payload); 
        
        // Respuesta de éxito para carga masiva
        res.status(201).json({ 
            message: `${result.length} productos creados exitosamente`, 
            data: result 
        });

      } else {
        // 2. Comportamiento actual: crear un solo producto
        console.log("Creando un solo producto...");
        // Llama a la función de creación simple en el servicio
        result = await productService.createSingleProduct(payload);
        res.status(201).json(result);
      }

    } catch (error) {
      console.error("Error en la creación/carga masiva de productos:", error);
      // Devuelve un error 400 si es un fallo de validación o un 500 para errores de DB
      res.status(400).json({ // Usamos 400 por si falla la validación del ORM (bulkCreate)
          message: 'Error al procesar la creación de productos. Verifique los datos.',
          error: error.message || 'Error interno del servidor'
      });
    }
  },
  
  // (Mantener el resto de los métodos como getAllProducts, getProductById, etc.)
  // ...
  
  // Refactorizar updateProduct para recibir un solo objeto de updates
  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      // Pasa el objeto req.body completo al service
      const product = await productService.updateProduct(id, req.body); 
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar producto' });
    }
  },
  
  // ... (otros métodos)

  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener productos' });
    }
  },

  async getProductById(req, res) {
    try {
      const id = req.params.id;
      const product = await productService.getProductById(id);
      if (!product) {
        res.status(404).json({ message: 'Producto no encontrado' });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener producto' });
    }
  },
    async updateQuantityProduct(req, res) {
    try {
      const productId = req.params.id;
      const { quantityToDiscount } = req.body;
      const updatedProduct = await productService.updateQuantityProduct(productId, quantityToDiscount);
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error al actualizar cantidad del producto:", error);
      res.status(500).json({ message: 'Error al actualizar la cantidad del producto' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      await productService.deleteProduct(id);
      res.status(204).json({ message: 'Producto eliminado' });
      console.log('Producto eliminado!!');
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar producto' });
    }
  },

};

module.exports = productController;