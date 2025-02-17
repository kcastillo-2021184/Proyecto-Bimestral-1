import Category from './category.model.js';

//Crear categoria
export const createCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = new Category(data);
    await category.save();
    return res.status(201).send(
        { 
            success: true, 
            message: 'Category created successfully 👻', 
            category 
        }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, message: 'Error creating category', err });
  }
};

//Listar todas
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.send(
        { 
            success: true, 
            message: 'Categories found successfully 👻',
            total: categories.length,
            categories 
        }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, message: 'Error fetching categories', err });
  }
};

//Obtener por ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).send(
        { 
            success: false, 
            message: 'Category not found'   
        }
    );
    return res.send(
        { 
            success: true, 
            message: 'Category found successfully 👻',
            category 
        }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, message: 'Error fetching category', err });
  }
};

//Actuallizar Categoria
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
        id, 
        data, 
        { new: true }
    );
    if (!updatedCategory) return res.status(404).send(
        { 
            success: false, 
            message: 'Category not found' 
        }
    );
    return res.send(
        { 
            success: true, 
            message: 'Category updated successfully 👻', 
            updatedCategory 
        }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, message: 'Error updating category', err });
  }
};

//Eliminar Categoria
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).send(
        { 
            success: false, 
            message: 'Category not found' 
        }
    );
    return res.send(
        { 
            success: true, 
            message: 'Category deleted successfully 👻' 
        }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false, message: 'Error deleting category', err });
  }
};