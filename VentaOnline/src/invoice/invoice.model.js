import { Schema, model } from "mongoose";

const invoiceSchema = Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required']
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity must be at least 1']
                },
                price: {
                    type: Number,
                    required: true,
                    min: [0, 'Price must be a positive value']
                }
            }
        ],
        total: {
            type: Number,
            required: true,
            min: [0, 'Total must be a positive value']
        },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Cancelled'],
            default: 'Pending'
        }
    },
    {
        timestamps: true
    }
);

export default model('Invoice', invoiceSchema);