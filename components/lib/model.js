const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const lib = connect.define('lib', {
    uuid:Sequelize.STRING,
    name:Sequelize.STRING,
    version:Sequelize.STRING,
    url:Sequelize.STRING,
    initial:Sequelize.TEXT,
},{
    tableName:'lib',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
    ]
});

//defined model
seqModel['lib'] = lib;

module.exports = {
    lib:lib
}