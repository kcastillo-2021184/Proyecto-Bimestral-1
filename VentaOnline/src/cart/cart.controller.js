import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

// Obtener el carrito del usuario
export const getCart = async (req, res) => {
    try {
        const userId = req.user.uid;
        const cart = await Cart.findOne({ user: userId }).populate('products.product', 'name price stock');

        if (!cart) return res.status(404).send({ success: false, message: 'Cart not found 👻' });
        return res.send({ success: true, message: 'Cart retrieved 👻', cart });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Agregar un producto al carrito con validación de stock
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.uid; 
        const { productId, quantity } = req.body;

        // Validar que los datos necesarios están presentes
        if (!productId || !quantity) {
            return res.status(400).send({ success: false, message: "Product ID and quantity are required 👻" });
        }

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) return res.status(404).send({ success: false, message: "Product not found 👻" });

        // Validar que haya suficiente stock disponible
        if (product.stock < quantity) {
            return res.status(400).send({ success: false, message: `Not enough stock for ${product.name} 👻` });
        }

        // Buscar el carrito del usuario o crearlo si no existe
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, products: [] });
        }

        // Verificar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return res.status(200).send({ success: true, message: "Product added to cart 👻", cart });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error 👻", err });
    }
};

// Eliminar un producto del carrito
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).send({ success: false, message: 'Cart not found 👻' });

        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        await cart.save();

        return res.send({ success: true, message: 'Product removed from cart 👻', cart });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Vaciar el carrito
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.uid;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).send({ success: false, message: 'Cart not found 👻' });

        cart.products = [];
        await cart.save();

        return res.send({ success: true, message: 'Cart cleared 👻' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};
