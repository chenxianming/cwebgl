let express = require('express');
let router = express.Router();


const service = require('./service')();

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');



//render views



module.exports = router;
