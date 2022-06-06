let express = require('express');
let router = express.Router();


const service = require('./service')();

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');
const decodeBody = require('../../middleware/decodeBody');

const fn = require('./lib');
const api = require('./api');

//render views
router.post('/get',decodeBody,api.getList );

module.exports = router;
