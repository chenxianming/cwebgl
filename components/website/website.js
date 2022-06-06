

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const querystring = require('querystring');

const color = require('onecolor');

const QRCode = require('qrcode-svg');

const generatorColorplane = () => {
    /*
    let count = 360,
        colors = [];
    
    for(let i = 0;i<count;i++){
        let oneColor = new color(`hsl(${i}, 50%, ${ ~~( (i/360) * 100 ) }%)`);
        colors.push( oneColor.hex() );
    }
    
    return colors;
    */
    
    return ["#faddd1","#fad3d1","#fad1e6","#e5d1fa","#d4d1fa","#d1e3fa","#d1f3fa","#d1faf0","#d1fad7","#ebfad1","#faf9d1","#faefd1","#fae6d1","#f2e2d9","#ffffff","#f4b69c","#f4a09c","#f49cc8","#c69cf4","#a39cf4","#9cc2f4","#9ce5f4","#9cf4df","#9cf4a7","#d4f49c","#f4f19c","#f4dc9c","#f4c89c","#e3c0ac","#e4e4e4","#ee8f66","#ee6d66","#ee66aa","#a866ee","#7166ee","#66a1ee","#66d7ee","#66eece","#66ee78","#bcee66","#eee966","#eeca66","#eeaa66","#d59f80","#b4b4b4","#e86830","#e83a30","#e8308c","#8930e8","#4030e8","#3080e8","#30c9e8","#30e8bd","#30e849","#a5e830","#e8e230","#e8b730","#e88c30","#c67d53","#848484","#c74b16","#c71f16","#c7166f","#6c16c7","#2516c7","#1663c7","#16a9c7","#16c79e","#16c72e","#86c716","#c7c116","#c79816","#c76f16","#a66037","#545454","#913710","#911710","#911051","#4f1091","#1b1091","#104891","#107c91","#109173","#109121","#629110","#918d10","#916f10","#915110","#794628","#242424","#5c230a","#5c0e0a","#5c0a33","#320a5c","#110a5c","#0a2e5c","#0a4e5c","#0a5c49","#0a5c15","#3e5c0a","#5c590a","#5c460a","#5c330a","#4d2c19","#000000"];
    
}

//render views
const getList = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['c','l','color','platform','p','sort'];
    
    let renderObj = {
            title:'酷站',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({status:'normal'},{sort:{postDate:1},limit:12});
    
    for(let key in queryObj){
        switch(key){
            case 'c' :
                {
                    brige[0]['categories'] = queryObj[key];
                }
            break;
                
            case 'l' :
                {
                    brige[0]['language'] = queryObj[key];
                }
            break;

            case 'platform' :
                {
                    brige[0]['platform'] = queryObj[key];
                }
            break;
                
            case 'color' :
                {
                    
                    brige[0]['color'] = queryObj[key];
                    
                    try{
                        
                        let oneColor = color(queryObj[key]),
                            covert = oneColor.hue(0, true).toJSON();

                        let hsb = Math.round( covert[1] * 360 ),
                            hsbs = Math.round( covert[2] * 100 ),
                            hsbl = Math.round( covert[3] * 100 );

                        brige[0]['hsb'] = hsb;
                        brige[0]['hsbs'] = hsbs;
                        brige[0]['hsbl'] = hsbl;
                        
                    }catch(e){
                        Log('conver error',e);
                        delete brige[0]['color'];
                        delete req.query['color'];
                    }
                    
                }
            break;

            case 'sort' :
                {
                    let arr = queryObj[key].split('-');
                    
                    ( arr[1] ) && ( brige[1]['sort'] = {} );
                    
                    brige[1]['sort'][ arr[0] ] = arr[1];
                }
            break;
                
            case 'p' :
                {
                    queryObj[key] = Math.max(queryObj[key],1);
                    
                    brige[1]['offset'] = (queryObj[key] * 1 - 1) * brige[1]['limit'];
                }
            break;
        }
    }
    
    let lists = await controller.queryWebSiteList(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd') );
    } );
    
    lists['option'] = brige[0];
    
    lists.result.forEach( (item) => {
        item.collected = 0;
    } );
    
    let task = [];
    
    if( req.session.userData && req.session.userData.uuid ){
        task = [];
        const getCollected = (item) => new Promise( async (resolve) => {
            let author = req.session.userData.uuid || null;
            
            controller.collectExist(seqModel,{target:item.uuid,author:author,type:'website'}).then( (count) => {
                item.collected = count || 0;
                resolve( item );
            } ).catch( (e) => {
                item.collected = 0;
                resolve(item);
            } )
        } )
        
        lists.result.forEach( (item) => {
            task.push( getCollected(item) );
        } );
        
        await Promise.all( task );
    }
    
    renderObj['data'] = lists;
    
    
    let showCase = await controller.getShowCase( seqModel,'website' );
    
    renderObj['showcase'] = showCase;
    
    
    //Log( renderObj );
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'website';
    
    renderObj['colorPlane'] = generatorColorplane();
    
    res.render('website.ejs', renderObj);
};

const getDetail = async (req, res, next) => {
    
    let uuid;
    
    let sDate = new Date().getTime();
    
    try{
        uuid = req.params.uuid.match(/(.*)\.html/)[1]
    }catch(e){
        uuid = null;
    }
    
    if(!uuid){
        return next();
    }

    let detail = await controller.getDetail(seqModel,uuid);
    
    if(!detail || (detail && detail.status!='normal') ){
        return res.redirect('/redirect.html');
    }
    
    detail['postDate'] = ( dateParse(new Date( detail.postDate * 1 ),'yyyy-MM-dd') );
    
    let renderObj = {};
    
    ( detail.platform.length > 1 ) && ( renderObj['qrCode'] = new QRCode({
        content: detail.link,
        padding: 2,
        width: 160,
        height: 160,
        color: "#000000",
        background: "#ffffff",
        ecl: "M"
    }).svg() );

    renderObj['title'] = detail.title +' - 酷站';
    
    renderObj['data'] = detail;
    
    let relation = await controller.getWebsiteRelation(seqModel,uuid);
    
    renderObj['relation'] = relation.result || [];
    
    let prevNext = await controller.getWebsiteBetweenInsertDate(seqModel,uuid);
    
    renderObj['prevNext'] = prevNext.result;
    
    renderObj['position'] = 'website';
    
    renderObj['isCollect'] = null;
    ( req.session.userData && req.session.userData.uuid ) && ( renderObj['isCollect'] = await controller.collectExist(seqModel,{target:uuid,author:req.session.userData.uuid,type:'website'}) );
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    //Log( renderObj );
    
    res.render('websiteDetail.ejs', renderObj);
}


module.exports = {
    getList:getList,
    getDetail:getDetail,
};
