const rsaGenerator = require('rsa-generator');

const getRsa = (size) => new Promise( (resolve) => {
    var size = size || 1024;
    
    rsaGenerator.generator(1024,(data) => {
        if(!data){
            return resolve( null );
        }
        
        resolve( data );
    });
    
} );

module.exports = getRsa;