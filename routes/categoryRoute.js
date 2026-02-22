const router = require('express').Router();
const {getCategories, createCategory, getCategorywithSubCategories} = require('../controller/categoryController');
const subCategoryRoutes = require('./subCategoryRoute');

router.get('/',getCategories);
router.post('/',createCategory);
router.get('/withSubCategories',getCategorywithSubCategories)

// nest routing of subcategories as children to categories under or using unique id
router.use('/:categoryId/subCategories', subCategoryRoutes);

module.exports=router;