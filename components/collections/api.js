let express = require('express');
let router = express.Router();

//render api

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const getRsa = require('../../utils/getRsa');

const getIp = require('remote-ip');

const getCollection = async (req,res,next) => {
    let must = ['type'],
        isPass = true,
        queryObj = {},
        sDate = new Date().getTime();
    
    must.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
        (!req.body[key]) && ( isPass = false );
    } );
    
    let author = req.session.userData.uuid || null; 
    
    if(!isPass || !author){
        return res.json({
            msg:'缺少必填参数'
        });
    }
    
    queryObj['author'] = author;
    
    let result = await controller.getCollection(seqModel,queryObj);
    
    result['timestamp'] = `${ new Date().getTime() - sDate }(ms)`;
    
    res.json(result);
}

module.exports = {
    getCollection:getCollection
};
