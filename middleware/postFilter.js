const xss = require('xss');

module.exports = function(req,res,next){
    
    let isPass = true,
        title = req.body.title || '',
        description = req.body.description || '',
        tags = req.body.tags || [];
    
    let titleResult = xss(title),
        descriptionResult = xss(description);
    
    title && ( req.body.title = titleResult );
    description && ( req.body.description = descriptionResult );

    tags && tags.forEach( (tag,idx) => {
        tags[idx] = xss( tag );
    } );
    
    req.body.tags = tags;
    
    next();
    
}