const router = require('express').Router({mergeParams:true});
const {getBusiness, getSingleBusiness} = require('../controller/businessController');
const authenticator = require('../middleware/authenticator')

router.get('/',getBusiness);
router.get('/:businessId', getSingleBusiness)

module.exports=router;