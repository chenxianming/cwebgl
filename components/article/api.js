let express = require('express');
let router = express.Router();

//render api

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');
const bytelength = require('../../utils/bytelength');

const qiniu = require('qiniu');
const config = require('../../config');

const getList = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['c','p','sort'];
    
    let renderObj = {
            title:'文章',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    let brige = new Array({status:'normal'},{sort:{postDate:1},limit:10});
    
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
    
    let latestPick = await controller.getLatestPick(seqModel);
    
    renderObj['latestPick'] = latestPick.result;
    
    let lists = await controller.queryArticleList(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd') );
    } );
    
    lists['option'] = brige[0];
    
    let hotList = await controller.queryArticleList(seqModel,{status:'normal'},{sort:{views:1},limit:6});
    
    renderObj['hotList'] = hotList;
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    res.json(renderObj);
};

const uploadKey = async (req,res,next) => {

    if(!req.body.cerf){
        return res.json({
            msg:'缺少必填参数'
        });
    }
    
    if( new Date().getTime() - ( req.body.cerf * 1 ) > ( 2 * 60 * 1000 ) ){
        return res.json({
            msg:'验证已过期,请重试'
        });
    }
    
    let accessKey = config.qiniu.accessKey,
        secretKey = config.qiniu.secretKey,
        mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    
    let options = {
        scope: config.qiniu.scope,
        fsizeLimit:1024 * 1024 * 5,//5m文件限制
        expires: 7200
    },
        putPolicy = new qiniu.rs.PutPolicy(options),
        uploadToken = putPolicy.uploadToken(mac);
    
    res.json({
        result:uploadToken
    });
}

const getkeywords = async (req,res,next) => {
    
    let keywords = req.body.keywords || null;
    
    if( !keywords || bytelength(keywords) < 2 ){
        return res.json({
            msg:'缺少必要字段'
        })
    }
    
    let result = await controller.getKeywords( seqModel,keywords );
    
    res.json({
        result:result
    });
}

const clearKeywords = async (req,res,next) => {

    if(!req.body.cerf){
        return res.json({
            msg:'缺少必填参数'
        });
    }
    
    if( new Date().getTime() - ( req.body.cerf * 1 ) > ( 2 * 60 * 1000 ) ){
        return res.json({
            msg:'验证已过期,请重试'
        });
    }
    
    req.session.searchHistroy = [];
    
    return res.json({
        result:true
    });
}

module.exports = {
    getList:getList,
    uploadKey:uploadKey,
    getkeywords:getkeywords,
    clearKeywords:clearKeywords,
};
