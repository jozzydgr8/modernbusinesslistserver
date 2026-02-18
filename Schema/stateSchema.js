const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
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

stateSchema.index({ name: 1, country: 1 }, { unique: true });

module.exports=mongoose.model('State', stateSchema);