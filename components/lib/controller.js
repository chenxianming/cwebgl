const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

module.exports = {
    getAll:async (models) => new Promise( async (resolve) => {
        let result = interface.queryList(models.lib,{});
        
        resolve( result ? result : null );
    } ),
}