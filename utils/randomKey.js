module.exports = (length,numOnly) => {
    let len = length ? length : 4,
        key = (numOnly ? '1234567890' : '1234567890qwertyuiopasdfghjklzxcvbnm').split(''),
        chunk = '';
    
    for( let i = 0;i<len;i++ ){
        chunk += ( Math.random() > .5 ? key[ ~~( Math.random() * key.length ) ] : (key[ ~~( Math.random() * key.length ) ]).toUpperCase() );
    }
    
    return chunk;
}