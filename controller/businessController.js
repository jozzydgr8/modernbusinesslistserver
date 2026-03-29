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

    const [data, total, country,subcategory] = await Promise.all([
      Business.find({ subCategoryId,country:countryId })
        .populate('subCategoryId', 'name')
        .skip(skip)
        .limit(Number(limit)),

      Business.countDocuments({ subCategoryId }),
      Country.findById(countryId).select('name'),
      SubCategory.findById(subCategoryId).select('name')
    ]);

    res.status(200).json({
      data,
      total,
      country:country.name,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit:Number(limit),
      subcategory:subcategory.name
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getSingleBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
   

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: 'Invalid business ID' });
    }

    // Fetch business
    const business = await Business.findById(businessId)
      .populate('subCategoryId', 'name')
      .populate('country', 'name');

    // Check if found
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.status(200).json({
    data: business,
    subcategory: business.subCategoryId?.name,
    country: business.country?.name
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports={getBusiness, getSingleBusiness}
