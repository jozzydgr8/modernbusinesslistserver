const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim: true,
        minlength: [2, "Category name must be at least 2 characters"]
    }
},{timestamps:true})

module.exports=mongoose.model('Categories',categorySchema)