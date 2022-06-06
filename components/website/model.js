const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const website = connect.define('website', {
    uuid:Sequelize.STRING,
    status:{
        type:Sequelize.ENUM('normal', 'pending'),
        defaultValue:'pending'
    },
    title:Sequelize.STRING,
    description:Sequelize.TEXT,
    postDescription:Sequelize.TEXT,
    tags:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:[]
    },
    postDate:Sequelize.BIGINT,
    litpic:Sequelize.STRING,
    bgpic:Sequelize.STRING,
    previewList:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:[]
    },
    categories:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:['活动页面']
    },
    author:Sequelize.STRING,//uuid
    language:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:['英文']
    },
    color:Sequelize.ARRAY(Sequelize.TEXT),
    hsb1:Sequelize.RANGE(Sequelize.INTEGER),
    hsbs1:Sequelize.RANGE(Sequelize.INTEGER),
    hsbl1:Sequelize.RANGE(Sequelize.INTEGER),
    hsb2:Sequelize.RANGE(Sequelize.INTEGER),
    hsbs2:Sequelize.RANGE(Sequelize.INTEGER),
    hsbl2:Sequelize.RANGE(Sequelize.INTEGER),
    hsb3:Sequelize.RANGE(Sequelize.INTEGER),
    hsbs3:Sequelize.RANGE(Sequelize.INTEGER),
    hsbl3:Sequelize.RANGE(Sequelize.INTEGER),
    hsb4:Sequelize.RANGE(Sequelize.INTEGER),
    hsbs4:Sequelize.RANGE(Sequelize.INTEGER),
    hsbl4:Sequelize.RANGE(Sequelize.INTEGER),
    hsb5:Sequelize.RANGE(Sequelize.INTEGER),
    hsbs5:Sequelize.RANGE(Sequelize.INTEGER),
    hsbl5:Sequelize.RANGE(Sequelize.INTEGER),
    hsb6:Sequelize.RANGE(Sequelize.INTEGER),
    hsbs6:Sequelize.RANGE(Sequelize.INTEGER),
    hsbl6:Sequelize.RANGE(Sequelize.INTEGER),
    platform:{
        type:Sequelize.ARRAY(Sequelize.TEXT),
        defaultValue:[]
    },
    link:Sequelize.STRING,
    views:{
        type:Sequelize.BIGINT,
        defaultValue:0
    },
},{
    tableName:'website',
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


//defined model
seqModel['website'] = website;

module.exports = {
    website:website
}