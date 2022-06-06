let express = require('express');
let router = express.Router();

const controller = require('./controller');

const addViews = async (req,res,next) => {
    if(!req.body.uuid){
        return res.json({
            msg:'缺少必填参数'
        });
    }
    
    let result = controller.addViews(seqModel,{
        uuid:req.body.uuid
    });
    
    res.json(result);
}

module.exports = {
    addViews:addViews
}
