
const {getCountry} = require('../controller/countryDetectorController')
const express = require('express');

const router = express.Router();

router.get('/', getCountry);

module.exports = router;