const Business = require('../Schema/businessSchema');
const mongoose = require('mongoose');
const SubCategory = require('../Schema/subCategorySchema');
const Category = require('../Schema/categorySchema');
const State = require('../Schema/stateSchema');
const Country = require('../Schema/countrySchema');

const getBusiness = async (req, res) => {
  try {
    const { subCategoryId, countryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ message: 'invalid sub-categoryID' });
    }
    if (!mongoose.Types.ObjectId.isValid(countryId)) {
      return res.status(400).json({ message: 'invalid sub-categoryID' });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total, country] = await Promise.all([
      Business.find({ subCategoryId,country:countryId })
        .populate('subCategoryId', 'name')
        .skip(skip)
        .limit(Number(limit)),

      Business.countDocuments({ subCategoryId }),
      Country.findById(countryId).select('name')
    ]);

    res.status(200).json({
      data,
      total,
      country,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
};


const addBusiness = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const {name, description, country, state, address, city, phone, website, email} = req.body;
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
            city,
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
module.exports={getBusiness, addBusiness}
