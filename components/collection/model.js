const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const collection = connect.define('collection', {
    uuid:Sequelize.STRING,
    target:Sequelize.STRING,//uuid
    type:Sequelize.ENUM('article', 'website', 'code', 'topic'),
    author:Sequelize.STRING,//uuid
    collections:Sequelize.STRING,//uuid
},{
    tableName:'collection',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['target']
        },
        {
            unique: false,
            fields: ['type']
        },
        {
            unique: false,
            fields: ['author']
        },
        {
            unique: false,
            fields: ['collections']
        },
    ]
});

//defined model
seqModel['collection'] = collection;

module.exports = {
    collection:collection
}