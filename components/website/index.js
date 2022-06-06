let express = require('express');
let router = express.Router();

const dbModel = require('./model');
const controller = require('./controller');

setTimeout( () => {
    Log( global.isMaster && require('./service')() );
},500 );

const dateParse = require('../../utils/dateParse');

const fn = require('./website');
const api = require('./api');

const decodeBody = require('../../middleware/decodeBody');

//render views

router.get('/',fn.getList );

router.get('/:uuid',fn.getDetail );

//api
router.post('/addViews',decodeBody,api.addViews);

module.exports = router;
