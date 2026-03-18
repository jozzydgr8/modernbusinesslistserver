const router = require('express').Router({mergeParams:true});
const {getSubCategories, createSubCategory} = require('../controller/subCategoryController');
const businessRoute = require('./businessRoute')

router.get('/', getSubCategories);
router.post('/',createSubCategory);

//nest routing for businesses
router.use('/:subCategoryId/:countryId/business', businessRoute)

module.exports=router