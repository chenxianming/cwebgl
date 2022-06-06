let express = require('express');
let router = express.Router();


const service = require('./service')();

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');

const fn = require('./comment');

const api = require('./api');

const decodeBody = require('../../middleware/decodeBody');

//render views

router.post('/',decodeBody,api.getList );

module.exports = router;
