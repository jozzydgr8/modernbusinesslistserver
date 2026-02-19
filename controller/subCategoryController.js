const SubCategory = require('../Schema/subCategorySchema');
const Category = require('../Schema/categorySchema');
const mongoose = require('mongoose');
const createSubCategory = async(req,res)=>{
    const{name} = req.body;
    const {categoryId} = req.params;
    try{
        const findCategory = await Category.findById(categoryId);

        if (!findCategory) {
        return res.status(404).json({ message: "Category does not exist" });
        }

        const subCategory = await SubCategory.create({name, categoryId:findCategory._id});
        res.status(201).json(subCategory);
    }catch(error){
         if (error.code === 11000) {
        return res.status(400).json({
            message: "sub category already exists"
        });
    }
        res.status(500).json(error.message)
    }
}

const getSubCategories = async(req,res)=>{
    try{
        const {categoryId} = req.params;
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        
        const fetchSubCategory = await SubCategory.find({categoryId}).populate('categoryId','name');
        res.status(200).json(fetchSubCategory);

    }
    catch(error){
        res.status(500).json(error.message)
    }
}

module.exports = {createSubCategory, getSubCategories}