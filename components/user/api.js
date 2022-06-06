let express = require('express');
let router = express.Router();

const uuidv4 = require('uuid/v4');

const md5 = require('md5');
const isMd5 = require('is-md5');

//render api

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const getRsa = require('../../utils/getRsa');
const bytelength = require('../../utils/bytelength');

const getIp = require('remote-ip');

const getUser = (uuid) => new Promise( async (resolve) => {
    
    let user = await controller.getUser(seqModel,{
        uuid:uuid
    });
    
    resolve( user );
    
} );

const getPublicKey = async (req,res,next) => {
    
    let queryKey = ['captcha','password','user'],
        isPass = true;

    let queryObj = {};
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
        (!req.body[key]) && ( isPass = false );
    } );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    let user = await controller.login(seqModel,queryObj);
    
    if(!user){
        return res.json({
            msg:'验证失败'
        });
    }
    
    if(req.body.captcha.toLocaleLowerCase() != req.session.captcha){
        return res.json({
            msg:'图形验证码不正确'
        });
    }
    
    if(req.session.rsa){
        return res.json({
            result:req.session.rsa.public
        });
    }
    
    let rsa = await getRsa();
    
    if(!rsa){
        return res.json({
            msg:'服务器正在维护,稍后重试'
        });
    }
    
    req.session.rsa = rsa;
    
    res.json({
        result:rsa.public
    });
}

const login = async (req,res,next) => {
    
    let queryKey = ['captcha','password','user'],
        isPass = true;

    let queryObj = {};
    
    let loginToken = req.sessionID;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
        (!req.body[key]) && ( isPass = false );
    } );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if(req.body.captcha.toLocaleLowerCase() != req.session.captcha){
        return res.json({
            msg:'图形验证码不正确'
        });
    }
    
    delete req.session.captcha;
    
    queryObj['loginToken'] = loginToken;
    let result = await controller.login(seqModel,queryObj);
    
    if(!result){
        return res.json({
            msg:'登录失败'
        });
    }
    
    if(result.msg){
        return res.json(result);
    }
    
    delete result.result.password;
    delete result.result.id;
    
    req.session.userData = result.result;
    
    const url = req.headers.referer || '/';
    
    res.json({
        result:url
    });
}

const newUser = async (req,res,next) => {
    
    let queryKey = ['name','password','mobile'],
        isPass = true;

    let loginToken = req.sessionID;
    
    let queryObj = {};
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
        (!req.body[key]) && ( isPass = false );
    } );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if(req.session.checkMobile != queryObj.mobile){
        return res.json({
            msg:'该手机号验证失败,请重新获取验证码'
        });
    }
    
    queryObj['uuid'] = uuidv4();
    queryObj['loginToken'] = loginToken;
    
    let result = await controller.newUser(seqModel,queryObj);
    
    if(!result){
        return res.json({
            msg:'注册失败,请重新获取验证码'
        });
    }
    
    if(result.msg){
        return res.json(result);
    }
    
    delete result.result.password;
    delete result.result.id;
    
    req.session.userData = result.result;
    
    delete req.session.checkMobile;
    
    const url = req.headers.referer || '/';
    
    res.json({
        result:url
    });
}

const postKey = async (req,res,next) => {
    if(!req.body.cerf){
        return res.json({
            msg:'缺少必要参数'
        });
    }
    
    if(req.session.rsa){
        req.session.cerf = req.body.cerf;
        return res.json({
            result:req.session.rsa.public
        });
    }
    
    let rsa = await getRsa();
    
    if(!rsa){
        return res.json({
            msg:'服务器正在维护,稍后重试'
        });
    }
    
    req.session.rsa = rsa;
    req.session.cerf = req.body.cerf;
    
    res.json({
        result:rsa.public
    });
}

const newComment = async (req,res,next) => {
    
    let queryKey = ['target','type','content','cerf'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
        (!req.body[key]) && ( isPass = false );
    } );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( bytelength(queryObj.content) > 1000){
        return res.json({
            msg:'长度不能大于1000'
        });
    }
    
    if( queryObj.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    queryObj['author'] = author;
    
    let result = await controller.newComment(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
}

const account = async (req,res,next) => {
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    let queryKey = ['oldpass','pass'];
    
    let queryObj = {},
        isPass = true,
        uuid = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] ? ( queryObj[key] = req.body[key] ) : ( isPass = false );
    } );
    
    if(!isPass){
        return res.json({
            msg:'缺少必要参数'
        });
    }
    
    if(!uuid){
        return res.json({
            msg:'请重新登录'
        });
    }
    
    let user = await getUser(uuid);
    
    if( !user ){
        return res.json({
            msg:'请重新登录'
        });
    }
    
    for(let key in queryObj){
        queryObj[key] = ( isMd5(queryObj[key]) ? queryObj[key] : md5(queryObj[key]) );
    }
    
    if(user.password != queryObj.oldpass){
        return res.json({
            msg:'密码不正确'
        });
    }
    
    if( queryObj['pass'] == queryObj['oldpass'] ){
        return res.json({
            msg:'新旧密码不能相同'
        });
    }
    
    req.session.postLimit = new Date().getTime();
    
    queryObj = {
        password:queryObj.pass
    };
    
    let update = await controller.updateProfile(seqModel,uuid,queryObj);
    
    if(!update){
        return res.json({
            msg:'更新失败,请重试'
        });
    }
    
    req.session.userData = user;
    
    res.json({
        result:`更新成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转..`
    });
}


