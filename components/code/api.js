let express = require('express');
let router = express.Router();

//render api
const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const getUser = (uuid) => new Promise( async (resolve) => {
    
    let user = await controller.getUser(seqModel,{
        uuid:uuid
    });
    
    resolve( user );
    
} );

const sync = async (req, res, next) => {
    
    let sDate = new Date().getTime(),
        renderObj = {};
    
    req.session.htmlCode = req.body.htmlCode;
    req.session.jsCode = req.body.jsCode;
    req.session.dependencies = req.body.dependencies;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['result'] = 'done.'
    
    res.json(renderObj);
};

const editCode = async (req, res, next) => {
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    let queryKey = ['title','description','dependencies','html','js','uuid'];
    
    let queryObj = {},
        isPass = true,
        uuid = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
        (!req.body[key]) && ( isPass = false );
    } );
    
    queryObj['author'] = uuid;
    
    if(!isPass){
        return res.json({
            msg:'缺少必要参数'
        });
    }
        
    if( !queryObj.dependencies.hasOwnProperty('length') ){
        return res.json({
            msg:'参数错误'
        });
    }
    
    if(queryObj.title.length >= 50 || queryObj.description.length >= 200){
        return res.json({
            msg:'长度错误'
        });
    }

    result = await controller.editCode(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    return result ? res.json(result) : res.json({
        msg:'修改失败'
    });
    
}


const newCode = async (req, res, next) => {
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    let queryKey = ['title','description','dependencies','html','js'];
    
    let queryObj = {},
        isPass = true,
        uuid = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
        (!req.body[key]) && ( isPass = false );
    } );
    
    queryObj['author'] = uuid;
    
    if(!isPass){
        return res.json({
            msg:'缺少必要参数'
        });
    }
        
    if( !queryObj.dependencies.hasOwnProperty('length') ){
        return res.json({
            msg:'参数错误'
        });
    }
    
    if(queryObj.title.length >= 50 || queryObj.description.length >= 200){
        return res.json({
            msg:'长度错误'
        });
    }

    result = await controller.newCode(seqModel,queryObj);
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    return result ? res.json(result) : res.json({
        msg:'添加失败'
    });
    
}

const fork = async (req, res, next) => {
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    let queryKey = ['uuid'];
    
    let queryObj = {},
        isPass = true,
        uuid = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
        (!req.body[key]) && ( isPass = false );
    } );
    
    queryObj['author'] = uuid;
    
    if(!isPass){
        return res.json({
            msg:'缺少必要参数'
        });
    }
        
    let result = await controller.forkCode( seqModel,queryObj );
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
    
}

const recover = async (req, res, next) => {
    if( req.body.cerf != req.session.cerf ){
        return res.json({
            msg:'密钥不正确,请重新操作'
        });
    }
    
    delete req.session.cerf;
    
    let queryKey = ['uuid'];
    
    let queryObj = {},
        isPass = true,
        uuid = req.session.userData ? req.session.userData.uuid : null;
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
        (!req.body[key]) && ( isPass = false );
    } );
    
    queryObj['author'] = uuid;
    
    if(!isPass){
        return res.json({
            msg:'缺少必要参数'
        });
    }
        
    let result = await controller.recoverCode( seqModel,queryObj );
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json(result);
    
}




module.exports = {
    sync:sync,
    newCode:newCode,
    editCode:editCode,
    fork:fork,
    recover:recover,
};
