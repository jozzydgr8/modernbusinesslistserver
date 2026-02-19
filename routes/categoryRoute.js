const router = require('express').Router();
const {getCategories, createCategory} = require('../controller/categoryController');

router.get('/',getCategories);
router.post('/',createCategory);

module.exports=router;