const router = require('express').Router();
const{createCountry, getCountries} = require('../controller/countryController')

router.get('/', getCountries);
router.post('/',createCountry);

module.exports = router