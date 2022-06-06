let express = require('express');
let router = express.Router();

//render api

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const getList = async (req, res, next) => {
    
    let sDate = new Date().getTime(),
        renderObj = {};
    
    let result = await controller.getAll(seqModel);
    
    if(!result){
        return res.json({
            msg:'获取依赖失败,请重试'
        });
    }
    
    renderObj['data'] = result;
    
    res.json(renderObj);
};

const up = async (req, res, next) => {
    
    let sDate = new Date().getTime(),
        renderObj = {};
    
    let author = req.session.userData.uuid || null;
    
    let uuid = req.body.uuid || null;
    
    if(!author || !uuid){
        return res.json({
            msg:'缺少必填参数'
        });
    }
    
    let result = await controller.upThread(seqModel,{
        uuid:uuid,
        author:author
    });
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json( result );
    
};


const removeThread = async (req, res, next) => {

    let sDate = new Date().getTime(),
        renderObj = {};
    
    let author = req.session.userData.uuid || null;
    
    let uuid = req.body.uuid || null;
    
    if(!author || !uuid){
        return res.json({
            msg:'缺少必填参数'
        });
    }
    
    let result = await controller.removeThread(seqModel,{
        uuid:uuid,
        author:author
    });
    
    ( !result.msg ) && ( req.session.postLimit = new Date().getTime() );
    
    res.json( result );
}


module.exports = {
    getList:getList,
    up:up,
    removeThread:removeThread,
};
