

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');
const simpleKey = require('../../utils/simpleKey');

const querystring = require('querystring');

const uuidv4 = require('uuid/v4');

//render views
const logout = async (req, res, next) => {
    delete req.session.userData;
    
    const url = req.headers.referer || '/';
    
    res.redirect(url);
}

const getUser = (uuid) => new Promise( async (resolve) => {
    
    let user = await controller.getUser(seqModel,{
        uuid:uuid
    });
    
    resolve( user );
    
} );

const homepage = async (req, res, next) => {
    let renderObj = {
        title:'我的主页'
    };
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    renderObj['position'] = 'user';
    
    res.render('homepage.ejs', renderObj);
}

const userDetail = async (req, res, next) => {
    
    let uuid = req.params.uuid || null;
    
    if(!uuid){
        return res.redirect('/redirect.html');
    }
    
    let renderObj = {};
    
    let user = await getUser( uuid );
    
    if(!user){
        return res.redirect('/redirect.html');
    }
    
    delete user.id;
    delete user.password;
    
    renderObj['title'] = `${ user.name } 的个人主页`;
    
    renderObj['data'] = user;
    
    renderObj['position'] = 'user';
    

    let sDate = new Date().getTime();
    
    let queryKey = ['p','t'],
        queryObj = {};
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige1 = {
        type:queryObj.t || ('article'),
        status:'normal',
        author:uuid
    };
    
    ( !queryObj.t || (queryObj.t == 'article') ) && ( brige1['anonymous'] = 0 );
    
    let brige = new Array(brige1,{sort:{updatedAt:1},limit:12});
    
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
    
    let lists = await controller.queryUserResult(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {updatedAt:1};
    
    (!brige[1].sort) && (lists.sort = 'updatedAt-1');
    
    lists['option'] = brige[0];
    
    renderObj['lists'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'user';
    
    renderObj['menu'] = brige[0].type;
    
    Log( renderObj );
    
    res.render('userpage.ejs', renderObj);
}

const updatepage = async (req, res, next) => {
    let renderObj = {
        title:'修改资料'
    };
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    renderObj['position'] = 'user';
    
    res.render('homepageUpdate.ejs', renderObj);
}

const account = async (req, res, next) => {
    let renderObj = {
        title:'修改资料'
    };
    
    let user = await getUser( req.session.userData.uuid );
    req.session.userData = user;
    
    renderObj['position'] = 'user';
    
    res.render('homepageAccount.ejs', renderObj);
}

const newPost = async (req, res, next) => {
    let type = req.query.t || null,
        title = null;
    
    if(!type){
        return res.redirect('/user');
    }
    
    let arr = [
        {
            title:'文章',
            key:'article'
        },
        {
            title:'酷站',
            key:'website'
        },
        {
            title:'帖子',
            key:'topic'
        }
    ];
    
    arr.forEach( (ar) => {
        (ar.key == type) && ( title = ar.title );
    } );
    
    if(!title){
        return res.redirect('/user');
    }
    
    let renderObj = {
        title:'发表'+title
    };
    
    let user = await getUser( req.session.userData.uuid );
    req.session.userData = user;
    renderObj['position'] = 'user';
    
    renderObj['menu'] = type;
    
    let outputUUID = ( uuidv4() ).toString();
    
    req.session['relationUUID'] = outputUUID;
    
    let relationUUIDObj = {
        result:outputUUID
    };
    
    renderObj['relationUUID'] = simpleKey.encode(relationUUIDObj,'010455');
    renderObj['relationUUID'] = renderObj['relationUUID'].replace(/\\/g,'fanxiegang');
    
    res.render(`homepageNewpost_${ type }.ejs`, renderObj);
}

const editPost = async (req, res, next) => {
    
    let type = req.query.t || null,
        title = null,
        uuid = req.query.uuid || null;
    
    if(!type || !uuid){
        return res.redirect('/user');
    }
    
    let arr = [
        {
            title:'文章',
            key:'article'
        },
        {
            title:'帖子',
            key:'thread'
        }
    ];
    
    arr.forEach( (ar) => {
        (ar.key == type) && ( title = ar.title );
    } );
    
    if(!title){
        return res.redirect('/user');
    }
    
    let renderObj = {
        title:'编辑'+title
    };
    
    let obj = await controller.queryContentById(seqModel,type,uuid);
    
    if(!obj){
        return res.redirect('/user');
    }
    
    if(obj.author != req.session.userData.uuid){
        return res.redirect('/user');
    }
    
    (type == 'article') && ( renderObj['pick'] = {} );
    
    if(type=='article' && obj.pick){
        let pick = await controller.getPickDetail(seqModel,{
            uuid:obj.pick
        });
        
        renderObj['pick'] = pick;
    }
    
    renderObj['data'] = obj;
    renderObj['position'] = 'user';
    renderObj['menu'] = type=='thread' ? 'topic' : 'article';
    
    let outputUUID = obj.uuid;
    
    req.session['relationUUID'] = outputUUID;
    
    let relationUUIDObj = {
        result:outputUUID
    };
    
    renderObj['relationUUID'] = simpleKey.encode(relationUUIDObj,'010455');
    renderObj['relationUUID'] = renderObj['relationUUID'].replace(/\\/g,'fanxiegang');
    
    let user = await getUser( req.session.userData.uuid );
    req.session.userData = user;
    
    res.render(`homepageEditpost_${ type }.ejs`, renderObj);
}

const index = async (req,res,next) => {
    return res.redirect( req.session.userData ? '/user/homepage' : '/' );
}

const article = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['s','p'];
    
    let renderObj = {
            title:'我的主页 - 文章',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({
        author:req.session.userData.uuid,
        anonymous:1
    },{sort:{postDate:1},limit:12});
    
    for(let key in queryObj){
        switch(key){
            case 's' :
                {
                    brige[0]['status'] = queryObj[key];
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
    
    let lists = await controller.queryArticleList(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd') );
    } );
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'user';
    renderObj['menu'] = 'article';
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    
    Log( renderObj );
    
    res.render('homepage_article.ejs', renderObj);
}

const website = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['s','p'];
    
    let renderObj = {
            title:'我的主页 - 酷站',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({
        author:req.session.userData.uuid
    },{sort:{postDate:1},limit:12});
    
    for(let key in queryObj){
        switch(key){
            case 's' :
                {
                    brige[0]['status'] = queryObj[key];
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
    
    let lists = await controller.queryWebsiteList(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd') );
    } );
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'user';
    
    renderObj['menu'] = 'website';
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    
    Log( renderObj );
    
    res.render('homepage_website.ejs', renderObj);
}

const code = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['s','p'];
    
    let renderObj = {
            title:'我的主页 - 代码',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({
        author:req.session.userData.uuid
    },{sort:{postDate:1},limit:12});
    
    for(let key in queryObj){
        switch(key){
            case 's' :
                {
                    brige[0]['status'] = queryObj[key];
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
    
    let lists = await controller.queryCodeList(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd') );
    } );
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'user';
    
    renderObj['menu'] = 'code';
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    
    Log( renderObj );
    
    res.render('homepage_code.ejs', renderObj);
}

const topic = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['s','p'];
    
    let renderObj = {
            title:'我的主页 - 热帖',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({
        author:req.session.userData.uuid
    },{sort:{sortDate:1},limit:12});
    
    for(let key in queryObj){
        switch(key){
            case 's' :
                {
                    brige[0]['status'] = queryObj[key];
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
    
    let lists = await controller.queryTopicList(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {sortDate:1};
    
    (!brige[1].sort) && (lists.sort = 'sortDate-1');
    
    lists.result.forEach( (item) => {
        item.sortDate = ( dateParse(new Date( item.sortDate * 1 ),'yyyy-MM-dd hh:mm') );
    } );
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'user';
    
    renderObj['menu'] = 'topic';
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    
    Log( renderObj );
    
    res.render('homepage_topic.ejs', renderObj);
}


const message = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['s','p'];
    
    let renderObj = {
            title:'我的主页 - 消息',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({
        to:req.session.userData.uuid
    },{sort:{postDate:1},limit:12});
    
    for(let key in queryObj){
        switch(key){
            case 's' :
                {
                    brige[0]['status'] = queryObj[key];
                }
            break;
                
            case 'to' :
                {
                    brige[0]['to'] = queryObj[key];
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
    
    let lists = await controller.getMessage(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd hh:mm') );
    } );
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'user';
    
    renderObj['menu'] = 'message';
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    
    Log( renderObj );
    
    res.render('homepage_messagelist.ejs', renderObj);
}

const sendMessage = async (req, res, next) => {
    
    let renderObj = {
            title:'我的主页 - 消息',
        };
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    renderObj['position'] = 'user';
    renderObj['menu'] = 'message';
    renderObj['queryObj'] = req.query;
    
    res.render('homepage_messagesend.ejs', renderObj);
}

const readMessage = async (req, res, next) => {
    
    let uuid = req.params.uuid
    
    if(!uuid){
        return next();
    }
    
    let renderObj = {
            title:'我的主页 - 读消息',
        };
    
    let datas = await controller.readMessage( seqModel,{
        to:req.session.userData.uuid,
        uuid:uuid
    } );
    
    if(datas.msg || !datas){
        return res.redirect('/user/message');
    }
    
    renderObj['datas'] = datas.result;
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    renderObj['position'] = 'user';
    renderObj['menu'] = 'message';
    
    res.render('homepage_messageread.ejs', renderObj);
}

const collections = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['t','p'];
    
    let renderObj = {
            title:'我的主页 - 热帖',
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    (!queryObj['t']) && (queryObj['t'] = 'article');
    
    let brige = new Array({
        author:req.session.userData.uuid
    },{sort:{updatedAt:1},limit:4});
    
    for(let key in queryObj){
        switch(key){
            case 't' :
                {
                    brige[0]['type'] = queryObj[key];
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
    
    let lists = await controller.queryCollectionsList(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {updatedAt:1};
    
    (!brige[1].sort) && (lists.sort = 'updatedAt-1');
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'user';
    
    renderObj['menu'] = 'collections';
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    
    Log( renderObj.data );
    
    res.render('homepage_collections.ejs', renderObj);
}

const collectionsDetail = async (req,res,next) => {
    let uuid = req.params.uuid || null;
    
    if(!uuid){
        return res.redirect('/user/collections');
    }
    
    let detail = await controller.collectionsDetail(seqModel,{
        uuid:uuid
    });
    
    if(!detail){
        return res.redirect('/user/collections');
    }
    
    let sDate = new Date().getTime();
    
    let queryKey = ['p'];
    
    let renderObj = {
            title:'我的主页 - 热帖',
        },
        queryObj = {
            collections:uuid
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({
        type:detail.type,
        collections:uuid
    },{sort:{updatedAt:1},limit:12});
    
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
    
    let lists = await controller.queryCollectionList(seqModel,brige[0],brige[1]);
    
    let listDetail = await controller.queryListDetail(seqModel,lists.result,detail.type);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {updatedAt:1};
    
    (!brige[1].sort) && (lists.sort = 'updatedAt-1');
    
    lists['option'] = brige[0];
    
    renderObj['detail'] = detail;
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'user';
    
    renderObj['menu'] = 'collections';
    
    let user = await getUser( req.session.userData.uuid );
    
    req.session.userData = user;
    
    Log( renderObj );
    
    res.render('homepage_collection.ejs', renderObj);
}


module.exports = {
    updatepage:updatepage,
    homepage:homepage,
    userDetail:userDetail,
    logout:logout,
    index:index,
    account:account,
    newPost:newPost,
    editPost:editPost,
    article:article,
    website:website,
    code:code,
    topic:topic,
    message:message,
    sendMessage:sendMessage,
    readMessage:readMessage,
    collections:collections,
    collectionsDetail:collectionsDetail,
};
