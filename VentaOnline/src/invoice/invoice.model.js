import { Schema, model } from "mongoose";

const invoiceSchema = Schema(
    {
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
            required: [true, 'Cart is required']
        },
        total: {
            type: Number,
            required: true,
            min: [0, 'Total must be a positive value']
        },
        status: {
            type: String,
            enum: ['Pending', 'Paid'],
            default: 'Pending'
        }
    },
    {
        timestamps: true
    }
);

export default model('Invoice', invoiceSchema);