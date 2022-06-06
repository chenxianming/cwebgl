

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const querystring = require('querystring');

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
    
    let brige = new Array({},{sort:{createdAt:1},limit:12});
    
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
    
    let lists = await controller.queryPickList(seqModel,brige[0],brige[1]);
    
    lists.result.forEach( (lst) => {
        lst['updateDate'] = ( dateParse(new Date( lst.updatedAt ),'yyyy-MM-dd') );
    } );
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {createAt:1};
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'article';
    
    Log( renderObj );
    
    res.render('article-pick.ejs', renderObj);
};

module.exports = {
    getList:getList
};
