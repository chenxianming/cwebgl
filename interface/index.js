const redisCacheConcept = (model,queryObj) => new Promise( (resolve) => {
    
    let redisKey = new Buffer( ( JSON.stringify(queryObj) ) , 'utf-8').toString('base64');
    
    redis.get(redisKey,(err,redisResult) => {
        if(redisResult){
            return resolve(JSON.parse(redisResult));
        }
        
        model.findAll(queryObj).then( (results) => {
            
            let arr = [];

            results.forEach( (d) => {
                arr.push(d.dataValues);
            } );

            resolve(arr);
            //subscribe queryObj to update list
            //redis.set(redisKey,JSON.stringify(arr));
        } ).catch( e => {
            resolve([]);
        } );
    });
} );


const uuidv4 = require('uuid/v4');
const Base64 = require('../utils/base64');

let addViewsTm = null;

const setRedis = async (key,val) => {
    return await redis.set(key,JSON.stringify(val));
}

const addSubscribe = async (key,q,tbName,acName) => {
    
    let where = {
        where:{
            key:key
        }
    };
    
    let tar = await seqModel.cache.findOne(where);
    
    let updateObj = {
        uuid:uuidv4(),
        key:key,
        value:JSON.stringify(q),
        tbName:tbName,
        acName:acName
    }
    
    return ( !tar ) ? ( await seqModel.cache.create( updateObj ) ) : ( await seqModel.cache.update(updateObj,where) );
}


//========================== cache query

const findOneCustomRedis = (model,obj) => new Promise( async (resolve) => {
    
    let isAddviews = obj.addViews ? true : false;
    
    delete obj.addViews;
    
    if(isAddviews){
        clearTimeout(addViewsTm);
        addViewsTm = setTimeout( () => {
            model.findOne(obj).then( (result) => {
                (isAddviews && result) && result.increment('views');
            } );
        },200);
    }
    
    obj.findTable = model.name;
    
    let redisKey = new Buffer( ( JSON.stringify(obj) ) , 'utf-8').toString('base64');
    
    let redisResult = await redis.get(redisKey);
    
    if(redisResult){
        return resolve(JSON.parse(redisResult));
    }
    
    let countObj = {};
    obj.where && ( countObj['where'] = obj.where );
    let count = await model.count(countObj);
    
    if(!count){
        return resolve(null);
    }
    
    let sqlRaw = '';
    
    obj['logging'] = (log) => {
        sqlRaw = Base64.encode(log.replace(`Executing (default): `,''));
    }
    
    delete obj.findTable;
    
    model.findOne(obj).then( (rs) => {
        
        let result = rs ? rs.dataValues : null;
        
        result && addSubscribe(redisKey,sqlRaw,model.name.toString(),'findOne');
        result && setRedis(redisKey,result);
        
        resolve(result);
        
    } ).catch( e => {
        resolve(null);
    } );
    
} );

const queryListRedis = (model,queryObj) => new Promise( async (resolve) => {

    queryObj.findTable = model.name;
    
    let redisKey = new Buffer( ( JSON.stringify(queryObj) ) , 'utf-8').toString('base64');
    
    let redisResult = await redis.get(redisKey);
    
    if(redisResult){
        return resolve(JSON.parse(redisResult));
    }
    
    queryObj['logging'] = (log) => {
        sqlRaw = Base64.encode(log.replace(`Executing (default): `,''));
    }
    
    delete queryObj.findTable;
    
    model.findAll(queryObj).then( (results) => {
        let arr = [];
        
        results.forEach( (d) => {
            arr.push(d.dataValues);
        } );
        
        
        (results) && addSubscribe(redisKey,sqlRaw,model.name.toString(),'findAll');
        (results) && setRedis(redisKey,arr);
        
        resolve(arr);
    } ).catch( e => {
        resolve([]);
    } );
    
});



//========================== sql query

