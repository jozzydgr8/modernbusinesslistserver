const router = require('express').Router();
const {getCategories, createCategory} = require('../controller/categoryController');
const subCategoryRoutes = require('./subCategoryRoute');

router.get('/',getCategories);
router.post('/',createCategory);

// nest routing of subcategories as children to categories under or using unique id
router.use('/:categoryId/subCategories', subCategoryRoutes);

module.exports=router;