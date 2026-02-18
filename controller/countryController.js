const Country = require('../Schema/countrySchema');

const getCountries = async(req,res)=>{
    try{
        const countries = await Country.find({});
        const countriesWithSlug = countries.map(country => ({
            _id: country._id,
            name: country.name,
            currency: country.currency,
            iso: country.iso,
            slug: country.iso.toLowerCase() // generate slug from ISO
        }));

    res.status(200).json(countriesWithSlug);

    }catch(error){
        res.status(400).json(error.message)
    }
}

const createCountry = async(req,res)=>{
    const {name, currency, iso} = req.body;
    try{
        const country = await Country.create({name, currency, iso});
        res.status(200).json(country)
    }catch(error){
        res.status(400).json(error.message)
    }
}

module.exports={getCountries, createCountry}