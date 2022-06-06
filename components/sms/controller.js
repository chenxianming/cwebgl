const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

module.exports = {
    checkMobile:async (models,obj) => new Promise( async (resolve) => {
        
        let result = {
            result:'可用'
        }
        
        if(!obj.mobile){
            result = {
                msg:'缺少必填参数'
            }
            
            return resolve(result);
        }
        
        let findOneCustom = {
            where:{
                mobile:obj.mobile
            }
        };
        
        let user = await interface.findOneCustom(models.user,findOneCustom);
        
        if( user ){
            result = {
                msg:'手机号码已存在'
            };
            
            return resolve(result);
        }
        
        resolve(result);
    }),
    existByName:async (models,obj) => new Promise( async (resolve) => {
    
        let result = {
            result:'可用'
        }

        if(!obj.name){
            result = {
                msg:'缺少必填参数'
            }
            
            return resolve(result);
        }
        
        let findOneCustom = {
            where:{
                name:{
                    [Op.iLike]:obj.name
                }
            }
        };
        
        let user = await interface.findOneCustom(models.user,findOneCustom);
        
        if( user ){
            result = {
                msg:'用户已存在'
            };
            
            return resolve(result);
        }
        
        resolve(result);
    }),
    newRegCheck:async (models,obj) => new Promise( async (resolve) => {
        
        let result = null,
            newObj = {},
            timestamp = new Date().getTime(),
            findOneCustom;
        
        var mobilePt = /^(86)?((13\d{9})|(15[0,1,2,3,5,6,7,8,9]\d{8})|(17[0,1,2,3,5,6,7,8,9]\d{8})|(18[2,3,0,5,6,7,8,9]\d{8}))$/;
        
        if(!obj.mobile || !obj.ip){
            result = {
                msg:'缺少必填参数'
            };
            
            return resolve(result);
        }
        
        if(!mobilePt.test(obj.mobile)){
            result = {
                msg:'手机格式不正确'
            };

            return resolve(result);
        }
        
        findOneCustom = {
            where:{
                ip:obj.ip
            },
            order:[
                ['createdAt','DESC']
            ]
        };
        
        let sms = await interface.findOneCustom(models.sms,findOneCustom);
        
        ( sms && sms.sendDate ) && ( sms.sendDate *= 1 );
        
        Log( sms ? ( ( ( timestamp - sms.sendDate ) / 1000 / 60 )+' (m)' ) : '' );

        if( sms && ( ( ( timestamp - sms.sendDate ) / 1000 / 60 ) < 5 ) ){
            result = {
                msg:'在5分钟内仅可发送一次短信'
            };
            
            return resolve(result);
        }
        
        let code = randomKey(4,1);
        
        newObj = {
            uuid:uuidv4(),
            code:code,
            sendDate:timestamp,
            type:'phone',
            value:obj.mobile,
            ip:obj.ip
        };
        
        result = await interface.insertOne( models.sms,newObj );
        
        resolve(result ? {
            result:code
        } : {
            msg:'发送失败'
        });
        
    } ),
    confrimSms:async (models,obj) => new Promise( async (resolve) => {
        
        let result = null,
            newObj = {},
            timestamp = new Date().getTime(),
            findOneCustom;
        
        var mobilePt = /^(86)?((13\d{9})|(15[0,1,2,3,5,6,7,8,9]\d{8})|(17[0,1,2,3,5,6,7,8,9]\d{8})|(18[2,3,0,5,6,7,8,9]\d{8}))$/;
        
        if(!obj.mobile || !obj.ip || !obj.code){
            result = {
                msg:'缺少必填参数'
            };
            
            return resolve(result);
        }
        
        if(!mobilePt.test(obj.mobile)){
            result = {
                msg:'手机格式不正确'
            };

            return resolve(result);
        }
        
        findOneCustom = {
            where:{
                ip:obj.ip,
                value:obj.mobile
            },
            order:[
                ['createdAt','DESC']
            ]
        };
        
        let sms = await interface.findOneCustom(models.sms,findOneCustom);
        
        if(!sms){
            result = {
                msg:'请重新发送信息'
            };

            return resolve(result);
        }
        
        if( ( ( ( timestamp - sms.sendDate ) / 1000 / 60 ) > 15 ) ){
            result = {
                msg:'验证码已过期,请重新发送'
            };
            
            await interface.deleteOne(models.sms,findOneCustom);
            
            return resolve(result);
        }
        
        if( obj.code != sms.code ){
            result = {
                msg:'验证码不正确,请重新发送'
            };
            
            return resolve(result);
        }
        
        //await interface.deleteOne(models.sms,findOneCustom);
            
        resolve({
            result:'验证通过'
        })
        
    } )
}