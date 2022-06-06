let express = require('express');
let router = express.Router();

setTimeout( () => {
    Log( global.isMaster && require('./service')() );
},500 );

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');

const decodeBody = require('../../middleware/decodeBody');

const fn = require('./article');

const api = require('./api');

//render views

router.get('/',fn.getList );

router.get('/:uuid',fn.getDetail );

//api

router.post('/',decodeBody,api.getList );


module.exports = router;
