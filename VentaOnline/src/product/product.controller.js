import Product from "./product.model.js";
import Invoice from "../invoice/invoice.model.js";

// Obtener todos los productos
export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const products = await Product.find()
            .populate('category', '_id name description') // Incluye el ID, nombre y descripción de la categoría
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        if (products.length === 0) return res.status(404).send({ message: 'Products not found 👻', success: false });
        return res.send({
            success: true,
            message: 'Products found 👻',
            products,
            total: products.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Obtener producto por ID
export const get = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category', '_id name description');

        if (!product) return res.status(404).send({ success: false, message: 'Product not found 👻' });
        return res.send({ success: true, message: 'Product found 👻', product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body;
        if (stock < 0) return res.status(400).send({ success: false, message: 'Stock cannot be negative 👻' });
        const newProduct = new Product({ name, description, price, stock, category });
        await newProduct.save();
        return res.status(201).send({ success: true, message: 'Product created 👻', product: newProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Actualizar un producto
export const updatedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.body.stock !== undefined && req.body.stock < 0) {
            return res.status(400).send({ success: false, message: 'Stock cannot be negative 👻' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true }).populate('category', 'id name description');

        if (!updatedProduct) return res.status(404).send({ success: false, message: 'Product not found 👻' });
        return res.send({ success: true, message: 'Product updated 👻', product: updatedProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Eliminar un producto
export const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) return res.status(404).send({ success: false, message: 'Product not found 👻' });
        return res.send({ success: true, message: 'Product deleted 👻' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Obtener productos agotados
export const getOutOfStock = async (req, res) => {
    try {
        const products = await Product.find({ stock: 0 }); // Filtra los productos sin stock
        if (products.length === 0) return res.status(404).send({ success: false, message: 'No out-of-stock products 👻' });
        return res.send({ success: true, message: 'Out-of-stock products found 👻', products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Obtener productos más vendidos
export const getTopSellers = async (req, res) => {
    try {
        const topProducts = await Invoice.aggregate([
            { $unwind: "$cart.products" }, // Descompone el array de productos en cada factura
            { $group: { _id: "$cart.products.product", totalSold: { $sum: "$cart.products.quantity" } } }, // Agrupa por producto y suma la cantidad vendida
            { $sort: { totalSold: -1 } }, // Ordena los productos por cantidad vendida de mayor a menor
            { $limit: 5 }, // Limita la consulta a los 5 productos más vendidos
            { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } }, // Obtiene detalles de cada producto
            { $unwind: "$product" } // Convierte el array de productos en documentos individuales
        ]);

        if (!topProducts.length) return res.status(404).send({ success: false, message: 'No sales data 👻' });
        return res.send({ success: true, message: 'Top-selling products found 👻', products: topProducts });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};
