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


module.exports = {
    getList:getList
};
