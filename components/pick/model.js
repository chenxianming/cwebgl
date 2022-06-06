const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const pick = connect.define('pick', {
    uuid:Sequelize.STRING,
    categories:Sequelize.STRING,
    title:Sequelize.STRING,
    author:Sequelize.STRING,//uuid
    description:Sequelize.TEXT,
    litpic:Sequelize.STRING,
    child:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:[]
    },
},{
    tableName:'pick',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['child']
        },
    ]
});

//defined model
seqModel['pick'] = pick;

module.exports = {
    pick:pick
}