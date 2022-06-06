const fs = require('fs');
const keywordsTxt = fs.readFileSync('./utils/keywords.txt','utf-8'),
      keywordsArr = keywordsTxt.split('\n');

/*
keywordsArr.forEach( (word,line) => {
    (/^[\u4E00-\u9FA5]{1}$/.test(word)) && Log( word,line );
} );
*/

module.exports = function(req,res,next){

    let isPass = true,
        filter = [],
        content = req.body.content || null,
        title = req.body.title || null;
    
    if(!content || !title){
        return next();
    }
    
    let test = content.toString();
    
    keywordsArr.forEach( (keywords,line) => {
        
        ( test.indexOf( keywords ) > -1 ) && ( isPass = false );
        ( test.indexOf( keywords ) > -1 ) && ( filter.push( keywords ) );
        
    } );
    
    test = title.toString();
    
    keywordsArr.forEach( (keywords,line) => {
        
        ( test.indexOf( keywords ) > -1 ) && ( isPass = false );
        ( test.indexOf( keywords ) > -1 ) && ( filter.push( keywords ) );
        
    } );
    
    let arrResult = [];
    
    filter.forEach( (f) => {
        ( arrResult.indexOf(f) < 0 ) && arrResult.push( f );
    } );
    
    filter = arrResult;
    
    if( !isPass ){
        var str = '';
        
        filter.forEach( (key) => {
            str += `<b class="orange" style="margin-right:10px">${key}</b>`;
        } );
        
        return res.json({
            msg:`正文中含有敏感词汇:<br />${ str } <br />请勿发表违反中华人民共和国法律网络监管范围内的违法内容`
        });
    }
    
    next();
}