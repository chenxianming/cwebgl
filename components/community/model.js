const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const topic = connect.define('topic', {
    uuid:Sequelize.STRING,
    status:{
        type:Sequelize.ENUM('normal', 'pending'),
        defaultValue:'pending'
    },
    type:{
        type:Sequelize.ENUM('讨论', '求助', '教程', '精华', '置顶'),
        defaultValue:'讨论'
    },
    title:Sequelize.STRING,
    author:Sequelize.STRING,//uuid
    sortDate:Sequelize.BIGINT,
    views:{
        type:Sequelize.BIGINT,
        defaultValue:0
    },
    tags:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:[]
    }
},{
    tableName:'topic',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
    ]
});

const thread = connect.define('thread', {
    uuid:Sequelize.STRING,
    topic:Sequelize.STRING,
    status:{
        type:Sequelize.ENUM('normal', 'pending'),
        defaultValue:'normal'
    },
    author:Sequelize.STRING,//uuid
    postDate:Sequelize.BIGINT,
    index:Sequelize.BIGINT,
    up:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:[]
    },
    content:Sequelize.TEXT
},{
    tableName:'thread',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['topic']
        },
    ]
});

const editThread = connect.define('editThread', {
    uuid:Sequelize.STRING,
    content:Sequelize.TEXT,
},{
    tableName:'editThread',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
    ]
});


//defined model
seqModel['topic'] = topic;
seqModel['thread'] = thread;
seqModel['editThread'] = editThread;

module.exports = {
    topic:topic,
    thread:thread,
    editThread:editThread,
}