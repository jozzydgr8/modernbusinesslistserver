const router = require('express').Router({mergeParams:true});
const {getBusiness, addBusiness, getSingleBusiness} = require('../controller/businessController');
const authenticator = require('../middleware/authenticator')

router.get('/',getBusiness);
router.get(':businessId', getSingleBusiness)
router.post('/', authenticator, addBusiness);
module.exports=router;