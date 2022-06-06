let express = require('express');
let router = express.Router();

setTimeout( () => {
    //Log( global.isMaster && require('./service')() );
},500 );

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');

const decodeBody = require('../../middleware/decodeBody');
const decodeRsa = require('../../middleware/decodeRsa');
const checkLogin = require('../../middleware/checkLogin');

const fn = require('./collections');

const api = require('./api');

//render views
router.get('/getimage/:uuid', checkLogin, fn.getImage );
//router.get('/',fn.getList );

//api

router.post('/get',checkLogin);
router.post('/get',decodeBody);
router.post('/get',api.getCollection);


module.exports = router;
