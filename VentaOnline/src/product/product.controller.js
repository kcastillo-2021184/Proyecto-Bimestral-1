import Product from "./product.model.js";

// Obtener todos los productos
export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const products = await Product.find()
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        if (products.length === 0) return res.status(404).send({ message: 'Products not found', success: false });
        return res.send({
            success: true,
            message: 'Products found',
            products,
            total: products.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error', err });
    }
};

// Obtener producto por ID
export const get = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).send({ success: false, message: 'Product not found' });
        return res.send({ success: true, message: 'Product found', product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error', err });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, image } = req.body;
        const newProduct = new Product({ name, description, price, stock, category, image });
        await newProduct.save();
        return res.status(201).send({ success: true, message: 'Product created', product: newProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error', err });
    }
};

// Actualizar un producto
export const updatedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedProduct) return res.status(404).send({ success: false, message: 'Product not found' });
        return res.send({ success: true, message: 'Product updated', product: updatedProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error', err });
    }
};

// Eliminar un producto
export const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) return res.status(404).send({ success: false, message: 'Product not found' });
        return res.send({ success: true, message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error', err });
    }
};
