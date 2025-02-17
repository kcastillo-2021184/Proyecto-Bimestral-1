import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      maxLength: [50, "Can't exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model('Category', categorySchema);