const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

module.exports = {
    addViews:async (models,obj) => {
        let queryObj = {
            where:{
                uuid:obj.uuid
            },
            addViews:true
        };

        let result = await interface.findOneCustom(models.website,queryObj);
        
        return result;
    },
    queryWebSiteList:async (models,obj,options) => new Promise( async (resolve) => {
        
        const autoArr = ['categories','author','status'];
        
        const containArr = ['tags','categories','language','platform','hsb','hsbl'];
        
        const queryObj = {
            attributes:['uuid','title','author','litpic','categories','postDate','views','status','tags','link','color','language','platform'],
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if( arrKey == key ){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
            } );
            
            containArr.forEach( (arrKey) => {
                if( arrKey == key && (arrKey != 'hsb') && (arrKey != 'hsbl') ){
                    let val = obj[key];
                    
                    queryObj.where[key] = {
                        [Op.contains]:new Array(val.toString())
                    };
                }
                
            } );
        }
        
        if( obj.hasOwnProperty('hsb') && obj.hasOwnProperty('hsbl') ){
            
            queryObj.where[Op.or] = [];
            
            for(let i = 0;i<6;i++){
                
                let pushObj = {};
                
                pushObj[`hsb${i+1}`] = {[Op.contains]: obj.hsb};
                pushObj[`hsbs${i+1}`] = {[Op.contains]: obj.hsbs};
                pushObj[`hsbl${i+1}`] = {[Op.contains]: obj.hsbl};
                
                queryObj.where[Op.or].push(pushObj);
                
            }

            /*
                where:{
                    [Op.or]:[
                        {
                            hsb1:{
                                [Op.contains]: new Array(hsb-3,hsb+3)
                            },
                            hsbl1:{
                                [Op.contains]: new Array(lsbl-20,lsbl+20)
                            }
                        },
                    ]
                }
            */
            
        }
        
        let count = await interface.geContentListCount(models.website,queryObj);
        
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
        
        results = await interface.queryList(models.website,queryObj);
        
        //==== collect
        let task = [];
        
        const getColl = (item) => new Promise( async (resolve) => {
            
            let q = {
                where:{
                    target:item.uuid,
                    type:'website'
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
        
        //==== comment
        task = [];
        
        const getCom = (item) => new Promise( async (resolve) => {
            
            let q = {
                where:{
                    target:item.uuid,
                    type:'website'
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
        
        resolve(results ? {
            count:count,
            result:results,
            limit:queryObj.limit
        } : {
            results:[]
        });
        
    } ),
    getDetail:async (models,uuid) => new Promise( async (resolve) => {
        
        let queryObj = {
            where:{
                uuid:uuid
            }
        };

        let result = await interface.findOneCustomRedis(models.website,queryObj);

        if(!result){
            return resolve({
                msg:'内容不存在'
            });
        }

        //get collect
        queryObj = {
            where:{
                target:uuid,
                type:'website'
            },
            limit:20
        };
        
        result.collection = await interface.queryList(models.collection,queryObj);
        
        let task = [];
        
        //getUserSimple
        task = [];
        const getCollectUserSimple = (col) => new Promise( (resolve) => {
            let author = col.author || '';
            
            interface.getUserSimple(models,author).then( (item) => {
                col = item;
                resolve( col );
            } ).catch( (e) => {
                col = {};
                resolve( col );
            } );
        } )
        
        result.collection.forEach( (col) => {
            task.push(getCollectUserSimple(col));
        } );

        result.collection = await Promise.all( task );
        
        //get commment
        queryObj = {
            where:{
                target:uuid,
                type:'website'
            }
        };

        result.comment = await interface.geContentListCount(models.comment,queryObj);

        resolve(result);
    } ),
    getWebsiteRelation:async (models,uuid) => new Promise( async (resolve) => {
        
        let result = null,
            newObj = {},
            tags = [],
            categories = [],
            color = [],
            resultArr = [],
            resultArrId = [];
        
        if(!uuid){
            result = {
                msg:'缺少必填字段'
            };
            
            return resolve(result);
        }
        
        let queryObj = {
            where:{
                uuid:uuid
            }
        };

        result = await interface.findOneCustomRedis(models.website,queryObj);
        
        if(!result){
            result = {
                msg:'该网站未收录'
            };
            
            return resolve(result);
        }
        
        tags = result.tags;
        categories = result.categories;
        color = result.color;
        
        queryObj = {
            where:{
                status:'normal',
                tags:{
                    '$overlap': tags
                },
                uuid:{
                    '$notIn':new Array(uuid)
                }
            },
            limit:5
        };
        
        resultArr = await interface.queryListRedis(models.website,queryObj);
        
        if(resultArr.length>=3){
            return resolve({
                result:resultArr
            });
        }
        
        resultArr.forEach( (rs) => {
            resultArrId.push(rs.uuid);
        } );
        
        queryObj = {
            where:{
                status:'normal',
                categories:{
                    '$overlap': categories
                },
                uuid:{
                    '$notIn':new Array(uuid)
                }
            },
            limit:5
        };
        
        let simWebsiteByCategory = await interface.queryListRedis(models.website,queryObj);
        
        simWebsiteByCategory.forEach( (rs) => {
            ( resultArrId.indexOf(rs.uuid) < 0 ) && resultArr.push( rs );
        } );
        
        resultArrId = [];
        
        resultArr.forEach( (rs) => {
            resultArrId.push(rs.uuid);
        } );
        
        if(resultArr.length>=3){
            return resolve( {
                result:resultArr
            } );
        }
        
        resultArr.forEach( (rs) => {
            resultArrId.push(rs.uuid);
        } );
        
        queryObj = {
            where:{
                status:'normal',
                color:{
                    '$overlap': color
                },
                uuid:{
                    '$notIn':new Array(uuid)
                }
            },
            limit:5
        };
        
        let simWebsiteByColor = await interface.queryListRedis(models.website,queryObj);
        
        simWebsiteByColor.forEach( (rs) => {
            ( resultArrId.indexOf(rs.uuid) < 0 ) && resultArr.push( rs );
        } );
        
        return resolve( resultArr );
        
    }),
    getWebsiteBetweenInsertDate:async (models,uuid) => new Promise( async (resolve) => {
        
        let result = null,
            queryObj = {};
        
        if(!uuid){
            result = {
                msg:'缺少必填字段'
            };
            
            return resolve(result);
        }
        
        queryObj = {
            where:{
                uuid:uuid,
                status:'normal'
            }
        };
        
        result = await interface.findOneCustomRedis(models.website,queryObj);
        
        if(!result){
            result = {
                msg:'该网站未收录'
            };
            
            return resolve(result);
        }
        
        queryObj = {
            attributes:['id','uuid'],
            where:{
                id:{
                    '$between':[ (result.id-10) , (result.id+10) ],
                },
                uuid:{
                    '$notIn':new Array(uuid)
                },
                status:'normal'
            },
            limit:20
        };
        
        let arr = await interface.queryListRedis( models.website,queryObj );

        let distArr = [],
            resultArr = [];
        
        arr.forEach( (output) => {
            output.dist = Math.abs( result.id - output.id );
        } );
        
        arr.sort( (b,a) => ( b.dist - a.dist ) );
        
        for( let i = 0;i < arr.length;i++ ){
            if( arr[i].id < result.id ){
                resultArr.push({
                    uuid:arr[i].uuid,
                    idx:'next'
                });
                break ;
            }
        }
        
        for( let i = 0;i < arr.length;i++ ){
            if( arr[i].id > result.id ){
                resultArr.push({
                    uuid:arr[i].uuid,
                    idx:'prev'
                });
                break ;
            }
        }
        
        resolve({
            result:resultArr
        });
        
    }),
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
        
        return result;
    }
}