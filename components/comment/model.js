const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const comment = connect.define('comment', {
    uuid:Sequelize.STRING,
    status:{
        type:Sequelize.ENUM('normal', 'pending'),
        defaultValue:'pending'
    },
    postDate:Sequelize.BIGINT,
    target:Sequelize.STRING,//uuid
    type:Sequelize.ENUM('article', 'website', 'code'),
    author:Sequelize.STRING,//uuid
    content:Sequelize.TEXT
},{
    tableName:'comment',
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
            fields: ['postDate']
        },
        {
            unique: false,
            fields: ['type']
        },
        {
            unique: false,
            fields: ['author']
        },
    ]
});

//defined model
seqModel['comment'] = comment;

module.exports = {
    comment:comment
}