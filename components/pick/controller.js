const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

module.exports = {
    queryPickList:async (models,obj,options) => new Promise( async (resolve) => {
        
       const autoArr = ['categories','uuid','author'];
        
        const queryObj = {
            attributes:['uuid','title','author','litpic','categories','views'],
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
        
        queryObj['where']['child'] = {
            [Op.ne]:[]
        };
        
        let count = await interface.geContentListCount(models.pick,queryObj);
        
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
        
        results = await interface.queryList(models.pick,queryObj);

        let task = [];

        const setArticle = (lst) => new Promise( async (resolve) => {
            lst.articles = await interface.queryList(models.article,{
                where:{
                    pick:lst.uuid,
                    status:'normal'
                }
            });
            resolve( lst );
        } );
        
        results.forEach( (lst) => {
            task.push( setArticle(lst) );
        } );

        results = await Promise.all( task );
        
        resolve( results ? {
            count:count,
            result:results
        } : {
            results:[]
        } );
        
    } ),
}