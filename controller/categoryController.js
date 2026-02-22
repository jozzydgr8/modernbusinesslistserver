const Category = require('../Schema/categorySchema');
const SubCategory = require('../Schema/subCategorySchema');

const getCategories = async(req,res)=>{
    try{
        const fetchCategories = await Category.find({});
        res.status(200).json(fetchCategories);
    }catch(error){
        res.status(400).json(error.message)
    }
}

const createCategory = async(req,res)=>{
    const {name} = req.body
    try{
        const createCategory = await Category.create({name});
        res.status(201).json(createCategory)
    }catch(error){
         if (error.code === 11000) {
        return res.status(400).json({
            message: "Category already exists"
        });
    }
        res.status(400).json(error.message)
    }
}

const getCategorywithSubCategories = async (req, res)=>{
    try{
        //fetch categories
        const fetchCategories = await Category.find({}).lean();

        //fetch subcategories
        const fetchSubCategories = await SubCategory.find({}).lean();

        //attach subcategories to categories
        const result = fetchCategories.map(cat => ({
      ...cat,
      subCategories: fetchSubCategories.filter(sub => sub.categoryId.toString() === cat._id.toString())
    }));
        res.status(200).json(result);
    }catch(error){
        res.status(400).json(error.message)
    }
}

module.exports={getCategories, createCategory, getCategorywithSubCategories}