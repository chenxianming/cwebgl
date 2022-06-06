const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const dateParse = require('../../utils/dateParse');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

module.exports = {
    getList:async (models,obj,options) => new Promise( async (resolve) => {
        
       const autoArr = ['status'];
        
        const queryObj = {
            //attributes:['title','postDate','views','description'],
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key && arrKey!='tags'){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
                
                
                if(arrKey=='tags' && arrKey==key){
                    let val = obj[key];
                    if(val){
                        queryObj.where['tags'] = {
                            [Op.contains]:new Array(val)
                        };
                    }
                }
            } );
        }
        
        let count = await interface.geContentListCount(models.code,queryObj);
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }
                        
                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if( val>0 ){
                                queryObj.order.push(new Array(opKey,'DESC'));
                            }else{
                                queryObj.order.push(new Array(opKey,'ASC'));
                            }
                        }
                    }
                break ;

                case 'offset' :
                    {
                        let val = options[key];
                        queryObj.offset = val;
                    }
                break ;

                case 'limit' :
                    {
                        let val = Math.min(options[key],40);

                        queryObj.limit = val;
                    }
                break ;
            }
        }
        
        results = await interface.queryList(models.code,queryObj);
        
        let task = [];
        
        //==== user
        task = [];
        
        const getUsr = (item) => new Promise( async (resolve) => {
            
            item.userDetail = ( await interface.getUserSimple(models.user,item.author) );
            resolve( item );
        } );
        
        results.forEach( (rs) => {
            task.push( getUsr(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        //==== comment
        task = [];
        
        const getCom = (item) => new Promise( async (resolve) => {
            
            let q = {
                where:{
                    target:item.uuid,
                    type:'code'
                }
            };
            
            item.comment = await interface.geContentListCount(models.comment,q);
            
            resolve( item );
        } );
        
        results.forEach( (rs) => {
            task.push( getCom(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        //==== collect
        task = [];
        
        const getColl = (item) => new Promise( async (resolve) => {
            
            let q = {
                where:{
                    target:item.uuid,
                    type:'code'
                }
            };
            
            item.collection = await interface.geContentListCount(models.collection,q);
            
            resolve( item );
        } );
        
        results.forEach( (rs) => {
            task.push( getColl(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        
        resolve( results ? {
            count:count,
            result:results
        } : {
            results:[]
        } );
        
    } ),
    getUserSimple:async (models,obj) => {
        
        let result = null,
            queryObj = {};
        
        if(!obj.uuid){
            result = {
                msg:'缺少必要字段'
            }
            return result;
        }
        
        let user = ( await interface.getUserSimple(models.user,obj.uuid) );
        
        return user;
    },
    getUser:async (models,obj) => {
        
        let fineOneCustom = {
            where:{
                uuid:obj.uuid
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        return user;
    },
    newCode:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['title','description','dependencies','author','html','js'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
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
        
        newObj['uuid'] = uuidv4();
        newObj['postDate'] = new Date().getTime();
        
        result = await interface.insertOne(models.code,newObj);
        
        return result ? {
            result:newObj['uuid']
        } : {
            msg:'添加失败'
        };
    },
    editCode:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['uuid','description','dependencies','author','html','js'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
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
        
        result = await interface.queryContentById(models,'code',obj.uuid);
        
        if(!result){
            result = {
                msg:'该代码不存在'
            };
            
            return result;
        }
        
        if( (result.author != newObj.author) && (result.author != 'admin') ){
            result = {
                msg:'作者与当前不一致，修改错误'
            };
            
            return result;
        }
           
        if(obj.litpic){
            newObj['litpic'] = obj.litpic;
        }
        
        if(obj.title){
            newObj['title'] = obj.title;
        }
        
        result = await interface.updateOneCustom(models.code,newObj,{
            where:{
                uuid:newObj.uuid
            }
        });
        
        return result ? {
            result:newObj.uuid
        } : {
            msg:'修改失败'
        };
        
    },
    getDetail:async (models,obj) => {
        
        let fineOneCustom = {
            where:{
                uuid:obj.uuid
            },
            addViews:true
        };
        
        let content = await interface.findOneCustom(models.code,fineOneCustom);
        
        if(!content){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        //get coll
        queryObj = {
            where:{
                target:obj.uuid
            }
        };
            
        content['collect'] = await interface.geContentListCount(models.collection,queryObj);
        
        //get comment
        queryObj = {
            where:{
                target:obj.uuid
            }
        };
        
        content['comment'] = await interface.geContentListCount(models.comment,queryObj);
        
        //get comment
        queryObj = {
            where:{
                forkFrom:obj.uuid
            }
        };
        
        content['forked'] = await interface.geContentListCount(models.code,queryObj);
        
        return content;
    },
    forkCode:async (models,obj) => {
        let result = null,
            newObj = {};
        
        if( !obj.uuid || !obj.author ){
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
        
        result = await interface.queryContentById(models,'code',obj.uuid);
        
        if(!result){
            result = {
                msg:'该代码不存在'
            };
            
            return result;
        }
        
        delete result.uuid;
        delete result.id;
        
        newObj = Object.assign({},result);
        
        if( result.author == obj.author ){
            result = {
                msg:'您不能fork自己的代码'
            };
            
            return result;
        }
        
        if( result.status != 'normal' ){
            result = {
                msg:'该代码正审核中,Fork失败'
            };
            
            return result;
        }
        
        //get count
        let count = await interface.geContentListCount(models.code,{
            where:{
                forkFrom:obj.uuid,
                author:obj.author
            }
        });
        
        if( count >= 10 ){
            result = {
                msg:'同一代码仅能fork10次,谢谢合作'
            };
            
            return result;
        }
        
        newObj.uuid = uuidv4();
        newObj.views = 0;
        newObj.postDate = new Date().getTime();
        newObj.forkFrom = obj.uuid;
        newObj.title += ' (fork)';
        newObj.htmlOrigin = newObj.html;
        newObj.jsOrigin = newObj.js;
        newObj.status = 'normal';
        newObj.author = obj.author;
        newObj.status = 'pending';
        
        result = await interface.insertOne(models.code,newObj);
        
        return result ? {
            result:newObj.uuid
        } : {
            msg:'Fork失败'
        };
    },
    recoverCode:async (models,obj) => {
        
        let result = null,
            newObj = {};
        
        if( !obj.uuid || !obj.author ){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = ( await interface.queryContentById(models,'user',obj.author) );
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        result = await interface.queryContentById(models,'code',obj.uuid);
        
        if(!result){
            result = {
                msg:'该代码不存在'
            };
            
            return result;
        }
        
        if( result.author != obj.author && result.author != 'admin' ){
            result = {
                msg:'作者与当前不一致，修改错误'
            };
            
            return result;
        }
        
        newObj = Object.assign({},result);
        
        newObj['js'] = result.jsOrigin;
        newObj['html'] = result.htmlOrigin;
        
        if(!result.forkFrom){
            result = {
                msg:'内容错误'
            };
            
            return result;
        }
        
        result = await interface.updateOneCustom(models.code,newObj,{
            where:{
                uuid:newObj.uuid
            }
        });
        
        return result ? {
            result:newObj.uuid
        } : {
            msg:'还原失败'
        };
    },
    getLibDetail:async (models,uuid) => new Promise( async (resolve) => {
        
        let queryObj = {
            where:{
                uuid:uuid
            }
        };

        let result = await interface.findOneCustomRedis(models.lib,queryObj);        
        
        resolve(result);
    } ),
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
    getShowCase:async (models,type) => {
        
        let q = {
            where:{
                value:`${type}top`
            }
        };
        
        let target = await interface.findOneCustomRedis(models.config,q);
        
        q = {
            where:{
                uuid:target.uuid
            }
        }
        
        let result = await interface.findOneCustomRedis(models[type],q);
        
        q = {
            where:{
                target:result.uuid,
                type:type
            }
        }
        
        let coll = await interface.geContentListCount(models.collection,q);
        
        result['collect'] = coll;
        
        let comment = await interface.geContentListCount(models.comment,q);
        
        result['comment'] = comment;
        
        q = {
            where:{
                forkFrom:result.uuid
            }
        }
        
        let fork = await interface.geContentListCount(models.code,q);
        
        result['fork'] = fork;
        
        
        let authorDetail = await interface.getUserSimple(models.user,result.author);
        
        result['authorDetail'] = authorDetail;
        
        result['postDate'] = dateParse( new Date(result.createdAt),'yyyy-MM-dd hh:mm' );
        
        return result;
    },
    thumnbnail:async (model,uuid) => {
        let q = {
            attributes:['litpic'],
            where:{
                uuid:uuid
            }
        };
        
        let result = await interface.findOneCustomRedis(model,q);
        
        return ( result && result.litpic ) ? result.litpic : null;
    }
}