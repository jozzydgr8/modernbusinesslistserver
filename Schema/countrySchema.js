const { default: mongoose } = require("mongoose");

const countrySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true,
        unique:true,
        lowercase:true
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