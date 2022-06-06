const xss = require('xss');

const whiteList = ['qq.com','sohu.com','sina.com','youku.com','tudou.com'];

const checkWhiteList = (url) => {
    let isPass = false;
    
    whiteList.forEach( (w) => {
        let exp = new RegExp(`src=\"[http\:\/\/|https\:\/\/](.*).${w}`);
        
        url.match( exp ) && ( isPass = true );
    } );
    
    return isPass;
};

module.exports = function(req,res,next){
    
    let isPass = true,
        content = req.body.content || null;
    
    if( !content ){
        return next();
    }
    
    
    content = xss(content,{
        onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
            
            if( (tag=='span') && (name='class') && (value=='orange') ){
                return name + '="' + xss.escapeAttrValue(value) + '"';
            }
            
            if( (tag=='img') && (name=='class') && (value="emoji-face") ){
                return name + '="' + xss.escapeAttrValue(value) + '"';
            }
            
            if( (value=='text-align: left;') || (value=='text-align: right;') || (value=='text-align: center;') || (value="font-size: 12px;") || (tag=='embed') ){
                return name + '="' + xss.escapeAttrValue(value) + '"';
            }
            
        },
        onTag:function(tag,html,option){
            if( tag == 'cloud' ){
                return html;
            }
            
            if( tag == 'attachment' ){
                return html;
            }
        },
        onIgnoreTag: function(tag, name, value, isWhiteAttr){
            
            if( ( tag=='embed' && checkWhiteList(name) ) ){
                return name;
            }
            
        },
    });
    
    
    req.body.content = content;
    
    next();
}