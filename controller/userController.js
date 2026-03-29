
const User = require('../Schema/userSchema');
const jwt = require('jsonwebtoken');
const Business = require('../Schema/businessSchema');
const mongoose = require('mongoose');
const SubCategory = require('../Schema/subCategorySchema');
const Category = require('../Schema/categorySchema');
const State = require('../Schema/stateSchema');
const Country = require('../Schema/countrySchema');

const genToken = (_id)=>{
    return jwt.sign({_id}, process.env.jwtSecret, {expiresIn:'2d'})
}
const addUser = async(req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.createUser({email, password});
        const token = genToken(user._id)
        res.status(200).json({email:user.email, token})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const signUser = async(req,res)=>{
    const {email, password}= req.body;
    try{
        const user = await User.signUser({email,password})
        const token =  genToken(user._id)
        res.status(200).json({email:user.email, token:token})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const fetchUserBusiness = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const business = await Business.findOne({ user: req.user._id }).lean();

        if (!business) {
            return res.status(404).json({ error: 'User has no business' });
        }

        res.status(200).json(business);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addUserBusiness = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const {name, description, country, state, address,phone, website, email} = req.body;
        const {subCategoryId} = req.params;
        const user = req.user;
       
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'user does not exist' });
        }
        const checkCountry = await Country.findById(country).session(session);
        const checkState = await State.findById(state).session(session);
      
        if (!name || !checkCountry || !checkState || !address) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: "Missing required fields" });
        }

        
        const checkUserBusiness = await Business.findOne({user:user._id}).session(session);
        if (checkUserBusiness) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'user already has a business' });
        }
        

        const findSubCategory = await SubCategory
            .findById(subCategoryId)
            .session(session);

        if(!findSubCategory){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message:'SubCategory does not exist'});
        }

        // const findCategory = await Category
        //     .findById(findSubCategory.categoryId)
        //     .session(session);

        const createBusiness = await Business.create([
            {
            name,
            description,
            country,
            state,
            address,
            phone,
            website,
            email,
            subCategoryId: findSubCategory._id,
            user:user._id
        },
        ], { session });

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
module.exports = {
    addUser,
    signUser, 
    fetchUserBusiness,
    addUserBusiness
}
