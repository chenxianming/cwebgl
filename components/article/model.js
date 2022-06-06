const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const article = connect.define('article', {
    uuid:Sequelize.STRING,
    status:{
        type:Sequelize.ENUM('normal', 'pending'),
        defaultValue:'pending'
    },
    litpic:Sequelize.STRING,
    categories:{
        type:Sequelize.ENUM('WEBGL教程', '原创文章', '翻译文章' ,'栏目专题', 'WEBGL资讯'),
        defaultValue:'原创文章'
    },
    pick:{
        type:Sequelize.STRING,//uuid
        defaultValue:null
    },
    title:Sequelize.STRING,
    author:Sequelize.STRING,//uuid
    postDate:Sequelize.BIGINT,
    views:{
        type:Sequelize.BIGINT,
        defaultValue:0
    },
    from:{
        type:Sequelize.STRING,
        defaultValue:null
    },
    fromLink:{
        type:Sequelize.STRING,
        defaultValue:null
    },
    anonymous:{
        type:Sequelize.BIGINT,
        defaultValue:0
    },
    description:Sequelize.TEXT,
    content:Sequelize.TEXT,
    tags:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:[]
    }
},{
    tableName:'article',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['status']
        },
    ]
});

const editArticle = connect.define('editArticle', {
    uuid:Sequelize.STRING,
    title:Sequelize.STRING,
    content:Sequelize.TEXT,
    pick:{
        type:Sequelize.STRING,//uuid
        defaultValue:null
    },
    from:{
        type:Sequelize.STRING,
        defaultValue:null
    },
    fromLink:{
        type:Sequelize.STRING,
        defaultValue:null
    },
    anonymous:{
        type:Sequelize.BIGINT,
        defaultValue:1
    },
    tags:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:[]
    }
},{
    tableName:'editArticle',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['pick']
        },
    ]
});

//defined model
seqModel['article'] = article;
seqModel['editArticle'] = editArticle;

//config
const config = connect.define('config', {
    uuid:Sequelize.STRING,
    key:{
        type:Sequelize.ENUM('normal', 'pending'),
        defaultValue:'normal'
    },
    value:Sequelize.STRING,
},{
    tableName:'config',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
    ]
});

//keywords
const keywords = connect.define('keywords', {
    uuid:Sequelize.STRING,
    name:Sequelize.STRING,
    pinyin:Sequelize.STRING,
    short:Sequelize.STRING,
},{
    tableName:'keywords',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['name']
        },
        {
            unique: false,
            fields: ['pinyin']
        },
        {
            unique: false,
            fields: ['short']
        },
    ]
});

//hotsearch
const hotsearch = connect.define('hotsearch', {
    uuid:Sequelize.STRING,
    keywords:Sequelize.STRING,
    views:Sequelize.BIGINT,
},{
    tableName:'hotsearch',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['keywords']
        },
    ]
});

//cache
const cache = connect.define('cache', {
    uuid:Sequelize.STRING,
    key:Sequelize.TEXT,
    value:Sequelize.TEXT,
    tbName:Sequelize.STRING,
    acName:Sequelize.STRING,
},{
    tableName:'cache',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['key']
        },
        {
            unique: false,
            fields: ['tbName']
        },
        {
            unique: false,
            fields: ['acName']
        },
    ]
});

seqModel['config'] = config;
seqModel['keywords'] = keywords;
seqModel['hotsearch'] = hotsearch;
seqModel['cache'] = cache;


module.exports = {
    article:article,
    editArticle:editArticle
}