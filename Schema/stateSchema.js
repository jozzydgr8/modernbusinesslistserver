const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        minlength: [2, "Category name must be at least 2 characters"]
    },
    countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
    index: true
  },
  businessCount: {
    type: Number,
    default: 0
  },
}, {timestamps:true})

stateSchema.index({ name: 1, countryId: 1 }, { unique: true });

module.exports=mongoose.model('State', stateSchema);