const update = async (req,res,next) => {
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    let queryKey = ['avatar','male','location','age','postScript','email','job','company','wechat','qq','weibo','link','be','github'];
    
    let queryObj = {},
        isPass = true,
        uuid = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        //user[key] && ( queryObj[key] = user[key] );
        ( queryObj[key] = req.body[key] || null );
    } );
    
    for(var key in queryObj){
        ( queryObj[key] && (queryObj[key].length > 500) ) && ( isPass = false );
    }

    if(!isPass){
        return res.json({
            msg:'长度不正确'
        });
    }
    
    if(!uuid){
        return res.json({
            msg:'请重新登录'
        });
    }
    
    req.session.postLimit = new Date().getTime();

    
    let update = await controller.updateProfile(seqModel,uuid,queryObj);
    
    if(!update){
        return res.json({
            msg:'更新失败,请重试'
        });
    }
    
    let user = await getUser(uuid);
    
    req.session.userData = user;
    
    res.json({
        result:`更新成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转..`
    });
}

const newPick = async (req,res,next) => {
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    let queryKey = ['title','description','litpic','categories'];
    
    let queryObj = {},
        isPass = true,
        uuid = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    queryObj['author'] = uuid;
    
    if(req.body.uuid){
        queryObj['uuid'] = req.body.uuid;
        delete queryObj['categories'];
        
        let update = await controller.editPick(seqModel,queryObj);
        
        return update ? res.json({
            result:update
        }) : res.json({
            msg:'未能修改栏目，请重试'
        });
        
    }else{
        let insert = await controller.newPick(seqModel,queryObj);
        
        return insert ? res.json({
            result:insert
        }) : res.json({
            msg:'未能新增栏目，请重试'
        });
    }

}

const getPick = async (req,res,next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['c','p'];
    
    let renderObj = {
            title:'文章',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    let brige = new Array({author:req.session.userData.uuid},{sort:{updatedAt:1},limit:200});
    
    for(let key in queryObj){
        switch(key){
            case 'c' :
                {
                    brige[0]['categories'] = queryObj[key];
                }
            break;

            case 'sort' :
                {
                    let arr = queryObj[key].split('-');
                    
                    ( arr[1] ) && ( brige[1]['sort'] = {} );
                    
                    brige[1]['sort'][ arr[0] ] = arr[1];
                }
            break;
                
            case 'p' :
                {
                    queryObj[key] = Math.max(queryObj[key],1);
                    
                    brige[1]['offset'] = (queryObj[key] * 1 - 1) * brige[1]['limit'];
                }
            break;
        }
    }
    
    let lists = await controller.getPick(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd') );
    } );
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    res.json(renderObj);
}

const getPickDetail = async (req,res,next) => {
    
    let sDate = new Date().getTime();
    
    let uuid = req.paramas.uuid || null;
    
    if(!uuid){
        return res.json({
            msg:'uuid不正确'
        });
    }
    
    let result = await controller.getPickDetail(seqModel,{
        uuid:uuid
    });
    
    renderObj['data'] = result;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    res.json(renderObj);
}


const removePick = async (req,res,next) => {
    let sDate = new Date().getTime(),
        renderObj = {};
    
    let uuid = req.body.uuid || null;
    
    if(!uuid){
        return res.json({
            msg:'uuid不正确'
        });
    }
    
    let result = await controller.removePick(seqModel,{
        uuid:uuid,
        author:req.session.userData.uuid
    });
    
    renderObj['data'] = result;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    res.json(renderObj);
}

