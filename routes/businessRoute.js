const router = require('express').Router({mergeParams:true});
const {getBusiness, addBusiness} = require('../controller/businessController');

router.get('/',getBusiness);
router.post('/',addBusiness);
module.exports=router;