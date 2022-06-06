const simpleKey = require('../utils/simpleKey');

module.exports = function(req,res,next){
    let datas = req.body.datas || null;
    
    if(!datas || !req.body.key){
        return res.json({
            msg:'invialid data'
        });
    }
    
    try{
        let data = simpleKey.decode(datas,req.body.key);
        
        data = JSON.parse( data );
        
        delete req.body.datas;
        
        req.body = Object.assign(req.body,data);
        
    }catch(e){
        
        Log( e );
        
        return res.json({
            msg:'invialid data'
        });
    }
    
    next();
}