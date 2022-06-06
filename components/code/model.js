const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const code = connect.define('code', {
    uuid:Sequelize.STRING,
    status:{
        type:Sequelize.ENUM('normal', 'pending'),
        defaultValue:'pending'
    },
    title:Sequelize.STRING,
    litpic:Sequelize.STRING,
    author:Sequelize.STRING,//uuid
    postDate:Sequelize.BIGINT,
    views:{
        type:Sequelize.BIGINT,
        defaultValue:0
    },
    forkFrom:{
        type:Sequelize.STRING,//uuid
        defaultValue:null
    },
    description:Sequelize.TEXT,
    dependencies:Sequelize.ARRAY(Sequelize.TEXT),
    html:Sequelize.TEXT,
    js:Sequelize.TEXT,
    htmlOrigin:Sequelize.TEXT,
    jsOrigin:Sequelize.TEXT,
    tags:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:[]
    }
},{
    tableName:'code',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
    ]
});

//defined model
seqModel['code'] = code;

module.exports = {
    code:code
}