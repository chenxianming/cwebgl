const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

const esClient = require('../../interface/es');

module.exports = {
    queryArticleList:async (models,obj,options) => new Promise( async (resolve) => {
        
        const autoArr = ['categories','tags','author','status'];
        
        const queryObj = {
            attributes:['uuid','title','author','litpic','categories','postDate','views','status','tags'],
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
                            '$contains':new Array(val)
                        };
                    }
                }
            } );
        }
        
        let count = await interface.geContentListCount(models.article,queryObj);
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }

                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if(val){
                                queryObj.order.push(new Array(opKey,'DESC'));
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
        
        results = await interface.queryListRedis(models.article,queryObj);
        
        //==== comment
        let task = [];
        
        const getCom = (item) => new Promise( async (resolve) => {
            
            let q = {
                where:{
                    target:item.uuid,
                    type:'article'
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
        
        resolve( results ? {
            count:count,
            result:results
        } : {
            results:[]
        } );
        
    } ),
    getDetail:async (models,uuid) => new Promise( async (resolve) => {
        
        let queryObj = {
            where:{
                uuid:uuid
            }
        };

        queryObj.addViews = true;

        let result = await interface.findOneCustomRedis(models.article,queryObj);

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
    queryPickIdByArticleId:async (models,uuid) => {
        
        let result = null
        
        if(!uuid){
            result = {
                msg:'缺少必要参数'
            }
        }
        
        let findOneCustom = {
            attributes:['uuid','child'],
            where:{
                child:{
                    '$contains':new Array(uuid)
                }
            }
        };
        
        let pick = await interface.findOneCustomRedis(models.pick,findOneCustom);
        
        return pick ? {
            result:pick
        } : {
            msg:'内容不存在'
        }
    },
    queryPickDetail:async (models,obj) => {
        
        let result = null,
            findOneCustom = {};
        
        if(!obj.uuid){
            result = {
                msg:'缺少必要参数'
            }
        }
        
        findOneCustom = {
            where:{
                uuid:obj.uuid
            }
        }
        
        let pick = await interface.findOneCustomRedis(models.pick,findOneCustom);
        
        if(!pick){
            result = {
                msg:'专栏不存在'
            };
            
            return result;
        }
        
        let articles = await interface.queryListRedis(models.article,{
            where:{
                pick:obj.uuid,
                status:'normal'
            }
        });
        
        return {
            pick:pick,
            articles:articles
        }
    },
    getLatestPick:async (models) => {
        
        let pick = await interface.queryListRedis(models.pick,{
            limit:1,
            offset:0,
            order:[
                ['updatedAt','DESC']
            ],
            where:{
                child:{
                    '$ne':[]
                }
            }
        });
        
        if(!pick[0]){
            return {
                msg:'内容不存在'
            }
        }
        
        let result = pick[0];
        
        result.articles = await interface.queryListRedis(models.article,{
            where:{
                pick:result.uuid,
                status:'normal'
            },
            order:[
                ['postDate','DESC']
            ],
            limit:6
        });
        
        return result ? {
            result:result
        } : {
            msg:'内容不存在'
        }
    },
    getRelationArticle:async (models,uuid) => {
        
        if(!uuid){
            return {
                msg:'缺少必要参数'
            }
        }
        
        let findOneCustom = {
            where:{
                uuid:uuid
            }
        }
        
        let article = await interface.findOneCustomRedis(models.article,findOneCustom);
        
        if(!article){
            return {
                msg:'文章不存在'
            }
        }
        
        let queryObj = {
            where:{
                status:'normal',
                tags:{
                    '$overlap': article.tags
                },
                uuid:{
                    '$notIn':new Array(article.uuid)
                }
            },
            limit:6
        };
        
        let result = await interface.queryListRedis(models.article,queryObj);
        
        return result.length ? {
            result:result
        } : {
            result:[]
        };
    },
    getArticleBetweenInsertDate:async (models,uuid) => new Promise( async (resolve) => {
        
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
        
        result = await interface.findOneCustomRedis(models.article,queryObj);
        
        if(!result){
            result = {
                msg:'无该内容'
            };
            
            return resolve(result);
        }
        
        queryObj = {
            attributes:['id','uuid'],
            where:{
                id:{
                    '$between':new Array(result.id-1,result.id+1),
                },
                uuid:{
                    '$notIn':new Array(uuid)
                },
                status:'normal'
            },
            limit:5
        };
            
        let arr = await interface.queryListRedis( models.article,queryObj );
        
        let resultArr = [];
        
        arr.forEach( (rs) => {
            resultArr.push( {
                uuid:rs.uuid,
                idx:( result.id - rs.id ) > 0 ? 'prev' : 'next'
            } );
        } );
        
        resolve({
            result:resultArr
        });
        
    }),
    getHotList:async (models,type) => {
        
        let q = {
            where:{
                status:'normal',
            },
            order:[
                ['views','DESC']
            ],
            limit:6
        };
        
        let result = await interface.queryListRedis( models[type],q );
        
        return result;
    },
    getKeywords:async (models,keywords) => {
        
        let q = {
            attributes:['name','uuid'],
            where:{
                $or:[
                    {
                        name:{$like:`%${keywords}%`}
                    },
                    {
                        pinyin:{$iLike:`%${keywords}%`}
                    },
                    {
                        short:{$iLike:`%${keywords}%`}
                    },
                ]
            },
            limit:5
        };
        
        let result = await interface.queryListRedis( models.keywords,q );
        
        return result;
    },
    search:async (obj,options) => {
        
        Log( obj,options );
        
        obj.keywords = obj.keywords.toLocaleLowerCase();
        
        let keywordsArr = obj.keywords.split(' '),
            shouldArr = [];
        
        keywordsArr.forEach( (kw) => {
            shouldArr.push({match_phrase:{title:`${ kw }`}});
            shouldArr.push({match_phrase:{content:`${ kw }`}});
            shouldArr.push({match_phrase:{tags:`${ kw }`}});
        } );
        
        let queryObj = {
            //scroll: '30s', // keep the search results "scrollable" for 30 seconds
            index: 'cwebgl',
            body:{
                query:{
                    bool:{
                        should:shouldArr
                    },
                },
            },
        };
        
        obj.type && ( queryObj['type'] = obj.type );
        
        queryObj['from'] = options.offset;
        queryObj['size'] = options.limit;
        
        let sortObj = [];
        
        for(let key in options.sort){
            let obj = {};
            
            (key == 'postDate') && (key = 'createdAt');
            
            obj[key] = {
                order:( options.sort[key] > 0 ) ? 'asc' : 'desc'
            };
            
            sortObj.push( obj );
        }
        
        queryObj.body['sort'] = sortObj;
        
        let result = await esClient.search(queryObj);
        
        let hotList = await interface.queryListRedis( seqModel.hotsearch, {
            limit:6,
            order:[
                ['views','desc']
            ]
        } );
        
        let insertObj = {
            where:{
                keywords:obj.keywords
            },
            addViews:true
        };
        
        let hotKeywords = await interface.findOneCustomRedis( seqModel.hotsearch,insertObj );
        
        clearTimeout( global.addHotTm );
        
        global.addHotTm = setTimeout( async () => {
            if( hotKeywords ){
                return ;
            }
            
            let insertObj = {
                uuid:uuidv4(),
                keywords:obj.keywords,
                views:0
            }
            
            await interface.insertOne( seqModel.hotsearch,insertObj );
            
        },300 );
        
        ( result.hits ) && ( result.hits.hotList = hotList );
        
        return result ? result.hits : result;
        
    }
}