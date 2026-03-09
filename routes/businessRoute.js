const router = require('express').Router({mergeParams:true});
const {getBusiness, addBusiness} = require('../controller/businessController');
const authenticator = require('../middleware/authenticator')

router.get('/',getBusiness);
router.post('/', authenticator, addBusiness);
module.exports=router;