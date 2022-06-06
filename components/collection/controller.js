const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

const eachLimit = require('../../utils/eachLimit');

const getImages = (col) => new Promise( (resolve) => {
    Log( col );
} );

module.exports = {
    getCollections:async (models,options) => {
        
        let count = await interface.geContentListCount(models.collection)
        
        let result = await interface.queryListRedis( models.collection,{
            limit:count
        } );
        
        //get images
        eachLimit(5,result,getImages);
        
        return result;
    }
}