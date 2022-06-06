const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const connect = require('../../interface/connect');
const esClient = require('../../interface/es');

const Base64 = require('../../utils/base64');
const Pinyin = require('../../utils/pinyin');
const eachLimit = require('../../utils/eachLimit');

const uuidv4 = require('uuid/v4');

const controller = require('./controller');

const fs = require('fs')
const path = require('path');
const request = require('request');
const gm = require('gm');

const delay = 5 * 60 * 1000;

const clearCache = async () => {
    let dirPath = `${path.resolve()}/cachefile`,
        files = ( fs.readdirSync(dirPath) );
    
    files.forEach( (f) => {
        fs.unlinkSync(`${dirPath}/${ f }`);
    } );
}

const getContent = (child) => new Promise( async (resolve) => {
    
    let result = await controller.getContent( seqModel,{
        type:child.type,
        uuid:child.target
    } );
    
    child = result;
    resolve( child );
    
} );

const getChild = (col) => new Promise( async (resolve) => {
    
    if( col.type=='topic' ){
        return resolve( col );
    }
    
    let child = await controller.getChild(seqModel,{
        collections:col.uuid,
        author:col.author,
        type:col.type,
    });
    
    col.child = await eachLimit(4,child,getContent);
    
    col.images = [];
    
    col.child.forEach( (c) => {
        col.images.push( c.litpic );
    } );
    
    resolve( col );
    
} );

const fetchImage = (url) => new Promise( (resolve) => {
    
    let dirPath = `${path.resolve()}/cachefile`,
        name = ~~( Math.random() * 500000 );
    
    request({
        url:url,
        method:'get',
        timeout:20000,
        proxy:'http://vps.coldnoir.com:44123'
    }).on('end',function(){
        resolve(name);
    }).on('error',function(e){
        resolve(name);
    }).pipe( fs.createWriteStream(`${dirPath}/${name}.png`) );
    
} );

const resizeImage = (size,path) => new Promise( ( resolve ) => {
    
    gm(path).resize(size[0],size[1]).write(path,function( err ){
        resolve( err ? false : true );
    });
    
} );

const cropImage = (size,path) => new Promise( ( resolve ) => {
    
    gm(path).crop(size[0],size[1],size[2],size[4]).write(path,function( err ){
        resolve( err ? false : true );
    });
    
} );

const mosaic = (obj,output) => new Promise( (resolve) => {
    
    obj.mosaic()
        .write(output, function (err) {
            resolve( err ? false : true );
        });
    
} );

const mergeImage = ( col, images ) => new Promise( async ( resolve ) => {
    
    let litpic = `${path.resolve()}/cachefile/${col.uuid}.png`;
    
    let imgPath = [],
        compress = [];
    
    images.forEach( (image) => {
        ( ( fs.statSync(`${path.resolve()}/cachefile/${image}.png`) ) && ( fs.statSync(`${path.resolve()}/cachefile/${image}.png`) ).size > 0 ) && imgPath.push( `${path.resolve()}/cachefile/${image}.png` );
    } );
    
    if( col.type!='article' ){
        //resize
        compress = await eachLimit(1,imgPath,resizeImage.bind(this,[160,null]));
    }else{
        await eachLimit(1,imgPath,resizeImage.bind(this,[300,180]));
        await eachLimit(1,imgPath,cropImage.bind(this,[232,160,34,10]));
        compress = await eachLimit(1,imgPath,resizeImage.bind(this,[160,null]));
    }
    
    let mgObj = gm();
    
    for(let i = 0;i<4;i++){
        ( !imgPath[i] || !compress[i] ) && ( imgPath[i] = `${path.resolve()}/public/basic.png` );
    }

    imgPath.forEach( (img,idx) => {

        let setting = '';

        switch(idx){
            case 0 :
                {
                    setting = '+0+0';
                    mgObj.in('-page', setting).in(img);
                }
            break ;

            case 1 :
                {
                    setting = '+160+0';
                    mgObj.in('-page', setting).in(img);
                }
            break ;

            case 2 :
                {
                    setting = '+0+110';
                    mgObj.in('-page', setting).in(img);
                }
            break ;

            case 3 :
                {
                    setting = '+160+110';
                    mgObj.in('-page', setting).in(img);
                }
            break ;
        }

    } );
    
    let result = await mosaic( mgObj, litpic );
    
    resolve( result );
    
} );

const getLitpic = async ( col ) => new Promise( async ( resolve ) => {
    
    let mergeResult;
    
    if(!col.images || (!col.images.length) ){
        mergeResult = null;
    }else{
        let images = await eachLimit(4,col.images,fetchImage);
        mergeResult = await mergeImage( col,images );
    }
    
    await controller.updateLitpic( seqModel,{
        uuid:col.uuid,
        value:mergeResult
    } );
    
    resolve( col );
} );

const getCollections = async () => {
    
    let collection = await controller.getCollection( seqModel );
    
    let result = await eachLimit(5,collection.result,getChild);
    
    let resultAddlitpic = await eachLimit(5,result,getLitpic);
    
    Log(`update collections`);
    
}

const autoTask = async () => {
    
    clearCache();
    
    setTimeout( getCollections,500 );
    
    setTimeout(autoTask,delay);
}

module.exports = autoTask;