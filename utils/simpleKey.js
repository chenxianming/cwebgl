const Base64 = require('./base64');

const getCircleIndex = (str,idx) => {
    var str = str || '',
        count = ~~(idx / str.length),
        wd = idx - count*str.length;

    return str[wd] * 1;
}

const encode = (text,keyStr) => {
    //encode

    var base64Str = Base64.encode( JSON.stringify(text) );
    var arr = [],
        result = [];
    for(var i = 0;i<base64Str.length;i++){
        var n = base64Str[i].charCodeAt(0) * 1;
        arr[i] = n+getCircleIndex(keyStr,i);
    }
    arr.forEach(function(ar,idx){
        result[idx] = String.fromCharCode(ar);
    });
    var rs = ( result.join('') );

    return rs;
}

const decode = (text,keyStr) => {
    //decode
    var arr = text.split(''),
        codeArr = [];

    arr.forEach(function(code,idx){
        codeArr[idx] = code.charCodeAt(0);
    });

    for(var i = 0;i<codeArr.length;i++){
        codeArr[i] *= 1;
        codeArr[i] -= getCircleIndex(keyStr,i);
        codeArr[i] = String.fromCharCode(codeArr[i]);
    }

    return ( Base64.decode(codeArr.join('')) );
}

module.exports = {
    decode:decode,
    encode:encode
}