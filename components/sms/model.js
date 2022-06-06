const Sequelize = require('sequelize');
const connect = require('../../interface/connect');

const sms = connect.define('sms', {
    uuid:Sequelize.STRING,
    sendDate:Sequelize.BIGINT,
    type:Sequelize.ENUM('phone', 'email'),
    value:Sequelize.STRING,
    code:Sequelize.STRING,
    ip:Sequelize.STRING,
},{
    tableName:'sms',
    indexes:[
        {
            unique: true,
            fields: ['uuid']
        },
        {
            unique: false,
            fields: ['type']
        }
    ]
});

//defined model
seqModel['sms'] = sms;

module.exports = {
    sms:sms
}