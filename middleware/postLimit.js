const config = require('../config');

module.exports = function(req,res,next){
    
    if(!req.session.postLimit){
        return next();
    }
    
    let st = new Date().getTime(),
        limit = config.writeLimit*1 || 2;
    
    if( ( ( st - req.session.postLimit ) / 1000 / 60 ) < (limit) ){
        return res.json({
            msg:`您操作的频率太快了, <span class="time-limit">${ ~~( ( 60 * limit ) - ( (st - req.session.postLimit) / 1000) ) }</span> 秒后重试`
        });
    }
    
    next();
}