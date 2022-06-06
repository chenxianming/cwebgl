const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const uuidv4 = require('uuid/v4');
const bytelength = require('../../utils/bytelength');
const randomKey = require('../../utils/randomKey');
const md5 = require('md5');
const isMd5 = require('is-md5');

const interface = require('../../interface');

const dateParse = require('../../utils/dateParse');

module.exports = {
    login:async (models,obj) => new Promise( async (resolve) => {
        
        let result = null,
            isMobile = true,
            password = '',
            findOneCustom = {};
        
        var mobilePt = /^(86)?((13\d{9})|(15[0,1,2,3,5,6,7,8,9]\d{8})|(17[0,1,2,3,5,6,7,8,9]\d{8})|(18[2,3,0,5,6,7,8,9]\d{8}))$/;
        
        if( !obj.user || !obj.password ){
            result = {
                msg:'缺少必要字段'
            };
            
            return resolve(result);
        }
        
        if(!mobilePt.test(obj.user)){
            isMobile = false;
        }
        
        password = ( isMd5(obj.password) ? obj.password : md5(obj.password) );
        
        let type = isMobile ? 'mobile' : 'name';
        
        findOneCustom = {
            where:{}
        }
        
        findOneCustom['where'][type] = (type=='mobile') ? obj.user : {
            [Op.iLike]:obj.user
        };
        
        let user = ( await interface.findOneCustom(models.user,findOneCustom) );
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return resolve(result);
        }
        
        if(user.password != password){
            result = {
                msg:'密码错误'
            };
            
            return resolve(result);
        }
        
        if(obj.loginToken){
            
            await interface.syncSessionBySid( ('sess:'+user.loginToken),{
                userData:null
            } );
            
            let updateObj = {
                    loginToken:obj.loginToken
                },
                findObj = {
                    where:{}
                };
            
            findObj['where'][type] = obj.user;
            ( await interface.updateOneCustom(models.user,updateObj,findObj) );
            user['loginToken'] = obj.loginToken;
            
        }
        
        result = {
            result:user
        };
        
        return resolve(result);
        
    }),
    newUser:async (models,obj) => new Promise( async (resolve) => {
        
        let uuid = uuidv4();
        
        let findOneCustom = {};
        
        let result = null;
        
        //let regPt = /^[\u4E00-\u9FA5a-zA-Z0-9_-]{3,12}$/;
        let regPt = /^[\u4E00-\u9FA5a-zA-Z0-9_-]/;
        
        var mobilePt = /^(86)?((13\d{9})|(15[0,1,2,3,5,6,7,8,9]\d{8})|(17[0,1,2,3,5,6,7,8,9]\d{8})|(18[2,3,0,5,6,7,8,9]\d{8}))$/;
        
        for(let key in obj){
            switch (key){
                case 'name' :
                    {
                        let name = obj[key];
                        
                        if(!name){
                            result = {
                                msg:'缺少用户'
                            };
                            
                            return resolve(result);
                        }
                        
                        if( bytelength(name) > 12 || bytelength(name) < 3 ){
                            result = {
                                msg:'用户不能大于12个字节或小于3个字节'
                            };
                            
                            return resolve(result);
                        }
                        
                        
                        if(!regPt.test(name)){
                            result = {
                                msg:'用户格式不正确'
                            };
                            
                            return resolve(result);
                        }
                    }
                break ;
                    
                case 'password' :
                    {
                        let password = obj[key];
                        
                        if(!password){
                            result = {
                                msg:'缺少密码'
                            };
                            
                            return resolve(result);
                        }
                        
                        if( bytelength(password) > 20 || bytelength(password) < 6 ){
                            result = {
                                msg:'密码不能大于20个字节或小于6个字节'
                            };
                            
                            return resolve(result);
                        }
                        
                        let pass = ( isMd5(password) ? password : md5(password) );
                        
                        obj['password'] = pass;
                    }
                break ;
                    
                case 'mobile' :
                    {
                        let mobile = obj[key];
                        
                        if(!mobile){
                            result = {
                                msg:'缺少手机'
                            };
                            
                            return resolve(result);
                        }
                        
                        if(!mobilePt.test(mobile)){
                            result = {
                                msg:'手机格式不正确'
                            };
                            
                            return resolve(result);
                        }
                    }
                break ;
            }
        }
        
        //check user
        findOneCustom = {
            where:{
                name:obj.name
            }
        }
        
        if( await interface.findOneCustom(models.user,findOneCustom) ){
            result = {
                msg:'用户已存在'
            };

            return resolve(result);
        }
        
        findOneCustom = {
            where:{
                mobile:obj.mobile
            }
        }
        
        if( await interface.findOneCustom(models.user,findOneCustom) ){
            result = {
                msg:'手机已存在'
            };
            
            return resolve(result);
        }
        
        let randomAvatar = `/avatar_pack_random/1535707443523_${ Math.ceil(Math.random() * 6) }.png`;
        obj['avatar'] = randomAvatar;
        result = await interface.insertOne( models.user,obj );
        
        if(!result){
            return resolve({
                msg:'注册失败'
            });
        }
        
        let autoCollections = [
            {
                field:'article',
                name:'文章'
            },
            {
                field:'website',
                name:'酷站'
            },
            {
                field:'code',
                name:'代码'
            },
            {
                field:'topic',
                name:'论坛主题'
            }
        ];
        
        autoCollections.forEach( (ac) => {
            const fn = async () => {
                await interface.insertOne(models.collections,{
                    uuid:uuidv4(),
                    author:obj['uuid'],
                    type:ac.field,
                    name:`我的收藏夹`,
                    description:`系统默认创建`
                });
            }
            fn();
        } );
        
        resolve(result ? {
            result:result
        } : {
            msg:'注册失败'
        });
        
    } ),
    newPick:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const must = ['author','categories','title','description','litpic'];
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        newObj['uuid'] = uuidv4();
        
        result = await interface.insertOne( models.pick,newObj );
        
        return result ? {
            result:newObj['uuid']
        } : {
            msg:'查询失败'
        };
        
    },
    newComment:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true,
            fineOneCustom = {};
        
        const must = ['target','type','author','content'];
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        fineOneCustom = {
            where:{
                uuid:obj.target
            }
        };
        
        let target = await interface.findOneCustom(models[obj.type],fineOneCustom);
        
        if(!target){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if(target.status!='normal'){
            result = {
                msg:'内容正在审核中'
            };
            
            return result;
        }
        
        newObj['uuid'] = uuidv4();
        newObj['postDate'] = new Date().getTime();
        newObj['status'] = 'normal';
        
        result = await interface.insertOne( models.comment,newObj );
        
        return result ? {
            result:`发表成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转..`
        } : {
            msg:'发表失败'
        };
    },
    getUser:async (models,obj) => {
        
        let fineOneCustom = {
            where:{
                uuid:obj.uuid
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let queryNewMessage = {
            where:{
                to:obj.uuid,
                status:'unread'
            }
        };
        
        let newMessage = await interface.geContentListCount(models.message,queryNewMessage);
        
        user['newMessage'] = newMessage;
        
        return user;
    },
    updateProfile:async (models,uuid,options) => {
        
        let findObj = {
            where:{
                uuid:uuid
            }
        };
            
        
        let result = ( await interface.updateOneCustom(models.user,options,findObj) );
        
        if(!result){
            return {
                msg:'更新失败，请重试'
            };
        }
        
        return result;
        
    },
    getPickDetail:async (models,obj) => new Promise( async (resolve) => {
        
        let result = null;
        
        if(!obj.uuid){
            result = {
                msg:'缺少必要参数'
            }
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.uuid
            }
        };
        
        let pick = await interface.findOneCustom(models.pick,fineOneCustom);
        
        if(!pick){
            result = {
                msg:'专栏不存在'
            };
            
            return resolve(result);
        }
        
        let task = [];
        
        pick.child.forEach( (uuid) => {
            let f = {
                where:{
                    uuid:obj.uuid
                }
            };
            
            task.push( interface.findOneCustom(models.article,f) );
        } );
        
        let articles = await Promise.all( task );
        
        return resolve({
            pick:pick,
            articles:articles
        });
        
    } ),
    getPick:async (models,obj,options) => new Promise( async (resolve) => {
        
        const autoArr = ['categories','tags','author','status'];
        
        const queryObj = {
            //attributes:['uuid','title','author','litpic','categories','postDate','views','status','tags'],
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key && arrKey!='tags'){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
                
            } );
        }
        
        let count = await interface.geContentListCount(models.pick,queryObj);
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }

                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if(val){
                                queryObj.order.push(new Array(opKey,'DESC'));
                            }
                        }
                    }
                break ;

                case 'offset' :
                    {
                        let val = options[key];
                        queryObj.offset = val;
                    }
                break ;

                case 'limit' :
                    {
                        let val = Math.min(options[key],40);

                        queryObj.limit = val;
                    }
                break ;
            }
        }
        
        results = await interface.queryList(models.pick,queryObj);
        
        resolve( results ? {
            count:count,
            result:results
        } : {
            results:[]
        } );
    } ),
    editPick:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const must = ['uuid','author'];
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        const prefix = ['title','description'];
        
        for(let key in obj){
            prefix.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
            } );
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        fineOneCustom = {
            where:{
                uuid:obj.uuid
            }
        };
        
        let pick = await interface.findOneCustom(models.pick,fineOneCustom);
        
        if(!pick){
            result = {
                msg:'专栏不存在'
            };
            
            return result;
        }
        
        if( pick.author != obj.author && pick.author != 'admin' ){
            result = {
                msg:'您无权限修改'
            };
            
            return result;
        }
        
        let findObj = {
            where:{
                uuid:obj.uuid
            }
        };

        result = ( await interface.updateOneCustom(models.pick,newObj,findObj) );
        
        return result ? {
            result:'修改成功'
        } : {
            msg:'修改失败'
        };
        
    },
    removePick:async (models,obj) => {
    
        let result = null,
            newObj = {},
            isPass = true;
        
        const must = ['uuid','author'];
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        fineOneCustom = {
            where:{
                uuid:obj.uuid
            }
        };
        
        let pick = await interface.findOneCustom(models.pick,fineOneCustom);
        
        if(!pick){
            result = {
                msg:'专栏不存在'
            };
            
            return result;
        }
        
        if( pick.author != obj.author && pick.author != 'admin' ){
            result = {
                msg:'您无权操作'
            };
            
            return result;
        }
        
        newObj = {
            where:{
                uuid:obj.uuid
            }
        };
        
        result = await interface.deleteOne(models.pick,newObj);
        
        return result ? {
            result:'删除专栏成功'
        } : {
            msg:'删除专栏失败'
        };
        
    },
    addToPick:async (models,obj) => {

        let result = null,
            newObj = {},
            isPass = true;
        
        const must = ['uuid','target','author'];
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = await interface.queryContentById(models,'user',obj.author);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let pick = await interface.queryContentById(models,'pick',obj.uuid);
        
        if(!pick){
            result = {
                msg:'专栏不存在'
            };
            
            return result;
        }
        
        let article = await interface.queryContentById(models,'article',obj.target);
        
        if(!article){
            result = {
                msg:'文章不存在'
            };
            
            return result;
        }
        
        if( ( article.author != pick.author ) && obj.author != article.author && obj.author != 'admin' ){
            result = {
                msg:'您无权进行此操作'
            };
            
            return result;
        }
        
        if(pick.child.indexOf(obj.target) > -1){
            result = {
                msg:'该文章已在专栏中'
            };
            
            return result;
        }
        
        if( pick.child.length >= 200 ){
            result = {
                msg:'专栏收录不能超过200篇文章'
            };
            
            return result;
        }
        
        let findOneCustom = {
            where:{
                child:{
                    [Op.contains]:new Array(obj.target)
                }
            }
        };
        
        let inPick = await interface.findOneCustom(models.pick,findOneCustom);
        
        if(inPick){
            result = {
                msg:'该文章已被其他专栏收录'
            };
            
            return result;
        }
        
        newObj.child = pick.child;
        
        newObj.child.push( obj.target );
        
        let custom = {
            where:{
                uuid:obj.uuid,
            }
        };
        
        result = await interface.updateOneCustom(models.pick,newObj,custom);
        
        let updateObj = {
            pick:obj.uuid
        }
        
        custom = {
            where:{
                uuid:obj.target,
            }
        };
        
        await interface.updateOneCustom(models.article,updateObj,custom);
        
        return result ? {
            result:'该文章已加入专栏'
        } : {
            msg:'该文章加入失败'
        };
    },
    removeFormPick:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const must = ['uuid','target','author'];
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = await interface.queryContentById(models,'user',obj.author);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let pick = await interface.queryContentById(models,'pick',obj.uuid);
        
        if(!pick){
            result = {
                msg:'专栏不存在'
            };
            
            return result;
        }
        
        let article = await interface.queryContentById(models,'article',obj.target);
        
        if(!article){
            result = {
                msg:'文章不存在'
            };
            
            return result;
        }
        
        let idx = pick.child.indexOf(obj.target);
        
        if( idx < 0){
            result = {
                msg:'该文章不在专栏中'
            };
            
            return result;
        }
        
        pick.child.splice( idx,1 );
        
        newObj = {
            child:pick.child
        };
        
        let custom = {
            where:{
                uuid:obj.uuid,
            }
        };
        
        result = await interface.updateOneCustom(models.pick,newObj,custom);
        
        return result ? {
            result:'该文章已从专栏中删除'
        } : {
            msg:'删除失败'
        };
        
    },
    editArticle:async (models,obj) => {

        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['author','categories','title','content'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }

        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        const prefixArr = ['litpic','pick','from','fromLink','description','tags','anonymous'];
        
        for(let key in obj){
            prefixArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
            } );
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        
        if( obj['pick'] ){
            
            
            let syncPick;
            
            //delete newObj['pick'];
            
            if( obj['defaultpick'] ){
                syncPick = {
                    uuid:obj.defaultpick,
                    target:obj.uuid,
                    author:obj.author
                };
                
                let syncResult = ( obj['defaultpick'] ) && await module.exports.removeFormPick(models,syncPick);
                
                if( syncResult.msg ){
                    return syncResult;
                }
            }
            
            if( obj['pick'] != 'delete' ){
                
                syncPick = {
                    uuid:obj.pick,
                    target:obj.uuid,
                    author:obj.author
                };
                
                let syncResult = ( obj['pick'] ) && await module.exports.addToPick(models,syncPick);
                
                if( syncResult.msg ){
                    return syncResult;
                }
            }else{
                newObj['pick'] = null;
            }
            
            /*
            
            let syncResult = ( obj['defaultpick'] ) && await module.exports.removeFormPick(models,syncPick);
            
            if( syncResult.msg ){
                return syncResult;
            }
            
            if( newObj['pick'] != 'delete' ){
                syncResult = ( newObj['pick'] ) && await module.exports.addToPick(models,syncPick);
                if( syncResult.msg ){
                    return syncResult;
                }
            }
            */
        }
        
        //newObj['postDate'] = new Date().getTime();
        
        let findObj = {
                where:{
                    uuid:obj.uuid
                }
            };
        
        result = ( await interface.updateOneCustom(models.article,newObj,findObj) );
        
        return result ? {
            result:`编辑成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转.. (请耐心等待审核)`
        } : {
            msg:'编辑失败'
        };

    },
    newArticle:async (models,obj) => {
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['author','categories','title','content','uuid'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        const prefixArr = ['litpic','pick','from','fromLink','description','tags','anonymous'];
        
        for(let key in obj){
            prefixArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
            } );
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        newObj['postDate'] = new Date().getTime();
        
        result = await interface.insertOne(models.article,newObj);
        
        return result ? {
            result:`发表成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转.. (请耐心等待审核)`
        } : {
            msg:'发表失败'
        };
        
    },
    newWebsite:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['author', 'title', 'link', 'description','tags'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        newObj.link = obj.link.replace(/https\:\/\/|http\:\/\/|\/$/g,'');
        
        let fineOneCustom = {
            where:{
                link:newObj.link
            }
        };
        
        let isExist = await interface.findOneCustom(models.website,fineOneCustom);
        
        if(isExist){
            result = {
                msg:'该网站已收录'
            };
            
            return result;
        }
        
        let uuid = uuidv4();
        newObj.uuid = uuid;
        newObj.postDate = new Date().getTime();
        
        result = await interface.insertOne(models.website,newObj);
        
        return result ? {
            result:`发表成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转.. (请耐心等待审核)`
        } : {
            msg:'添加失败'
        };
        
    },
    queryContentById:async (models,type,uuid) => {
        return await interface.queryContentById(models,type,uuid);
    },
    newTopic:async (models,obj) => {
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['title','author','content','tags'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        if( obj.type ){
            newObj['type'] = obj.type;
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let timestamp = new Date().getTime();
        
        newObj['uuid'] = uuidv4();
        newObj['status'] = 'normal';
        newObj['sortDate'] = timestamp;
        
        result = await interface.insertOne(models.topic,newObj);
        
        //new topic thread
        let threadObj = {
            uuid:uuidv4(),
            topic:newObj['uuid'],
            author:newObj.author,
            postDate:timestamp,
            index:0,
            content:newObj.content
        };
        
        await interface.insertOne(models.thread,threadObj);
        
        return result ? {
            result:`发表成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转..`
        } : {
            msg:'添加失败'
        };
    },
    newThread:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['topic','author','content'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        result = await interface.queryContentById(models,'topic',obj.topic);
        
        if(!result){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        let queryObj = {
            attributes:['index'],
            where:{
                topic:obj.topic
            },
            limit:1,
            offset:0,
            order:[
                ['index', 'DESC']
            ]
        };
        
        let index = await interface.queryList(models.thread,queryObj);
        
        if(!index[0]){
            result = {
                msg:'主题不存在或内容正在审核中'
            };
            
            return result;
        }
        
        let timestamp = new Date().getTime();
        
        newObj['index'] = (index[0].index * 1) + 1;
        newObj['postDate'] = timestamp;
        newObj['uuid'] = uuidv4();
        
        
        result = await interface.insertOne(models.thread,newObj);
        
        if(!result){
            result = {
                msg:'回复失败'
            };
            
            return result;
        }
        
        
        //update topic sortDate
        let updateObj = {
            sortDate:timestamp
        };
        
        let findObj = {
            where:{
                uuid:obj.topic,
            }
        };
        
        result = await interface.updateOneCustom(models.topic,updateObj,findObj);
        
        return result ? {
            result:newObj['topic']
        } : {
            msg:'新增失败'
        };
        
    },
    editThread:async (models,obj) => {

        let result = null,
            newObj = {},
            isPass = true,
            topic = null;
        
        const autoArr = ['uuid','author','content'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let thread = await interface.queryContentById(models,'thread',obj.uuid);
        
        if(!thread){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if( thread.author != obj.author && thread.author != 'admin' ){
            result = {
                msg:'您无权限修改'
            };
            
            return result;
        }
        
        topic = thread.topic;
        
        
        let timestamp = new Date().getTime();
        
        newObj.content = `<div class="line-postscript">[该用户于${ ( dateParse(new Date( timestamp ),'yyyy-MM-dd hh:mm') ) }进行编辑]</div>` + newObj.content;
        
        let updateObj = {
            content:newObj.content
        };
        
        let findObj = {
            where:{
                uuid:obj.uuid
            }
        };
        
        await interface.updateOneCustom(models.thread,updateObj,findObj);
        
        //update topic sortDate
        updateObj = {
            sortDate:timestamp
        };
        
        findObj = {
            where:{
                uuid:topic,
            }
        };
        
        result = await interface.updateOneCustom(models.topic,updateObj,findObj);
        
        return result ? {
            result:topic
        } : {
            msg:'修改失败'
        };   
    },
    queryUserResult:async (models,obj,options) => new Promise( async (resolve) => {
        
        let task = [];
        
        const autoArr = ['author','status'];
        
        const queryObj = {
            //attributes:['uuid','title','author','litpic','categories','postDate','views','status','tags'],
            where:{}
        };
        
        obj.type && ( autoArr.push('anonymous') );
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key && arrKey!='tags'){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
            } );
        }
        
        let count = await interface.geContentListCount(models.article,queryObj);
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }

                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if(val){
                                queryObj.order.push(new Array(opKey,'DESC'));
                            }
                        }
                    }
                break ;

                case 'offset' :
                    {
                        let val = options[key];
                        queryObj.offset = val;
                    }
                break ;

                case 'limit' :
                    {
                        let val = Math.min(options[key],40);

                        queryObj.limit = val;
                    }
                break ;
            }
        }
        
        ( obj.type=='topic' ) && ( queryObj['order'] = [ [ 'sortDate', 'DESC' ] ] );
        
        results = await interface.queryList(models[obj.type],queryObj);
        
        if(obj.type=='article'){
            
            results.forEach( (item) => {
                ( item.postDate = dateParse( new Date( item.postDate * 1 ), 'yyyy-MM-dd' ) );
            } );
            
        }
        
        if(obj.type=='topic'){
            
            results.forEach( (item) => {
                ( item.sortDate = dateParse( new Date( item.sortDate * 1 ), 'yyyy-MM-dd hh:mm' ) );
            } );
            
            //==== thread count
            task = [];

            const getCollCount = (item) => new Promise( async (resolve) => {
                let q = {
                    where:{
                        topic:item.uuid
                    }
                };

                let count = await interface.geContentListCount(models.thread,q);
                item.threadCount = count;
                
                resolve( item );
            } );

            results.forEach( (rs) => {
                task.push( getCollCount(rs) );
            } );

            results = await Promise.all( task );
            //====
            
        }
        
        return resolve( {
            count:count,
            result:results,
        } );
        
    } ),
    queryArticleList:async (models,obj,options) => new Promise( async (resolve) => {
        
       const autoArr = ['categories','tags','author','status'];
        
        const queryObj = {
            attributes:['uuid','title','author','litpic','categories','postDate','views','status','tags'],
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key && arrKey!='tags'){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
                
                
                if(arrKey=='tags' && arrKey==key){
                    let val = obj[key];
                    if(val){
                        queryObj.where['tags'] = {
                            [Op.contains]:new Array(val)
                        };
                    }
                }
            } );
        }
        
        let pendingCount = await interface.geContentListCount(models.article,{
            where:{
                author:obj.author,
                status:'pending'
            }
        });
        
        let count = await interface.geContentListCount(models.article,queryObj);
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }

                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if(val){
                                queryObj.order.push(new Array(opKey,'DESC'));
                            }
                        }
                    }
                break ;

                case 'offset' :
                    {
                        let val = options[key];
                        queryObj.offset = val;
                    }
                break ;

                case 'limit' :
                    {
                        let val = Math.min(options[key],40);

                        queryObj.limit = val;
                    }
                break ;
            }
        }
        
        results = await interface.queryList(models.article,queryObj);
        
        
        //==== comment
        let task = [];
        
        const getCom = (item) => new Promise( async (resolve) => {
            
            let q = {
                where:{
                    target:item.uuid,
                    type:'article'
                }
            };
            
            item.comment = await interface.geContentListCount(models.comment,q);
            
            resolve( item );
        } );
        
        results.forEach( (rs) => {
            task.push( getCom(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        
        resolve( results ? {
            count:count,
            pendingCount:pendingCount,
            result:results
        } : {
            results:[]
        } );
        
    } ),
    queryWebsiteList:async (models,obj,options) => new Promise( async (resolve) => {
        
        const autoArr = ['categories','author','status'];
        
        const containArr = ['tags','categories','language','color','platform'];
        
        const queryObj = {
            attributes:['uuid','title','author','litpic','categories','postDate','views','status','tags','link','color','language','platform'],
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if( arrKey == key ){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
            } );
            
            containArr.forEach( (arrKey) => {
                if( arrKey == key ){
                    let val = obj[key];
                    queryObj.where[key] = {
                        [Op.contains]:new Array(val)
                    };
                }
            } );
        }
        
        let count = await interface.geContentListCount(models.website,queryObj);
        
        let pendingCount = await interface.geContentListCount(models.website,{
            where:{
                author:obj.author,
                status:'pending'
            }
        });
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }

                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if( val>0 ){
                                queryObj.order.push(new Array(opKey,'DESC'));
                            }else{
                                queryObj.order.push(new Array(opKey,'ASC'));
                            }
                        }
                    }
                break ;

                case 'offset' :
                    {
                        let val = options[key];
                        queryObj.offset = val;
                    }
                break ;

                case 'limit' :
                    {
                        let val = Math.min(options[key],40);

                        queryObj.limit = val;
                    }
                break ;
            }
        }
        
        results = await interface.queryList(models.website,queryObj);
        
        resolve(results ? {
            count:count,
            pendingCount:pendingCount,
            result:results,
            limit:queryObj.limit
        } : {
            results:[]
        });
        
    } ),
    queryCodeList:async (models,obj,options) => new Promise( async (resolve) => {
        
       const autoArr = ['status','author'];
        
        const queryObj = {
            //attributes:['title','postDate','views','description'],
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key && arrKey!='tags'){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
                
                
                if(arrKey=='tags' && arrKey==key){
                    let val = obj[key];
                    if(val){
                        queryObj.where['tags'] = {
                            [Op.contains]:new Array(val)
                        };
                    }
                }
            } );
        }
        let count = await interface.geContentListCount(models.code,queryObj);
        let pendingCount = await interface.geContentListCount(models.code,{
            where:{
                author:obj.author,
                status:'pending'
            }
        });
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }
                        
                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if( val>0 ){
                                queryObj.order.push(new Array(opKey,'DESC'));
                            }else{
                                queryObj.order.push(new Array(opKey,'ASC'));
                            }
                        }
                    }
                break ;

                case 'offset' :
                    {
                        let val = options[key];
                        queryObj.offset = val;
                    }
                break ;

                case 'limit' :
                    {
                        let val = Math.min(options[key],40);

                        queryObj.limit = val;
                    }
                break ;
            }
        }
        
        results = await interface.queryList(models.code,queryObj);
        
        let task = [];
        
        resolve( results ? {
            pendingCount:pendingCount,
            count:count,
            result:results
        } : {
            results:[]
        } );
        
    } ),
    queryTopicList:(models,obj,options) => new Promise( async (resolve) => {
        
        const autoArr = ['author','status'];
        
        const queryObj = {
            //attributes:['uuid','title','author','litpic','categories','postDate','views','status','tags'],
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key && arrKey!='tags'){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
                
            } );
        }
        
        let pendingCount = await interface.geContentListCount(models.topic,{
            where:{
                author:obj.author,
                status:'pending'
            }
        });
        
        let count = await interface.geContentListCount(models.topic,queryObj);
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }

                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if(val){
                                queryObj.order.push(new Array(opKey,'DESC'));
                            }
                        }
                    }
                break ;

                case 'offset' :
                    {
                        let val = options[key];
                        queryObj.offset = val;
                    }
                break ;

                case 'limit' :
                    {
                        let val = Math.min(options[key],40);

                        queryObj.limit = val;
                    }
                break ;
            }
        }
        
        results = await interface.queryList(models.topic,queryObj);
        
        //==== thread
        let task = [];
        
        const getThread = (item) => new Promise( async (resolve) => {
            
            let q = {
                attributes:['uuid'],
                where:{
                    topic:item.uuid,
                    index:0
                }
            };
            
            item.thread = await interface.findOneCustom(models.thread,q);
            
            resolve( item );
        } );
        
        results.forEach( (rs) => {
            task.push( getThread(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        
        //==== thread count
        task = [];

        const getThreadCount = (item) => new Promise( async (resolve) => {
            let q = {
                where:{
                    topic:item.uuid
                }
            };

            let count = await interface.geContentListCount(models.thread,q);
            item.threadCount = count;
            resolve( item );
        } );
        
        results.forEach( (rs) => {
            task.push( getThreadCount(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        resolve( results ? {
            count:count,
            pendingCount:pendingCount,
            result:results
        } : {
            results:[]
        } );
    } ),
    queryCollectionsList:(models,obj,options) => new Promise( async (resolve) => {
        
       const autoArr = ['author','type'];
        
        const queryObj = {
            //attributes:['uuid','title','author','litpic','categories','postDate','views','status','tags'],
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key && arrKey!='tags'){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
                
            } );
        }
        
        let count = await interface.geContentListCount(models.collections,queryObj);
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }

                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if(val){
                                queryObj.order.push(new Array(opKey,'DESC'));
                            }
                        }
                    }
                break ;

                case 'offset' :
                    {
                        let val = options[key];
                        queryObj.offset = val;
                    }
                break ;

                case 'limit' :
                    {
                        let val = Math.min(options[key],40);

                        queryObj.limit = val;
                    }
                break ;
            }
        }
        
        results = await interface.queryList(models.collections,queryObj);
        
        
        //==== thread count
        task = [];

        const getCollCount = (item) => new Promise( async (resolve) => {
            let q = {
                where:{
                    collections:item.uuid
                }
            };

            let count = await interface.geContentListCount(models.collection,q);
            item.collectCount = count;
            resolve( item );
        } );
        
        results.forEach( (rs) => {
            task.push( getCollCount(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        
        resolve( results ? {
            count:count,
            result:results
        } : {
            results:[]
        } );
    } ),
    collectionsDetail:async (models,obj) => {
        
        let q = {
            where:obj
        };
        
        let result = await interface.findOneCustom(models.collections,q);
        
        return result;
    },
    queryCollectionList:async (models,obj,options) => {
        
        const autoArr = ['collections','type', 'author'];
        
        const queryObj = {
            //attributes:['uuid','title','author','litpic','categories','postDate','views','status','tags'],
            where:{}
        };
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key && arrKey!='tags'){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
                
            } );
        }
        
        let count = await interface.geContentListCount(models.collection,queryObj);
        
        for(let key in options){
            
            switch(key){
                case 'sort' :
                    {
                        if(!queryObj.order){
                            queryObj.order = [];
                        }

                        for(let opKey in options.sort){
                            let val = options.sort[opKey];
                            
                            if(val){
                                queryObj.order.push(new Array(opKey,'DESC'));
                            }
                        }
                    }
                break ;

                case 'offset' :
                    {
                        let val = options[key];
                        queryObj.offset = val;
                    }
                break ;

                case 'limit' :
                    {
                        let val = Math.min(options[key],40);

                        queryObj.limit = val;
                    }
                break ;
            }
        }
        
        results = await interface.queryList(models.collection,queryObj);
        
        return ( results ? {
            count:count,
            result:results,
        } : {
            results:[]
        } );
        
    },
    queryListDetail:async (models,list,type) => {
        
        let task = [];
        
        //==== user
        task = [];
        
        const getDetail = (item) => new Promise( async (resolve) => {
            let q = {
                where:{
                    uuid:item.target
                }
            };
            
            item.detail = ( await interface.findOneCustomRedis(models[type],q) );
            
            //date passed
            ( type=='article' ) && ( item.detail.postDate = dateParse( new Date( item.detail.postDate * 1 ), 'yyyy-MM-dd' ) );
            
            ( type=='topic' ) && ( item.detail.sortDate = dateParse( new Date( item.detail.sortDate * 1 ), 'yyyy-MM-dd hh:ss' ) );
            
            if( ( type=='topic' ) ){
                //==== thread count
                let q = {
                    where:{
                        topic:item.detail.uuid
                    }
                };

                let count = await interface.geContentListCount(models.thread,q);
                item.detail.threadCount = count;
                //====
            }
            
            resolve( item );
        } );
        
        list.forEach( (rs) => {
            task.push( getDetail(rs) );
        } );
        
        let result = await Promise.all( task );
        //====
        
        
        return result;
    },
    deleteEventarticle:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true,
            topic = null;
        
        const autoArr = ['uuid','author'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let content = await interface.queryContentById(models,obj.type,obj.uuid);
        
        if(!content){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if( content.author != obj.author && content.author != 'admin' ){
            result = {
                msg:'您无权限修改'
            };
            
            return result;
        }
        
        let deleteObj = {
            where:{
                uuid:obj.uuid
            }
        };
        
        result = await interface.deleteOne(models.article,deleteObj);
        
        //remove comment
        await interface.deleteOne(models.comment,{
            where:{
                target:obj.uuid,
                type:obj.type
            }
        });
        
        //remove collection
        
        let removeCollection = {
            where:{
                target:obj.uuid
            }
        };
        
        await interface.deleteOne(models.collection,removeCollection);
        
        return result ? {
            result:`删除成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转..`
        } : {
            msg:'删除失败'
        };
        
    },
    deleteEventcode:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true,
            topic = null;
        
        const autoArr = ['uuid','author'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let content = await interface.queryContentById(models,obj.type,obj.uuid);
        
        if(!content){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if( content.author != obj.author && content.author != 'admin' ){
            result = {
                msg:'您无权限修改'
            };
            
            return result;
        }
        
        let deleteObj = {
            where:{
                uuid:obj.uuid
            }
        };
        
        result = await interface.deleteOne(models.code,deleteObj);
        
        //remove comment
        await interface.deleteOne(models.comment,{
            where:{
                target:obj.uuid,
                type:obj.type
            }
        });
        
        //remove collection
        
        let removeCollection = {
            where:{
                target:obj.uuid
            }
        };
        
        await interface.deleteOne(models.collection,removeCollection);
        
        return result ? {
            result:`删除成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转..`
        } : {
            msg:'删除失败'
        };
        
    },
    deleteEventtopic:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true,
            topic = null;
        
        const autoArr = ['uuid','author'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let content = await interface.queryContentById(models,obj.type,obj.uuid);
        
        if(!content){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if( content.author != obj.author && content.author != 'admin' ){
            result = {
                msg:'您无权限修改'
            };
            
            return result;
        }
        
        let deleteObj = {
            where:{
                uuid:obj.uuid
            }
        };
        
        result = await interface.deleteOne(models.topic,deleteObj);
        
        //remove thread
        await interface.deleteOne(models.thread,{
            where:{
                topic:obj.uuid
            }
        });
        
        //remove collection
        
        let removeCollection = {
            where:{
                target:obj.uuid
            }
        };
        
        await interface.deleteOne(models.collection,removeCollection);
        
        return result ? {
            result:`删除成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转..`
        } : {
            msg:'删除失败'
        };
        
    },
    deleteEventcollections:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true,
            topic = null;
        
        const autoArr = ['uuid','author'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let content = await interface.queryContentById(models,'collections',obj.uuid);
        
        if(!content){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if( content.author != obj.author && content.author != 'admin' ){
            result = {
                msg:'您无权限修改'
            };
            
            return result;
        }
        
        let deleteObj = {
            where:{
                uuid:obj.uuid
            }
        };
        
        result = await interface.deleteOne(models[obj.type],deleteObj);
        
        //remove collection
        
        let removeCollection = {
            where:{
                collections:obj.uuid
            }
        };
        
        await interface.deleteOne(models.collection,removeCollection);
        
        return result ? {
            result:`删除成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转..`
        } : {
            msg:'删除失败'
        };
        
    },
    deleteEventmessage:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true,
            topic = null;
        
        const autoArr = ['uuid','author'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let fineOneCustom = {
            where:{
                uuid:obj.author
            }
        };
        
        let user = await interface.findOneCustom(models.user,fineOneCustom);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let content = await interface.queryContentById(models,obj.type,obj.uuid);
        
        if(!content){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if( content.to != obj.author && content.to != 'admin' ){
            result = {
                msg:'您无权限修改'
            };
            
            return result;
        }
        
        let deleteObj = {
            where:{
                uuid:obj.uuid
            }
        };
        
        result = await interface.deleteOne(models[obj.type],deleteObj);
        
        return result ? {
            result:`删除成功 <span class="time-limit">${ ~~( 3 ) }</span> 秒后进行跳转..`
        } : {
            msg:'删除失败'
        };
        
    },
    getMessage:async (models,obj,option) => {
        
        let attributes = [],
            must = ['to'],
            prefix = ['status'],
            sort = ['postDate'],
            field = ['offset','limit'],
            result = false,
            isPass = true;
        
        let queryObj = {
            order:[],
            where:{}
        };
        
        if(attributes.length){
            queryObj.attributes = attributes;
        }
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            }
            return result;
        }
        
        for(let key in obj){
            prefix.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    queryObj.where[key] = val;
                }
            } );
        }
        
        let count = await interface.geContentListCount(models.message,queryObj);
        
        for(let key in option.sort){
            sort.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = option.sort[key];
                    val && queryObj.order.push(new Array(key,'DESC'));
                }
            } );
        }
        
        for(let key in option){
            field.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = option[key];
                    queryObj[key] = val;
                }
            } );
        }
        
        //build queryObj END
        result = await interface.queryList(models.message,queryObj);
        
        let pendingCount = await interface.geContentListCount(models.message,{
            where:{
                to:obj.to,
                status:'unread'
            }
        });
        
        let task = [];
        
        //==== user
        task = [];
        
        const getUsr = (item) => new Promise( async (resolve) => {
            
            item.userDetail = ( await interface.getUserSimple(models.user,item.author) );
            resolve( item );
        } );
        
        result.forEach( (rs) => {
            task.push( getUsr(rs) );
        } );
        
        await Promise.all( task );
        //====
        
        
        return {
            result:result,
            offet:option.offset || 1,
            limit:option.limit,
            count:count,
            pendingCount:pendingCount,
        };
        
    },
    sendMessage:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const must = ['title','author','to','content'];
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        if( obj.author == obj.to ){
            result = {
                msg:'您不能发信息给自己'
            };
            
            return result;
        }
        
        let toQ = {
            where:{
                name:obj.to
            }
        }
        
        let toUser = await interface.findOneCustom(models.user,toQ);
        
        if(!toUser){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        newObj.to = toUser.uuid;
        
        let user = await interface.queryContentById(models,'user',obj.author);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        if( bytelength(obj.content) >= 1000){
            result = {
                msg:'消息长度不能大于1000'
            };
            
            return result;
        }
        
        newObj['uuid'] = uuidv4();
        newObj['postDate'] = new Date().getTime();
        
        result = await interface.insertOne( models.message,newObj );
        
        return result ? {
            result:'发送成功'
        } : {
            msg:'发送失败'
        };
        
    },
    readMessage:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const must = ['uuid','to'];
        
        for(let key in obj){
            must.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = await interface.queryContentById(models,'user',obj.to);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let msg = await interface.queryContentById(models,'message',obj.uuid);
        
        if(!msg){
            result = {
                msg:'消息不存在'
            };
            
            return result;
        }
        
        if( msg.to != obj.to && msg.to != 'admin' ){
            result = {
                msg:'您无阅读权限'
            };
            
            return result;
        }
        
        let updateObj = {
            status:'read'
        };
        
        let custom = {
            where:{
                uuid:obj.uuid,
            }
        };
        
        result = await interface.updateOneCustom(models.message,updateObj,custom);
        
        msg.postDate = dateParse( new Date(msg.postDate*1),'yyyy-MM-dd hh:mm' );
        
        msg.userDetail = ( await interface.getUserSimple(models.user,msg.author) );
        
        return result ? {
            result:msg
        } : {
            msg:'阅读失败'
        };
        
    },
    collectExist:async (model,obj) => {
        let must = ['type','target','author'],
            queryObj = {},
            isPass = true;

        must.forEach( (key) => {
            obj[key] && ( queryObj[key] = obj[key] );
            ( !obj[key] ) && ( isPass = false );
        } )

        if(!isPass){
            return null;
        }
        
        let count = await interface.collectExist(model,queryObj) || 0;
        
        return count;
    },
    addCollectEvent:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['target','type','author','collections'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = await interface.queryContentById(models,'user',newObj.author);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        result = await interface.collectExist(models.collection,newObj);
        
        if(result){
            result = {
                msg:'您已收藏过该内容'
            };
            
            return result;
        }
        
        let cq = {
            where:{
                uuid:newObj.collections
            }
        };
        
        result = await interface.findOneCustom(models.collections,cq);
        
        if(!result){
            result = {
                msg:'收藏夹不存在'
            };
            
            return result;
        }
        
        if(result.type != newObj.type){
            result = {
                msg:'收藏夹类型不一致'
            };
            
            return result;
        }
        
        result = await interface.queryContentById(models,newObj.type,newObj.target);
        
        if(!result){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        if(result.status!='normal'){
            result = {
                msg:'该内容正在审核中'
            };
            
            return result;
        }
        
        newObj['uuid'] = uuidv4();
        
        result = await interface.insertOne(models.collection,newObj);
        
        return result ? {
            result:newObj['uuid']
        } : {
            msg:'收藏失败'
        };
        
    },
    removeCollectEvent:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['target','type','author'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = await interface.queryContentById(models,'user',newObj.author);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        result = await interface.queryContentById(models,newObj.type,newObj.target);
        
        if(!result){
            result = {
                msg:'内容不存在'
            };
            
            return result;
        }
        
        result = await interface.collectExist(models.collection,newObj);
        
        if(!result){
            result = {
                msg:'您尚未藏该内容'
            };
            
            return result;
        }
        
        result = await interface.deleteOne(models.collection,{
            where:newObj
        });
        
        return result ? {
            result:'删除成功'
        } : {
            msg:'删除失败'
        };
        
    },
    newCollection:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['author','type','name','description'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = await interface.queryContentById(models,'user',newObj.author);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let qo = {
            where:{
                author:newObj.author,
                type:newObj.type,
                name:newObj.name,
            }
        }
        
        result = await interface.findOneCustom(models.collections,qo);
        
        if(result){
            result = {
                msg:'收藏夹已存在'
            };
            
            return result;
        }
        
        newObj['uuid'] = uuidv4();
        
        result = await interface.insertOne(models.collections,newObj);
        
        return result ? {
            result:newObj['uuid']
        } : {
            msg:'新增失败'
        };
        
    },
    editCollection:async (models,obj) => {
        
        let result = null,
            newObj = {},
            isPass = true;
        
        const autoArr = ['author','name','description','uuid'];
        
        for(let key in obj){
            autoArr.forEach( (arrKey) => {
                if(arrKey==key){
                    let val = obj[key];
                    newObj[key] = val;
                }
                
                if(!obj[arrKey]){
                    isPass = false;
                }
                
            } );
        }
        
        if(!isPass){
            result = {
                msg:'缺少必要字段'
            };
            
            return result;
        }
        
        let user = await interface.queryContentById(models,'user',newObj.author);
        
        if(!user){
            result = {
                msg:'用户不存在'
            };
            
            return result;
        }
        
        let qo = {
            where:{
                uuid:newObj.uuid
            }
        };
        
        result = await interface.findOneCustom(models.collections,qo);
        
        if(!result){
            result = {
                msg:'收藏夹不存在'
            };
            
            return result;
        }
        
        if( (result.author != newObj.author) && (newObj.author != 'admin') ){
            result = {
                msg:'您无权限编辑'
            };
            
            return result;
        }
        
        delete newObj.author;
        delete newObj.uuid;
        
        result = await interface.updateOneCustom(models.collections,newObj,qo);
        
        return result ? {
            result:newObj['uuid']
        } : {
            msg:'修改失败'
        };
        
    },
}

