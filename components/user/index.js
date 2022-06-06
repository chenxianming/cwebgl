let express = require('express');
let router = express.Router();


const service = require('./service')();

const dbModel = require('./model');
const controller = require('./controller');

const dateParse = require('../../utils/dateParse');

const decodeBody = require('../../middleware/decodeBody');
const decodeRsa = require('../../middleware/decodeRsa');
const checkLogin = require('../../middleware/checkLogin');
const senstifyWord = require('../../middleware/senstifyWord');
const postLimit = require('../../middleware/postLimit');
const lengthLimit = require('../../middleware/lengthLimit');
const tagFilter = require('../../middleware/tagFilter');
const postFilter = require('../../middleware/postFilter');
const xssFilter = require('../../middleware/xssFilter');


const fn = require('./user');

const api = require('./api');

//render views
router.get('/',fn.index);

router.get('/newpost',checkLogin,fn.newPost);

router.get('/editpost',checkLogin,fn.editPost);

router.get('/homepage',checkLogin,fn.article);

router.get('/article',checkLogin,fn.article);
router.get('/website',checkLogin,fn.website);
router.get('/code',checkLogin,fn.code);
router.get('/topic',checkLogin,fn.topic);

router.get('/collections',checkLogin,fn.collections);
router.get('/collections/:uuid',checkLogin,fn.collectionsDetail);

router.get('/message',checkLogin,fn.message);
router.get('/message/send',checkLogin,fn.sendMessage);
router.get('/message/:uuid',checkLogin,fn.readMessage);



router.get('/update',checkLogin,fn.updatepage);

router.get('/account',checkLogin,fn.account);

router.get('/logout',fn.logout);

router.get('/:uuid',fn.userDetail);

//api
router.post('/getPublicKey',decodeBody,api.getPublicKey);


router.post('/postKey',checkLogin);
router.post('/postKey',postLimit);
router.post('/postKey',decodeBody,api.postKey);


router.post('/newUser',decodeBody);
router.post('/newUser',decodeRsa);
router.post('/newUser',api.newUser);


router.post('/login',decodeBody);
router.post('/login',decodeRsa);
router.post('/login',api.login);


router.post('/newComment',checkLogin);
router.post('/newComment',postLimit);
router.post('/newComment',decodeBody);
router.post('/newComment',decodeRsa);
router.post('/newComment',senstifyWord);
router.post('/newComment',lengthLimit);
router.post('/newComment',postFilter);
router.post('/newComment',tagFilter);
router.post('/newComment',api.newComment);


router.post('/update',checkLogin);
router.post('/update',postLimit);
router.post('/update',decodeBody);
router.post('/update',decodeRsa);
router.post('/update',senstifyWord);
router.post('/update',lengthLimit);
router.post('/update',xssFilter);
router.post('/update',api.update);


router.post('/account',checkLogin);
router.post('/account',postLimit);
router.post('/account',decodeBody);
router.post('/account',decodeRsa);
router.post('/account',senstifyWord);
router.post('/account',lengthLimit);
router.post('/account',xssFilter);
router.post('/account',api.account);


router.post('/newpick',checkLogin);
router.post('/newpick',postLimit);
router.post('/newpick',decodeBody);
router.post('/newpick',decodeRsa);
router.post('/newpick',lengthLimit);
router.post('/newpick',postFilter);
router.post('/newpick',api.newPick);


router.post('/removepick',checkLogin);
router.post('/removepick',postLimit);
router.post('/removepick',decodeBody);
router.post('/removepick',decodeRsa);
router.post('/removepick',api.removePick);


router.post('/getpick',checkLogin);
router.post('/getpick',decodeBody);
router.post('/getpick',api.getPick);


router.post('/newarticle',checkLogin);
router.post('/newarticle',postLimit);
router.post('/newarticle',decodeBody);
router.post('/newarticle',decodeRsa);
router.post('/newarticle',senstifyWord);
router.post('/newarticle',lengthLimit);
router.post('/newarticle',tagFilter);
router.post('/newarticle',postFilter);
router.post('/newarticle',api.newArticle);


router.post('/editarticle',checkLogin);
router.post('/editarticle',postLimit);
router.post('/editarticle',decodeBody);
router.post('/editarticle',decodeRsa);
router.post('/editarticle',senstifyWord);
router.post('/editarticle',lengthLimit);
router.post('/editarticle',tagFilter);
router.post('/editarticle',postFilter);
router.post('/editarticle',api.editArticle);


router.post('/newwebsite',checkLogin);
router.post('/newwebsite',postLimit);
router.post('/newwebsite',decodeBody);
router.post('/newwebsite',decodeRsa);
router.post('/newwebsite',lengthLimit);
router.post('/newwebsite',postFilter);
router.post('/newwebsite',api.newWebsite);


router.post('/newtopic',checkLogin);
router.post('/newtopic',postLimit);
router.post('/newtopic',decodeBody);
router.post('/newtopic',decodeRsa);
router.post('/newtopic',senstifyWord);
router.post('/newtopic',lengthLimit);
router.post('/newtopic',tagFilter);
router.post('/newtopic',postFilter);
router.post('/newtopic',api.newTopic);


router.post('/newthread',checkLogin);
router.post('/newthread',postLimit);
router.post('/newthread',decodeBody);
router.post('/newthread',decodeRsa);
router.post('/newthread',senstifyWord);
router.post('/newthread',lengthLimit);
router.post('/newthread',tagFilter);
router.post('/newthread',postFilter);
router.post('/newthread',api.newThread);


router.post('/editthread',checkLogin);
router.post('/editthread',postLimit);
router.post('/editthread',decodeBody);
router.post('/editthread',decodeRsa);
router.post('/editthread',senstifyWord);
router.post('/editthread',lengthLimit);
router.post('/editthread',tagFilter);
router.post('/editthread',postFilter);
router.post('/editthread',api.editThread);


router.post('/delete',checkLogin);
router.post('/delete',postLimit);
router.post('/delete',decodeBody);
router.post('/delete',decodeRsa);
router.post('/delete',api.deleteEvent);

router.post('/message/send',checkLogin);
router.post('/message/send',postLimit);
router.post('/message/send',decodeBody);
router.post('/message/send',decodeRsa);
router.post('/message/send',senstifyWord);
router.post('/message/send',lengthLimit);
router.post('/message/send',postFilter);
router.post('/message/send',tagFilter);
router.post('/message/send',api.sendMessage);

router.post('/newcollection',checkLogin);
router.post('/newcollection',postLimit);
router.post('/newcollection',decodeBody);
router.post('/newcollection',decodeRsa);
router.post('/newcollection',lengthLimit);
router.post('/newcollection',postFilter);
router.post('/newcollection',api.newCollection);


router.post('/editcollection',checkLogin);
router.post('/editcollection',postLimit);
router.post('/editcollection',decodeBody);
router.post('/editcollection',decodeRsa);
router.post('/editcollection',lengthLimit);
router.post('/editcollection',postFilter);
router.post('/editcollection',api.editCollection);



router.post('/collect',checkLogin);
router.post('/collect',postLimit);
router.post('/collect',decodeBody);
router.post('/collect',decodeRsa);
router.post('/collect',api.collectEvent);


/*
router.post('/getpick/:uuid',checkLogin);
router.post('/getpick/:uuid',decodeBody);
router.post('/getpick/:uuid',api.getPickDetail);
*/


module.exports = router;
