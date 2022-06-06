const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const user = connect.define('user', {
    uuid:Sequelize.STRING,
    name:Sequelize.STRING,
    loginToken:Sequelize.STRING,
    password:Sequelize.STRING,
    mobile:Sequelize.BIGINT,
    credit:{
        type:Sequelize.BIGINT,
        defaultValue:0
    },
    avatar:Sequelize.STRING,
    postScript:Sequelize.STRING,
    male:{
        type:Sequelize.ENUM('男', '女', '未知'),
        defaultValue:'未知'
    },
    age:Sequelize.STRING,
    location:Sequelize.STRING,
    email:Sequelize.STRING,
    job:Sequelize.STRING,
    company:Sequelize.STRING,
    wechat:Sequelize.STRING,
    qq:Sequelize.STRING,
    weibo:Sequelize.STRING,
    link:Sequelize.STRING,
    be:Sequelize.STRING,
    github:Sequelize.STRING,
},{
    tableName:'user',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: true,
            fields: ['name']
        },
        {
            unique: true,
            fields: ['mobile']
        },
    ]
});

const message = connect.define('message', {
    uuid:Sequelize.STRING,
    title:Sequelize.STRING,
    postDate:{
        type:Sequelize.BIGINT,
        defaultValue:0
    },
    status:{
        type:Sequelize.ENUM('read', 'unread'),
        defaultValue:'unread'
    },
    author:Sequelize.STRING,//uuid
    to:Sequelize.STRING,//uuid
    content:Sequelize.TEXT,
},{
    tableName:'message',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['to']
        },
        {
            unique: false,
            fields: ['status']
        },
    ]
});

//defined model
seqModel['user'] = user;
seqModel['message'] = message;

module.exports = {
    user:user
}