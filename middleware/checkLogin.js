module.exports = function(req,res,next){
    
    if(!req.session.userData && !(req.session.checkMobile && req.url=='/postKey') ){
        return res.redirect('/');
    }
    
    next();
}