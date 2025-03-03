import Invoice from "./invoice.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../product/product.model.js";
import mongoose from "mongoose";


// Obtener todas las facturas
export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const invoices = await Invoice.find()
            .populate('user', 'name email')
            .populate({ path: 'cart', populate: { path: 'products.product', select: 'name price stock' } })
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        if (invoices.length === 0) return res.status(404).send({ message: 'Invoices not found 👻', success: false });
        return res.send({ success: true, message: 'Invoices found 👻', invoices, total: invoices.length });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Obtener una factura por ID
export const get = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findById(id)
            .populate('user', 'name email')
            .populate({ path: 'cart', populate: { path: 'products.product', select: 'name price stock' } });

        if (!invoice) return res.status(404).send({ success: false, message: 'Invoice not found 👻' });
        return res.send({ success: true, message: 'Invoice found 👻', invoice });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Obtener facturas por usuario
export const getByUser = async (req, res) => {
    try {
        const userId = req.user.uid; // Ahora esto siempre será un String

        // Buscar facturas y popular correctamente el carrito con su usuario
        const invoices = await Invoice.find()
            .populate({
                path: 'cart',
                populate: { path: 'user', model: 'User', select: '_id' } // Asegurar que se expanda completamente
            })
            .populate({ path: 'cart.products.product', select: 'name price stock' });

        // Asegurar que cart.user._id esté presente y hacer la comparación correctamente
        const userInvoices = invoices.filter(invoice => 
            invoice.cart && invoice.cart.user && invoice.cart.user._id.toString() === userId
        )

        if (!userInvoices || userInvoices.length === 0) {
            return res.status(404).send({ success: false, message: "No invoices found for this user 👻" });
        }

        return res.send({ success: true, message: "Invoices found 👻", invoices: userInvoices });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: "General error 👻", err });
    }
};



// Crear una nueva factura desde el carrito y actualizar stock
export const createInvoice = async (req, res) => {
    try {
        const user = req.user.id; 
        const { cartId } = req.body;

        console.log(req.body)

        if (!cartId) {
            return res.status(400).send({ success: false, message: "Cart ID is required 👻" });
        }

        const cart = await Cart.findById(cartId).populate('products.product');

        if (!cart) return res.status(404).send({ success: false, message: 'Cart not found 👻' });
        if (cart.products.length === 0) return res.status(400).send({ success: false, message: 'Cart is empty 👻' });

        let total = 0;
        for (const item of cart.products) {
            const product = await Product.findById(item.product._id);
            if (!product || product.stock < item.quantity) {
                return res.status(400).send({ success: false, message: `Not enough stock for ${product.name} 👻` });
            }

            product.stock -= item.quantity;
            await product.save();
            total += item.quantity * product.price;
        }

        const newInvoice = new Invoice({ user, cart: cartId, total, status: 'Paid' });
        await newInvoice.save();

        return res.status(201).send({ success: true, message: 'Invoice created and stock updated 👻', invoice: newInvoice });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Actualizar una factura
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const invoice = await Invoice.findById(id);
        if (!invoice) return res.status(404).send({ success: false, message: 'Invoice not found 👻' });

        invoice.status = status || invoice.status;
        await invoice.save();

        return res.send({ success: true, message: 'Invoice updated successfully 👻', invoice });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Eliminar una factura
export const removeInvoice = async (req, res) => { 
    try {
        const { id } = req.params;

        // Buscar la factura para verificar si existe y obtener los productos del carrito
        const invoice = await Invoice.findById(id).populate('cart');

        if (!invoice) {
            return res.status(404).send({ success: false, message: 'Invoice not found 👻' });
        }

        // Verificar si la factura ya está cancelada
        if (invoice.status === "Cancelled") {
            return res.status(400).send({ success: false, message: 'Invoice is already cancelled 👻' });
        }

        // Actualizar el estado de la factura a "Cancelled"
        invoice.status = "Cancelled";
        await invoice.save();

        // Restaurar el stock de los productos en la factura
        for (const item of invoice.cart.products) {
            await Product.findByIdAndUpdate(
                item.product, 
                { $inc: { stock: item.quantity } } // Incrementar el stock con la cantidad cancelada
            );
        }

        return res.send({ success: true, message: 'Invoice cancelled and stock restored 👻', invoice });
    } catch (err) {
        console.error("Error en removeInvoice:", err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

