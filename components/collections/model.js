const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const collections = connect.define('collections', {
    uuid:Sequelize.STRING,
    type:Sequelize.ENUM('article', 'website', 'code', 'topic'),
    litpic:Sequelize.STRING,
    author:Sequelize.STRING,//uuid
    name:Sequelize.STRING,
    description:Sequelize.STRING
},{
    tableName:'collections',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
    ]
});

//defined model
seqModel['collections'] = collections;

module.exports = {
    collections:collections
}