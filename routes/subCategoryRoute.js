const router = require('express').Router({mergeParams:true});
const {getSubCategories, createSubCategory} = require('../controller/subCategoryController');

router.get('/', getSubCategories);
router.post('/',createSubCategory);

module.exports=router