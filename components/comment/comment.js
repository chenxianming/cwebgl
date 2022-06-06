let express = require('express');
let router = express.Router();

//render api

const getList = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['t','p'];
    
    let renderObj = {
            
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.body[key] && ( queryObj[key] = req.body[key] );
    } );
    
    let brige = new Array({status:'normal'},{sort:{postDate:1},limit:10});
    
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
    
    
    let lists = await controller.getList(seqModel,brige[0],brige[1]);
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd') );
    } );
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    res.json(renderObj);
};

module.exports = {
    getList:getList
};
