import { Schema, model } from "mongoose";

const productSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            maxLength: [50, "Can't exceed 50 characters"]
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [250, "Can't exceed 250 characters"]
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be a positive value']
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock must be a positive value']
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required']
        }
    },
    {
        timestamps: true
    }
);

export default model('Product', productSchema);