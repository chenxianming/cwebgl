module.exports = function(str){
    let l = str.length,
        blen = 0;
    
    for(let i=0;i<l;i++){
        if((str.charCodeAt(i) & 0xff00) != 0){
            blen++; 
        }
        blen++;
    }
    
    return blen;
}
