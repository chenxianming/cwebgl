const NodeRSA = require('node-rsa');

module.exports = function(req,res,next){
    
    let isPass = true;
    
    if(!req.body.rsa){
        return res.json({
            msg:'invialid sign#1 如未能解决此问题，请情况浏览缓存再试'
        });
    }
    
    try{
        
        let objData,
            objDataStr = '';
        
        let key = new NodeRSA(req.session.rsa.private);
        key.setOptions({encryptionScheme: 'pkcs1'});
        
        req.body.rsa.forEach( (rsa,idx) => {
            try{
                var decrypted = key.decrypt(rsa,'utf-8');
                objDataStr += decrypted;
            }catch(e){
                isPass = false;
            }
        } );
        
        if(!isPass){
            return res.json({
                msg:'invialid sign#2 如未能解决此问题，请情况浏览缓存再试'
            });
        }
        
        objData = JSON.parse( objDataStr );
        
        req.body = Object.assign(req.body,objData);
        
        //delete req.session.rsa;
        delete req.body.rsa;
        
    }catch(e){
        return res.json({
            msg:'invialid sign#3 如未能解决此问题，请情况浏览缓存再试'
        });
    }
    
    next();
}