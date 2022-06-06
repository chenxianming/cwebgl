const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const connect = require('../../interface/connect');
const esClient = require('../../interface/es');

const Base64 = require('../../utils/base64');
const Pinyin = require('../../utils/pinyin');
const eachLimit = require('../../utils/eachLimit');

const uuidv4 = require('uuid/v4');

const delay = 5 * 60 * 1000;

const setRedis = async (key,val) => {
    return await redis.set(key,JSON.stringify(val));
}

const updateRedis = async () => {
    
    const arr = await seqModel.cache.findAll();
    
    let subscribe = [];
    
    arr.forEach( (d) => {
        subscribe.push(d.dataValues);
    } );
    
    let task = [];
    
    const getResult = (sc,idx) => new Promise( async (resolve) => {
        
        let sqlSytax = Base64.decode(sc.value);
        
        let sqlResult = await connect.query(sqlSytax,{
            raw:true
        });
        
        let val;
        
        (sc.acName=='findOne') && ( val = sqlResult[0][0] || null );
        
        (sc.acName=='findAll') && ( val = sqlResult[0] || [] );
        
        setRedis(sc.key,val).then( () => {
            resolve();
        } ).catch( (e) => {
            resolve();
        } );
        
    } );
    
    subscribe.forEach( (sc,idx) => {
        
        task.push( getResult(sc,idx) );
        
    } );
    
    await Promise.all( task );
    Log('redis updated');
    
}

//Log( Pinyin.getCamelChars('中国话').toUpperCase() );
//Log( Pinyin.getFullChars('中国话').toUpperCase() );

const getThread = (topic) => new Promise( (resolve) => {
    
    let q = {
        attributes:['uuid','content','index','createdAt'],
        where:{
            topic:topic.uuid
        }
    };
    
    let arr = [];
    
    seqModel.thread.findAll(q).then( (result) => {
        
        result.forEach( (rs) => {
            rs.dataValues && ( arr.push( rs.dataValues ) );
        } )
        
        topic.threads = arr;
        resolve( topic );
    } ).catch( (e) => {
        resolve( topic );
    } );
    
} );

const getContentByType = async (type) => {
    let count = await seqModel[type].count(),
        arr = [],
        q = {
            attributes:['uuid','tags','createdAt','views'],
            where:{
                status:'normal'
            },
            limit:count
        };
        
        switch(type){
            case 'article' :
            case 'website' :
            case 'code' :
                {
                    q['attributes'] = q['attributes'].concat(['title','description']);
                }
            break ;
                
            case 'topic' :
                {
                    q['attributes'] = q['attributes'].concat(['title']);
                }
            break ;
        }
    
        let result = await seqModel[type].findAll(q);
    
    result.forEach( (rs) => {
        rs.dataValues && ( arr.push( rs.dataValues ) );
    } );
    
    if(type=='topic'){
        await eachLimit(30,arr,getThread);
    }
    
    return arr;
}

const insertToDatabase = async (word) => {
    
    word = word.toLowerCase();
    
    let q = {
        where:{
            name:word
        }
    },exitst = await seqModel.keywords.count(q);
    
    if( exitst ){
        return true;
    }
    
    let insertObj = {};
    insertObj['uuid'] = uuidv4();
    insertObj['name'] = word;
    insertObj['pinyin'] = Pinyin.getFullChars( word ).toLowerCase();
    insertObj['short'] = Pinyin.getCamelChars( word ).toUpperCase();
    
    let result = await seqModel.keywords.create(insertObj);
    
    return result ? true : false;
}

const esSync = (obj,type) => new Promise( ( resolve ) => {
    
    let bulkArr = [],
        updateObj = {
            title:obj.title,
            content:obj.description || '',
            tags:obj.tags || '',
            createdAt:new Date( obj.createdAt ).getTime(),
            views:(obj.views * 1) || 0
        };
    
    if(type=='thread'){
        updateObj['topic'] = obj.topic;
        updateObj['idx'] = obj.idx;;
    }
    
    //lowercase
    for(let key in updateObj){
        ( isNaN( updateObj[key] ) ) && ( updateObj[key] = ( updateObj[key].toString() ).toLowerCase() );
    }
    
    return console.log( {
        index:'cwebgl',
        type:type,
        id:obj.uuid,
        body:updateObj
    } );
    
    esClient.index({
        index:'cwebgl',
        type:type,
        id:obj.uuid,
        body:updateObj
    }).then( () => {
        resolve( true )
    } ).catch( (e) => {
        Log( e );
        resolve( false );
    } );
    
    
    /*
    bulkArr.push( { index:  { _index: 'cwebgl', _type: type, _id: obj['uuid'] } } );
    bulkArr.push( updateObj );
    
    esClient.bulk({
        body:bulkArr
    }).then( () => {
        resolve( true )
    } ).catch( (e) => {
        Log( e );
        resolve( false );
    } )
    */
    
} );



const syncElasticSearch = async () => {
    
    let articles = await getContentByType('article'),
        websites = await getContentByType('website'),
        codes = await getContentByType('code'),
        topics = await getContentByType('topic');
    
    let newArr = [];
    
    topics.forEach( (topic) => {
        topic.threads.forEach( (tp) => {
            newArr.push({
                uuid:tp.uuid,
                topic:topic.uuid,
                type:'thread',
                title:topic.title,
                description:tp.content || '',
                tags:topic.tags || [],
                idx:tp.index.toString(),
                createdAt:tp.createdAt,
                views:topic.views,
            });
        } );
    } );
    
    topics = newArr;
    
    const implet = (type,obj) => new Promise( async (resolve) => {
        
        let result = await esSync( obj,type );
        
        return resolve( result ? true : false );
        
    } );
    
    (await eachLimit(30,articles,implet.bind(this,'article')) );
    (await eachLimit(30,websites,implet.bind(this,'website')) );
    (await eachLimit(30,codes,implet.bind(this,'code')) );
    (await eachLimit(30,topics,implet.bind(this,'thread')) );
    
    Log('es update');
}

const updateKeywords = async () => {
    
    let articles = await getContentByType('article'),
        websites = await getContentByType('website'),
        codes = await getContentByType('code'),
        topics = await getContentByType('topic');
    
    const implet = ( arr ) => new Promise( async (resolve) => {
        
        (await eachLimit(1,arr.tags,insertToDatabase) );
        
        resolve( true );
        
    } );
    
    (await eachLimit(1,articles,implet) );
    (await eachLimit(1,websites,implet) );
    (await eachLimit(1,codes,implet) );
    (await eachLimit(1,topics,implet) );
    
    Log('keywords updated');
}

const autoTask = async () => {
    updateRedis();
    
    setTimeout(updateKeywords,50);
    
    setTimeout(syncElasticSearch,50);
    
    setTimeout(autoTask,delay);
}

module.exports = autoTask;