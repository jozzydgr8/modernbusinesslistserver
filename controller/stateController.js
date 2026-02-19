const State = require('../Schema/stateSchema');
const Country = require('../Schema/countrySchema')


const getStatesByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;

    const states = await State.find({ countryId }).populate('countryId', 'name');
    res.status(200).json(states);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createState = async(req,res)=>{
    const{name} = req.body;
    const {countryId} = req.params;
    try{
        const findCountry = await Country.findById(countryId);
;
        if (!findCountry) {
        return res.status(404).json({ message: "Country not found" });
        }
        
        const state = await State.create({countryId:findCountry._id, name})

        res.status(201).json(state)

    }catch(error){
       if (error.code === 11000) {
        return res.status(400).json({
            message: "Category already exists"
        });
    }
        res.status(400).json(error.message)
    }
}

module.exports = {getStatesByCountry, createState}