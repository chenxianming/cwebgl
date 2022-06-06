let express = require('express');
let router = express.Router();


const service = require('./service')();

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');

const fn = require('./community');
const api = require('./api');

const decodeBody = require('../../middleware/decodeBody');
const decodeRsa = require('../../middleware/decodeRsa');
const checkLogin = require('../../middleware/checkLogin');
const senstifyWord = require('../../middleware/senstifyWord');
const postLimit = require('../../middleware/postLimit');
const lengthLimit = require('../../middleware/lengthLimit');

//render views
router.get('/',fn.getList );
router.get('/:uuid',fn.getDetail );

//api
router.post('/up',checkLogin);
router.post('/up',decodeBody);
router.post('/up',api.up);


router.post('/removeThread',checkLogin);
router.post('/removeThread',postLimit);
router.post('/removeThread',decodeBody);
router.post('/removeThread',decodeRsa);
router.post('/removeThread',api.removeThread);



module.exports = router;
