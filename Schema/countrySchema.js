const { default: mongoose } = require("mongoose");

const countrySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true,
        unique:true,
        lowercase:true,
        minlength: [2, "Category name must be at least 2 characters"]
    },
    currency:{
        type:String,
        required:true,
        trim: true,
        uppercase:true,
    },
    iso:{
        type:String,
        required:true,
        trim:true,
        uppercase:true,
        unique:true
    }
},{timestamps:true})

module.exports = mongoose.model('Country',countrySchema);