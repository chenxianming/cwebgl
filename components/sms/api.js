let express = require('express');
let router = express.Router();

//render api

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const getRsa = require('../../utils/getRsa');

const getIp = require('remote-ip');

const request = require('request');

const sha256 = require('sha256');

const sendMobile = (mobile,code) => new Promise( (resolve) => {
    
    let random = ~~( Math.random() * 500000 );
    
    let appID = '1400137388',
        appKEY = '4d4f6abe02c458d80e9c7eb83e8f441b';
    
    let url = `https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid=${ appID }&random=${ random }`;
    
    let mobileStr = mobile,
        strAppKey = appKEY,
        strRand = random,
        timstamp = ~~( new Date().getTime() / 1000 ),
        sign = sha256(`appkey=${ strAppKey }&random=${ random }&time=${ timstamp }&mobile=${ mobileStr }`);
    
    request({
        url:url,
        method:'post',
        timeout:6000,
        json:{
            "ext": "",
            "extend": "",
            "params": [
                code,
                15
            ],
            "sig": sign,
            sign:'短信验证',
            "tel": {
                "mobile": mobileStr,
                "nationcode": "86"
            },
            "time": timstamp,
            "tpl_id": 190738
        }
    },(err,response) => {
        
        if(err){
            return resolve(null);
        }
        
        Log( response );
        
        resolve(true);
    });
    
} );

const newRegCheck = async (req, res, next) => {
    let sDate = new Date().getTime();
    
    if( req.session.sendMsgLimit && ( (sDate - req.session.sendMsgLimit) / 1000 / 60 ) < 1 ){
        return res.json({
            msg:`请勿重复请求发送, <span class="time-limit">${ ~~(60 - ((sDate - req.session.sendMsgLimit) / 1000)) }</span> 秒后重试`
        });
    }
    
    let queryKey = ['mobile'];
    
    let queryObj = {};
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    if(!queryObj.mobile ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    let user = await controller.checkMobile(seqModel,req.body);
    
    if(user.msg){
        return res.json(user);
    }
    
    queryObj['ip'] = getIp(req);
    
    queryObj['ip'] = queryObj['ip'].replace(/\:\:(.*)\:/,'');
    
    let newSms = await controller.newRegCheck(seqModel,queryObj);
    
    if(newSms.msg){
        return res.json(newSms);
    }
    
    //send API
    await sendMobile( queryObj.mobile,newSms.result );
    
    //newSms.code
    req.session.sendMsgLimit = new Date().getTime();
    
    return res.json({
        result:'发送成功,请查看手机'
    });
}


const getPublicKey = async (req,res,next) => {
    
    if(!req.body.mobile){
        return res.json({
            msg:'缺少必要参数'
        });
    }
    
    if(req.body.captcha.toLocaleLowerCase() != req.session.captcha){
        return res.json({
            msg:'图形验证码不正确'
        });
    }
    
    delete req.session.captcha;
    
    let user = await controller.checkMobile(seqModel,req.body);
    
    if(user.msg){
        return res.json(user);
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

const confrimSms = async (req,res,next) => {
    let queryKey = ['mobile','code'];
    
    let queryObj = {};
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    if(!queryObj.mobile ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    queryObj['ip'] = getIp(req);
    queryObj['ip'] = queryObj['ip'].replace(/\:\:(.*)\:/,'');
    
    let user = await controller.checkMobile(seqModel,{
        mobile:queryObj.mobile
    });
    
    if(user.msg){
        return res.json(user);
    }
    
    
    let result = await controller.confrimSms(seqModel,queryObj);
    
    if(result.msg){
        return res.json(result);
    }
    
    req.session.checkMobile = queryObj.mobile;
    
    res.json({
        result:'验证通过'
    });
}

const checkMobile = async (req,res,next) => {
    let queryKey = ['mobile'];
    
    let queryObj = {};
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    if(!queryObj.mobile ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    let result = await controller.checkMobile(seqModel,queryObj);
    
    if(result.msg){
        return res.json(result);
    }
    
    res.json({
        result:'验证通过'
    });
}

const checkName = async (req,res,next) => {
    let queryKey = ['name'];
    
    let queryObj = {};
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    if(!queryObj.name ){
        return res.json({
            msg:'缺少必要字段'
        });
    }
    
    let result = await controller.existByName(seqModel,queryObj);
    
    if(result.msg){
        return res.json(result);
    }
    
    res.json({
        result:'验证通过'
    });
}


module.exports = {
    getPublicKey:getPublicKey,
    newRegCheck:newRegCheck,
    confrimSms:confrimSms,
    checkMobile:checkMobile,
    checkName:checkName,
};
