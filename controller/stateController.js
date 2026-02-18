const State = require('../Schema/stateSchema');
const Country = require('../Schema/countrySchema')


const getState = async(req,res)=>{
    try{
        const fetchStates = await State.find({});
        res.status(200).json(fetchStates)
    }catch(error){
        res.status(400).json(error.message)
    }
}

const createState = async(req,res)=>{
    const{country, name} = req.body;
    try{
        country = country.trim().toLowerCase();
        const findCountry = await Country.findOne({name:country});
        if (!findCountry) {
        return res.status(404).json({ message: "Country not found" });
        }
        
        const state = await State.create({countryId:findCountry.id, name})

        res.status(200).json(state)

    }catch(error){
        res.status(400).json(error.message)
    }
}

module.exports = {getState, createState}