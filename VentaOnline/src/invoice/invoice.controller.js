import Invoice from "./invoice.model.js";
import Product from "../product/product.model.js";

// Obtener todas las facturas
export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const invoices = await Invoice.find()
            .populate('user', 'name email')
            .populate('products.product', 'name price')
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        if (invoices.length === 0) return res.status(404).send({ message: 'Invoices not found 👻', success: false });
        return res.send({
            success: true,
            message: 'Invoices found 👻',
            invoices,
            total: invoices.length
        });
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
            .populate('products.product', 'name price');

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
        const { userId } = req.params;
        const invoices = await Invoice.find({ user: userId })
            .populate('products.product', 'name price');

        if (invoices.length === 0) return res.status(404).send({ success: false, message: 'No invoices found for this user 👻' });
        return res.send({ success: true, message: 'Invoices found 👻', invoices });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Crear una nueva factura
export const createInvoice = async (req, res) => {
    try {
        const { user, products, total, status } = req.body;
        const newInvoice = new Invoice({ user, products, total, status });
        await newInvoice.save();
        return res.status(201).send({ success: true, message: 'Invoice created 👻', invoice: newInvoice });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Actualizar una factura con validación de stock
export const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { products } = req.body;

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product || product.stock < item.quantity) {
                return res.status(400).send({ success: false, message: `Not enough stock for ${product.name} 👻` });
            }
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInvoice) return res.status(404).send({ success: false, message: 'Invoice not found 👻' });
        return res.send({ success: true, message: 'Invoice updated 👻', invoice: updatedInvoice });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};

// Eliminar una factura
export const removeInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedInvoice = await Invoice.findByIdAndDelete(id);

        if (!deletedInvoice) return res.status(404).send({ success: false, message: 'Invoice not found 👻' });
        return res.send({ success: true, message: 'Invoice deleted 👻' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ success: false, message: 'General error 👻', err });
    }
};
