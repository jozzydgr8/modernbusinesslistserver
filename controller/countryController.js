const Country = require('../Schema/countrySchema');

const getCountries = async(req,res)=>{
    try{
        const countries = await Country.find({});
        const countriesWithSlug = countries.map(country => ({
            _id: country._id,
            name: country.name,
            currency: country.currency,
            iso: country.iso,
            slug: country.iso.toLowerCase() 
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
        res.status(201).json(country)
    }catch(error){
         if (error.code === 11000) {
        return res.status(400).json({
            message: "Category already exists"
        });
    }
        res.status(400).json(error.message)
    }
}

module.exports={getCountries, createCountry}