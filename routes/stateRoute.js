const router = require('express').Router({ mergeParams: true });
const {getStatesByCountry, createState} = require('../controller/stateController')

router.get('/',getStatesByCountry);
router.post('/', createState)

module.exports= router