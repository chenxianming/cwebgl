const uuidv4 = require('uuid/v4');

const getCodeByGuid = (guid,mapKey,mapPramas) => {
    
    const timestamp = (new Date().getTime()).toString();
    
    let timestampArr = timestamp.split('');
    
    timestampArr.forEach( (time,idx) => {
        ( timestampArr[idx] = mapPramas.indexOf(time) );
    } );
    
    var guid = guid.toLocaleLowerCase(),
        arr = guid.split('');
    
    var arr2 = mapPramas.split('');
    
    let results = arr2.map( data => ( guid.indexOf(data) ) );
    
    var str = results.join('');
    str = str.replace(/-/g,'');
    
    return str +'10466'+ timestampArr.join('');
}

const decodeTimeStamp = (key,mapPramas) => {
    
    if(!key){
        return '';
    }
    
    let time = key.match(/10466(.*)/);
    
    if(!time){
        return '';
    }
    
    time = time[1];
    
    let timeArr = time.split(''),
        rs = [];
    
    timeArr.forEach( (r,idx) => {
        rs[idx] = mapPramas[r];
    } );
    
    return rs.join('') * 1;
}

const csrf = function(req,res,next){
    
    const cerToken = req.body['token'] || req.headers['token'] || null,
          cerKey = req.body['key'] || req.headers['key'] || null,
          method = req.method;
    
    const mapKey = 'dm0d93djns0d9csdc',
          mapPramas = '1876540239';
    
    const sessionToken = ( req.session && req.session.key ) ? req.session.key.token : null;
    
    req.csrfToken = () => {
        
        let csrf = uuidv4(),
            key = getCodeByGuid(csrf,mapKey,mapPramas);
        
        let token = {
            token:csrf,
            key:key
        };
        
        req.session.key = token;
        
        return token;
    }
    
    if(method != 'POST'){
        return next();
    }
    
    if( cerToken != sessionToken ){
        return res.json({
            msg:'token在其他打开的页面已变更,请重或刷新'
        });
    }
    
    let key = getCodeByGuid(cerToken,mapKey,mapPramas);
    
    let timestamp = decodeTimeStamp(cerKey,mapPramas);
    
    if( ( ( new Date().getTime() - timestamp ) / 1000 / 60 ) > 15 ){
        return res.json({
            msg:'token已过期,请重试或刷新页面'
        });
    }
    
    next();
}

module.exports = csrf;