import Product from "./product.model.js";
import Invoice from "../invoice/invoice.model.js";
import Category from "../category/category.model.js"; 


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
            { 
                $lookup: { 
                    from: "carts", // Relacionamos la factura con la colección "carts"
                    localField: "cart", 
                    foreignField: "_id", 
                    as: "cartData"
                } 
            },
            { $unwind: "$cartData" }, // Convertimos el carrito en un objeto
            { $unwind: "$cartData.products" }, // Extraemos los productos comprados
            { 
                $group: { 
                    _id: "$cartData.products.product", // Agrupamos por producto
                    totalSold: { $sum: "$cartData.products.quantity" } // Sumamos la cantidad vendida
                } 
            },
            { $sort: { totalSold: -1 } }, // Ordenamos por cantidad vendida de mayor a menor
            { $limit: 5 }, // Mostramos solo los 5 productos más vendidos
            { 
                $lookup: { 
                    from: "products", // Relacionamos con la colección "products"
                    localField: "_id", 
                    foreignField: "_id", 
                    as: "product" 
                } 
            },
            { $unwind: "$product" } // Extraemos la información del producto
        ]);

        if (!topProducts.length) 
            return res.status(404).send({ success: false, message: 'No sales data 👻' });

        return res.send({ success: true, message: 'Top-selling products found 👻', products: topProducts });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};



export const searchByName = async (req, res) => {
    try {
        const { name } = req.body; // Obtener el nombre desde el body
        if (!name) {
            return res.status(400).send({ success: false, message: "Name is required 👻" });
        }

        const products = await Product.find({
            name: { $regex: name, $options: "i" } // Búsqueda insensible a mayúsculas/minúsculas
        }).populate('category', '_id name description');

        if (products.length === 0) {
            return res.status(404).send({ success: false, message: "No products found 👻" });
        }

        return res.send({ success: true, message: "Products found 👻", products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error 👻", err });
    }
};

export const getByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Verificar si la categoría existe
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).send({ success: false, message: "Category not found 👻" });
        }

        // Buscar los productos de la categoría
        const products = await Product.find({ category: categoryId })
            .populate('category', '_id name description'); // Obtener detalles de la categoría

        if (products.length === 0) {
            return res.status(404).send({ success: false, message: "No products found in this category 👻" });
        }

        return res.send({ success: true, message: "Products found 👻", products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error 👻", err });
    }
};
