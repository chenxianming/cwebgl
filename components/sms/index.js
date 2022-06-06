let express = require('express');
let router = express.Router();


const service = require('./service')();

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');

const decodeBody = require('../../middleware/decodeBody');
const decodeRsa = require('../../middleware/decodeRsa');

const fn = require('./sms');

const api = require('./api');

//render views

//router.get('/',fn.getList );

//api

router.post('/newRegCheck',decodeBody);
router.post('/newRegCheck',decodeRsa);
router.post('/newRegCheck',api.newRegCheck);

router.post('/getPublicKey',decodeBody,api.getPublicKey );

router.post('/confrimSms',decodeBody,api.confrimSms );

router.post('/checkName',decodeBody,api.checkName );

module.exports = router;
