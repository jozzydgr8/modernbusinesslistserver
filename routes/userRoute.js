const { signUser, addUser, fetchUserBusiness, addUserBusiness } = require('../controller/userController');
const User = require('../Schema/userSchema');
const router = require('express').Router();
const authenticator = require('../middleware/authenticator');

router.post('/createuser',addUser);
router.post('/signuser', signUser);
router.get('/mybusiness', authenticator, fetchUserBusiness);
router.post('/addbusiness/:subCategoryId', authenticator, addUserBusiness)
router.delete('/:id', authenticator, async(req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findOneAndDelete({_id:id});
        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error:error})
    }
})
module.exports=router;