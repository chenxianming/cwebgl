const config = require('../../config');

const interface = require('../../interface');

const color = require('onecolor');

/*
    queryObj['color'].forEach( (coStr,idx) => {
        
        try{
        
            let oneColor = color(coStr),
                covert = oneColor.hue(0, true).toJSON();

            let hsb = Math.round( covert[1] * 360 ),
                hsbs = Math.round( covert[2] * 100 ),
                hsbl = Math.round( covert[3] * 100 );
                
            queryObj[`hsb${idx+1}`] = new Array(hsb-config.colorSort.h[0],hsb+config.colorSort.h[1]);
            queryObj[`hsbs${idx+1}`] = new Array(hsbs-config.colorSort.s[0],hsbs+config.colorSort.s[1]);
            queryObj[`hsbl${idx+1}`] = new Array(hsbl-config.colorSort.b[0],hsbl+config.colorSort.b[1]);
            
        }catch(e){}
        
    } );
*/


const updateColor = (web) => new Promise( (resolve) => {
    
    web['color'].forEach( (coStr,idx) => {
        
        try{
            
            let oneColor = color(coStr),
                covert = oneColor.hue(0, true).toJSON();
            
            let hsb = Math.round( covert[1] * 360 ),
                hsbs = Math.round( covert[2] * 100 ),
                hsbl = Math.round( covert[3] * 100 );
            
            web[`hsb${idx+1}`] = new Array(hsb-config.colorSort.h[0],hsb+config.colorSort.h[1]);
            web[`hsbs${idx+1}`] = new Array(hsbs-config.colorSort.s[0],hsbs+config.colorSort.s[1]);
            web[`hsbl${idx+1}`] = new Array(hsbl-config.colorSort.b[0],hsbl+config.colorSort.b[1]);
            
        }catch(e){
            Log( e );
        }
        
    } );
    
    interface.updateOneCustom(seqModel.website,web,{
        where:{
            uuid:web.uuid
        }
    }).then( () => {
        resolve( web );
    } ).catch( (e) => {
        resolve( web );
    } );
    
} );

const loop = async () => {
    let arr = await interface.queryList(seqModel['website'],{
        limit:50000
    });
    
    let task = [];
    
    arr.forEach( (web) => {
        task.push( updateColor(web) );
    } )
    
    await Promise.all( task );
}


const rate = 20 * 60 * 1000;

module.exports = function(){
    loop();
    setTimeout( loop,rate );
}