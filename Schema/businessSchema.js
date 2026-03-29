const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    // Owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Location
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    address: String,
  

    // Category

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    phone: {
        type:String,
        required:true
    },
    email: String,
    website: String,

    logo: String,
    
    isVerified: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

businessSchema.index({ name: 1, state: 1 }, { unique: true });

module.exports = mongoose.model("Business", businessSchema);