let express = require('express');
let router = express.Router();


const service = require('./service')();

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');

const fn = require('./code');

const api = require('./api');

const decodeBody = require('../../middleware/decodeBody');
const decodeRsa = require('../../middleware/decodeRsa');
const checkLogin = require('../../middleware/checkLogin');
const senstifyWord = require('../../middleware/senstifyWord');
const postLimit = require('../../middleware/postLimit');
const postFilter = require('../../middleware/postFilter');
const lengthLimit = require('../../middleware/lengthLimit');


//render views

router.get('/',fn.getList );
router.get('/preview',fn.preview );
router.get('/edit',fn.editCode );
router.get('/thumnbnail',fn.thumnbnail);

router.get('/:uuid',fn.getDetail );



//api
router.post('/sync',decodeBody );
router.post('/sync',api.sync );

router.post('/new',checkLogin);
router.post('/new',postLimit);
router.post('/new',decodeBody);
router.post('/new',decodeRsa);
router.post('/new',lengthLimit);
router.post('/new',postFilter);
router.post('/new',api.newCode);


router.post('/edit',checkLogin);
router.post('/edit',postLimit);
router.post('/edit',decodeBody);
router.post('/edit',decodeRsa);
router.post('/edit',lengthLimit);
router.post('/edit',postFilter);
router.post('/edit',api.editCode);


router.post('/fork',checkLogin);
router.post('/fork',postLimit);
router.post('/fork',decodeBody);
router.post('/fork',decodeRsa);
router.post('/fork',api.fork);

router.post('/recover',checkLogin);
router.post('/recover',postLimit);
router.post('/recover',decodeBody);
router.post('/recover',decodeRsa);
router.post('/recover',api.recover);


module.exports = router;
