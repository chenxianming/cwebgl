module.exports = {
    url:'localhost',
    port:3000,
    //sql config
    host:'localhost',
    sqlPort:5432,
    database:'cwebgl',
    user:'postgres',
    password:'123456',
    secretKey:'askdas6788hxasuXSJNsajx89210Sxas',
    writeLimit:.5,
    //redis config
    redisOption:{
        host:'localhost',
        port:6379
    },
    qiniu:{
        accessKey:'6NGw5ghQ-OLuwd6Yzvts_XfLYEElP6VMl1buwbAR',
        secretKey:'9thj1ui9GI3MtuFa0A-SgX0MI5lWpQHmGwjJ9efs',
        scope:'cwebgl'
    },
    colorSort:{
        h:[5,5],
        s:[30,30],
        b:[15,15],
    }
}