const newArticle = async (req,res,next) => {
    
    let queryKey = ['categories','from','fromLink','title','anonymous','content','tags'],
        must = ['categories','title','content'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        ( req.body[key] || ( !isNaN(req.body[key]) ) ) && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    ( ['原创文章','WEBGL资讯','翻译文章','WEBGL教程','栏目专题'].indexOf( req.body.categories ) < 0 ) && ( isPass = false );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( !req.session.relationUUID ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    queryObj['author'] = author;
    queryObj['uuid'] = req.session.relationUUID;
    
    let result = await controller.newArticle(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
}

const editArticle = async (req,res,next) => {
    
    let queryKey = ['categories','from','fromLink','title','anonymous','content','tags','pick','uuid','defaultpick'],
        must = ['categories','title','content'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        ( req.body[key] || ( !isNaN(req.body[key]) ) ) && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    ( ['原创文章','WEBGL资讯','翻译文章','WEBGL教程','栏目专题'].indexOf( req.body.categories ) < 0 ) && ( isPass = false );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    queryObj['author'] = author;
    
    let result = await controller.editArticle(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
}

const newWebsite = async (req,res,next) => {
    
    let queryKey = ['title','link','description','tags'],
        must = ['title','link','description'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    queryObj['author'] = author;
    
    let result = await controller.newWebsite(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
}

const newTopic = async (req,res,next) => {

    let queryKey = ['title','type','content','tags'],
        must = ['title','type','content'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    if(queryObj.type!='讨论' && queryObj.type!='教程' && queryObj.type!='求助' ){
        return res.json({
            msg:'分类不正确'
        });
    }
    
    queryObj['author'] = author;
    
    Log( queryObj );
    
    let result = await controller.newTopic(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
}


const newThread = async (req,res,next) => {
    
    let queryKey = ['topic','content'],
        must = ['topic','content'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    queryObj['author'] = author;
    
    let result = await controller.newThread(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
}

const editThread = async (req,res,next) => {

    let queryKey = ['uuid','content'],
        must = ['uuid','content'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    queryObj['author'] = author;
    
    let result = await controller.editThread(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
    
}

const deleteEvent = async (req,res,next) => {
    
    let types = ['article','topic','code','message','collections'],
        type = req.body.type || '',
        uuid = req.body.uuid || null,
        author = req.session.userData.uuid || null;
    
    if(!req.body.uuid || types.indexOf(type) < 0 ){
        return res.json({
            msg:'参数不正确,请刷新重试'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    let queryObj = {
        type:type,
        uuid:uuid,
        author:author
    };
    
    let result = await controller[`deleteEvent${type}`](seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
    
}

const sendMessage = async (req,res,next) => {
    
    let queryKey = ['title','content','to'],
        must = ['title','content','to'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    if( !isPass || !author ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    queryObj['author'] = author;
    
    let result = await controller.sendMessage(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
    
}

const collectEvent = async (req,res,next) => {
    
    let queryKey = ['uuid','target','type'],
        must = ['target','type'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData.uuid || null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    if( !isPass || !author ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    queryObj['author'] = author;
    
    let isRemove = req.body.remove || null;
    
    let exist = await controller.collectExist(seqModel.collection,queryObj);
    
    let newObj = Object.assign({},queryObj);
    
    delete newObj['uuid'];
    newObj['collections'] = queryObj.uuid;
    
    let result = (exist && isRemove) ? await controller.removeCollectEvent(seqModel,newObj) : await controller.addCollectEvent(seqModel,newObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
}

const newCollection = async (req,res,next) => {
    
    let queryKey = ['title','description','type'],
        must = ['title','description','type'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData.uuid || null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    queryObj['name'] = queryObj['title'];
    delete queryObj['title'];
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    if( !isPass || !author ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    queryObj['author'] = author;
    
    let result = await controller.newCollection(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
}


const editCollection = async (req,res,next) => {
    
    let queryKey = ['title','description','type','uuid'],
        must = ['title','description','uuid'],
        isPass = true;
    
    let queryObj = {},
        author = req.session.userData.uuid || null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    must.forEach( (key) => {
        (!queryObj[key]) && ( isPass = false );
    } );
    
    queryObj['name'] = queryObj['title'];
    delete queryObj['title'];
    
    if( !isPass ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    if( !isPass || !author ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    queryObj['author'] = author;
    
    let result = await controller.editCollection(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
}

module.exports = {
    newUser:newUser,
    login:login,
    getPublicKey:getPublicKey,
    postKey:postKey,
    newComment:newComment,
    update:update,
    account:account,
    newPick:newPick,
    getPick:getPick,
    getPickDetail:getPickDetail,
    removePick:removePick,
    newArticle:newArticle,
    editArticle:editArticle,
    newWebsite:newWebsite,
    newTopic:newTopic,
    newThread:newThread,
    editThread:editThread,
    deleteEvent:deleteEvent,
    sendMessage:sendMessage,
    collectEvent:collectEvent,
    newCollection:newCollection,
    editCollection:editCollection,
};
