const bytelength = require('../utils/bytelength');

module.exports = function(req,res,next){
    
    let isPass = true,
        datas = [
            {
                name:'title',
                maxLen:100
            },
            {
                name:'description',
                maxLen:500
            },
            {
                name:'content',
                maxLen:30000
            },
        ];
    
    datas.forEach( (item,idx) => {
        ( req.body[item.name] && ( bytelength( req.body[item.name] ) > datas[idx].maxLen ) ) && ( isPass = false );
    } );
    
    if(!isPass){
        return res.json({
            msg:'长度不正确'
        });
    }
    
    next();
}