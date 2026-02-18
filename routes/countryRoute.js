const router = require('express').Router();
const{createCountry, getCountries} = require('../controller/countryController')
const stateRoutes = require('./stateRoute')

router.get('/', getCountries);
router.post('/',createCountry);

//staterouting as a nest always countries/countryid/states
router.use('/:countryId/states', stateRoutes);


module.exports = router