let express = require('express');
let router = express.Router();

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');

const fn = require('./article');
const api = require('./api');

const decodeBody = require('../../middleware/decodeBody');

//render views

router.get('/',fn.getList );

router.get('/captcha.svg',fn.captcha );

router.get('/assets/img/user-avatar-default.png',fn.randomDefaultAvatar );

router.get('/search',fn.search );

//api
router.post('/uploadKey',decodeBody,api.uploadKey );

router.post('/getkeywords',decodeBody,api.getkeywords );

router.post('/clearkeywords',decodeBody,api.clearKeywords );

module.exports = router;