const findOneCustom = (model,obj) => new Promise( (resolve) => {
    
    let isAddviews = obj.addViews ? true : false;
    delete obj.addViews;
    
    model.findOne(obj).then( (result) => {
        
        (isAddviews) && result.increment('views');
        
        resolve(result ? result.dataValues : null);
    } ).catch( e => {
        resolve(null);
    } );
    
} );

const updateOneCustom = (model,obj,option) => new Promise( (resolve) => {
    
    model.update(obj,option).then( (result) => {
        resolve(result ? true : null);
    } ).catch( e => {
        resolve(null);
    } );
    
} );

const deleteOne = (model,obj) => new Promise( (resolve) => {
    
    model.destroy(obj).then( (result) => {
        resolve(result ? true : null);
    } ).catch( e => {
        resolve(null);
    } );
    
} );

const geContentListCount = (model,queryObj) => new Promise( (resolve) => {
    
    delete queryObj.attributes;
    
    model.count(queryObj).then( (result) => {
        resolve(result || 0);
    } ).catch( e => {
        resolve(null);
    } );
    
} );


const queryList = (model,queryObj) => new Promise( (resolve) => {
    
    model.findAll(queryObj).then( (results) => {
        let arr = [];
        
        results.forEach( (d) => {
            arr.push(d.dataValues);
        } );
        
        resolve(arr);
    } ).catch( e => {
        
        Log(e);
        resolve([]);
    } );
    
} );

const collectExist = async (model,obj) => {
    
    let must = ['type','target','author'],
        queryObj = {
            where:{}
        },
        isPass = true;
    
    must.forEach( (key) => {
        obj[key] && ( queryObj['where'][key] = obj[key] );
        ( !obj[key] ) && ( isPass = false );
    } )
    
    if(!isPass){
        return null;
    }
    
    let count = await model.count(queryObj) || 0;
    
    return count;
}

const getUserSimple = (model,uuid) => new Promise( (resolve) => {
    
    
    module.exports.findOneCustomRedis(seqModel.user,{
        attributes:['uuid','name','credit','avatar','postScript'],
        where:{
            uuid:uuid
        }
    }).then( (result) => {
        resolve(result || null);
    } ).catch( e => {
        resolve(null);
    } );
    
    /*
    model.findOne({
        attributes:['uuid','name','credit','avatar','postScript'],
        where:{
            uuid:uuid
        }
    }).then( (result) => {
        resolve(result ? result.dataValues : null);
    } ).catch( e => {
        resolve(null);
    } );
    */
    
} );

const insertOne = (model,obj) => new Promise( (resolve) => {
    
    model.create(obj).then( (result) => {
        resolve(result ? result.dataValues : null);
    } ).catch( e => {
        resolve(null);
    } );
    
});

const syncSessionBySid = (sid,obj) => new Promise( (resolve) => {
    
    let data,
        newObj,
        result;
    
    redis.get( sid ).then( (data) => {
        
        try{
            let json = JSON.parse( data );
            newObj = Object.assign( json,obj );
            redis.set(sid,JSON.stringify(newObj) );
            resolve(true);
        }catch(e){
            Log(e);
            resolve( null );
        }
        
    } ).catch( (e) => {
        resolve( null );
    } );
    
} );

const queryContentById = (models,type,uuid) => new Promise( (resolve) => {
    
    models[type].findOne({
        where:{
            uuid:uuid
        }
    }).then( (result) => {
        resolve(result ? result.dataValues : null);
    } ).catch( e => {
        resolve(null);
    } );
    
} );

module.exports = {
    findOneCustom:findOneCustom,
    findOneCustomRedis:findOneCustomRedis,
    geContentListCount:geContentListCount,
    queryList:queryList,
    queryListRedis:queryListRedis,
    getUserSimple:getUserSimple,
    insertOne:insertOne,
    deleteOne:deleteOne,
    updateOneCustom:updateOneCustom,
    syncSessionBySid:syncSessionBySid,
    queryContentById:queryContentById,
    collectExist:collectExist,
}