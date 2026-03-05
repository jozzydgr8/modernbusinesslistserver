const Business = require('../Schema/businessSchema');
const mongoose = require('mongoose');
const SubCategory = require('../Schema/subCategorySchema');
const Category = require('../Schema/categorySchema');
const State = require('../Schema/stateSchema');
const Country = require('../Schema/countrySchema');

const getBusiness = async (req,res)=>{
    try{
        const {subCategoryId} = req.params;
        if(!mongoose.Types.ObjectId.isValid(subCategoryId)){
           return res.status(400).json({message:'invalid sub-categoryID'})
        }
        const data = await Business.find({subCategoryId}).populate('subCategory','name');
        res.status(200).json(data);
        
    }catch(error){
        res.status(500).json(error.message)
    }
}


const addBusiness = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const {name, description, country, state, address, city, phone, website, email, user} = req.body;
        const {subCategoryId} = req.params;

        const findSubCategory = await SubCategory
            .findById(subCategoryId)
            .session(session);

        if(!findSubCategory){
            await session.abortTransaction();
            return res.status(400).json({message:'SubCategory does not exist'});
        }

        const findCategory = await Category
            .findById(findSubCategory.categoryId)
            .session(session);

        const createBusiness = await Business.create([{
            name,
            description,
            country,
            state,
            address,
            city,
            phone,
            website,
            email,
            subCategoryId: findSubCategory._id,
            user
        }], { session });

        // increment counters
        await SubCategory.findByIdAndUpdate(
            subCategoryId,
            {$inc:{businessCount:1}},
            {session}
        );

        await Category.findByIdAndUpdate(
            findSubCategory.categoryId,
            {$inc:{businessCount:1}},
            {session}
        );

        await State.findByIdAndUpdate(
            state,
            {$inc:{businessCount:1}},
            {session}
        );

        await Country.findByIdAndUpdate(
            country,
            {$inc:{businessCount:1}},
            {session}
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(createBusiness);

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        res.status(500).json(error.message);
    }
};
module.exports={getBusiness, addBusiness}
