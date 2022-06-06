const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

const dateParse = require('../../utils/dateParse');

module.exports = {
    getList:async (models,obj,option) => {
        
        //build queryObj
        
        let topCount = await interface.geContentListCount(models.topic,{
            where:{
                type:'置顶'
            }
        });
        
        let attributes = [],
            must = [],
            prefix = ['status','author','type'],
            sort = ['views','sortDate'],
            field = ['offset','limit'],
            result = false,
            isPass = true;
        
        let queryObj = {
            order:[],
            where:{}
        };
        
        if(attributes.length){
            queryObj.attributes = attributes;
        }
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    
                    if(val>0)
                    
                    queryObj.where[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            }
            return result;
        }
        
        for(let key in obj){
            prefix.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
            } );
        }
        
        ( queryObj.where.type == '全部' ) && ( delete queryObj.where.type );
        
        
        let count = await interface.geContentListCount(models.topic,queryObj);
        
        if(!queryObj.order){
            queryObj.order = [];
        }
        
        for(let key in option.sort){
            sort.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = option.sort[key];
                    if( val>0 ){
                        queryObj.order.push(new Array(key,'DESC'));
                    }else{
                        queryObj.order.push(new Array(key,'ASC'));
                    }
                }
            } );
        }
        
        
        for(let key in option){
            field.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = option[key];
                    queryObj[key] = val;
                }
            } );
        }
        
        //build queryObj END
        
        
        if( !(queryObj.offset>10) && ( !queryObj.where.type ) ){

            let dc = queryObj.limit;
            
            queryObj.limit = topCount;
            queryObj.where['type'] = '置顶';
            
            let arr = await interface.queryList(models.topic,queryObj);
            
            queryObj.limit = (dc-topCount);
            queryObj.where['type'] = {
                [Op.ne]:'置顶'
            }
            
            let arr2 = await interface.queryList(models.topic,queryObj);
            
            result = arr.concat( arr2 );
            
        }else{
            result = await interface.queryList(models.topic,queryObj);
        }
        
        
        let task = [];
        
        //==== user
        task = [];
        
        const getUsr = (item) => new Promise( async (resolve) => {
            item.userDetail = ( await interface.getUserSimple(models.user,item.author) );
            resolve( item );
        } );
        
        result.forEach( (rs) => {
            task.push( getUsr(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        
        //==== thread count
        task = [];

        const getThreadCount = (item) => new Promise( async (resolve) => {
            let q = {
                where:{
                    topic:item.uuid
                }
            };

            let count = await interface.geContentListCount(models.thread,q);
            item.threadCount = count;
            resolve( item );
        } );
        
        result.forEach( (rs) => {
            task.push( getThreadCount(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        //==== top latest
        task = [];

        const getTopLatest = (item) => new Promise( async (resolve) => {
            
            let queryObj = {
                attributes:['author','postDate'],
                order:[
                    ['postDate','DESC'],
                    ['index','DESC'],
                ],
                limit:1,
                where:{
                    topic:item.uuid
                }
            };
            
            let obj = await interface.queryList(models.thread,queryObj),
                rs = obj[0];
            
            rs['postDate'] = dateParse(new Date(rs.postDate * 1),'yyyy-MM-dd hh:mm');
            
            item.latest = rs;
            resolve( item );
        } );
        
        result.forEach( (rs) => {
            task.push( getTopLatest(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        
        //==== userDet
        task = [];
        
        const getUsrD = (item) => new Promise( async (resolve) => {
            item.latestDetail = ( await interface.getUserSimple(models.user,item.latest.author) );
            resolve( item );
        } );
        
        result.forEach( (rs) => {
            task.push( getUsrD(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        //get today
        let getTodayS = new Date( new Date().setHours(0,0,0,0) ).getTime(),
            getTodayE = getTodayS + 24 * 60 * 60 * 1000;
        
        let getToday = {
            where:{
                index:0,
                postDate:{
                    [Op.gte]:getTodayS,
                    [Op.lte]:getTodayE,
                }
            }
        }
        
        let today = await interface.geContentListCount(models.thread,getToday);
        
        //get today
        let getYestodayE = new Date( new Date().setHours(0,0,0,0) ).getTime(),
            getYestodayS = getYestodayE - 24 * 60 * 60 * 1000;
        
        let getYestoday = {
            where:{
                index:0,
                postDate:{
                    [Op.gte]:getYestodayS,
                    [Op.lte]:getYestodayE,
                }
            }
        }
        
        let yestoday = await interface.geContentListCount(models.thread,getYestoday);
        
        let topicCount = await interface.geContentListCount(models.topic,{}),
            threadCount = await interface.geContentListCount(models.thread,{});
        
        return result ? {
            count:count,
            result:result,
            today:today,
            yestoday:yestoday,
            topicCount:topicCount,
            threadCount:threadCount,
        } : {
            msg:'获取失败'
        };
        
    },
    getDetail:async (models,obj) => {
        
        let fineOneCustom = {
            where:{
                uuid:obj.uuid
            },
            addViews:true
        };
        
        let content = await interface.findOneCustom(models.topic,fineOneCustom);
        
        if(!content){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        return content;
    },
    getThreadList:async (models,obj,option) => {
        //build queryObj
        
        let attributes = [],
            must = ['topic'],
            prefix = ['status','author','type','topic'],
            sort = ['index'],
            field = ['offset','limit'],
            result = false,
            isPass = true;
        
        let author = new String(obj.author);
        
        delete obj.author;
        
        let queryObj = {
            order:[],
            where:{}
        };
        
        if(attributes.length){
            queryObj.attributes = attributes;
        }
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    
                    if(val>0)
                    
                    queryObj.where[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            }
            return result;
        }
        
        for(let key in obj){
            prefix.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
            } );
        }
        
        
        let count = await interface.geContentListCount(models.thread,queryObj);
        
        if(!queryObj.order){
            queryObj.order = [];
        }

        for(let key in option.sort){
            sort.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = option.sort[key];
                    
                    if( val>0 ){
                        queryObj.order.push(new Array(key,'DESC'));
                    }else{
                        queryObj.order.push(new Array(key,'ASC'));
                    }
                }
            } );
        }
        
        for(let key in option){
            field.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = option[key];
                    queryObj[key] = val;
                }
            } );
        }
        
        //build queryObj END
        
        result = await interface.queryList(models.thread,queryObj);
        
        result.forEach( (rs) => {
            rs['postDate'] = dateParse(new Date(rs.postDate * 1),'yyyy-MM-dd hh:mm');
        } );
        
        let task = [];
        
        //==== user
        task = [];
        
        const getUsr = (item) => new Promise( async (resolve) => {
            item.userDetail = ( await interface.getUserSimple(models.user,item.author) );
            resolve( item );
        } );
        
        result.forEach( (rs) => {
            task.push( getUsr(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        
        result.forEach( (rs) => {
            rs.isEdit = (rs.author == author) ? true : false;
        } );
        
        
        //get today
        let getTodayS = new Date( new Date().setHours(0,0,0,0) ).getTime(),
            getTodayE = getTodayS + 24 * 60 * 60 * 1000;
        
        let getToday = {
            where:{
                index:0,
                postDate:{
                    [Op.gte]:getTodayS,
                    [Op.lte]:getTodayE,
                }
            }
        }
        
        let today = await interface.geContentListCount(models.thread,getToday);
        
        //get today
        let getYestodayE = new Date( new Date().setHours(0,0,0,0) ).getTime(),
            getYestodayS = getYestodayE - 24 * 60 * 60 * 1000;
        
        let getYestoday = {
            where:{
                index:0,
                postDate:{
                    [Op.gte]:getYestodayS,
                    [Op.lte]:getYestodayE,
                }
            }
        }
        
        let yestoday = await interface.geContentListCount(models.thread,getYestoday);
        
        let topicCount = await interface.geContentListCount(models.topic,{}),
            threadCount = await interface.geContentListCount(models.thread,{});
        
        
        return result ? {
            count:count,
            result:result,
            today:today,
            yestoday:yestoday,
            topicCount:topicCount,
            threadCount:threadCount,
        } : {
            msg:'未能查询到内容'
        };
        
    },
    upThread:async (models,obj) => {
        
        let result = null,
            newObj = {};
        
        if(!obj.uuid || !obj.author){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = await interface.queryContentById(models,'user',obj.author);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        result = await interface.queryContentById(models,'thread',obj.uuid);
        
        if(!result){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if(result.up.indexOf(obj.author) > -1){
            result = {
                msg:'您已赞成过该内容'
            };
            
            return result;
        }
        
        result.up.push(obj.author);
        
        let updateObj = {
            up:result.up
        };
        
        let custom = {
            where:{
                uuid:obj.uuid,
            }
        };
        
        result = await interface.updateOneCustom(models.thread,updateObj,custom);
        
        return result ? {
            result:'点赞成功'
        } : {
            msg:'点赞失败'
        };
        
    },
    removeThread:async (models,obj) => {
        
        let result = null,
            newObj = {};
        
        if(!obj.uuid || !obj.author){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = await interface.queryContentById(models,'user',obj.author);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        result = await interface.queryContentById(models,'thread',obj.uuid);
        
        if(!result){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if(result.index==0){
            result = {
                msg:'请在个人中心进行删除'
            };
            
            return result;
        }
        
        if( result.author != obj.author && result.author != 'admin' ){
            result = {
                msg:'您无修改权限'
            };

            return result;
        }
        
        let queryObj = {
            where:{
                uuid:obj.uuid
            }
        };
        
        result = await interface.deleteOne(models.thread,queryObj);
        
        return result ? {
            result:'删除成功'
        } : {
            msg:'删除失败'
        };
    },
    collectExist:async (models,obj) => {
        let must = ['type','target','author'],
            queryObj = {},
            isPass = true;

        must.forEach( (key) => {
            obj[key] && ( queryObj[key] = obj[key] );
            ( !obj[key] ) && ( isPass = false );
        } )

        if(!isPass){
            return null;
        }
        
        let count = await interface.collectExist(models.collection,queryObj) || 0;

        return count;
    },
}