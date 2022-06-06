const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const eachLimit = require('../../utils/eachLimit');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

module.exports = {
    getCollection:async (models,obj) => {
        
        let queryObj = {
            where:{},
            limit:200,
            order:[[
                'updatedAt','DESC'
            ]]
        },
            task = [];
        
        for(let key in obj){
            queryObj['where'][key] = obj[key];
        }
        
        let result = await interface.queryList(models.collections,queryObj);
        
        //====get collectionCount
        task = [];
        
        const getCollectionCount = (item) => new Promise( async (resolve) => {
            
            let count = await interface.geContentListCount(models.collection,{
                where:{
                    collections:item.uuid,
                    author:item.author,
                    type:item.type
                }
            });
            
            item.count = count;
            
            resolve( item );
            
        } );
        
        result.forEach( (data) => {
            task.push( getCollectionCount(data) );
        } );
        
        result = await Promise.all( task );
        //====END
        
        return {
            result:result
        }
    },
    getChild:async (models,obj) => {
        
        let q = {
            where:obj,
            limit:4,
            sort:['updatedAt','desc']
        };
        
        let result = await interface.queryList(models.collection,q);
        
        return result;
        
    },
    getContent:async (models,obj) => {
        
        let q = {
            attributes:['uuid','litpic','title'],
            where:{
                uuid:obj.uuid
            }
        };
        
        let result = await interface.findOneCustomRedis(models[obj.type],q);
        
        return result;
        
    },
    updateLitpic:async (models,obj) => {
        let q = {
            where:{
                uuid:obj.uuid
            }
        };
        
        let result = await interface.updateOneCustom(models.collections,{
            litpic:obj.value ? `/collections/getimage/${ obj.uuid }.png` : null
        },q);
        
        return result;
    }
}