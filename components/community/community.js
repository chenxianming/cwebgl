

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const querystring = require('querystring');

const getList = async (req,res,next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['sort','p','t'];
    
    let renderObj = {
            title:'热帖'
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({status:'normal'},{sort:{sortDate:1},limit:10});
    
    for(let key in queryObj){
        switch(key){
            case 't' :
                {
                    brige[0]['type'] = queryObj['t'];
                }
            break ;
                
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
    
    
    let lists = await controller.getList(seqModel,brige[0],brige[1]);
    
    let hotList = await controller.getList(seqModel,{status:'normal'},{sort:{views:1},limit:6});
    renderObj['hotList'] = hotList;
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {sortDate:1};
    
    (!brige[1].sort) && (lists.sort = 'sortDate-1');
    
    lists.result.forEach( (item) => {
        item.sortDate = ( dateParse(new Date( item.sortDate * 1 ),'yyyy-MM-dd') );
    } );
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['queryObj'] = req.query;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'community';
    
    Log( renderObj );
    
    res.render('community.ejs', renderObj);
}

const getDetail = async (req,res,next) => {
    
    let uuid;
    
    let sDate = new Date().getTime();
    
    let author = req.session.userData ? req.session.userData.uuid : null;
    
    try{
        uuid = req.params.uuid.match(/(.*)\.html/)[1]
    }catch(e){
        uuid = null;
    }
    
    if(!uuid){
        return next();
    }
    
    let detail = await controller.getDetail(seqModel,{
        uuid:uuid
    });
    
    if(!detail || (detail && detail.status!='normal') ){
        return res.redirect('/redirect.html');
    }
    
    let queryKey = ['p'];
    
    let renderObj = {
            title:'热帖',
        },
        queryObj = {

        };

    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );

    let brige = new Array({status:'normal',topic:uuid},{sort:{index:0},limit:10});

    for(let key in queryObj){
        switch(key){
            
            case 'p' :
                {
                    queryObj[key] = Math.max(queryObj[key],1);

                    brige[1]['offset'] = (queryObj[key] * 1 - 1) * brige[1]['limit'];
                }
            break;
        }
    }
    
    brige[0].author = author;
    
    let lists = await controller.getThreadList(seqModel,brige[0],brige[1]);
    
    renderObj['position'] = 'community';
    renderObj['title'] = detail.title + ' - 热帖';
    renderObj['detail'] = detail;
    
    let hotList = await controller.getList(seqModel,{status:'normal'},{sort:{views:1},limit:6});
    renderObj['hotList'] = hotList;
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['queryObj'] = req.query;
    
    renderObj['isCollect'] = null;
    ( req.session.userData && req.session.userData.uuid ) && ( renderObj['isCollect'] = await controller.collectExist(seqModel,{target:uuid,author:req.session.userData.uuid,type:'topic'}) );
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['querystring'] = querystring;
        
    Log( renderObj );
    
    res.render('communityDetail.ejs', renderObj);
}

module.exports = {
    getList:getList,
    getDetail:getDetail,
};
