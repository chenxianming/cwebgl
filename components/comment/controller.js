const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

module.exports = {
    getList:async (models,obj,options) => new Promise( async (resolve) => {
        
       const autoArr = ['type','target'];
        
        const queryObj = {
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key && arrKey!='tags'){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
            } );
        }
        
        let count = await interface.geContentListCount(models.comment,queryObj);
        
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
        
        results = await interface.queryList(models.comment,queryObj);
        
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
}