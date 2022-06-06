

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');
const xss = require('xss');

const querystring = require('querystring');

const svgCaptcha = require('svg-captcha');

//render views
const getList = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['c','p','sort'];
    
    let renderObj = {
            title:'文章',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({status:'normal'},{sort:{postDate:1},limit:10});
    
    for(let key in queryObj){
        switch(key){
            case 'c' :
                {
                    brige[0]['categories'] = queryObj[key];
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
    
    let latestPick = await controller.getLatestPick(seqModel);
    
    renderObj['latestPick'] = latestPick.result;
    
    let lists = await controller.queryArticleList(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd') );
    } );
    
    lists['option'] = brige[0];
    
    let hotList = await controller.queryArticleList(seqModel,{status:'normal'},{sort:{views:1},limit:6});
    
    renderObj['hotList'] = hotList;
    
    let communityHotList = await controller.getHotList(seqModel,'topic');
    
    renderObj['community'] = communityHotList;
    
    let codeHotList = await controller.getHotList(seqModel,'code');
    
    renderObj['code'] = codeHotList;
    
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'article';
    
    Log( renderObj );
    
    let templateResult = 'article.ejs';
    ( !req.query.c ) && ( renderObj.title = '首页' );
    (req.query.c) && ( templateResult = 'article-list.ejs' );
    
    res.render(templateResult, renderObj);
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
    
    let renderObj = {};

    renderObj['title'] = detail.title +' - 文章';
    
    renderObj['data'] = detail;
    
    renderObj['position'] = 'article';
    
    renderObj['author'] = await controller.getUserSimple(seqModel,{
        uuid:detail.author
    });
    
    renderObj['pick'] = null;
    
    renderObj['relation'] = ( await controller.getRelationArticle(seqModel,detail.uuid) ).result ? ( await controller.getRelationArticle(seqModel,detail.uuid) ).result : [];
    
    if(detail.pick){
        let pick = await controller.queryPickDetail(seqModel,{
            uuid:detail.pick
        });
        
        renderObj['pick'] = pick;
    }
    
    let latestPick = await controller.getLatestPick(seqModel);
    
    renderObj['latestPick'] = latestPick.result;
    
    let hotList = await controller.queryArticleList(seqModel,{status:'normal'},{sort:{views:1},limit:6});
    
    renderObj['hotList'] = hotList;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    let prevNext = await controller.getArticleBetweenInsertDate(seqModel,uuid);
    
    renderObj['prevNext'] = prevNext.result;
    
    renderObj.data['postDate'] = ( dateParse(new Date( detail.postDate * 1 ),'yyyy-MM-dd hh:mm:ss') );
    
    renderObj['isCollect'] = null;
    
    ( req.session.userData && req.session.userData.uuid ) && ( renderObj['isCollect'] = await controller.collectExist(seqModel,{target:uuid,author:req.session.userData.uuid,type:'article'}) );
    
    //render template
    res.render('articleDetail.ejs', renderObj);
}

const captcha = async (req, res, next) => {
    
    let randomKey = ( Math.random() > .5 )? 'create' : 'createMathExpr';
    
    let captcha = svgCaptcha[randomKey]({
        noise:1,
        width:100,
        height:40,
        fontSize:35
    });
    
    req.session.captcha = captcha.text.toLocaleLowerCase();
    
    res.type('svg');
    res.status(200).send(captcha.data);
    
}

const randomDefaultAvatar = async (req, res, next) => {
    let idx = Math.ceil( Math.random() * 6 );
    
    let options = {
        root: './public/avatar_pack_random/',
        dotfiles: 'deny',
    },
        fileName = `1535707443523_${idx}.png`;
    
    res.sendFile(fileName,options);
}

const search = async (req, res, next) => {
    
    let keywords = req.query.k || '';
    
    if(!keywords){
        return res.redirect('/');
    }
    
    (!req.session.searchHistroy) && ( req.session.searchHistroy = [] );
    
    ( req.session.searchHistroy.indexOf(keywords) < 0 ) && ( req.session.searchHistroy.push(keywords) );
    
    let sDate = new Date().getTime();
    
    let queryKey = ['k','p','sort','t'];
    
    let renderObj = {},
        queryObj = {};
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({status:'normal'},{sort:{postDate:1},limit:10});
    
    for(let key in queryObj){
        switch(key){
            case 'k' :
                {
                    brige[0]['keywords'] = queryObj[key];
                }
            break;
                
            case 't' :
                {
                    brige[0]['type'] = queryObj[key];
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
    
    let lists = await controller.search(brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.hits.forEach( (item) => {
        item._source.createdAt = ( dateParse(new Date( item._source.createdAt * 1 ),'yyyy-MM-dd') );
        item._source.content = xss( item._source.content,{
          whiteList: [], // empty, means filter out all tags
          stripIgnoreTag: true, // filter out all HTML not in the whilelist
          stripIgnoreTagBody: ["script"] // the script tag is a special case, we need
          // to filter out its content
        } );
    } );
    
    lists['option'] = brige[0];
    
    renderObj['title'] = `搜索 ${keywords}`;
    renderObj['data'] = lists;
    renderObj['queryObj'] = req.query;
    renderObj['searchHistroy'] = req.session.searchHistroy;
    renderObj['querystring'] = querystring;
    
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    Log( renderObj );
    
    res.render('search.ejs', renderObj);
}

module.exports = {
    getList:getList,
    getDetail:getDetail,
    captcha:captcha,
    randomDefaultAvatar:randomDefaultAvatar,
    search:search,
};
