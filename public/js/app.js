"use strict"

;( (function(c,f,global){
    c(function(){
        var fn,
            Cwebgl = function(a){
                fn = c.extend({//pass me some data fn
                    utils:function(){
                        Date.prototype.Format = function (fmt) { //author: meizz 
                            var o = {
                                "M+": this.getMonth() + 1, //月份 
                                "d+": this.getDate(), //日 
                                "h+": this.getHours(), //小时 
                                "m+": this.getMinutes(), //分 
                                "s+": this.getSeconds(), //秒 
                                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                                "S": this.getMilliseconds() //毫秒 
                            };
                            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                            for (var k in o)
                            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                            return fmt;
                        }
                        
                        window.getLogInfomation = function(str){
                            c('.code-console-text-inner').append(`<pre>${str}</pre>`);
                            c('.code-console-text').scrollTop( c('.code-console-text-inner').height() + 20 );
                            console.log( str );
                        }
                        
                        Array.prototype.remove = function(val) {
                            var index = this.indexOf(val);
                            if (index > -1) {
                                return this.splice(index, 1);
                            }
                        };
                        
                        //defined Base64
                        fn.base64Encode();
                        fn.base64Decode();
                        
                        c.fn.initialEditor = function(){
                            var usage = c(this).attr('data-usage').split(','),
                                map = [
                                    {name:'face',icon:'smile',description:'插入表情'},
                                    {name:'link',icon:'text-format',description:'插入链接'},
                                    {name:'image',icon:'picture',description:'插入图片'},
                                    {name:'code',icon:'code',description:'插入代码'},
                                    {name:'cloud',icon:'cloud-sync',description:'插入云端代码'},
                                    {name:'headline',icon:'strikethrough',description:'插入标题'},
                                    {name:'bold',icon:'bold',description:'插入粗体字'},
                                    {name:'list',icon:'list',description:'插入列表'},
                                    {name:'audio',icon:'music-note',description:'插入音乐'},
                                    {name:'video',icon:'film-play',description:'插入视频'},
                                    {name:'attachment',icon:'paperclip',description:'插入附件'},
                                    {name:'paragraph',icon:'text-align-left',description:'修改对齐方式'},
                                ],
                                face = [
                                    {
                                        name:'eyes_only',
                                        text:'eyes_only'
                                    },
                                    {
                                        name:'grin_1',
                                        text:'grin_1'
                                    },
                                    {
                                        name:'grin_2',
                                        text:'grin_2'
                                    },
                                    {
                                        name:'grin_3',
                                        text:'grin_3'
                                    },
                                    {
                                        name:'grin_4',
                                        text:'grin_4'
                                    },
                                    {
                                        name:'grin_5',
                                        text:'grin_5'
                                    },
                                    {
                                        name:'smile',
                                        text:'smile'
                                    },
                                    {
                                        name:'smile_upsidedown',
                                        text:'smile_upsidedown'
                                    },
                                    {
                                        name:'sad_1',
                                        text:'sad_1'
                                    },
                                    {
                                        name:'sad_2',
                                        text:'sad_2'
                                    },
                                    {
                                        name:'sad_3',
                                        text:'sad_3'
                                    },
                                    {
                                        name:'frown_1',
                                        text:'frown_1'
                                    },
                                    {
                                        name:'frown_2',
                                        text:'frown_2'
                                    },
                                    {
                                        name:'surprised_sad',
                                        text:'surprised_sad'
                                    },
                                    {
                                        name:'surprised_sad_raised_brows',
                                        text:'surprised_sad_raised_brows'
                                    },
                                    {
                                        name:'sad_with_frown',
                                        text:'sad_with_frown'
                                    },
                                    {
                                        name:'surprised_raised_brows',
                                        text:'surprised_raised_brows'
                                    },
                                    {
                                        name:'surprised',
                                        text:'surprised'
                                    },
                                    {
                                        name:'disappointed',
                                        text:'disappointed'
                                    },
                                    {
                                        name:'angry_1',
                                        text:'angry_1'
                                    },
                                    {
                                        name:'angry_2',
                                        text:'angry_2'
                                    },
                                    {
                                        name:'delightful',
                                        text:'delightful'
                                    },
                                    {
                                        name:'not_impressed',
                                        text:'not_impressed'
                                    },
                                    {
                                        name:'smirk',
                                        text:'smirk'
                                    },
                                    {
                                        name:'wink',
                                        text:'wink'
                                    },
                                    {
                                        name:'heart_eyes',
                                        text:'heart_eyes'
                                    },
                                    {
                                        name:'kiss_heart',
                                        text:'kiss_heart'
                                    },
                                    {
                                        name:'kiss',
                                        text:'kiss'
                                    },
                                    {
                                        name:'kiss_happy_eyes',
                                        text:'kiss_happy_eyes'
                                    },
                                    {
                                        name:'kiss_blushing',
                                        text:'kiss_blushing'
                                    },
                                    {
                                        name:'disappointed',
                                        text:'disappointed'
                                    },
                                    {
                                        name:'doh',
                                        text:'doh'
                                    },
                                    {
                                        name:'blushing_1',
                                        text:'blushing_1'
                                    },
                                    {
                                        name:'blushing_2',
                                        text:'blushing_2'
                                    },
                                    {
                                        name:'dead',
                                        text:'dead'
                                    },
                                    {
                                        name:'yelling',
                                        text:'yelling'
                                    },
                                    {
                                        name:'sigh',
                                        text:'sigh'
                                    },
                                    {
                                        name:'tongue_out_1',
                                        text:'tongue_out_1'
                                    },
                                    {
                                        name:'tongue_out_2',
                                        text:'tongue_out_2'
                                    },
                                    {
                                        name:'tongue_out_3',
                                        text:'tongue_out_3'
                                    },
                                    {
                                        name:'tongue_out_4',
                                        text:'tongue_out_4'
                                    },
                                    {
                                        name:'eyes_up',
                                        text:'eyes_up'
                                    },
                                    {
                                        name:'eyes_open',
                                        text:'eyes_open'
                                    },
                                    {
                                        name:'sigh_2',
                                        text:'sigh_2'
                                    },
                                    {
                                        name:'angel',
                                        text:'angel'
                                    },
                                    {
                                        name:'nervous_smile',
                                        text:'nervous_smile'
                                    },
                                    {
                                        name:'grin_drop',
                                        text:'grin_drop'
                                    },
                                    {
                                        name:'tired_drop',
                                        text:'tired_drop'
                                    },
                                    {
                                        name:'tear_1',
                                        text:'tear_1'
                                    },
                                    {
                                        name:'tear_2',
                                        text:'tear_2'
                                    },
                                    {
                                        name:'headache_1',
                                        text:'headache_1'
                                    },
                                    {
                                        name:'headache_2',
                                        text:'headache_2'
                                    },
                                    {
                                        name:'spooky',
                                        text:'spooky'
                                    },
                                    {
                                        name:'laughing_tears',
                                        text:'laughing_tears'
                                    },
                                    {
                                        name:'wiping_tear',
                                        text:'wiping_tear'
                                    },
                                    {
                                        name:'sunglasses',
                                        text:'sunglasses'
                                    },
                                    {
                                        name:'zzz',
                                        text:'zzz'
                                    },
                                    {
                                        name:'nurse',
                                        text:'nurse'
                                    },
                                    {
                                        name:'crying',
                                        text:'crying'
                                    },
                                    {
                                        name:'wounded',
                                        text:'wounded'
                                    },
                                    {
                                        name:'dollar_eyes',
                                        text:'dollar_eyes'
                                    },
                                    {
                                        name:'pondering',
                                        text:'pondering'
                                    },
                                    {
                                        name:'Ill',
                                        text:'Ill'
                                    },
                                    {
                                        name:'zipped',
                                        text:'zipped'
                                    },
                                    {
                                        name:'geek',
                                        text:'geek'
                                    },
                                    {
                                        name:'hrumph',
                                        text:'hrumph'
                                    },
                                    {
                                        name:'poop',
                                        text:'poop'
                                    },
                                ];
                            
                            if(!usage.length){
                                return ;
                            }
                            
                            var self = c(this),
                                editor = self.find('.post-content-textarea'),
                                editPos = 0,
                                container = self.parents('#comment-reply').length ? self.parents('#comment-reply') : self.parents('.content-post'),
                                postBtn = container.find('.post-content-submit'),
                                isActive = container.find('.comment-reply-post-nologin')[0] ? false : true,
                                obj = {
                                    bindEvent:function(){
                                        self.find('.post-title-i').each(function(){
                                            var _self = c(this);
                                            
                                            map.forEach(function(m){
                                                ( _self.hasClass(`editor-${ m.name }`) ) && ( c(document).on('click',`.editor-${ m.name }`,obj.eventList[m.name ]) );
                                                
                                                
                                                ( ( _self.hasClass(`editor-${ m.name }`) ) && obj.implementation[m.name+'Done'] ) && ( c(document).on('click',`.editor-${ m.name }-option .editor-option-done`,obj.implementation[m.name+'Done']) );
                                                
                                            }); 
                                        });
                                        
                                        //initial data
                                        c('.post-title-i').each( function(){
                                            ( c(this).hasClass('editor-image') && global.relationUUID ) && ( c(this).data('uploadKey',true) );
                                            
                                            ( c(this).hasClass('editor-attachment') && global.relationUUID ) && ( c(this).data('uploadKey',true) );
                                        } );
                                        
                                        editor.on('blur',function(){
                                            editPos = obj.implementation.getCurPos();
                                        }).on('keydown',function(e){
                                            
                                            /*
                                            if(!c(this).html() || c(this).html()=='<br>' ){
                                                e.preventDefault();
                                                var range = window.getSelection().getRangeAt(0);
                                                var div = document.createElement('div');
                                                div.innerHTML = e.key;
                                                range.insertNode(div);
                                                
                                                setTimeout(function(){
                                                    window.getSelection().removeAllRanges();
                                                    
                                                    obj.implementation.focus();
                                                    
                                                },1);
                                            }
                                            */
                                        });
                                        
                                        
                                        try {
                                            document.execCommand("AutoUrlDetect", false, false);
                                        }catch(e){}
                                        
                                        editor.on('paste', function(e){
                                            e.preventDefault();
                                            
                                            var text = null;
                                            
                                            if(window.clipboardData && clipboardData.setData) {
                                                // IE
                                                text = window.clipboardData.getData('text');
                                            }else{
                                                text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
                                            }
                                            
                                            if (document.body.createTextRange) {    
                                                if (document.selection) {
                                                    textRange = document.selection.createRange();
                                                } else if (window.getSelection) {
                                                    sel = window.getSelection();
                                                    var range = sel.getRangeAt(0);

                                                    // 创建临时元素，使得TextRange可以移动到正确的位置
                                                    var tempEl = document.createElement("span");
                                                    tempEl.innerHTML = "&#FEFF;";
                                                    range.deleteContents();
                                                    range.insertNode(tempEl);
                                                    textRange = document.body.createTextRange();
                                                    textRange.moveToElementText(tempEl);
                                                    tempEl.parentNode.removeChild(tempEl);
                                                }
                                                textRange.text = text;
                                                textRange.collapse(false);
                                                textRange.select();
                                            } else {
                                                // Chrome之类浏览器
                                                document.execCommand("insertText", false, text);
                                            }
                                        });
                                        
                                        c(document).on('click','.editor-option-cancel',obj.implementation.close);
                                        
                                        c(document).on('click','.edit-align-item',obj.implementation.textAlignEvent);
                                        
                                        c(document).on('click','.editor-input-uploadimg',obj.implementation.uploadImg);
                                        
                                        c(document).on('click','.editor-face li',obj.implementation.face);
                                        
                                        postBtn.on('click',obj.eventList.post);
                                        
                                        obj.implementation.initTextAlign();
                                    },
                                    implementation:{
                                        face:function(e){
                                            e.stopPropagation();
                                            
                                            var self = c(this);
                                            
                                            self.addClass('cur').siblings().removeClass('cur');
                                            
                                            setTimeout(function(){
                                                self.parents('.editor-face-option').find('.editor-option-done').trigger('click');
                                            },20);
                                        },
                                        uploadImg:function(){
                                            
                                            var self = c(this);
                                            
                                            var chunk = `
                                                <div class="uploadpic">
                                                    <div class="uploadpic-area"></div>
                                                    <div class="uploadpic-uploadevent btn">上传<input accept="image/gif, image/jpeg, image/png" type="file" data-aspectRatio="${ c(this).attr('data-aspectRatio') }" /></div>
                                                </div>
                                            `;
                                            
                                            fn.alert(chunk,global.eventObj.uploadEvent.bind(this,function(imgLink){
                                                self.parents('.editor-input').find('input').val( imgLink );
                                            }));
                                            
                                            c('.dialog-port').css({
                                                top:'50%',
                                                marginTop:c('.dialog-port').height()/-2,
                                                width:700,
                                                marginLeft:-350
                                            });
                                            
                                            ( self.data('uploadKey') ) && setTimeout( function(){
                                                c('.uploadpic').data('uploadKey',true);
                                            },20 );
                                            
                                        },
                                        postComment:function(obj){
                                            
                                            if(global.eventLock){
                                                return ;
                                            }
                                            
                                            fn.eventLock();

                                            var cerf = ( fn.simpleKey.keygen() );
                                
                                            var preObj = {
                                                    cerf:cerf
                                                },
                                                queryObj = {};
                                            
                                            //set cerficate
                                            queryObj['token'] = global.token;
                                            queryObj['key'] = global.key;

                                            var datas = fn.simpleKey.encode(preObj,global.key);
                                            
                                            queryObj['datas'] = datas;
                                            c.post('/user/postKey',queryObj,function(response){

                                                fn.setToken(response.key);

                                                if(response.msg){
                                                    fn.eventUnlock();
                                                    return fn.dialog(response.msg);
                                                }

                                                global.publicKey = ( response.result );
                                                
                                                var objData = preObj;
                                                fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                                    
                                                    preObj['rsa'] = rsa;
                                                    
                                                    var qa = ['target','type','content'];

                                                    var queryObj = {};
                                                    
                                                    preObj = Object.assign(preObj,obj);
                                                    
                                                    //set cerficate
                                                    queryObj['token'] = global.token;
                                                    queryObj['key'] = global.key;

                                                    var datas = fn.simpleKey.encode(preObj,global.key);
                                                    queryObj['datas'] = datas;

                                                    c.post('/user/newComment',queryObj,function(response){

                                                        fn.eventUnlock();
                                                        fn.setToken(response.key);

                                                        if(response.msg){
                                                            return fn.dialog(response.msg);
                                                        }

                                                        fn.dialog( response.result );
                                                        fn.eventLock();
                                                        setTimeout(function(){
                                                            location.href = location.href;
                                                        },2500);
                                                        
                                                    }).fail(function(response){
                                                        
                                                        fn.eventUnlock();
                                                        fn.dialog(response.statusText);
                                                    });
                                                    
                                                });

                                            }).fail(function(response){

                                                fn.eventUnlock();
                                                fn.dialog(response.statusText);

                                            });
                                            
                                            
                                        },
                                        initTextAlign:function(){
                                            
                                            var self_ = self.find('.editor-paragraph');
                                            
                                            c('.edit-align').remove();
                                            
                                            self_.append(`
                                                <div class="edit-align">
                                                    <button id="text-left" class="btn edit-align-item">
                                                        <i class="lnr-text-align-left lnr"></i><span>左对齐</span>
                                                    </button>
                                                    <button id="text-center" class="btn edit-align-item">
                                                        <i class="lnr-text-align-center lnr"></i><span>居中对齐</span>
                                                    </button>
                                                    <button id="text-right" class="btn edit-align-item">
                                                        <i class="lnr-text-align-right lnr"></i><span>右对齐</span>
                                                    </button>
                                                </div>
                                            `);
                                        },
                                        focus:function(len){
                                            //设置选区焦点
                                            var len = len || 1;
                                            
                                            var this__ = editor,
                                                div = this__.find('div:eq(-1)')[0],
                                                range = document.createRange();
                                            range.setStart(div, len);
                                            range.setEnd(div, len);
                                            getSelection().addRange(range);
                                        },
                                        getCurPos:function(){
                                            
                                            var sel, range;
                                            
                                            try{
                                                sel = window.getSelection();
                                                var r = sel.getRangeAt(0);
                                                
                                                if( !c(r.commonAncestorContainer).hasClass('post-content-textarea') && !c(r.commonAncestorContainer).parents('.post-content-textarea')[0] ){
                                                    return ;
                                                }
                                                
                                                range = r;
                                            }catch(e){}
                                            
                                            return range;
                                        },
                                        textAlignEvent:function(e){
                                            
                                            //e.preventDefault();
                                            
                                            var direction = c(this)[0].id ? c(this)[0].id.replace('text-','') : null;
                                            
                                            if(!direction){
                                                return ;
                                            }
                                            
                                            document.execCommand('justify'+direction);
                                            
                                        },
                                        close:function(){
                                            c(this).parents('.editor-option').remove();
                                        },
                                        faceDone:function(){
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            
                                            if(!c('.editor-face li.cur')){
                                                return ;
                                            }
                                            
                                            var el = c('<img />').addClass('emoji-face');
                                            
                                            el.attr('src',c('.editor-face li.cur img')[0].src);
                                            
                                            var ct = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            ct.append(el);
                                            ct.append(br);
                                            
                                            editPos.insertNode ? editPos.insertNode( ct[0] ) : editPos.appendChild( ct[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                            
                                        },
                                        linkDone:function(){
                                            
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var href = 
                                                c(this).parents('.editor-option').find('.editor-input input[name="link-href"]').val() || null,
                                                text = 
                                                c(this).parents('.editor-option').find('.editor-input input[name="link-text"]').val() || null,
                                                color = 
                                                c(this).parents('.editor-option').find('.editor-input input[name="link-color"]').val() || null;
                                            
                                            var el = c('<a />'),
                                                elI = c(`<font />`).html(text);
                                            
                                            href && el.attr('href',href);
                                            
                                            text && el.html( elI );
                                            
                                            color && elI.attr('color',color);
                                            
                                            var ct = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            ct.append(el);
                                            ct.append(br);
                                            
                                            editPos.insertNode ? editPos.insertNode( ct[0] ) : editPos.appendChild( ct[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                        },
                                        imageDone:function(){
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var href = c(this).parents('.editor-option').find('.editor-input input[name="image-href"]').val() || null,
                                                width = c(this).parents('.editor-option').find('.editor-input input[name="image-width"]').val() || null,
                                                height = c(this).parents('.editor-option').find('.editor-input input[name="image-height"]').val() || null;
                                                
                                            var el = c('<img />');
                                            
                                            href && el.attr('src',href);
                                            
                                            width && el.css('width',width);
                                            
                                            height && el.css('width',height);
                                            
                                            var ct = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            ct.append(el);
                                            ct.append(br);
                                            
                                            editPos.insertNode ? editPos.insertNode( ct[0] ) : editPos.appendChild( ct[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                            
                                        },
                                        codeDone:function(){
                                            
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var value = c(this).parents('.editor-option').find('.editor-textarea textarea[name="code-value"]').val() || '';
                                            
                                            var code = c(`<code />`),
                                                arr = value.split(`\n`),
                                                el = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            arr.forEach(function(html){
                                                code.append( c(`<pre />`).text(html) );
                                            });
                                            
                                            el.append( code );
                                            el.append( br );
                                            
                                            editPos.insertNode ? editPos.insertNode( el[0] ) : editPos.appendChild( el[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                        },
                                        cloudDone:function(){
                                            
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var value = c(this).parents('.editor-option').find('.editor-input input').val() || '';
                                            
                                            var cloud = c(`<cloud />`),
                                                el = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            cloud.text( value );
                                            
                                            el.append( cloud );
                                            el.append( br );
                                            
                                            editPos.insertNode ? editPos.insertNode( el[0] ) : editPos.appendChild( el[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                            
                                            fn.initialCloud();
                                        },
                                        headlineDone:function(){
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var value = c(this).parents('.editor-option').find('.editor-input input[name="headline-value"]').val() || null,
                                                color = c(this).parents('.editor-option').find('.editor-input input[name="headline-color"]').val() || null;
                                                
                                            var el = c('<h3 />'),
                                                elI = c(`<font />`).html(value);
                                            
                                            value && el.html(elI);
                                            
                                            color && elI.attr('color',color);
                                            
                                            var ct = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            ct.append(el);
                                            ct.append(br);
                                            
                                            editPos.insertNode ? editPos.insertNode( ct[0] ) : editPos.appendChild( ct[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                            
                                        },
                                        boldDone:function(){
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var value = c(this).parents('.editor-option').find('.editor-input input[name="bold-value"]').val() || null,
                                                color = c(this).parents('.editor-option').find('.editor-input input[name="bold-color"]').val() || null;
                                                
                                            var el = c('<b />'),
                                                elI = c(`<font />`).html(value);
                                            
                                            value && el.html(elI);
                                            
                                            color && elI.attr('color',color);
                                            
                                            var ct = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            ct.append(el);
                                            ct.append(br);
                                            
                                            editPos.insertNode ? editPos.insertNode( ct[0] ) : editPos.appendChild( ct[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                            
                                        },
                                        listDone:function(){

                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var value = c(this).parents('.editor-option').find('.editor-textarea textarea[name="list-value"]').val() || '';
                                            
                                            var ul = c(`<ul />`),
                                                arr = value.split(`\n`),
                                                el = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            arr.forEach(function(html){
                                                ul.append( c(`<li />`).text(html) );
                                            });
                                            
                                            el.append( ul );
                                            el.append( br );
                                            
                                            editPos.insertNode ? editPos.insertNode( el[0] ) : editPos.appendChild( el[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                            
                                        },
                                        audioDone:function(){
                                            
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var link = c(this).parents('.editor-option').find('.editor-input input[name="audio-link"]').val() || null;
                                            
                                            var el = c('<audio controls />');
                                            
                                            link && el.attr('src',link);
                                            
                                            var ct = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            ct.append(el);
                                            ct.append(br);
                                            
                                            editPos.insertNode ? editPos.insertNode( ct[0] ) : editPos.appendChild( ct[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                        },
                                        videoDone:function(){
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                            
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var link = 
                                                c(this).parents('.editor-option').find('.editor-input input[name="video-link"]').val() || null,
                                                width = c(this).parents('.editor-option').find('.editor-input input[name="video-width"]').val() || null,
                                                height = c(this).parents('.editor-option').find('.editor-input input[name="video-height"]').val() || null,
                                                type = link.match(/\.swf/g) ? 'swf' : 'video';
                                            
                                            if(!link){
                                                return ;
                                            }
                                            
                                            var el = 
                                            
                                            (type == 'swf') ? (
                                                c('<embed controls />').attr({
                                                    src:link || null,
                                                    allowFullScreen:true,
                                                    quality:'high',
                                                    width:width||480,
                                                    height:height||400,
                                                    align:'middle',
                                                    allowScriptAccess:'always',
                                                    type:'application/x-shockwave-flash'
                                                })
                                            ) : (
                                                c('<video controls />').attr({
                                                    src:link || null,
                                                    width:width||480,
                                                    height:height||400,
                                                })
                                            );
                                            
                                            var ct = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            ct.append(el);
                                            ct.append(br);
                                            
                                            editPos.insertNode ? editPos.insertNode( ct[0] ) : editPos.appendChild( ct[0] );
                                        },
                                        attachmentDone:function(){
                                            
                                            if(!editPos){
                                                editPos = editor[0];
                                            }
                                            
                                            var el = c(`<attachment />`);
                                            
                                            c('.attachment-list-li').each( function(idx){
                                                (idx!=0) && ( el.append(`\n`) );
                                                el.append(`${c(this).attr('data-name')},${c(this).data('url')},${c(this).data('size')}`);
                                            } );
                                            
                                            var ct = c(`<div />`),
                                                br = c(`<br />`);
                                            
                                            ct.append(el);
                                            ct.append(br);
                                            
                                            editPos.insertNode ? editPos.insertNode( ct[0] ) : editPos.appendChild( ct[0] );
                                            
                                            c(this).parents('.post').find('.editor-option-cancel').trigger('click');
                                        },
                                        appendFace:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var chunk = '';
                                            
                                            face.forEach( function(f){
                                                chunk += `<li class="btn" title="${ f.text }" data-value="${ f.name }"><img src="/emoji/${  f.name }.png" /></li>`;
                                            } );
                                            
                                            var html = `
                                                    <div class="editor-option editor-face-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-face">
                                                                    <ul>${ chunk }</ul>
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                        appendLink:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-link-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="link-href" type="text" placeholder="链接地址" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="link-text" type="text" placeholder="链接文字" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="link-color" type="text" placeholder="链接颜色" value="#ffa325" />
                                                                    <div class="editor-input-color btn"><i class="lnr-magic-wand lnr"></i></div>
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                        appendImage:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-image-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input style="width:190px;margin:0 0 0 20px;" name="image-href" type="text" placeholder="图片链接" />
                                                                    <div class="editor-input-uploadimg btn">上传</div>
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="editor-input" style="display:inline-block;vertical-align:middle;width:135px;margin-right:10px;">
                                                                    <input style="width:95px" name="image-width" type="text" placeholder="宽度" />
                                                                </div><div class="editor-input" style="display:inline-block;vertical-align:middle;width:135px;">
                                                                    <input style="width:95px" name="image-height" type="text" placeholder="高度" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                            
                                            ( jqSelf.data('uploadKey') ) && setTimeout( function(){
                                                c('.editor-input-uploadimg').data('uploadKey',true);
                                            },20 );
                                        },
                                        appendCode:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-code-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-textarea">
                                                                    <textarea name="code-value" placeholder="插入代码"></textarea>
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                        appendCloud:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-cloud-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="link-text" type="text" placeholder="云端代码ID" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                        appendHeadline:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-headline-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="headline-value" type="text" placeholder="粗体内容" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="headline-color" type="text" placeholder="链接颜色" />
                                                                    <div class="editor-input-color btn"><i class="lnr-magic-wand lnr"></i></div>
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                        appendBold:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-bold-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="bold-value" type="text" placeholder="粗体内容" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="bold-color" type="text" placeholder="链接颜色" />
                                                                    <div class="editor-input-color btn"><i class="lnr-magic-wand lnr"></i></div>
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                        appendList:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-list-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-textarea">
                                                                    <textarea name="list-value" placeholder="插入列表,换行隔开"></textarea>
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                        appendAudio:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-audio-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="audio-link" type="text" placeholder="音乐链接" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                        appendVideo:function(jqSelf){
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-video-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="editor-input">
                                                                    <input name="video-link" type="text" placeholder="链接地址 .swf / .mp4 / .mov" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="editor-input" style="display:inline-block;vertical-align:middle;width:135px;margin-right:10px;">
                                                                    <input style="width:95px" name="video-width" type="text" placeholder="宽度" />
                                                                </div><div class="editor-input" style="display:inline-block;vertical-align:middle;width:135px;">
                                                                    <input style="width:95px" name="video-height" type="text" placeholder="高度" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                        appendAttachment:function(jqSelf){
                                            
                                            if(!global.relationUUID){
                                                return fn.dialog('上传密钥获取失败,请刷新重试');
                                            }
                                            
                                            self.find('.editor-option').remove();
                                            
                                            var html = `
                                                    <div class="editor-option editor-attachment-option" style="left:${ jqSelf.position().left }px">
                                                        <div class="pd20">
                                                            <div class="editor-option-line">
                                                                <div class="attachment-list"></div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="attachment-upload btn">
                                                                    上传附件
                                                                    <input type="file" />
                                                                </div>
                                                            </div>
                                                            <div class="editor-option-line">
                                                                <div class="fr"><div class="btn editor-option-cancel">取消</div></div>
                                                                <div class="fr"><div class="btn editor-option-done">确定</div></div>
                                                                <div class="clear"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                                            
                                            self.append(html);
                                        },
                                    },
                                    eventList:{
                                        face:function(){
                                            obj.implementation.appendFace( c(this) );
                                        },
                                        link:function(){
                                            obj.implementation.appendLink( c(this) );
                                        },
                                        image:function(){
                                            obj.implementation.appendImage( c(this) );
                                        },
                                        code:function(){
                                            obj.implementation.appendCode( c(this) );
                                        },
                                        cloud:function(){
                                            obj.implementation.appendCloud( c(this) );
                                        },
                                        headline:function(){
                                            obj.implementation.appendHeadline( c(this) );
                                        },
                                        bold:function(){
                                            obj.implementation.appendBold( c(this) );
                                        },
                                        list:function(){
                                            obj.implementation.appendList( c(this) );
                                        },
                                        audio:function(){
                                            obj.implementation.appendAudio( c(this) );
                                        },
                                        video:function(){
                                            obj.implementation.appendVideo( c(this) );
                                        },
                                        attachment:function(){
                                            obj.implementation.appendAttachment( c(this) );
                                        },
                                        paragraph:function(){},
                                        post:function(){
                                            var id = container.attr('data-target') || null,
                                                event = container.attr('data-type') || null,
                                                type = self.attr('data-type') || null,
                                                content = editor.html() || null,
                                                isPass = true;
                                            
                                            if( !id || !event || !type || !content ){
                                                return fn.dialog('缺少必要参数');
                                            }
                                            
                                            var usage = self.attr('data-usage').split(','),
                                                fieldArr = ['face','link','image','code','bold','audio','video','attachment'];
                                            
                                            fieldArr.forEach( function(field){
                                                if( usage.indexOf(field) < 0 ){
                                                    //check
                                                }
                                            } );
                                            
                                            if(!isPass){
                                                return fn.dialog('内容有误,请重新提交');
                                            }
                                            
                                            //initial cloud tag
                                            c('.post-content-textarea cloud').each(function(){
                                                var guid = c(this).find('.cloud-preview').attr('data-uuid');
                                                c(this).html( guid );
                                            });
                                            
                                            switch(event){
                                                
                                                case 'comments' :
                                                    {
                                                        obj.implementation.postComment({
                                                            target:id,
                                                            type:type,
                                                            content:content
                                                        });
                                                    }
                                                break ;
                                                    
                                                case 'editArticle' :
                                                    {
                                                        
                                                        var arr = ['categories','from','fromLink','title','anonymous','content','tags'],
                                                            postObj = {},
                                                            isPass = true,
                                                            must = ['categories','title','content','uuid'];
                                                        
                                                        arr.forEach(function(field){
                                                            switch(field){
                                                                case 'categories' :
                                                                    {
                                                                        var categories = c(`.homepage-container-line-selector[data-value="${ field }"] li`).find('.selected').parents('li').find('span').html();
                                                                        
                                                                        categories && ( postObj[field] = categories );
                                                                    }
                                                                break ;
                                                                    
                                                                case 'content' :
                                                                    {
                                                                        
                                                                        c('.post-content-textarea').html() && ( postObj[field] = c.trim( c('.post-content-textarea').html() ) );
                                                                    }
                                                                break ;
                                                                
                                                                case 'anonymous' :
                                                                    {
                                                                        postObj['anonymous'] = c(`.homepage-container-line-selector[data-value="anonymous"] .homepage-container-sl.selected`)[0] ? 1 : 0;
                                                                    }
                                                                break ;
                                                                    
                                                                case 'tags' :
                                                                    {
                                                                        postObj['tags'] = [];
                                                                        
                                                                        c('.tags li').each(function(){
                                                                            var v = c(this).find('span').html();
                                                                            postObj['tags'].indexOf(v) && postObj['tags'].push( v );
                                                                        });
                                                                    }
                                                                break ;
                                                                    
                                                                default : 
                                                                    {
                                                                        c(`.content-edit`).find(`*[data-value="${ field }"]`).val() && ( postObj[field] = c(`.content-edit`).find(`*[data-value="${ field }"]`).val() );
                                                                    }
                                                                break ;
                                                            }
                                                        });
                                                        
                                                        
                                                        c(`.content-edit`).find('.is-created.selected')[0] && ( postObj['from'] = 'CWEBGL原创',postObj['fromLink'] = '/' );
                                                        
                                                        postObj['uuid'] = fn.getUrlParam('uuid') || null;
                                                        postObj['pick'] = c('.homepage-container-line-pick-selector').attr('data-uuid');
                                                        postObj['defaultpick'] = c('.homepage-container-line-pick-selector').attr('data-default');
                                                        
                                                        must.forEach(function(key){
                                                            ( !postObj[key] ) && ( isPass = false );
                                                        });
                                                        
                                                        if( !isPass ){
                                                            return fn.dialog('缺少必填参数');
                                                        }
                                                        
                                                        if( global.eventLock ){
                                                            return ;
                                                        }

                                                        fn.eventLock();

                                                        var cerf = ( fn.simpleKey.keygen() ),
                                                            preObj = {
                                                                cerf:cerf
                                                            },
                                                            queryObj = {};
                                                        
                                                        //set cerficate
                                                        queryObj['token'] = global.token;
                                                        queryObj['key'] = global.key;

                                                        var datas = fn.simpleKey.encode(preObj,global.key);
                                                        queryObj['datas'] = datas;

                                                        c.post('/user/postKey',queryObj,function(response){

                                                            fn.setToken(response.key);

                                                            if(response.msg){
                                                                fn.eventUnlock();
                                                                return fn.dialog(response.msg);
                                                            }

                                                            global.publicKey = ( response.result );

                                                            var objData = preObj;

                                                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){

                                                                preObj['rsa'] = rsa;
                                                                preObj = Object.assign( preObj,postObj );
                                                                
                                                                var queryObj = {};

                                                                //set cerficate
                                                                queryObj['token'] = global.token;
                                                                queryObj['key'] = global.key;

                                                                var datas = fn.simpleKey.encode(preObj,global.key);
                                                                queryObj['datas'] = datas;

                                                                c.post('/user/editarticle',queryObj,function(response){

                                                                    fn.eventUnlock();
                                                                    fn.setToken(response.key);

                                                                    if(response.msg){
                                                                        return fn.dialog(response.msg);
                                                                    }

                                                                    fn.dialog(response.result);
                                                                    fn.eventLock();
                                                                    setTimeout(function(){
                                                                        location.href = '/user';
                                                                    },2500);

                                                                }).fail(function(response){
                                                                    fn.eventUnlock();
                                                                    fn.dialog(response.statusText);
                                                                });

                                                            });

                                                        }).fail(function(response){

                                                            fn.eventUnlock();
                                                            fn.dialog(response.statusText);

                                                        });
                                                        
                                                        
                                                    }
                                                break ;
                                                    
                                                case 'newArticle' :
                                                    {
                                                        var arr = ['categories','from','fromLink','title','anonymous','content','tags'],
                                                            postObj = {},
                                                            must = ['categories','title','content'];
                                                        
                                                        arr.forEach(function(field){
                                                            switch(field){
                                                                case 'categories' :
                                                                    {
                                                                        var categories = c(`.homepage-container-line-selector[data-value="${ field }"] li`).find('.selected').parents('li').find('span').html();
                                                                        
                                                                        categories && ( postObj[field] = categories );
                                                                    }
                                                                break ;
                                                                    
                                                                case 'content' :
                                                                    {
                                                                        c('.post-content-textarea').html() && ( postObj[field] = c.trim( c('.post-content-textarea').html() ) );
                                                                    }
                                                                break ;
                                                                
                                                                case 'anonymous' :
                                                                    {
                                                                        postObj['anonymous'] = c(`.homepage-container-line-selector[data-value="anonymous"] .homepage-container-sl.selected`)[0] ? 1 : 0;
                                                                    }
                                                                break ;
                                                                    
                                                                case 'tags' :
                                                                    {
                                                                        postObj['tags'] = [];
                                                                        
                                                                        c('.tags li').each(function(){
                                                                            var v = c(this).find('span').html();
                                                                            postObj['tags'].indexOf(v) && postObj['tags'].push( v );
                                                                        });
                                                                    }
                                                                break ;
                                                                    
                                                                default : 
                                                                    {
                                                                        c(`.content-edit`).find(`*[data-value="${ field }"]`).val() && ( postObj[field] = c(`.content-edit`).find(`*[data-value="${ field }"]`).val() );
                                                                    }
                                                                break ;
                                                            }
                                                        });
                                                        
                                                        c(`.content-edit`).find('.is-created.selected')[0] && ( postObj['from'] = 'CWEBGL原创',postObj['fromLink'] = '/' );
                                                        
                                                        if( !postObj['title'] || !postObj['categories'] || !postObj['content'] ){
                                                            return fn.dialog('缺少必填参数');
                                                        }
                                                        
                                                        if( global.eventLock ){
                                                            return ;
                                                        }

                                                        fn.eventLock();

                                                        var cerf = ( fn.simpleKey.keygen() ),
                                                            preObj = {
                                                                cerf:cerf
                                                            },
                                                            queryObj = {};
                                                        
                                                        //set cerficate
                                                        queryObj['token'] = global.token;
                                                        queryObj['key'] = global.key;

                                                        var datas = fn.simpleKey.encode(preObj,global.key);
                                                        queryObj['datas'] = datas;

                                                        c.post('/user/postKey',queryObj,function(response){

                                                            fn.setToken(response.key);

                                                            if(response.msg){
                                                                fn.eventUnlock();
                                                                return fn.dialog(response.msg);
                                                            }

                                                            global.publicKey = ( response.result );

                                                            var objData = preObj;

                                                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){

                                                                preObj['rsa'] = rsa;
                                                                preObj = Object.assign( preObj,postObj );
                                                                
                                                                var queryObj = {};

                                                                //set cerficate
                                                                queryObj['token'] = global.token;
                                                                queryObj['key'] = global.key;

                                                                var datas = fn.simpleKey.encode(preObj,global.key);
                                                                queryObj['datas'] = datas;

                                                                c.post('/user/newarticle',queryObj,function(response){

                                                                    fn.eventUnlock();
                                                                    fn.setToken(response.key);

                                                                    if(response.msg){
                                                                        return fn.dialog(response.msg);
                                                                    }

                                                                    fn.dialog(response.result);
                                                                    fn.eventLock();
                                                                    setTimeout(function(){
                                                                        location.href = '/user';
                                                                    },2500);

                                                                }).fail(function(response){
                                                                    fn.eventUnlock();
                                                                    fn.dialog(response.statusText);
                                                                });

                                                            });

                                                        }).fail(function(response){

                                                            fn.eventUnlock();
                                                            fn.dialog(response.statusText);

                                                        });
                                                        
                                                    }
                                                break ;
                                                    
                                                case 'newTopic' : {
                                                    var postObj = {
                                                        title:c('input[data-value="title"]').val(),
                                                        type:c(`.homepage-container-line-selector[data-value="type"] li`).find('.selected').parents('li').find('span').html() || '讨论',
                                                        content:c.trim( c('.post-content-textarea').html() )
                                                    };
                                                    
                                                    postObj['tags'] = [];
                                                                        
                                                    c('.tags li').each(function(){
                                                        var v = c(this).find('span').html();
                                                        postObj['tags'].indexOf(v) && postObj['tags'].push( v );
                                                    });
                                                    
                                                    if( !postObj['title'] || !postObj['type'] || !postObj['content'] ){
                                                        return fn.dialog('缺少必填参数');
                                                    }
                                                    
                                                    if( global.eventLock ){
                                                        return ;
                                                    }

                                                    fn.eventLock();

                                                    var cerf = ( fn.simpleKey.keygen() ),
                                                        preObj = {
                                                            cerf:cerf
                                                        },
                                                        queryObj = {};

                                                    //set cerficate
                                                    queryObj['token'] = global.token;
                                                    queryObj['key'] = global.key;

                                                    var datas = fn.simpleKey.encode(preObj,global.key);
                                                    queryObj['datas'] = datas;
                                                    
                                                    
                                                    c.post('/user/postKey',queryObj,function(response){

                                                        fn.setToken(response.key);

                                                        if(response.msg){
                                                            fn.eventUnlock();
                                                            return fn.dialog(response.msg);
                                                        }

                                                        global.publicKey = ( response.result );

                                                        var objData = preObj;

                                                        fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){

                                                            preObj['rsa'] = rsa;
                                                            preObj = Object.assign( preObj,postObj );

                                                            var queryObj = {};

                                                            //set cerficate
                                                            queryObj['token'] = global.token;
                                                            queryObj['key'] = global.key;

                                                            var datas = fn.simpleKey.encode(preObj,global.key);
                                                            queryObj['datas'] = datas;

                                                            c.post('/user/newtopic',queryObj,function(response){

                                                                fn.eventUnlock();
                                                                fn.setToken(response.key);

                                                                if(response.msg){
                                                                    return fn.dialog(response.msg);
                                                                }

                                                                fn.dialog(response.result);
                                                                fn.eventLock();
                                                                setTimeout(function(){
                                                                    location.href = '/community';
                                                                },2500);

                                                            }).fail(function(response){
                                                                fn.eventUnlock();
                                                                fn.dialog(response.statusText);
                                                            });

                                                        });

                                                    }).fail(function(response){

                                                        fn.eventUnlock();
                                                        fn.dialog(response.statusText);

                                                    });
                                                    
                                                }
                                                    
                                                break ;
                                                    
                                                case 'newReply' :
                                                    {
                                                        
                                                        var postObj = {
                                                            topic:id,
                                                            content:c.trim( c('.post-content-textarea').html() )
                                                        };

                                                        if( !postObj['topic'] || !postObj['content'] ){
                                                            return fn.dialog('缺少必填参数');
                                                        }

                                                        if( global.eventLock ){
                                                            return ;
                                                        }

                                                        fn.eventLock();

                                                        var cerf = ( fn.simpleKey.keygen() ),
                                                            preObj = {
                                                                cerf:cerf
                                                            },
                                                            queryObj = {};

                                                        //set cerficate
                                                        queryObj['token'] = global.token;
                                                        queryObj['key'] = global.key;

                                                        var datas = fn.simpleKey.encode(preObj,global.key);
                                                        queryObj['datas'] = datas;

                                                        c.post('/user/postKey',queryObj,function(response){

                                                            fn.setToken(response.key);

                                                            if(response.msg){
                                                                fn.eventUnlock();
                                                                return fn.dialog(response.msg);
                                                            }

                                                            global.publicKey = ( response.result );

                                                            var objData = preObj;

                                                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){

                                                                preObj['rsa'] = rsa;
                                                                preObj = Object.assign( preObj,postObj );

                                                                var queryObj = {};

                                                                //set cerficate
                                                                queryObj['token'] = global.token;
                                                                queryObj['key'] = global.key;

                                                                var datas = fn.simpleKey.encode(preObj,global.key);
                                                                queryObj['datas'] = datas;

                                                                c.post('/user/newthread',queryObj,function(response){

                                                                    fn.eventUnlock();
                                                                    fn.setToken(response.key);

                                                                    if(response.msg){
                                                                        return fn.dialog(response.msg);
                                                                    }

                                                                    fn.dialog('回复成功,正在跳转');
                                                                    
                                                                    fn.eventLock();
                                                                    
                                                                    setTimeout(function(){
                                                                        location.href = `/community/${response.result}.html`;
                                                                    },500);
                                                                    
                                                                }).fail(function(response){
                                                                    fn.eventUnlock();
                                                                    fn.dialog(response.statusText);
                                                                });

                                                            });

                                                        }).fail(function(response){

                                                            fn.eventUnlock();
                                                            fn.dialog(response.statusText);

                                                        });
                                                    
                                                        
                                                    }
                                                break ;
                                                    
                                                case 'editThread' :
                                                    {

                                                        var postObj = {
                                                            uuid:c('.content-post').attr('data-uuid'),
                                                            content:c.trim( c('.post-content-textarea').html() )
                                                        };

                                                        if( !postObj['uuid'] || !postObj['content'] ){
                                                            return fn.dialog('缺少必填参数');
                                                        }

                                                        if( global.eventLock ){
                                                            return ;
                                                        }

                                                        fn.eventLock();

                                                        var cerf = ( fn.simpleKey.keygen() ),
                                                            preObj = {
                                                                cerf:cerf
                                                            },
                                                            queryObj = {};

                                                        //set cerficate
                                                        queryObj['token'] = global.token;
                                                        queryObj['key'] = global.key;

                                                        var datas = fn.simpleKey.encode(preObj,global.key);
                                                        queryObj['datas'] = datas;

                                                        c.post('/user/postKey',queryObj,function(response){

                                                            fn.setToken(response.key);

                                                            if(response.msg){
                                                                fn.eventUnlock();
                                                                return fn.dialog(response.msg);
                                                            }

                                                            global.publicKey = ( response.result );

                                                            var objData = preObj;

                                                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){

                                                                preObj['rsa'] = rsa;
                                                                preObj = Object.assign( preObj,postObj );

                                                                var queryObj = {};

                                                                //set cerficate
                                                                queryObj['token'] = global.token;
                                                                queryObj['key'] = global.key;

                                                                var datas = fn.simpleKey.encode(preObj,global.key);
                                                                queryObj['datas'] = datas;

                                                                c.post('/user/editthread',queryObj,function(response){

                                                                    fn.eventUnlock();
                                                                    fn.setToken(response.key);

                                                                    if(response.msg){
                                                                        return fn.dialog(response.msg);
                                                                    }

                                                                    fn.dialog('修改成功,正在跳转');
                                                                    
                                                                    fn.eventLock();
                                                                    
                                                                    setTimeout(function(){
                                                                        location.href = `/community/${response.result}.html`;
                                                                    },500);
                                                                    
                                                                }).fail(function(response){
                                                                    fn.eventUnlock();
                                                                    fn.dialog(response.statusText);
                                                                });

                                                            });

                                                        }).fail(function(response){

                                                            fn.eventUnlock();
                                                            fn.dialog(response.statusText);

                                                        });
                                                        
                                                        
                                                    }
                                                break ;
                                                    
                                            }
                                            
                                        }
                                    }
                                };
                            
                            usage.forEach(function(usg){
                                map.forEach(function(m){
                                    if(usg==m.name){
                                        c('.post-title').append(`<div title="${ m.description }" class="btn post-title-i editor-${ m.name }"><i class="lnr lnr-${ m.icon }"></i></div>`);
                                        
                                    }
                                })
                            });
                            
                            isActive && obj.bindEvent();
                        }
                        
                        c('.post').each(function(){
                            c(this).initialEditor();
                        });
                        
                    },
                    base64Encode:function(){
                        (function() {
                            'use strict';
                            var buffer;

                            var cb_utob = function(c) {
                                if (c.length < 2) {
                                    var cc = c.charCodeAt(0);
                                    return cc < 0x80 ? c
                                        : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                                        + fromCharCode(0x80 | (cc & 0x3f)))
                                        : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                                           + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                                           + fromCharCode(0x80 | ( cc         & 0x3f)));
                                } else {
                                    var cc = 0x10000
                                        + (c.charCodeAt(0) - 0xD800) * 0x400
                                        + (c.charCodeAt(1) - 0xDC00);
                                    return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                                            + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                                            + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                                            + fromCharCode(0x80 | ( cc         & 0x3f)));
                                }
                            };
                            var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
                            var utob = function(u) {
                                return u.replace(re_utob, cb_utob);
                            };
                            var fromCharCode = String.fromCharCode;
                            var _encode = buffer ? function (u) {
                                return (u.constructor === buffer.constructor ? u : new buffer(u))
                                .toString('base64')
                            }
                            : function (u) { return btoa(utob(u)) }
                            ;
                            var encode = function(u, urisafe) {
                                return !urisafe
                                    ? _encode(String(u))
                                    : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                                        return m0 == '+' ? '-' : '_';
                                    }).replace(/=/g, '');
                            };
                            var encodeURI = function(u) { return encode(u, true) };

                            // export Base64
                            Base64.encode = encode;
                        })();
                    },
                    base64Decode:function(){
                        
                        var enKey = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
                            deKey = new Array(
                                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
                                52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
                                -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                                15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
                                -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                                41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
                            ),
                            decode = function(src){
                            //用一个数组来存放解码后的字符。
                            var str=new Array();
                            var ch1, ch2, ch3, ch4;
                            var pos=0;
                            //过滤非法字符，并去掉'='。
                            src=src.replace(/[^A-Za-z0-9\+\/]/g, '');
                            //decode the source string in partition of per four characters.
                            while(pos+4<=src.length){
                              ch1=deKey[src.charCodeAt(pos++)];
                              ch2=deKey[src.charCodeAt(pos++)];
                              ch3=deKey[src.charCodeAt(pos++)];
                              ch4=deKey[src.charCodeAt(pos++)];
                              str.push(String.fromCharCode(
                                (ch1<<2&0xff)+(ch2>>4), (ch2<<4&0xff)+(ch3>>2), (ch3<<6&0xff)+ch4));
                            }
                            //给剩下的字符进行解码。
                            if(pos+1<src.length){
                              ch1=deKey[src.charCodeAt(pos++)];
                              ch2=deKey[src.charCodeAt(pos++)];
                              if(pos<src.length){
                                ch3=deKey[src.charCodeAt(pos)];
                                str.push(String.fromCharCode((ch1<<2&0xff)+(ch2>>4), (ch2<<4&0xff)+(ch3>>2)));
                              }else{
                                str.push(String.fromCharCode((ch1<<2&0xff)+(ch2>>4)));
                              }
                            }
                            //组合各解码后的字符，连成一个字符串。
                            return str.join('');
                          }
                        
                        // export Base64
                        Base64.decode2 = decode;
                    },
                    getWidth:function(){
                        return c(window).width();
                    },
                    getHeight:function(){
                        return c(window).height();
                    },
                    arrClone:function(arr){
                        return arr.slice(0);
                    },
                    getUrlParam:function(name){
                        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
                            r = window.location.search.substr(1).match(reg);
                        
                        //return (r != null) ? unescape(r[2]) : null;
                        return (r != null) ? decodeURIComponent(r[2]) : null;
                    },
                    bytelength:function(str){
                        var l = str.length;
                        var blen = 0; 
                        for(var i=0;i<l;i++){
                            if((str.charCodeAt(i) & 0xff00) != 0){
                                blen++; 
                            }
                            blen++;
                        }
                        return blen;
                    },
                    getUploadKey:function(){
                        var result = null;
                        
                        try{
                            var json = JSON.parse( fn.simpleKey.decode(global.relationUUID,'010455') );
                            result = json.result;
                        }catch(e){}
                        
                        return result;
                    },
                    simpleKey:{
                        keygen:function(){
                            var str = 'qwertyuiopasdfghjklzxcvbnm1234567890',
                                chunk = '';
                            
                            var ran = ( parseInt( Math.random() * new Date().getTime() * 5000 ) ).toString();
                            
                            ran = ran.split('');
                            
                            for(var i = 0;i<ran.length;i++){
                                ran[i] += ( (Math.random() > .5) ? ~~(Math.random() * 100) : ~~( Math.random() * 10 ) );
                                ran[i] *= 1;
                            }
                            
                            
                            ran.forEach(function(r){
                                chunk += ( fn.simpleKey.getCircle(str,r) );
                            });
                            
                            return chunk;
                        },
                        getCircle:function(str,idx){
                            var str = str || '',
                                count = ~~(idx / str.length),
                                wd = idx - count*str.length;
                            
                            return str[wd];
                        },
                        getCircleIndex:function(str,idx){
                            var str = str || '',
                                count = ~~(idx / str.length),
                                wd = idx - count*str.length;
                            
                            return str[wd] * 1;
                        },
                        encode:function (text,keyStr){
                            
                            //encode
                            
                            var base64Str = Base64.encode( JSON.stringify(text) );
                            
                            var arr = [],
                                result = [];
                            for(var i = 0;i<base64Str.length;i++){
                                var n = base64Str[i].charCodeAt(0) * 1;
                                arr[i] = n+fn.simpleKey.getCircleIndex(keyStr,i);
                            }
                            arr.forEach(function(ar,idx){
                                result[idx] = String.fromCharCode(ar);
                            });
                            
                            var rs = ( result.join('') );
                            
                            return rs;
                            
                            try{
                                (typeof(text) != 'string') && ( text = JSON.stringify(text) );
                            }catch(e){
                                return '';
                            }
                            
                            var ciphertext = CryptoJS.AES.encrypt(text,keyStr);

                            return ciphertext.toString();
                        },
                        decode:function(text,keyStr){
                            
                            //decode
                            var arr = text.split(''),
                                codeArr = [];
                            
                            arr.forEach(function(code,idx){
                                codeArr[idx] = code.charCodeAt(0);
                            });
                            
                            for(var i = 0;i<codeArr.length;i++){
                                codeArr[i] *= 1;
                                codeArr[i] -= fn.simpleKey.getCircleIndex(keyStr,i);
                                codeArr[i] = String.fromCharCode(codeArr[i]);
                            }
                            
                            return ( Base64.decode2(codeArr.join('')) );
                            
                            var bytes  = CryptoJS.AES.decrypt(text,keyStr);
                            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                            return plaintext;
                        },
                        rsaEncode:function(dataObj,publicKey,callback){
                            
                            //initial rsa obj
                            var encrypt = new JSEncrypt({default_key_size: 1024});
                            encrypt.setPublicKey(publicKey);

                            var objStr = JSON.stringify(dataObj),
                                splitLen = 110,
                                rsa = [],
                                len = Math.ceil( objStr.length/splitLen );
                            
                            var ii = 0;
                            
                            function loop(){
                                
                                if( ii>=len ){
                                    return callback(rsa);
                                }
                                
                                var idx = ii * splitLen,
                                    str = ( objStr.substring(idx,idx+splitLen) ),
                                    dec = encrypt.encrypt( str );
                                
                                rsa.push( dec );
                                
                                //console.log(`decode progress==>${ ~~( ii / len * 100 ) }(%)`);
                                
                                ii++;
                                
                                setTimeout(loop,30)
                            }
                            
                            loop();
                        },
                    }
                },f(),a);
            };
        
        Cwebgl({
            getRegPage:function(){
                return `
        <div id="register" class="openfixed">
            <div class="openfixed-bg"></div>
            <div class="table">
                <div class="cell">
                    <div class="fixedport register">
                        <div class="fixedport-ct">
                            <h2>注册</h2>
                            <div class="fixedport-ct-line">
                                <input id="reg-mobile" maxLength="11" type="text" placeholder="手机号" class="fixedport-ct-input" />
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fixedport-ct-line-item">
                                    <input id="captcha-value" style="width:100px;margin-right:10px" type="text" placeholder="图形验证码" class="fixedport-ct-input" />
                                </div><div class="fixedport-ct-line-item">
                                    <div class="captcha refresh-captcha"><img src="/captcha.svg?${ Math.random() }" /></div>
                                </div><div class="fixedport-ct-line-item orange" style="line-height:50px;">
                                    <b class="refresh-captcha" style="cursor:pointer;">看不清?</b>
                                </div>
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fixedport-ct-line-item">
                                    <input style="width:210px;margin-right:10px" type="text" placeholder="验证码" class="fixedport-ct-input" />
                                </div><div class="fixedport-ct-line-item">
                                    <div class="reg-send-msg reg-send-msg-btn btn">发送验证码</div>
                                </div>
                            </div>
                            <div class="fixedport-ct-line">
                                <div id="check-reg-code" class="fixedport-login btn">立即注册</div>
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fr">
                                    <div class="fixedport-ct-line-desc">
                                        已经有账号？<a class="login-event" href="#">登录</a>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div class="fixedport-close">
                            <i class="lnr lnr-cross"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                `;
            },
            getRestPage:function(){
                return `
        <div id="reset" class="openfixed">
            <div class="openfixed-bg"></div>
            <div class="table">
                <div class="cell">
                    <div class="fixedport register">
                        <div class="fixedport-ct">
                            <h2>重置密码</h2>
                            <div class="fixedport-ct-line">
                                <input maxLength="11" type="text" placeholder="手机号" class="fixedport-ct-input" />
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fixedport-ct-line-item">
                                    <input style="width:210px;margin-right:10px" type="text" placeholder="验证码" class="fixedport-ct-input" />
                                </div><div class="fixedport-ct-line-item">
                                    <div class="reg-send-msg btn">发送验证码</div>
                                </div>
                            </div>
                            <div class="fixedport-ct-line">
                                <input type="password" placeholder="密码" class="fixedport-ct-input" />
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fixedport-login btn">完成注册</div>
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fr">
                                    <div class="fixedport-ct-line-desc">
                                        已有账号？<a class="login-event" href="#">登录</a>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div class="fixedport-close">
                            <i class="lnr lnr-cross"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                `;
            },
            getLoginPage:function(){
                return `
        <div id="login" class="openfixed">
            <div class="openfixed-bg"></div>
            <div class="table">
                <div class="cell">
                    <div class="fixedport register">
                        <div class="fixedport-ct">
                            <h2>登录</h2>
                            <div class="fixedport-ct-line">
                                <input id="login-user-value" type="text" placeholder="手机号/昵称" class="fixedport-ct-input" />
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fixedport-ct-line-item">
                                    <input id="captcha-value" style="width:100px;margin-right:10px" type="text" placeholder="图形验证码" class="fixedport-ct-input" />
                                </div><div class="fixedport-ct-line-item">
                                    <div class="captcha refresh-captcha"><img src="/captcha.svg?${ Math.random() }" /></div>
                                </div><div class="fixedport-ct-line-item orange" style="line-height:50px;">
                                    <b class="refresh-captcha" style="cursor:pointer;">看不清?</b>
                                </div>
                            </div>
                            <div class="fixedport-ct-line">
                                <input id="login-password-value" type="password" placeholder="密码" class="fixedport-ct-input" />
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fixedport-login btn login-btn">立即登录</div>
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fl">
                                    <div class="fixedport-ct-line-desc"><a class="getrest-event" href="#">找回密码</a></div>
                                </div>
                                <div class="fr">
                                    <div class="fixedport-ct-line-desc">
                                        没有有账号？<a class="reg-event" href="#">立即注册</a>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div class="fixedport-close">
                            <i class="lnr lnr-cross"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                `;
            },
            getSetPassPage:function(){
                return `
        <div id="setpass" class="openfixed">
            <div class="openfixed-bg"></div>
            <div class="table">
                <div class="cell">
                    <div class="fixedport register">
                        <div class="fixedport-ct">
                            <h2>重置密码</h2>
                            <div class="fixedport-ct-line">
                                <input type="password" placeholder="密码" class="fixedport-ct-input" />
                            </div>
                            <div class="fixedport-ct-line">
                                <input type="password" placeholder="重复密码" class="fixedport-ct-input" />
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fixedport-login btn">重置</div>
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fr">
                                    <div class="fixedport-ct-line-desc">
                                        已经有账号？<a class="login-event" href="#">登录</a>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div class="fixedport-close">
                            <i class="lnr lnr-cross"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                `;
            },
            getConfig:function(mobile){
                return `
        <div id="user-config" class="openfixed" data-mobile="${ mobile }">
            <div class="openfixed-bg"></div>
            <div class="table">
                <div class="cell">
                    <div class="fixedport register">
                        <div class="fixedport-ct">
                            <h2>完成注册</h2>
                            <div class="fixedport-ct-line">
                                <div class="fixedport-ct-line-item">
                                    <input id="check-name-val" style="width:210px;margin-right:10px" type="text" placeholder="昵称" class="fixedport-ct-input" />
                                </div><div class="fixedport-ct-line-item">
                                    <div class="reg-send-msg check-name btn">查看可用</div>
                                </div>
                            </div>
                            <div class="fixedport-ct-line">
                                <input type="password" placeholder="密码" class="fixedport-ct-input" />
                            </div>
                            <div class="fixedport-ct-line">
                                <input type="password" placeholder="重复密码" class="fixedport-ct-input" />
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fixedport-login reg-done">完成注册</div>
                            </div>
                            <div class="fixedport-ct-line">
                                <div class="fl">
                                    <div class="fixedport-ct-line-desc warn"></div>
                                </div>

                                <div class="fr">
                                    <div class="fixedport-ct-line-desc">
                                        已有账号？<a class="login-event" href="#">登录</a>
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div class="fixedport-close">
                            <i class="lnr lnr-cross"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                `;
            },
            resize:function(){
                global.width = c(window).width();
                global.height = c(window).height();
            },
            initScene:function(){
                var width = c(window).width(),
                    height = 300,
                    container = c('#scene');

                var vs = `
                    uniform float u_time;

                    attribute float displacement;
                    attribute float startTime;
                    attribute float lifeTime;
                    attribute vec3 vindex;
                    varying float vVindex;

                    uniform sampler2D u_noise;

                    float getAngle(float diagonal,float numRows) {
                        return 3.1415926 * 2. * (diagonal / numRows);
                    }

                    void main(){
                        vVindex = vindex.x;
                        
                        float timestamp = 1. - startTime / lifeTime;

                        vec2 aUv = ( 0.5 + timestamp ) * uv;
                        vec3 np;

                        vec3 noise = texture2D(u_noise,vec2( uv.x,uv.y )).rgb;
                        vec3 noise2 = texture2D(u_noise,vec2( aUv.x,aUv.y )).rgb;

                        vec3 v = ( noise.rgb - .5 ) * 20.;

                        np = position;

                        float a1 = getAngle( u_time,10.);
                
                        np.z += ( cos( u_time * vVindex / 10000. ) / 2. );
                        np.x += ( sin( u_time * vVindex / 10000. ) / 2. );
                
                        //np.z += v.x;
                        np += v;

                        gl_Position = projectionMatrix * modelViewMatrix * vec4( np, 1.0 );
                        gl_PointSize = 1.;
                    }
                `,
                    fs = `
                        uniform float u_time;

                        varying float vVindex;

                        void main(){
                            gl_FragColor = vec4( vVindex / 50000. * 1. );
                        }
                `;

                var camera, scene, renderer;
                var uniforms,
                    width,
                    height,
                    object,
                    anmDirection = 1,
                    mouse = {
                        x:0,
                        y:0
                    };
                
                var loader = new THREE.TextureLoader();
                
                loader.load( '/perlin-512.png' ,function(texture){
                    init(texture);
                });
                
                
                function init(texture){
                    
                    if(!detector()){
                        c('body')[0].innerHTML = '您的浏览器不兼容本站以及一系列功能, 请更新支持WEBGL的浏览器, 谢谢.';
                    }
                    
                    camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
                    camera.position.z = 30;

                    scene = new THREE.Scene();
                    //scene.background = new THREE.Color( 0x000000 );

                    scene.add( camera );

                    var geometry = new THREE.PlaneBufferGeometry( 200, 200, 400, 400 );


                    uniforms = {
                        u_time: { value: 0 },
                        u_noise: {
                            value:texture
                        }
                    };
                    
                    uniforms.u_noise.wrapS = uniforms.u_noise.wrapT = THREE.RepeatWrapping;

                    var material = new THREE.ShaderMaterial({
                        uniforms: uniforms,
                        vertexShader: vs,
                        fragmentShader: fs,
                        side:THREE.DoubleSide,
                        //blending:THREE.AdditiveBlending,
                        //depthTest:false,
                        transparent:true,
                    });


                    //initial attributes
                    var count = geometry.attributes.position.array.length;

                    geometry.addAttribute( 'lifeTime', new THREE.BufferAttribute( new Float32Array(count / 3), 1 ) );
                    geometry.addAttribute( 'startTime', new THREE.BufferAttribute( new Float32Array(count / 3), 1 ) );
                    geometry.addAttribute( 'direction', new THREE.BufferAttribute( new Float32Array(count / 3), 1 ) );
                    geometry.addAttribute( 'velocity', new THREE.BufferAttribute( new Float32Array(count), 3 ) );
                    geometry.addAttribute( 'vindex', new THREE.BufferAttribute( new Float32Array(count), 3 ) );


                    for(var j = 0;j<geometry.attributes.lifeTime.array.length;j++){
                        geometry.attributes.lifeTime.array[j] = ~~( Math.random() * 50 );
                    }

                    for(var j = 0;j<geometry.attributes.velocity.array.length;j++){
                        geometry.attributes.velocity.array[j] = ( Math.random() );
                    }

                    for(var j = 0;j<geometry.attributes.direction.array.length;j++){
                        geometry.attributes.direction.array[j] = ( 1 );
                    }

                    for(var j = 0;j<geometry.attributes.vindex.array.length;j++){
                        geometry.attributes.vindex.array[j] = ~~( j / 3 );
                    }


                    var plane = new THREE.Points( geometry, material );
                    object = plane;

                    plane.rotation.x = 5.05;
                    plane.rotation.z = 9.5;

                    scene.add( plane );

                    renderer = new THREE.WebGLRenderer({
                        alpha:true
                    });
                    
                    renderer.setPixelRatio( window.devicePixelRatio );
                    renderer.setSize( width, height );

                    container[0].appendChild( renderer.domElement );

                    c(window).on('resize',resize);
                    container.on('mousemove',mousemove);
                    
                    loop();
                    
                    c('#scene').addClass('open');

                }


                function detector(){
                    var isPass = true;

                    try{
                        var ctx = ( c('<canvas />')[0].getContext('webgl') ) || ( c('<canvas />')[0].getContext('experimental-webgl') );
                    }catch(e){
                        isPass = false;
                    }

                    return isPass;
                }
                
                function update(){
                    
                    object.material.uniforms.u_time.value += (.01) * anmDirection;
                    
                    object.rotation.z += ( mouse.x > 0 ) ? ( Math.cos(object.material.uniforms.u_time.value * anmDirection) * .001 ) : ( Math.cos(object.material.uniforms.u_time.value ) * -.001 );
                    
                    if( Math.abs( object.material.uniforms.u_time.value ) > Math.PI * 2 ){
                        //object.material.uniforms.u_time.value = 0;
                        anmDirection *= -1;
                    }

                    for(var j = 0;j<object.geometry.attributes.startTime.array.length;j++){

                        object.geometry.attributes.startTime.array[j] += object.geometry.attributes.velocity.array[j] * object.geometry.attributes.direction.array[j] * .05;

                        if( object.geometry.attributes.startTime.array[j] > object.geometry.attributes.lifeTime.array[j] || object.geometry.attributes.startTime.array[j] < 0 ){
                            //object.geometry.attributes.startTime.array[j] = 0;
                            object.geometry.attributes.direction.array[j] *= -1;
                        }

                    }

                    object.geometry.attributes.startTime.needsUpdate = true;
                    object.geometry.attributes.direction.needsUpdate = true;
                    object.geometry.attributes.position.needsUpdate = true;
                    
                    object.rotation.z += (mouse.x / width) * .01;
                }

                function resize(){
                    width = c(window).width();
                    
                    renderer.setSize(width,height);
                    
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                }
                
                function mousemove(e){
                    mouse.x = (e.clientX - width / 2) * .5;
                }
                
                function loop(){
                    update();
                    renderer.render( scene, camera );
                    requestAnimationFrame(loop);
                }
                
            },
            getFileName:function(path){
                var index = path.lastIndexOf('\\');
                return path.substring(index+1);
            },
            getExtendName:function(name){
                var index = name.lastIndexOf('.');
                return name.substring(index);
            },
            initialGuide:function(){
                c('.fr .w310').prepend(`
                    <div class="sub-display" style="background:#fff">
                        <div class="sub-display-guide">
                            <div class="sub-display-title" style="margin-bottom:10px;"><h3>阅读目录</h3></div>
                            <div class="sub-display-content">
                                <div class="sub-display-content-guide"></div>
                            </div>
                            </div>
                        </div>
                    </div>
                `);
                
                c('.display-content h3,.display-content b').each(function(){
                    c(this).text() && c(this).attr('id',c(this).text());
                });
                
                var guide = [];
                
                c('.display-content h3,.display-content b').each(function(){
                    c(this).attr('id') && guide.push( {
                        id:c(this).attr('id'),
                        type:c(this)[0].tagName
                    } );
                });
                
                //initial guide
                guide.forEach(function(gd){
                    gd.id && c('.sub-display-content-guide').append(`<li class="sub-display-content-guide-${ gd.type.toLowerCase() }"><a href="#${ gd.id }">${ gd.id }</a></li>`);
                });
                
                var h = c('.sub-display:eq(0)').height(),
                    top = c('.sub-display:eq(0)').offset().top;
                
                c(window).on('scroll',function(){
                    
                    var tp = c(window).scrollTop();
                    
                    c('.display-content h3,.display-content b').each(function(){
                        
                        if( ( ( c(this).offset().top - tp ) <= 0 ) ){
                            
                            var id = c(this)[0].id;
                            
                            c('.sub-display-content-guide li a').each(function(){
                                
                                ( c(this).text() == id ) ? c(this).parents('li').addClass('cur') : c(this).parents('li').removeClass('cur');
                                
                            });
                        }
                        
                    });
                    
                    c('.sub-display:eq(0)').css({
                        position:'fixed',
                        zIndex:30,
                        top: tp > h ? 0 : (top - tp)
                    });

                    c('.sub-display:eq(1)').css({
                        marginTop:h+40
                    });
                });
            },
            initialCode:function(){
                
                if(typeof(CodeMirror)=='undefined'){
                    return ;
                }
                
                var codes = [];
                
                c('code').each(function(){
                    var chunk = '';
                    
                    c(this).find('pre').each(function(){
                        var text = c(this).html();
                        text = text.replace(/\<br\>/,'');
                        text = text.replace(/\<br \/\>/,'');
                        
                        chunk += `\n${text}`;
                    });
                    
                    codes.push( chunk );
                });
                
                c('code').each(function(i){
                    c(this).html(`<textarea class="code-display">${ codes[i] }</textarea>`);
                });
                
                c('.code-display').each(function(){
                    CodeMirror.fromTextArea(c(this)[0], {
                        lineNumbers: true,
                        theme:'lucario',
                        mode:"javascript",
                    });
                });
                
            },
            initialCloud:function(){
                
                c('cloud').each(function(){
                    var uuid = c(this).text(),
                        chunk = '';
                    
                    if( uuid.length>100 ){
                        return ;
                    }
                    
                    chunk += `
                        <div class="cloud-preview" data-uuid="${ uuid }">
                            <img src="/code/thumnbnail?uuid=${ uuid }" />
                            <p><a target="_blank" href="/code/${uuid}"><span class="orange">查看源代码</span></a></p>
                        </div>
                    `;
                    
                    c(this).html( chunk );
                });
                
            },
            initialAttachment:function(){
                
                var chunk = '';
                
                c('attachment').each( function(){
                    var arr = c(this).html().split('\n'),
                        chunk1 = '';
                    
                    arr.forEach(function(atc,idx){
                        var arr2 = atc.split(',');
                        chunk1 += `<div class="attachment-item"><a target="_blank" href="${ arr2[1] }"><span><i class="lnr lnr-link"></i><span>${ arr2[0] }</span></a><span><em class="orange">${arr2[2]}(kb)</em></span></div>`;
                    });
                    
                    chunk += chunk1;
                    
                    c(this).html(`附件:${chunk1}`);
                } );
                
            },
            setFullScreen:function(element){

                var element = element || document.body;

                if
                 (element.requestFullscreen) {  
                    element.requestFullscreen(); 
                }
                //FireFox 
                else
                 if (element.mozRequestFullScreen) {  
                    element.mozRequestFullScreen(); 
                }
                //Chrome等 
                else
                 if (element.webkitRequestFullScreen) {  
                    element.webkitRequestFullScreen(); 
                }
                //IE11
                else
                 if (element.msRequestFullscreen) {
                     element.msRequestFullscreen();
                }
            },
            checkMobile:function(mobile){
                var mobilePt = /^(86)?((13\d{9})|(15[0,1,2,3,5,6,7,8,9]\d{8})|(17[0,1,2,3,5,6,7,8,9]\d{8})|(18[2,3,0,5,6,7,8,9]\d{8}))$/;
                
                if(!mobile){
                    return false;
                }
                
                if(!mobilePt.test(mobile)){
                    return false;
                }
                
                return true;
            },
            checkName:function(name){
                var regPt = /^[\u4E00-\u9FA5a-zA-Z0-9_-]/;
                
                if(!name){
                    return false;
                }
                
                if(!regPt.test(name)){
                    return false;
                }
                
                if( fn.bytelength(name) > 12 || fn.bytelength(name) < 3 ){
                    return false;
                }
                
                return true;
            },
            eventExtend:function(type,selector,fn){
                c(document).on(type,selector,fn);
            },
            eventBind:function(eventList){
                
                eventList.forEach( function(evt){
                    fn.eventExtend( evt.type,evt.selector,global.eventObj[ evt.eventName ] );
                } );
                
            },
            setToken:function(obj){
                
                if( !obj && (typeof(obj) != 'object') && (obj && !obj.token) && (obj && !obj.key) ){
                    return ;
                }
                
                global.token = obj.token;
                global.key = obj.key;
            },
            loadList:function(container,data,template){
                
                data.forEach( function(dt){
                    var rs = template;
                    
                    for(var key in dt){
                        var keyExp = new RegExp(`\\[\\[${key}\\]\\]`,'g');
                        rs = rs.replace(keyExp,dt[key]);
                    }
                    
                    container.append(rs);
                } );
            },
            eventLock:function(){
                global.eventLock = true;
            },
            eventUnlock:function(){
                global.eventLock = false;
            },
            warning:function(text){
                var text = text || '';
                
                (typeof(text) != 'string') && (text = JSON.stringify(text) );
                
                text = text.toString();
                
                if(!c('.warn')[0]){
                    return ;
                }
                
                c('.warn').html(text).addClass('show');
            },
            removeWarning:function(){
                c('.warn').removeClass('show');
            },
            alert:function(text,fn){
                var text = text || '';
                
                (typeof(text) != 'string') && (text = JSON.stringify(text) );
                
                text = text.toString();
                
                c('body').append(`
                    <div class="dialog">
                        <div class="dialog-bg"></div>
                        <div class="dialog-port">
                            <div class="dialog-port-content">
                                <div class="dialog-port-content-display">
                                    ${ text }
                                </div>
                            </div>
                            <div class="dialog-port-act">
                                <div class="fr">
                                    <div class="dialog-done btn">确定</div><div class="dialog-cancel btn">取消</div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    </div>
                `);
                
                fn && c('.dialog-done').on('click',fn);
            },
            buildCollectionsSelector:function(datas,uuid,type,btn){
                
                if(!datas[0]){
                    return fn.alert(`无该分类的收藏夹, 请移至收藏夹新增`,function(){
                        location.href = `/user/collections?t=${type}`;
                    });
                }
                
                var mapKey = [
                    {
                        name:'article',
                        map:'文章'
                    },
                    {
                        name:'website',
                        map:'酷站'
                    },
                    {
                        name:'code',
                        map:'代码'
                    },
                    {
                        name:'topic',
                        map:'热帖'
                    },
                ],
                    typeStr = '';
                
                mapKey.forEach(function(mp){
                    ( mp.name == type ) && ( typeStr = mp.map );
                });
                
                if(!typeStr){
                    return fn.dialog('请刷新重试');
                }
                
                var chunk = '';
                
                datas.forEach(function(dt,idx){
                    chunk += `
                        <div data-uuid="${ dt.uuid }" class="add-to-collection-panel-select-item${ (idx==0) ? ' selected' : '' }">
                            ${ dt.name }
                        </div>
                    `;
                });
                
                c('body').append(`
                    <div class="add-to-collection">
                        <div class="add-to-collection-bg"></div>
                        <div class="add-to-collection-panel">
                            <div class="pd30">
                                <div class="fl">
                                    <div class="add-to-collection-panel-litpic"><img src="${ datas[0].litpic ? datas[0].litpic : '/collection_default.png' }" /></div>
                                    <div class="add-to-collection-panel-description">
                                        <h3><span class="orange">${ datas[0].name }</span><span>类型<b class="orange">${ typeStr }</b></span><span>数量<b class="orange">${ datas[0].count }</b></span></h3>
                                        <p>${ datas[0].description }</p>
                                    </div>
                                </div>
                                <div class="fr">
                                    <div class="add-to-collection-panel-select">${chunk}</div>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="add-to-collection-panel-action">
                                <div class="add-to-collection-panel-action-btn btn"><a href="/user/collections">管理收藏夹</a></div>
                                <div class="add-to-collection-panel-action-btn btn add-collection-event-btn" data-uuid="${ datas[0].uuid }" data-target="${ uuid }" data-type="${ type }">加入收藏</div>
                            </div>
                        </div>
                    </div>
                `);
                
                c('.add-to-collection').data('datas',datas);
                c('.add-collection-event-btn').data('btn',btn);
            },
            dialog:function(text){
                var text = text || '';
                
                (typeof(text) != 'string') && (text = JSON.stringify(text) );
                
                text = text.toString();
                
                c('body').append(`
                    <div class="dialog">
                        <div class="dialog-bg"></div>
                        <div class="dialog-port">
                            <div class="dialog-port-content">
                                <div class="dialog-port-content-display">
                                    ${ text }
                                </div>
                            </div>
                            <div class="dialog-port-act">
                                <div class="fr">
                                    <div class="dialog-cancel btn">确定</div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    </div>
                `);
                
                if(c('.time-limit')[0]){
                    loop();
                }
                
                function loop(){
                    var v = ( c('.time-limit')[0] ) ? (c('.time-limit').html() * 1) : null;
                    
                    if( !c('.time-limit')[0] || v <=0 ){
                        return ;
                    }
                    
                    c('.time-limit').html(--v);
                    
                    setTimeout(loop,1000);
                }
            },
            initComments:function(){
                
                var container = c(`#comments`),
                    loading = `
                        <div class="comments-loading">
                            <span>正在载入评论</span>
                        </div>
                    `,
                    none = `
                        <div class="comments-loading">
                            <span>暂无评论</span>
                        </div>
                    `;
                
                var p = container.attr('data-page') || 1,
                    id = container.next().attr('data-target') || null,
                    t = container.attr('data-type') || null;
                
                if(!t || !id){
                    return fn.dialog('缺省必填字段');
                }
                
                container.find('.wrap').prepend(loading);
                
                fn.getCommentList(id,p,t,function(data){
                    container.attr('data-page',(p*1+1));
                    container.find('.wrap .comments-loading').remove();
                    p = container.attr('data-page');
                    
                    if(!data){
                        return ;
                    }
                    
                    if(data.msg){
                        return fn.dialog(data.msg);
                    }

                    if( !data.data.result.length ){
                        
                        if(p==2){
                            return container.find('.wrap')[0] ? container.find('.wrap').html( none ) : container.html( none );
                        }
                        
                        return fn.dialog('已至末页');
                    }
                    
                    data.data.result.forEach(function(dt){
                        container.find('.load-comment').before(`
                            <div class="comments-item">
                                <div class="comments-item-title">
                                    <div class="fl">
                                        <div class="comments-item-avatar">
                                            <a href="/user/${ dt.author.uuid }"><img src="${ dt.author.avatar ? dt.author.avatar : '/assets/img/user-avatar-default.png' }" /></a>
                                        </div>
                                    </div>
                                    <div class="fl">
                                        <div class="comments-item-name">${ dt.author.name }</div>
                                        <div class="comments-item-desc">${ dt.author.postScript || '该用户很懒,没有自我描述' }</div>
                                    </div>
                                    <div class="fr">
                                        <div class="comments-item-date">
                                            <div class="table">
                                                <div class="cell">发表于：${ dt.postDate }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clear"></div>
                                </div>

                                <div class="comments-item-content">
                                    <p>${ dt.content }</p>
                                </div>
                            </div>
                        `);
                    });
                });
                
            },
            getCommentList:function(target,p,type,callback){
                if(global.eventLock){
                    return ;
                }

                fn.eventLock();

                var queryObj = {},
                    preObj = {
                        target:target,
                        p:p,
                        t:type
                    };

                //set cerficate
                queryObj['token'] = global.token;
                queryObj['key'] = global.key;

                var datas = fn.simpleKey.encode(preObj,global.key);

                queryObj['datas'] = datas;
                
                c.post('/comment',queryObj,function(response){

                    fn.eventUnlock();
                    fn.setToken(response.key);

                    callback && callback(response);
                    
                }).fail(function(response){
                    
                    callback && callback(null);
                    
                    fn.eventUnlock();
                    fn.dialog(response.statusText);

                });
            },
            isLogin:function(){
                return c('#header .user-infomation-nick')[0] ? true : false;
            },
            init:function(){
                
                window.Log = console.log;
                
                global.templates = {
                    articleList:`
                        <div class="article-item">
                            <div class="fl">
                                <div class="article-item-pic">
                                    <a href="/article/[[uuid]].html"><img src="[[litpic]]"></a>
                                </div>
                            </div>
                            <div class="fr">
                                <div class="article-item-post">
                                    <div class="article-item-title">
                                        <a href="/article/[[uuid]].html">[[title]]</a>
                                    </div>
                                    <div class="article-item-description">

                                    </div>
                                    <div class="display">
                                        <div class="display-item"><i class="lnr lnr-eye"></i><span>[[views]]</span></div><div class="display-item"><i class="lnr lnr-bubble"></i><span>[[comment]]</span></div><div class="display-item"><i class="lnr lnr-history"></i><span>[[postDate]]</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                    `
                };
                
                fn.utils();
                
                global.eventList = [
                    {
                        type:'click',
                        selector:'#search',
                        eventName:'openSearch'
                    },
                    {
                        type:'blur',
                        selector:'.search-input input',
                        eventName:'closeSearch'
                    },
                    {
                        type:'mouseenter',
                        selector:'#navigator li:eq(0)',
                        eventName:'openNavList'
                    },
                    {
                        type:'mouseleave',
                        selector:'#navigator li:eq(0)',
                        eventName:'closeNavList'
                    },
                    {
                        type:'click',
                        selector:'.fixedport-close,.openfixed-bg',
                        eventName:'closePort'
                    },
                    {
                        type:'click',
                        selector:'.article-list-more',
                        eventName:'getArticleList'
                    },
                    {
                        type:'click',
                        selector:'.dialog-bg,.dialog-cancel',
                        eventName:'closeDialog'
                    },
                    {
                        type:'keyup',
                        selector:'body',
                        eventName:'keyupEvent'
                    },
                    {
                        type:'click',
                        selector:'.reg-send-msg-btn',
                        eventName:'regSendMsg'
                    },
                    {
                        type:'click',
                        selector:'#check-reg-code',
                        eventName:'checkRegCode'
                    },
                    {
                        type:'click',
                        selector:'.check-name',
                        eventName:'checkName'
                    },
                    {
                        type:'blur',
                        selector:'#user-config input[type="password"]',
                        eventName:'checkRegConfig'
                    },
                    {
                        type:'keyup',
                        selector:'#user-config input',
                        eventName:'checkRegConfig'
                    },
                    {
                        type:'click',
                        selector:'.reg-done.btn',
                        eventName:'finishRegist'
                    },
                    {
                        type:'click',
                        selector:'.refresh-captcha',
                        eventName:'refreshCaptcha'
                    },
                    {
                        type:'click',
                        selector:'.login-btn',
                        eventName:'loginEvent'
                    },
                    {
                        type:'click',
                        selector:'.search-btn',
                        eventName:'searchBtn'
                    },
                    {
                        type:'keyup',
                        selector:'.search-input input',
                        eventName:'searchBtnSubmit'
                    },
                    {
                        type:'keyup',
                        selector:'.post-content-textarea',
                        eventName:'postContent'
                    },
                    {
                        type:'focus',
                        selector:'body',
                        eventName:'postContentDisable'
                    },
                    {
                        type:'blur',
                        selector:'body',
                        eventName:'postContentRelease'
                    },
                    {
                        type:'keyup',
                        selector:'#login',
                        eventName:'loginKeyup'
                    },
                    {
                        type:'keyup',
                        selector:'#user-config input',
                        eventName:'userConfigKeyup'
                    },
                    {
                        type:'click',
                        selector:'.load-comment',
                        eventName:'loadNextComment'
                    },
                    {
                        type:'click',
                        selector:'.update-profile-save',
                        eventName:'updateProfile'
                    },
                    {
                        type:'click',
                        selector:'.update-account-save',
                        eventName:'updateAccount'
                    },
                    {
                        type:'click',
                        selector:'.update-profile-container-selection i',
                        eventName:'updateProfileSelection'
                    },
                    {
                        type:'click',
                        selector:'.post-type',
                        eventName:'postType'
                    },
                    {
                        type:'click',
                        selector:'.homepage-container-sl',
                        eventName:'homePageCsl'
                    },
                    {
                        type:'click',
                        selector:'.homepage-container-line-pick-selector',
                        eventName:'getPickList'
                    },
                    {
                        type:'click',
                        selector:'#newPick',
                        eventName:'newPick'
                    },
                    {
                        type:'click',
                        selector:'.edit-pick-cancel,.new-pick-bg',
                        eventName:'editPickCancel'
                    },
                    {
                        type:'click',
                        selector:'.edit-pick-done',
                        eventName:'editPickDone'
                    },
                    {
                        type:'click',
                        selector:'.edit-pick-remove',
                        eventName:'editPickRemove'
                    },
                    {
                        type:'click',
                        selector:'.pick-list li',
                        eventName:'selectPickList'
                    },
                    {
                        type:'click',
                        selector:'.homepage-container-line-pick-selector-btn',
                        eventName:'editPick'
                    },
                    {
                        type:'blur',
                        selector:'.tag-input',
                        eventName:'addTag'
                    },
                    {
                        type:'click',
                        selector:'.remove-tag',
                        eventName:'removeTag'
                    },
                    {
                        type:'click',
                        selector:'.submit-site',
                        eventName:'submitSite'
                    },
                    {
                        type:'mousedown',
                        selector:'.code-area-edit-grab',
                        eventName:'editGrabY'
                    },
                    {
                        type:'mousedown',
                        selector:'.code-area-edit-js-grab',
                        eventName:'editGrabX'
                    },
                    {
                        type:'mouseup',
                        selector:'',
                        eventName:'mouseupEvent'
                    },
                    {
                        type:'mousemove',
                        selector:'',
                        eventName:'mousemoveEvent'
                    },
                    {
                        type:'click',
                        selector:'.code-refresh',
                        eventName:'refreshCode'
                    },
                    {
                        type:'click',
                        selector:'.code-setup',
                        eventName:'codeSetup'
                    },
                    {
                        type:'click',
                        selector:'.code-alert-close,.code-setup-bg',
                        eventName:'codeAlertClose'
                    },
                    {
                        type:'click',
                        selector:'.code-setup-container-dependencies-new',
                        eventName:'newDependency'
                    },
                    {
                        type:'click',
                        selector:'.dependency-remove',
                        eventName:'dependencyRemove'
                    },
                    {
                        type:'click',
                        selector:'.dependency-core',
                        eventName:'dependencyCore'
                    },
                    {
                        type:'click',
                        selector:'.lib-list li',
                        eventName:'libListLi'
                    },
                    {
                        type:'click',
                        selector:'.dependency-version',
                        eventName:'getVer'
                    },
                    {
                        type:'click',
                        selector:'.save-code',
                        eventName:'saveCode'
                    },
                    {
                        type:'click',
                        selector:'.code-config',
                        eventName:'codeInfomation'
                    },
                    {
                        type:'click',
                        selector:'.code-fork,.user-infomation-fork',
                        eventName:'forK'
                    },
                    {
                        type:'click',
                        selector:'.recover-code',
                        eventName:'recoverCode'
                    },
                    {
                        type:'mouseleave',
                        selector:'.show-tips',
                        eventName:'userInfomationLeave'
                    },
                    {
                        type:'mouseenter',
                        selector:'.show-tips',
                        eventName:'userInfomationEnter'
                    },
                    {
                        type:'click',
                        selector:'.website-view',
                        eventName:'websiteView'
                    },
                    {
                        type:'click',
                        selector:'a[href="#reply-id"]',
                        eventName:'topicReply'
                    },
                    {
                        type:'click',
                        selector:'.up-topic',
                        eventName:'upTopic'
                    },
                    {
                        type:'click',
                        selector:'.remove-thread',
                        eventName:'removeThreadAlert'
                    },
                    {
                        type:'click',
                        selector:'.event-delete',
                        eventName:'eventDelete'
                    },
                    {
                        type:'click',
                        selector:'.user-tool-up',
                        eventName:'scrollTop'
                    },
                    {
                        type:'click',
                        selector:'.homepage-send-btn-sendevent',
                        eventName:'sendMessage'
                    },
                    {
                        type:'click',
                        selector:'.collect-event',
                        eventName:'selectCollection'
                    },
                    {
                        type:'click',
                        selector:'.add-to-collection-bg',
                        eventName:'removeAddToCollection'
                    },
                    {
                        type:'click',
                        selector:'.add-to-collection-panel-select-item',
                        eventName:'reloadAddCollecEvent'
                    },
                    {
                        type:'click',
                        selector:'.add-collection-event-btn',
                        eventName:'collectEventResult'
                    },
                    {
                        type:'click',
                        selector:'.new-collections',
                        eventName:'newCollections'
                    },
                    {
                        type:'click',
                        selector:'.new-collections-selector-item i',
                        eventName:'newCollectionsSelector'
                    },
                    {
                        type:'click',
                        selector:'.edit-collections',
                        eventName:'editCollections'
                    },
                    {
                        type:'click',
                        selector:'.send-to',
                        eventName:'sendTo'
                    },
                    {
                        type:'click',
                        selector:'.update-profile-avatar-upload',
                        eventName:'openUpload'
                    },
                    {
                        type:'change',
                        selector:'.uploadpic-uploadevent input',
                        eventName:'getUploadImg'
                    },
                    {
                        type:'change',
                        selector:'.attachment-upload input',
                        eventName:'attachmentUpload'
                    },
                    {
                        type:'click',
                        selector:'.attachment-list-close',
                        eventName:'removeAttachment'
                    },
                    {
                        type:'click',
                        selector:'.console',
                        eventName:'console'
                    },
                    {
                        type:'mouseenter',
                        selector:'.filter-s',
                        eventName:'closeColorPlane'
                    },
                    {
                        type:'mouseenter',
                        selector:'.open-colorPlane',
                        eventName:'openColorPlane'
                    },
                    {
                        type:'mouseleave',
                        selector:'#colorSelector',
                        eventName:'closeColorPlane'
                    },
                    {
                        type:'mouseenter',
                        selector:'.share-code',
                        eventName:'shareCode'
                    },
                    {
                        type:'click',
                        selector:'#share-code input',
                        eventName:'shareCodeSelect'
                    },
                    {
                        type:'mouseleave',
                        selector:'.preview-mode',
                        eventName:'closePreviewElement'
                    },
                    {
                        type:'mouseenter',
                        selector:'.open-qrcode',
                        eventName:'qrCode'
                    },
                    {
                        type:'mouseenter',
                        selector:'.open-vrcode',
                        eventName:'vrCode'
                    },
                    {
                        type:'click',
                        selector:'.setfull',
                        eventName:'setFull'
                    },
                    {
                        type:'click',
                        selector:'.code-console-bg',
                        eventName:'closeConsole'
                    },
                    {
                        type:'keyup',
                        selector:'.code-console-terminal-input input',
                        eventName:'codeConsoleTerminal'
                    },
                    {
                        type:'click',
                        selector:'.cloud-preview',
                        eventName:'cloudPreview'
                    },
                    {
                        type:'click',
                        selector:'.edit-pick-litpic',
                        eventName:'editPickListpic'
                    },
                    {
                        type:'keyup',
                        selector:'.search-input input',
                        eventName:'searchInput'
                    },
                    {
                        type:'click',
                        selector:'',
                        eventName:'searchListClose'
                    },
                    {
                        type:'click',
                        selector:'.search-page-history span',
                        eventName:'searchPageHistoryClear'
                    },

                ];
                
                global.eventObj = {
                    searchPageHistoryClear:function(){
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var preObj = {
                                cerf:new Date().getTime()
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/clearkeywords',queryObj,function(response){
                            fn.eventUnlock();
                            fn.setToken(response.key);

                            if(response.msg){
                                return fn.dialog( response.msg );
                            }

                            c('.search-page-history a').remove();
                            
                        }).fail( function(response){
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                        } );
                    },
                    searchListClose:function(e){
                        
                        if( !c('.search-sli').hasClass('open') ){
                            return ;
                        }
                        
                        //Log( c(e.target)[0].nodeType );
                        
                        c('.search-sli').removeClass('open');
                    },
                    searchInput:function(){
                        clearTimeout( global.eventTm );
                        
                        var val = c(this).val() || '';
                        
                        if( fn.bytelength(val) < 2 ){
                            return c('.search-sli').removeClass('open');
                        }
                        
                        var preObj = {
                                keywords:val
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        global.eventTm = setTimeout(function(){
                            c.post('/getkeywords',queryObj,function(response){
                                
                                fn.setToken(response.key);
                                
                                if(response.msg){
                                    return c('.search-sli').removeClass('open');
                                }
                                
                                if(!response.result.length){
                                    return c('.search-sli').removeClass('open');
                                }
                                
                                var chunk = ``;
                                
                                response.result.forEach(function(rs){
                                    chunk += `<li><a href="/search?k=${rs.name}">${rs.name}</a></li>`;
                                });
                                
                                c('.search-sli').html( chunk ).addClass('open');
                            });
                        },200);
                    },
                    editPickListpic:function(){
                        var chunk = `
                            <div class="uploadpic">
                                <div class="uploadpic-area"></div>
                                <div class="uploadpic-uploadevent btn">上传<input accept="image/gif, image/jpeg, image/png" type="file" data-aspectRatio="300:180" /></div>
                            </div>
                        `;
                        
                        fn.alert(chunk,global.eventObj.uploadEvent.bind(this,function(imgLink){
                            c('.edit-pick-litpic img')[0].src = imgLink;
                        }));
                        
                        c('.dialog-port').css({
                            top:'50%',
                            marginTop:c('.dialog-port').height()/-2,
                            width:700,
                            marginLeft:-350
                        });
                    },
                    cloudPreview:function(){
                        if( c(this).parents('.post-content-textarea')[0] ){
                            return ;
                        }
                        
                        var uuid = c(this).attr('data-uuid') || null;
                        
                        if(!uuid){
                            return fn.dialog('云端代码id不正确');
                        }
                        
                        var chunk = `
                            <iframe scrolling="no" src="/code/${ uuid }?f=1" width="690" height="400" frameborder="0"></iframe>
                        `;
                        
                        c(this).html( chunk ).css({
                            width:690,
                            height:400
                        }).addClass('preview').after(`
                            <p><a target="_blank" href="/code/${ uuid }"><span class="orange">查看源代码</span></a></p>
                        `);
                    },
                    codeConsoleTerminal:function(e){
                        if(e.keyCode==13){
                            var self = c(this),
                                val = c(this).val();
                            
                            global.eventObj.refreshCode(val,function(){
                                self.val('');
                                c('.code-console-text-inner').append(`<pre>run command <b class="orange">${ val }</b></pre>`);
                                c('.code-console-text').scrollTop( c('.code-console-text-inner').height() + 20 );
                            });
                        }
                    },
                    logMsg:function(e){
                        getLogInfomation( e.data );
                    },
                    setFull:function(){
                        fn.setFullScreen( c('.code-area-display iframe')[0] );
                    },
                    closePreviewElement:function(){
                        c('.preview-mode').removeClass('open');
                    },
                    shareCodeSelect:function(){
                        c(this).select();
                    },
                    vrCode:function(){
                        c('.preview-mode').removeClass('open');
                        c('#vr-code').addClass('open');
                    },
                    qrCode:function(){
                        c('.preview-mode').removeClass('open');
                        c('#qr-code').addClass('open');
                    },
                    shareCode:function(){
                        c('.preview-mode').removeClass('open');
                        c('#share-code').addClass('open');
                    },
                    closeColorPlane:function(){
                        c('#colorSelector').removeClass('open');
                    },
                    openColorPlane:function(){
                        c('#colorSelector').addClass('open');
                    },
                    closeConsole:function(){
                        c('.code-hidden,#code-console,#runner').remove();
                    },
                    console:function(){
                        
                        var html = global.htmlEditor.getValue(),
                            js = global.jsEditor.getValue().replace(/console\.log/g,'getLogInfomation');
                        
                        c('#code-console').remove();
                        
                        global.eventObj.refreshCode(function(){
                            c('body').append(`
                                <div id="code-console">
                                    <div class="code-console-bg"></div>
                                    <div class="code-console-fg">
                                        <div class="code-console-display">
                                            <div class="code-console-text">
                                                <div class="code-console-text-inner"></div>
                                            </div>
                                        </div>
                                        <div class="code-console-terminal">
                                            <div class="code-console-terminal-icon"><i class="lnr lnr-chevron-right"></i></div>
                                            <div class="code-console-terminal-input"><input type="text" placeholder="运行脚本" /></div>
                                        </div>
                                    </div>
                                </div>
                            `);
                        });
                        
                    },
                    uploadEvent:function(callbackFn){
                        
                        var data = c('.uploadpic').data('data'),
                            selection = c('.uploadpic').data('selection'),
                            crop = c('.uploadpic').data('crop'),
                            thumbnail = c('.uploadpic').data('thumbnail'),
                            uploadKey = c('.uploadpic').data('uploadKey');
                        
                        if(!data){
                            return fn.dialog('请选择您要上传的文件');
                        }
                        
                        if( uploadKey && !fn.getUploadKey() ){
                            return fn.dialog('您的上传密钥不正确,请刷新重试');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var preObj = {
                                cerf:new Date().getTime()
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;

                        c.post('/uploadKey',queryObj,function(response){

                            fn.eventUnlock();
                            fn.setToken(response.key);

                            if(response.msg){
                                return fn.dialog(response.msg);
                            }

                            var token = response.result,
                                key = uploadKey ? (`upload/10466${ fn.getUploadKey() }10466${fn.simpleKey.keygen()}`) : ( 'upload/'+fn.simpleKey.keygen() ),
                                putExtra = {
                                    fname: "",
                                    params: {},
                                    mimeType: ["image/png", "image/jpeg", "image/gif"] || null
                                },
                                config = {
                                    region: qiniu.region.z2
                                };
                            
                            var observable = qiniu.upload(data, key, token, putExtra, config);
                            
                            var subscription = observable.subscribe({
                                next:function(){},
                                error:function(err){
                                    fn.dialog(err.message);
                                },
                                complete:function(res){
                                    
                                    var imgLink = '';
                                    
                                    if(selection){
                                        imgLink = qiniu.imageMogr2({
                                            crop:`!${ selection.width }x${ selection.height }a${ selection.x1 }a${ selection.y1 }`,
                                            thumbnail:`${thumbnail.width}x${thumbnail.height}`
                                        } ,res.key, global['assets']);
                                    }else{
                                        imgLink = global['assets'] +'/'+ res.key;
                                    }
                                    
                                    callbackFn && callbackFn(imgLink);
                                    
                                    c('.dialog').remove();
                                    crop && crop.cancelSelection();
                                },
                            });
                            
                        }).fail(function(response){
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                        });
                        
                    },
                    removeAttachment:function(){
                        c(this).parents('.attachment-list-li').remove();
                    },
                    attachmentUploadEvent:function(data,name,callbackFn){
                        
                        if(!data){
                            return fn.dialog('请选择您要上传的文件');
                        }
                        
                        if( !fn.getUploadKey() ){
                            return fn.dialog('您的上传密钥不正确,请刷新重试');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var extendName = fn.getExtendName( name );
                        
                        var preObj = {
                                cerf:new Date().getTime()
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;

                        c.post('/uploadKey',queryObj,function(response){

                            fn.eventUnlock();
                            fn.setToken(response.key);

                            if(response.msg){
                                return fn.dialog(response.msg);
                            }

                            var token = response.result,
                                key = (`upload/10466${ fn.getUploadKey() }10466${fn.simpleKey.keygen()}${ extendName }`),
                                putExtra = {
                                    fname: "",
                                    params: {},
                                    mimeType: null
                                },
                                config = {
                                    region: qiniu.region.z2
                                };
                            
                            var observable = qiniu.upload(data, key, token, putExtra, config);
                            
                            var subscription = observable.subscribe({
                                next:function(){},
                                error:function(err){
                                    fn.dialog(err.message);
                                },
                                complete:function(res){
                                    
                                    var link = global['assets'] +'/'+ res.key;
                                    
                                    callbackFn && callbackFn(link);
                                    
                                },
                            });
                            
                        }).fail(function(response){
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                        });
                        
                    },
                    attachmentUpload:function(e){
                        var file = ( e.target.files[0] ),
                            name = fn.getFileName( e.target.value ),
                            self = c(this),
                            list = self.parents('.editor-attachment-option').find('.attachment-list');
                        
                        var li = c(`
                            <div class="attachment-list-li" data-name="${ name }">
                                <div class="attachment-list-desc">
                                    <i class="lnr lnr-link"></i>
                                </div><span>${ name }</span><div class="attachment-list-close btn"><i class="lnr lnr-cross"></i></div>
                            </div>
                        `);
                        
                        li.data('file',file);
                        li.data('size',(file.size/1024).toFixed(2) );
                        
                        ( !self.parents('.editor-attachment-option').find(`.attachment-list-li[data-name="${ name }"]`)[0] ) && global.eventObj.attachmentUploadEvent(file,name,function(url){
                            
                            li.data('url',url);
                            list.append(li);
                            
                            //init
                            self.html(`上传附件<input type="file" />`);
                        });
                        
                    },
                    getUploadImg:function(e){
                        var img = ( e.target.files[0] ),
                            self = c(this);
                        
                        var url = '';
                        
                        try{
                            url = URL.createObjectURL(img);
                        }catch(e){}

                        if(!url){
                            return fn.dialog('文件格式不正确');
                        }
                        
                        var img = c(`<img id="photo" src="${ url }" />`).css({
                            width:'100%'
                        });
                        
                        self.parents('.uploadpic').find('.uploadpic-area').html(img).css('minHeight','auto');
                        
                        self.parents('.uploadpic').data('data',e.target.files[0]);
                        
                        var crop = $('img#photo').imgAreaSelect({
                            instance:true,
                            handles: true,
                            aspectRatio: c(this).attr('data-aspectRatio'),
                            onSelectEnd: function(img,selection){
                                
                                c('.uploadpic').data('data',e.target.files[0]);
                                
                                if(!selection.width){
                                    return c('.uploadpic').data('selection',null);
                                }
                                
                                c('.uploadpic').data('selection',selection);
                                
                                c('.uploadpic').data('thumbnail',{
                                    width:$('.uploadpic-area').width(),
                                    height:$('.uploadpic-area').height()
                                });
                                
                                c('.uploadpic').data('crop',crop);
                            },
                        });
                        
                    },
                    openUpload:function(){
                        var chunk = `
                            <div class="uploadpic">
                                <div class="uploadpic-area"></div>
                                <div class="uploadpic-uploadevent btn">上传<input accept="image/gif, image/jpeg, image/png" type="file" data-aspectRatio="${ c(this).attr('data-aspectRatio') }" /></div>
                            </div>
                        `;
                        
                        fn.alert(chunk,global.eventObj.uploadEvent.bind(this,function(imgLink){
                            c('.update-profile-avatar img')[0].src = imgLink;
                        }));
                        
                        c('.dialog-port').css({
                            top:'50%',
                            marginTop:c('.dialog-port').height()/-2,
                            width:700,
                            marginLeft:-350
                        })
                    },
                    sendTo:function(e){
                        if( !fn.isLogin() ){
                            e.preventDefault();
                            return fn.dialog('请先登录');
                        }
                    },
                    editCollections:function(){
                        var chunk = `
                            <div class="new-collections-title">
                                <input type="text" placeholder="标题" value="${ c('.homepage-list-infomation:eq(0) span b').html() }" />
                            </div>
                            <div class="new-collections-description">
                                <textarea placeholder="描述">${ c('.homepage-list-infomation p').html() }</textarea>
                            </div>
                        `;
                        

                        fn.alert(chunk,global.eventObj.editCollectionsEvent.bind(this,c(this).attr('data-uuid')));
                        
                        c('.new-collections-title').parents('.dialog-port').css({
                            top:'50%',
                            marginTop:-200
                        });
                        
                    },
                    editCollectionsEvent:function(uuid){
                        
                        var title = c('.new-collections-title input').val(),
                            description = c('.new-collections-description textarea').val(),
                            uuid = uuid;
                        
                        if(!title || !description || !uuid){
                            return fn.dialog('缺少必填参数');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                uuid:uuid,
                                title:title,
                                description:description,
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/editcollection',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog('修改成功,正在跳转');
                                    
                                    setTimeout(function(){
                                        location.href = `/user/collections/${response.result}`;
                                    },500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });
                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    newCollectionsSelector:function(){
                        c(this).parents('.new-collections-selector-item').addClass('cur').siblings().removeClass('cur');
                    },
                    newCollections:function(){
                        
                        var chunk = `
                            <div class="new-collections-selector">
                                <div class="new-collections-selector-item" type='article'><i></i><span>文章</span></div>
                                <div class="new-collections-selector-item" type='website'><i></i><span>酷站</span></div>
                                <div class="new-collections-selector-item" type='code'><i></i><span>代码</span></div>
                                <div class="new-collections-selector-item" type='topic'><i></i><span>热帖</span></div>
                            </div>
                            <div class="new-collections-title">
                                <input type="text" placeholder="标题" />
                            </div>
                            <div class="new-collections-description">
                                <textarea placeholder="描述"></textarea>
                            </div>
                        `;
                        
                        fn.alert(chunk,global.eventObj.newCollectionsEvent.bind(this));
                        
                        c('.new-collections-selector').parents('.dialog-port').css({
                            top:'50%',
                            marginTop:-200
                        });
                    },
                    newCollectionsEvent:function(){
                        
                        var title = c('.new-collections-title input').val(),
                            description = c('.new-collections-description textarea').val(),
                            type = c('.new-collections-selector-item.cur').attr('type');
                        
                        if(!title || !description || !type){
                            return fn.dialog('缺少必填参数');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                title:title,
                                description:description,
                                type:type
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/newcollection',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog('新增成功,正在跳转');
                                    
                                    setTimeout(function(){
                                        location.href = `/user/collections?t=${type}`;
                                    },500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });
                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                        
                    },
                    collectEventResult:function(){
                        var uuid = c(this).attr('data-uuid'),
                            target = c(this).attr('data-target'),
                            type = c(this).attr('data-type'),
                            self = c(this).data('btn');
                        
                        if(!uuid || !target){
                            return fn.dialog('缺少必要字段');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                uuid:uuid,
                                target:target,
                                type:type
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/collect',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog('收藏成功');
                                    self.addClass('isCollected');
                                    self.find('i').removeClass('lnr-star').addClass('lnr-star-empty');
                                    self.find('span').html('已收藏');
                                    c('.add-to-collection').remove();

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });
                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                        
                    },
                    reloadAddCollecEvent:function(){
                        var uuid = c(this).attr('data-uuid'),
                            datas = c(this).parents('.add-to-collection').data('datas');
                        
                        c(this).addClass('selected').siblings().removeClass('selected');
                        
                        var data = null;
                        
                        datas.forEach(function(dt){
                            ( dt.uuid == uuid ) && (data = dt);
                        });
                        
                        if(!data){
                            return fn.dialog('数据加载错误,请刷新重试');
                        }
                        
                        c('.add-to-collection-panel-litpic img')[0].src = data.litpic || '/collection_default.png';
                        c('.add-to-collection-panel-description span:eq(0)').html( data.name );
                        c('.add-to-collection-panel-description span:eq(2) b').html( data.count );
                        c('.add-collection-event-btn').attr('data-uuid',uuid);
                        
                    },
                    removeAddToCollection:function(){
                        c('.add-to-collection').remove();
                    },
                    removeFromCollection:function(type,uuid,btn){
                        
                        if( !fn.isLogin() ){
                            return fn.dialog('请先登录');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                target:uuid,
                                type:type,
                                remove:true
                            },
                            queryObj = {},
                            self = btn;
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/collect',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog('取消收藏成功');
                                    self.removeClass('isCollected');
                                    self.find('i').removeClass('lnr-star-empty').addClass('lnr-star');
                                    self.find('span').html('收藏');

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });

                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    selectCollection:function(e){
                        e.preventDefault();
                        
                        if( !fn.isLogin() ){
                            return fn.dialog('请先登录');
                        }
                        
                        var type = c(this).attr('data-type') || null,
                            uuid = c(this).attr('data-uuid') || null,
                            btn = c(this);
                        
                        if(!type){
                            return fn.dialog('缺少必要字段');
                        }
                        
                        if( c(this).hasClass('isCollected') ){
                            return global.eventObj.removeFromCollection(type,uuid,btn);
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var preObj = {
                            type:type
                        },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/collections/get',queryObj,function(response){

                            fn.eventUnlock();
                            fn.setToken(response.key);

                            if(response.msg){
                                return fn.dialog(response.msg);
                            }

                            fn.buildCollectionsSelector(response.result,uuid,type,btn);

                        }).fail(function(response){
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                        });
                        
                    },
                    collectEvent:function(){
                        
                        if( !fn.isLogin() ){
                            return fn.dialog('请先登录');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                uuid:c(this).attr('data-uuid')
                            },
                            queryObj = {};
                        
                        if(!postObj.uuid){
                            return fn.dialog('缺少必填参数,请刷新重试');
                        }
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/code/fork',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog(`FORK成功,正在跳转...`);
                                    
                                    fn.eventLock();
                                    
                                    setTimeout(function(){
                                        location.href = `/code/${response.result}`;
                                    },500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });

                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                    },
                    sendMessage:function(){
                        var to = c('.homepage-send *[data-value="to"]').val(),
                            title = c('.homepage-send *[data-value="title"]').val(),
                            content = c('.homepage-send *[data-value="content"]').val();
                        
                        if(!to || !content || !title){
                            return fn.dialog('缺少必填字段');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                title,
                                to:to,
                                content:content,
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/message/send',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog(response.result);
                                    
                                    fn.eventLock();
                                    
                                    setTimeout(function(){
                                        location.href = '/user/message';
                                    },1000);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });

                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    scrollTop:function(){
                        c('html,body')[0].scrollTop = 0;
                    },
                    userDelete:function(type,uuid){
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                type:type,
                                uuid:uuid,
                            },
                            queryObj = {};
                        
                        c('.dialog').remove();
                        
                        if(!postObj.uuid){
                            return fn.dialog('缺少必填参数,请刷新重试');
                        }
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/delete',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog(response.result);
                                    
                                    fn.eventLock();
                                    
                                    setTimeout(function(){
                                        location.href = `/user/${type}`;
                                    },2500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });

                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    eventDelete:function(){
                        var type = c(this).attr('data-type'),
                            uuid = c(this).attr('data-uuid');
                        
                        if(!type || !uuid){
                            return fn.dialog('缺少必填参数');
                        }
                        
                        fn.alert('确定要删除该内容?该操作无法恢复',global.eventObj.userDelete.bind(this,type,uuid));
                    },
                    removeThread:function(uuid){
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                uuid:uuid
                            },
                            queryObj = {};
                        
                        c('.dialog').remove();
                        
                        if(!postObj.uuid){
                            return fn.dialog('缺少必填参数,请刷新重试');
                        }
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/community/removeThread',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog(`删除成功,正在跳转...`);
                                    
                                    fn.eventLock();
                                    
                                    setTimeout(function(){
                                        location.href = location.href;
                                    },500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });

                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    removeThreadAlert:function(e){
                        e.preventDefault();
                        
                        var uuid = c(this).parents('.forum-content-item').attr('data-uuid') || null;
                        
                        if(!uuid){
                            return fn.dialog('错误,请刷新再进行此操作');
                        }
                        
                        fn.alert('确定要删除该内容?',global.eventObj.removeThread.bind(this,uuid));
                    },
                    upTopic:function(e){
                        e.preventDefault();
                        
                        var self = c(this);
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                uuid:c(this).parents('.forum-content-item').attr('data-uuid')
                            },
                            queryObj = {};
                        
                        if(!preObj.uuid){
                            return fn.dialog('缺少必填参数,请刷新重试');
                        }
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;

                        c.post('/community/up',queryObj,function(response){

                            fn.eventUnlock();
                            fn.setToken(response.key);

                            if(response.msg){
                                return fn.dialog(response.msg);
                            }

                            fn.dialog(response.result);

                            self.parents('.forum-content-item').find('span.up-topic').html( '+1' );
                            
                        }).fail(function(response){
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                        });
                        
                    },
                    topicReply:function(){
                        
                        if( !fn.isLogin() ){
                            return fn.dialog('请先登录');
                        }
                        
                        var floor = c(this).parents('.forum-content-item-t1').find('.forum-content-item-t1-floor').attr('data-index'),
                            index = c(this).parents('.forum-content-item-t1').find('.forum-content-item-t1-floor').attr('data-link'),
                            name = c(this).parents('.forum-content-item-t1').find('.user-infomation-name').html();
                        
                        var page = fn.getUrlParam('p');
                        
                        var str = `
                            <div>回复 <a href="/community/${c('#forum').attr('data-uuid')}.html${ page ? `?p=${page}` : '' }#thread-${ index }">#${ floor }</a>  <span class="orange">${ name }</span> 的评论</div><div>:</div>
                        `;
                        
                        c('.post .post-content-textarea').html(str);
                        
                    },
                    websiteView:function(){
                        var uuid = c(this).attr('data-uuid');
                        
                        if(!uuid){
                            return fn.dialog('缺少必填参数');
                        }
                        
                        var preObj = {
                            uuid:uuid
                        },queryObj = {};
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;

                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/website/addViews',queryObj,function(response){
                            
                            fn.eventUnlock();
                            fn.setToken(response.key);
                            
                            if(response.msg){
                                return fn.dialog(response.msg);
                            }
                            
                        }).fail(function(response){
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                        });
                        
                    },
                    userInfomationLeave:function(){
                        c('.article-content-desc-item-tips').remove();
                    },
                    userInfomationEnter:function(){
                        c('.article-content-desc-item-tips').remove();
                        c(this).append(`
                            <div class="article-content-desc-item-tips">
                                <p>tips:所有用户可通过积分提升等级<span><br />levl1</span> 为5积分<br /><span>levl2</span> 为20积分<br /><span>levl3</span> 为50积分<br /><span>levl4</span> 为100积分<br /><span>levl5</span> 为300积分<br />超过 <span>levl3</span> 即可升级为专业用户<br /></p>
                                <a href="#"><i class="lnr lnr-link"></i><em>CWEBGL积分获得法则</em>
                              </a>
                            </div>
                        `);
                    },
                    recoverFork:function(){
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                uuid:c('#code-setup').attr('data-uuid')
                            },
                            queryObj = {};
                        
                        c('.dialog').remove();
                        
                        if(!postObj.uuid){
                            return fn.dialog('缺少必填参数,请刷新重试');
                        }
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/code/recover',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog(`还原成功,正在跳转...`);
                                    
                                    fn.eventLock();
                                    
                                    setTimeout(function(){
                                        location.href = `/code/${response.result}`;
                                    },500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });

                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    recoverCode:function(){
                        fn.alert('要还原成最初Fork的版本吗？',global.eventObj.recoverFork);
                    },
                    forK:function(e){
                        e.preventDefault();
                        
                        if( !fn.isLogin() ){
                            return fn.dialog('请先登录');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                uuid:c(this).attr('data-uuid')
                            },
                            queryObj = {};
                        
                        if(!postObj.uuid){
                            return fn.dialog('缺少必填参数,请刷新重试');
                        }
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/code/fork',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog(`FORK成功,正在跳转...`);
                                    
                                    fn.eventLock();
                                    
                                    setTimeout(function(){
                                        location.href = `/code/${response.result}`;
                                    },500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });

                                
                            });
                            

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    codeInfomation:function(){
                        c('#code-infomation').addClass('open');
                    },
                    saveCode:function(){
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                                //'title','description','dependencies','html','js'
                            },
                            postObj = {
                                title:c('.code-setup-container-title input').val(),
                                description:c('.code-setup-container-description textarea').val(),
                                dependencies:[],
                                html:global.htmlEditor.getValue(),
                                js:global.jsEditor.getValue()
                            },
                            queryObj = {};
                        
                        if( c('#code-setup').attr('data-uuid') ){
                            postObj['uuid'] = c('#code-setup').attr('data-uuid');
                        }
                        
                        c('.dependency').each(function(){
                            var uuid = c(this).attr('uuid');
                            
                            if(!uuid){
                                return ;
                            }
                            
                            ( postObj['dependencies'].indexOf(uuid) < 0 ) && ( postObj['dependencies'].push( uuid ) );
                        });
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post( postObj['uuid'] ? ('/code/edit') : ('/code/new'),queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog(`保存成功,正在跳转...`);
                                    
                                    fn.eventLock();
                                    
                                    setTimeout(function(){
                                        location.href = `/code/${response.result}`;
                                    },500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });
                                
                            });

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    getVer:function(){
                        var name = c(this).parents('.dependency').find('.dependency-core').attr('data-value');
                        
                        if(!name){
                            return fn.dialog('请先选择依赖库');
                        }
                        
                        c('.lib-list').remove();
                        
                        var libs = c('#code-setup').data('lib'),
                            vers = [],
                            chunk = '';
                        
                        libs.forEach(function(lib){
                            (lib.name == name) && vers.push( lib );
                        });
                        
                        vers.sort(function(a,b){
                            return b.version - a.version;
                        });
                        
                        vers.forEach(function(js){
                            chunk += `<li data-uuid="${js.uuid}" data-url="${ js.url }" data-value="${ js.version }">${ js.version }</li>`;
                        });
                        
                        c(this).append(`<ul class="lib-list">${ chunk }</ul>`);
                    },
                    libListLi:function(e){
                        e.stopPropagation();
                        
                        var val = c(this).attr('data-value');
                        
                        if( c(this).attr('data-uuid') ){
                            if( c(`.dependency[uuid="${ c(this).attr('data-uuid') }"]`)[0] ){
                                c('.lib-list').remove();
                                return fn.dialog('已添加该依赖');
                            }
                            
                            c(this).parents('.dependency').attr('uuid', c(this).attr('data-uuid') );
                        }
                        
                        c(this).parents('div').attr('data-value',val).find('>span').html(val);
                        
                        if( c(this).attr('data-url') ){
                            c(this).parents('.dependency').find('.dependency-url input').val( c(this).attr('data-url') );
                        }
                        
                        c('.lib-list').remove();
                    },
                    dependencyCore:function(){
                        var libs = c('#code-setup').data('lib'),
                            libArr = [],
                            results = [],
                            chunk = '';
                        
                        c('.lib-list').remove();
                        
                        libs.forEach(function(lib){
                            libArr.push(lib.name);
                        });
                        
                        libArr.forEach(function(lib){
                            ( results.indexOf(lib) < 0 ) && results.push( lib );
                        });
                        
                        results.forEach(function(js){
                            chunk += `<li data-value="${ js }">${ js }</li>`;
                        });
                        
                        c(this).append(`<ul class="lib-list">${ chunk }</ul>`);
                    },
                    dependencyRemove:function(){
                        c(this).parents('.dependency').remove();
                    },
                    newDependency:function(){
                        c('.lib-list').remove();
                        c('.code-setup-container-dependencies ul').append(`<li class="dependency">
                            <div class="dependency-core"><i class="lnr lnr-chevron-down"></i><span>选择库</span></div><div class="dependency-version"><i class="lnr lnr-chevron-down"></i><span>选择版本</span></div><div class="dependency-url"><input type="text" value="" /></div><div class="dependency-remove btn"><i class="lnr lnr-circle-minus"></i></div>
                        </li>`);
                    },
                    codeAlertClose:function(){
                        c(this).parents('.code-alert').removeClass('open');
                    },
                    codeSetup:function(){
                        if( !fn.isLogin() ){
                            return fn.dialog('请先登录');
                        }
                        
                        var preObj = {
                            key:fn.simpleKey.keygen()
                        },
                            queryObj = {};
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;

                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/lib/get',queryObj,function(response){
                            
                            fn.eventUnlock();
                            fn.setToken(response.key);
                            
                            if(response.msg){
                                return fn.dialog(response.msg);
                            }
                            
                            c('#code-setup').data('lib',response.data);
                            c('.code-setup-container-dependencies ul').empty();
                            
                            
                            var defaultLib = c(`.code-setup-container-dependencies ul`).attr('data-default');
                            if(defaultLib){
                                var defaultLibArr = defaultLib.split(',');
                                defaultLibArr.forEach(function(df){
                                    response.data.forEach(function(lib){
                                        if(df == lib.uuid){
                                            c('.code-setup-container-dependencies ul').append(`<li uuid="${lib.uuid}" class="dependency">
                                                <div class="dependency-core" data-value="${lib.name}"><i class="lnr lnr-chevron-down"></i><span>${ lib.name }</span></div><div class="dependency-version"><i class="lnr lnr-chevron-down"></i><span>${ lib.version }</span></div><div class="dependency-url"><input type="text" value="${ lib.url }" /></div><div class="dependency-remove btn"><i class="lnr lnr-circle-minus"></i></div>
                                            </li>`);
                                        }
                                    });
                                });
                            }
                            
                            c('#code-setup').addClass('open');
                            
                        }).fail(function(response){
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                        });
                        
                    },
                    refreshCode:function(runner,callback){
                        
                        var runner = (typeof(runner)=='string') ? runner : '',
                            args = arguments;
                        
                        var preObj = {
                            htmlCode:global.htmlEditor.getValue(),
                            jsCode:global.jsEditor.getValue()+`;eval(\`${runner}\`);`
                        },
                            queryObj = {};
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;

                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/code/sync',queryObj,function(response){
                            
                            fn.eventUnlock();
                            fn.setToken(response.key);
                            
                            if(response.msg){
                                return fn.dialog(response.msg);
                            }
                            
                            //refresh
                            c('.code-area-display iframe').attr('src','/code/preview');
                            (typeof(args[args.length-1])=='function') && args[args.length-1]();
                            
                        }).fail(function(response){
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                            (typeof(args[args.length-1])=='function') && args[args.length-1]();
                        });
                        
                    },
                    mousemoveEvent:function(e){
                        var y = e.clientY,
                            x = e.clientX;
                        
                        if( global.editGrabYLock ){
                            
                            var per = ( y - global.editGrabYLocksY + (y-c('.code-area-edit-grab').offset().top) ) / c('.code-area').height(),
                                r = y - 170,
                                rs = 0;
                            
                            r = Math.max(r,70),
                            rs = r / c('.code-area').height();
                            
                            ( r < 80 ) ? c('.code-area-edit').addClass('hor') : c('.code-area-edit').removeClass('hor');
                            
                            c('.code-area-edit').css('height',rs*100+'%');
                            c('.code-area-display').css({
                                top:rs*100+'%',
                                height:(1-rs)*100+'%'
                            });
                        }
                        
                        if( global.editGrabXLock && !c('.hor')[0] ){
                            
                            x = Math.max(x,50),
                            x = Math.min(x,c('.code-area-edit').width() - 50);
                            
                            var per = x / c('.code-area-edit').width();
                            
                            c('.code-area-edit-html').css({
                                width:per * 100 + '%'
                            });
                            
                            c('.code-area-edit-js').css({
                                width:(1-per) * 100 + '%'
                            });
                            
                            //Log( x -  c('.code-area-edit-js-grab').position().left );
                            
                            //Log( x - global.editGrabXLocksX + (x-c('.code-area-edit-js-grab').offset().left) );
                            
                        }
                        
                    },
                    mouseupEvent:function(){
                        global.editGrabYLock && ( global.editGrabYLock = false );
                        global.editGrabXLock && ( global.editGrabXLock = false );
                        c('.code-area-display').removeClass('drag');
                    },
                    editGrabY:function(e){
                        e.preventDefault();
                        var y = e.clientY - c(this).position().top + 170;
                        global.editGrabYLocksY = y;
                        global.editGrabYLock = true;
                        c('.code-area-display').addClass('drag');
                    },
                    editGrabX:function(e){
                        e.preventDefault();
                        var x = e.clientY - c(this).offset().left;
                        global.editGrabXLocksX = x;
                        global.editGrabXLock = true;
                    },
                    submitSite:function(){
                        
                        var title = c('.content-edit').find('*[data-value="title"]').val(),
                            link = c('.content-edit').find('*[data-value="link"]').val(),
                            description = c('.content-edit').find('*[data-value="description"]').val(),
                            tags = [];
                        
                        c('.tags li').each(function(){
                            var v = c(this).find('span').html()
                            tags.indexOf(v) && ( tags.push(v) );
                        });
                        
                        if( !title || !link || !description ){
                            return fn.dialog('缺少必填参数');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            postObj = {
                                title:title,
                                link:link,
                                description:description,
                                tags:tags
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                preObj = Object.assign(preObj,postObj);
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/newwebsite',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog(response.result);
                                    fn.eventLock();
                                    setTimeout(function(){
                                        location.href = '/user';
                                    },2500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });
                                
                            });

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    removeTag:function(){
                        c(this).parents('li').remove();
                    },
                    addTag:function(){
                        var v = c(this).val() || null;
                        
                        if(!v){
                            return ;
                        }
                        
                        c('.tags ul').append(`<li>
                            <span>${ v }</span>
                            <i class="remove-tag lnr btn lnr-cross"></i>
                        </li>`);
                        
                        c(this).val('');
                    },
                    getPick:function(){
                        var pick = c('.homepage-container-line-pick-selector').data('pick') || [],
                            uuid = c('.homepage-container-line-pick-selector').attr('data-uuid') || null,
                            target = null;
                        
                        pick.forEach(function(p){
                            (p.uuid == uuid) && (target = p);
                        });
                        
                        return target;
                    },
                    editPick:function(){
                        var pick = global.eventObj.getPick(),
                            type = c(this).attr('data-type');
                        
                        if(!pick){
                            return fn.dialog('请重新选择');
                        }

                        
                        if( !c('.homepage-container-sl.selected')[0] ){
                            return fn.dialog('当前未选择分类');
                        }
                        
                        if( type=='edit' ){
                            c('.new-pick').remove();
                            c('body').append(`
                                <div class="new-pick" data-id="${ pick.uuid }">
                                    <div class="new-pick-bg"></div>
                                    <div class="dialog-port" style="top:50%;margin-top:-300px">
                                        <div class="dialog-port-content">
                                            <div class="dialog-port-content-display">
                                                <div class="edit-pick-cate">当前分类:<span class="orange">${ pick.categories }</span></div>
                                                <div class="edit-pick-name"><input data-key="title" type="text" value="${ pick.title }" placeholder="栏目标题" /></div>
                                                <div class="edit-pick-description"><textarea data-key="description" placeholder="摘要">${ pick.description }</textarea></div>
                                                <div class="edit-pick-litpic">
                                                    <img data-key="litpic" src="${ pick.litpic || '/assets/img/pick_default.png' }" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="dialog-port-act">
                                            <div class="fr">
                                                <div class="edit-pick-cancel btn">取消</div>
                                            </div>
                                            <div class="fr">
                                                <div class="edit-pick-done btn">确定</div>
                                            </div>
                                            <div class="clear"></div>
                                        </div>
                                    </div>
                                </div>
                            `);
                        }else if( type=='remove' ){
                            c('.new-pick').remove();
                            c('body').append(`
                                <div class="new-pick" data-id="${ pick.uuid }">
                                    <div class="new-pick-bg"></div>
                                    <div class="dialog-port" style="top:50%;margin-top:-300px">
                                        <div class="dialog-port-content">
                                            <div class="dialog-port-content-display">
                                                <div class="edit-pick-cate">当前分类:<span class="orange">${ pick.categories }</span></div>
                                                <div class="edit-pick-cate">当前标题:<span class="orange">${ pick.title }</span></div>
                                                <div style="color:rgba(0,0,0,.3)" class="edit-pick-cate">${ pick.description }</div>
                                                <div class="edit-pick-litpic">
                                                    <img data-key="litpic" src="${ pick.litpic || '/assets/img/pick_default.png' }" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="dialog-port-act">
                                            <div class="fr">
                                                <div class="edit-pick-cancel btn">取消</div>
                                            </div>
                                            <div class="fr">
                                                <div class="edit-pick-remove btn">删除</div>
                                            </div>
                                            <div class="clear"></div>
                                        </div>
                                    </div>
                                </div>
                            `);
                        }
                        
                    },
                    selectPickList:function(e){
                        e.stopPropagation();
                        var uuid = c(this).attr('data-uuid'),
                            name = c(this).text();
                        
                        c('.pick-list').remove();
                        
                        c('.homepage-container-line-pick-selector').attr('data-uuid',uuid);
                        c('.homepage-container-line-pick-name').html( name );
                    },
                    editPickRemove:function(){
                        
                        if(!c('.new-pick').attr('data-id')){
                            return fn.dialog('缺少必要字段');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                c('.new-pick').attr('data-id') && ( preObj['uuid'] = c('.new-pick').attr('data-id') );
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/removepick',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }

                                    fn.dialog('操作成功');
                                    
                                    c('.new-pick').remove();
                                    c('.homepage-container-line-pick-name').html('选择分栏');
                                    c('.homepage-container-line-pick-selector').attr('data-uuid',null);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });
                                
                            });

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    editPickDone:function(){
                        var key = ['title','description','litpic','categories'],
                            postObj = {},
                            queryObj = {},
                            isPass = true;
                        
                        key.forEach( (k) => {
                            switch( k ){
                                case 'litpic' :
                                    {
                                        c(`*[data-key="${ k }"]`).attr('src') ? ( postObj[k] = c(`*[data-key="${ k }"]`).attr('src') ) : ( isPass = false );
                                    }
                                break ;
                                    
                                case 'categories' :
                                    {
                                        c('.homepage-container-sl.selected')[0] ? ( postObj[k] = c('.homepage-container-sl.selected').parents('li').find('span').html() ) : ( isPass = false );
                                    }
                                break ;
                                    
                                default :
                                    {
                                        ( c('.new-pick').find(`*[data-key="${ k }"]`).val() ) ? ( postObj[k] = c('.new-pick').find(`*[data-key="${ k }"]`).val() ) : ( isPass = false );
                                    }
                                break ;
                            }
                        } );
                        
                        if(!isPass){
                            return fn.dialog('缺少必填参数');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            };
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                preObj = Object.assign(preObj,postObj);
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                c('.new-pick').attr('data-id') && ( preObj['uuid'] = c('.new-pick').attr('data-id') );
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/newpick',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }

                                    fn.dialog('操作成功');
                                    
                                    c('.new-pick').remove();
                                    c('.homepage-container-line-pick-name').html('选择分栏');
                                    c('.homepage-container-line-pick-selector').attr('data-uuid',null);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });
                                
                            });

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    },
                    editPickCancel:function(){
                        c('.new-pick').remove();
                    },
                    newPick:function(){
                        
                        if( !c('.homepage-container-sl.selected')[0] ){
                            return fn.dialog('当前未选择分类');
                        }
                        
                        c('.new-pick').remove();
                        c('body').append(`
                            <div class="new-pick">
                                <div class="new-pick-bg"></div>
                                <div class="dialog-port" style="top:50%;margin-top:-300px">
                                    <div class="dialog-port-content">
                                        <div class="dialog-port-content-display">
                                            <div class="edit-pick-cate">${ c('.homepage-container-sl.selected')[0] ? ( '当前分类  <span class="orange"> '+c('.homepage-container-sl.selected').parents('li').find('span').text() + '</span>' ) : ( '当前未选择分类' ) }</div>
                                            <div class="edit-pick-name"><input data-key="title" type="text" placeholder="栏目标题" /></div>
                                            <div class="edit-pick-description"><textarea data-key="description" placeholder="摘要"></textarea></div>
                                            <div class="edit-pick-litpic">
                                                <img data-key="litpic" src="/assets/img/pick_default.png" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="dialog-port-act">
                                        <div class="fr">
                                            <div class="edit-pick-cancel btn">取消</div>
                                        </div>
                                        <div class="fr">
                                            <div class="edit-pick-done btn">确定</div>
                                        </div>
                                        <div class="clear"></div>
                                    </div>
                                </div>
                            </div>
                        `);
                    },
                    getPickList:function(){
                        
                        if( !c('.homepage-container-sl.selected')[0] ){
                            return fn.dialog('当前未选择分类');
                        }
                        
                        c('.pick-list')[0] && c('.pick-list').remove();
                        
                        var self = c(this);
                        
                        var postObj = {},
                            queryObj = {},
                            isPass = true;
                        
                        var categories = c('.homepage-container-sl.selected')[0] ? ( c('.homepage-container-sl.selected').parents('li').find('span').html() ) : null;
                        
                        if(!categories){
                            return fn.dialog('缺少必填参数');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var preObj = {
                                c:categories
                            };
                        
                        var queryObj = {};

                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;

                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;

                        c.post('/user/getpick',queryObj,function(response){

                            fn.eventUnlock();
                            fn.setToken(response.key);

                            if(response.msg){
                                return fn.dialog(response.msg);
                            }

                            if( !response.data.count ){
                                c('.homepage-container-line-pick-name').html('选择分栏');
                                c('.homepage-container-line-pick-selector').attr('data-uuid',null);
                                
                                return fn.dialog('无该分类下的栏目,请创建');
                            }
                            
                            var chunk = '';
                            
                            response.data.result.forEach(function(dt){
                                chunk += (`<li data-uuid="${ dt.uuid }">${ dt.title }</li>`);
                            });
                            
                            chunk += (`<li data-uuid="delete">无</li>`);
                            
                            self.append(`<div class="pick-list"><ul>${ chunk }</ul></div>`);
                            
                            c('.homepage-container-line-pick-selector').data('pick',response.data.result);
                            
                        }).fail(function(response){
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                        });

                    },
                    homePageCsl:function(){
                        var mult = c(this).parents('.homepage-container-line-selector').attr('data-type') ? true : false;
                        
                        mult ? ( c(this).hasClass('selected') ? c(this).removeClass('selected') : c(this).addClass('selected') ) : ( c(this).addClass('selected').parents('li').siblings().find('i').removeClass('selected') );
                    },
                    postType:function(e){

                        if( c(this).find('a')[0] ){
                            return ;
                        }
                        
                        if( !fn.isLogin() ){
                            return fn.dialog('请先登录');
                        }
                        
                        location.href = '/user/newpost?t='+c(this).attr('data-type');
                    },
                    updateProfileSelection:function(){
                        c(this).parents('.update-profile-container-selection li').addClass('cur').siblings().removeClass('cur');
                    },
                    loadNextComment:function(){
                        
                        var container = c(`#comments`),
                            loading = `
                                <div class="comments-loading">
                                    <span>正在载入评论</span>
                                </div>
                            `,
                            none = `
                                <div class="comments-loading">
                                    <span>暂无评论</span>
                                </div>
                            `;

                        var p = container.attr('data-page') || 1,
                            id = container.next().attr('data-target') || null,
                            t = container.attr('data-type') || null;

                        if(!t || !id){
                            return fn.dialog('缺省必填字段');
                        }

                        container.find('.wrap').prepend(loading);

                        fn.getCommentList(id,p,t,function(data){
                            container.attr('data-page',(p*1+1));
                            container.find('.wrap .comments-loading').remove();
                            p = container.attr('data-page');
                            
                            if(!data){
                                return ;
                            }
                            
                            if(data.msg){
                                return fn.dialog(data.msg);
                            }
                            
                            if( !data.data.result.length ){
                                c('.load-comment').remove();
                                return fn.dialog('已至末页');
                            }
                            
                            data.data.result.forEach(function(dt){
                                container.find('.load-comment').before(`
                                    <div class="comments-item">
                                        <div class="comments-item-title">
                                            <div class="fl">
                                                <div class="comments-item-avatar">
                                                    <a href="/user/${ dt.author.uuid }"><img src="${ dt.author.avatar ? dt.author.avatar : '/assets/img/user-avatar-default.png' }" /></a>
                                                </div>
                                            </div>
                                            <div class="fl">
                                                <div class="comments-item-name">${ dt.author.name }</div>
                                                <div class="comments-item-desc">${ dt.author.postScript || '该用户很懒,没有自我描述' }</div>
                                            </div>
                                            <div class="fr">
                                                <div class="comments-item-date">
                                                    <div class="table">
                                                        <div class="cell">发表于：${ dt.postDate }</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="clear"></div>
                                        </div>

                                        <div class="comments-item-content"><p>${ dt.content }</p></div>
                                    </div>
                                `);
                            });
                        });
                        
                    },
                    keyupEvent:function(e){
                        //Log( e.keyCode );
                        
                        if( global.keyLock ){
                            return ;
                        }
                        
                        switch(e.keyCode){
                            
                            case 37 : {
                                if( c('#prev')[0] ){
                                    c('#prev').addClass('press');
                                    setTimeout(function(){
                                        (location.href = c('#prev a')[0].href);
                                    },50);
                                }
                            }
                            
                            break ;
                                
                            case 39 : {
                                if( c('#next')[0] ){
                                    c('#next').addClass('press');
                                    setTimeout(function(){
                                        (location.href = c('#next a')[0].href);
                                    },50);
                                }
                            }
                            
                            break ;
                                
                            case 32 :
                            case 13 :
                            case 27 : {
                                
                                if( c('.dialog')[0] ){
                                    c('.dialog-cancel').addClass('press');
                                    setTimeout(function(){
                                        c('.dialog').remove();
                                    },100);
                                }
                                
                            }
                                
                            break ;
                        }
                    },
                    openSearch:function(){
                        clearTimeout( global.eventTm );
                        if(!c(this).hasClass('open')){
                            c(this).addClass('open');
                            c('.search-input input').focus();
                        }
                    },
                    closeSearch:function(){
                        clearTimeout( global.eventTm );
                        global.eventTm = setTimeout(function(){
                            c('#search').removeClass('open');
                        },100);
                    },
                    openNavList:function(){
                        clearTimeout( global.eventTm );
                        c(this).addClass('open');
                    },
                    closeNavList:function(){
                        var self = c(this);
                        
                        clearTimeout( global.eventTm );
                        global.eventTm = setTimeout(function(){
                            self.removeClass('open');
                        },300);
                    },
                    closePort:function(){
                        c('.openfixed').remove();
                    },
                    closeDialog:function(){
                        c(this).parents('.dialog').remove();
                    },
                    getArticleList:function(){
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var qa = ['p','c','sort'];
                        
                        var queryObj = {},
                            preObj = {p:1};
                        
                        qa.forEach(function(key){
                             fn.getUrlParam(key) && ( preObj[key] = fn.getUrlParam(key) );
                        });
                        
                        (global.curPage) && ( preObj['p'] = global.curPage );
                        preObj.p++;
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        
                        queryObj['datas'] = datas;
                        
                        c.post('/article',queryObj,function(response){
                            
                            fn.eventUnlock();
                            fn.setToken(response.key);
                            
                            if(response.msg){
                                return fn.dialog(response.msg);
                            }
                            
                            if( !response.data.result.length ){
                                return fn.dialog('已至末页');
                            }
                            
                            global.curPage = response.data.offset || 1;
                            
                            fn.loadList( c('.article-list'),response.data.result,global.templates.articleList );
                            
                        }).fail(function(response){
                            
                            
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                            
                        });
                    },
                    regSendMsg:function(){
                        
                        var mobile = c('#reg-mobile').val(),
                            captcha = c('#captcha-value').val();

                        if(!captcha){
                            return fn.dialog('请填写图形验证码');
                        }
                        
                        if(!fn.checkMobile(mobile)){
                            return fn.dialog('手机号码格式不正确');
                        }
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var queryObj = {},
                            preObj = {
                                mobile:mobile,
                                captcha:captcha
                            };
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        
                        queryObj['datas'] = datas;
                        
                        c.post('/sms/getPublicKey',queryObj,function(response){
                        
                            fn.setToken(response.key);
                            
                            if(response.msg){
                                global.eventObj.refreshCaptcha();
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );
                            
                            var preObj = {};
                            
                            var objData = {
                                mobile:mobile
                            };
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                preObj['rsa'] = rsa;
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);

                                queryObj['datas'] = datas;

                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;

                                c.post('/sms/newRegCheck',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }
                                    
                                    fn.dialog( response.result );

                                }).fail(function(response){

                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);

                                });
                                
                            });
                            
                        }).fail(function(response){
                            
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                            
                        });
                        
                    },
                    checkRegCode:function(){
                        
                        var mobile = c('#reg-mobile').val(),
                            code = c('input[placeholder="验证码"]').val();

                        
                        if(!fn.checkMobile(mobile)){
                            return fn.dialog('手机号码格式不正确');
                        }
                        
                        if(!code){
                            return fn.dialog('请填写验证码');
                        }
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var queryObj = {},
                            preObj = {
                                mobile:mobile,
                                code:code
                            };
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        
                        queryObj['datas'] = datas;
                        
                        c.post('/sms/confrimSms',queryObj,function(response){
                        
                            fn.setToken(response.key);
                            fn.eventUnlock();
                            
                            if(response.msg){
                                return fn.dialog(response.msg);
                            }
                            
                            global.eventObj.setRegConfig(mobile);
                            
                        }).fail(function(response){
                            
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                            
                        });
                        
                    },
                    setRegConfig:function(mobile){
                        c('.openfixed').remove();
                        
                        c('body').append(fn.getConfig(mobile));
                        
                        setTimeout( function(){
                            c('.openfixed').addClass('open');
                        },5 );
                    },
                    checkName:function(){
                        
                        var name = c('#check-name-val').val();
                        
                        if(!fn.checkName(name)){
                            
                            if( fn.bytelength(name) > 12 || fn.bytelength(name) < 3 ){
                                return fn.dialog('用户名必须是中文数字或字母组成的3-12位字符(一个中文算2个字符)');
                            }
                            
                            c('.reg-done').removeClass('btn');
                            return fn.warning('用户名格式不正确');
                        }
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var queryObj = {},
                            preObj = {
                                name:name
                            };
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/sms/checkName',queryObj,function(response){
                            
                            fn.setToken(response.key);
                            fn.eventUnlock();
                            
                            if(response.msg){
                                c('.reg-done').removeClass('btn');
                                return fn.warning(response.msg);
                            }
                            
                            fn.dialog(response.result);
                            fn.removeWarning();
                            
                        }).fail(function(response){
                            
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                            
                        });
                        
                    },
                    checkRegConfig:function(){
                        var arr = [],
                            isPass = true;
                        
                        c('input[type="password"]').each(function(i){
                            arr[i] = c(this).val();
                            
                            if( c(this).val() ){
                                isPass = false;
                            }
                        });
                        
                        if(isPass){
                            return fn.removeWarning();
                        }
                        
                        if(!c('#check-name-val').val()){
                            c('.reg-done').removeClass('btn');
                            return fn.warning('请填写用户昵称');
                        }
                        
                        if( (arr[0] != arr[1]) ){
                            c('.reg-done').removeClass('btn');
                            return fn.warning('两次密码不一致');
                        }
                        
                        fn.removeWarning();
                        c('.reg-done').addClass('btn');
                        
                    },
                    userConfigKeyup:function(e){
                        if(c('.dialog')[0]){
                            return ;
                        }
                        
                        if(e.keyCode==13){
                            global.eventObj.finishRegist();
                        }
                        
                    },
                    finishRegist:function(){
                        
                        var isPass = false,
                            arr = [];
                        
                        c('#user-config input[type="password"]').each(function(idx){
                            arr[idx] = c(this).val();
                        });
                        
                        if(arr[0]!=arr[1]){
                            c('.reg-done').removeClass('btn');
                            return fn.warning('两次密码不一致');
                        }
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf,
                                name:c('#check-name-val').val(),
                                mobile:c('#user-config').attr('data-mobile'),
                                password:c('#user-config input[type="password"]').val()
                            },
                            queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){
                            
                            fn.setToken(response.key);
                            
                            if(response.msg){
                                global.eventObj.refreshCaptcha();
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );
                            
                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                preObj['rsa'] = rsa;
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);

                                queryObj['datas'] = datas;

                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;

                                c.post('/user/newUser',queryObj,function(response){

                                    fn.setToken(response.key);
                                    fn.eventUnlock();

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }

                                    location.href = response.result;

                                }).fail(function(response){

                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);

                                });
                                
                            });
                            
                        }).fail(function(response){
                            
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                            
                        });
                        
                        
                    },
                    refreshCaptcha:function(){
                        c('.captcha img').attr('src',`/captcha.svg?${ Math.random() }`);
                    },
                    loginKeyup:function(e){
                        if(c('.dialog')[0]){
                            return ;
                        }
                        
                        if(e.keyCode==13){
                            global.eventObj.loginEvent();
                        }
                    },
                    loginEvent:function(){
                        var user = c('#login-user-value').val(),
                            password = c('#login-password-value').val(),
                            captcha = c('#captcha-value').val();
                        
                        if(!user || !password || !captcha){
                            return fn.dialog('缺少必填字段');
                        }
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var preObj = {
                            user:user,
                            password:password,
                            captcha:captcha
                        },
                        queryObj = {};
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        
                        queryObj['datas'] = datas;
                        
                        c.post('/user/getPublicKey',queryObj,function(response){
                            fn.setToken(response.key);
                            if(response.msg){
                                global.eventObj.refreshCaptcha();
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );
                            
                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                preObj['rsa'] = rsa;
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);

                                queryObj['datas'] = datas;

                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;

                                c.post('/user/login',queryObj,function(response){

                                    fn.setToken(response.key);
                                    fn.eventUnlock();

                                    if(response.msg){
                                        global.eventObj.refreshCaptcha();
                                        return fn.dialog(response.msg);
                                    }

                                    location.href = response.result;

                                }).fail(function(response){

                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);

                                });
                                
                            });
                            
                        }).fail(function(response){
                            
                            fn.eventUnlock();
                            fn.dialog(response.statusText);
                            
                        });
                    },
                    searchBtnSubmit:function(e){
                        
                        if(e.keyCode!=13){
                            return ;
                        }
                        
                        var val = c(this).parents('#search').find('.search-input input').val();
                        
                        if( !val ){
                            return fn.dialog('请输入搜索关键字');
                        }
                        
                        location.href = `/search?k=${val}`;
                    },
                    searchBtn:function(e){
                        e.preventDefault();
                        
                        c('.search-input input').focus();
                        
                        if( !c(this).parents('#search').hasClass('open') ){
                            return ;
                        }
                        
                        var val = c(this).parents('#search').find('.search-input input').val();
                        
                        if( !val ){
                            return ;
                        }
                        
                        location.href = `/search?k=${val}`;
                        
                    },
                    postContent:function(e){
                        clearTimeout(global.eventTm);
                        
                        var _self = c(this);
                        
                        global.eventTm = setTimeout(function(){
                            var val = _self.html();
                            
                            val = val.replace(/<div>/g,'<p>');
                            val = val.replace(/<\/div>/g,'<\/p>');
                            
                            //Log( curPos );
                            
                            //_self.html(val);
                        },5);
                        
                    },
                    postContentDisable:function(){
                        global.keyLock = true;
                    },
                    postContentRelease:function(){
                        global.keyLock = false;
                    },
                    updateAccount:function(){
                        var key = ['oldpass','pass','passconfrim'],
                            queryObj = {},
                            preObj = {},
                            postObj = {},
                            isPass = true;
                        
                        key.forEach(function(k){
                            ( c(`*[data-key="${ k }"]`).val() ) ? ( postObj[k] = ( c(`*[data-key="${ k }"]`).val() ) ) : ( isPass = false );
                        });
                        
                        if(!isPass){
                            return fn.dialog('缺少必填参数');
                        }
                        
                        if( postObj['pass'] != postObj['passconfrim'] ){
                            return fn.dialog('两次输入密码不相同');
                        }
                        
                        if( postObj['pass'] == postObj['oldpass'] ){
                            return fn.dialog('新旧密码不能相同');
                        }
                        
                        for(var key in postObj){
                            ( postObj[key].length < 6 || postObj[key].length > 20 ) && ( isPass = false );
                        }
                        
                        if(!isPass){
                            return fn.dialog('密码长度在6-20位之间');
                        }
                        
                        if( global.eventLock ){
                            return ;
                        }
                        
                        fn.eventLock();
                        
                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            };
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }
                            
                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                preObj = Object.assign(preObj,postObj);
                                
                                var queryObj = {};
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/account',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }

                                    fn.dialog( response.result );
                                    fn.eventLock();
                                    setTimeout(function(){
                                        location.href = '/user';
                                    },2500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });
                                
                            });

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                    },
                    updateProfile:function(){
                        var key = ['avatar','male','location','age','postScript','email','job','company','wechat','qq','weibo','link','be','github'],
                            queryObj = {},
                            postObj = {},
                            isPass = true;
                        
                        key.forEach(function(k){
                            
                            switch(k){
                                case 'avatar' :
                                    {
                                        c('.update-profile-avatar img').attr('src') && ( postObj[k] = c('.update-profile-avatar img').attr('src') );
                                    }
                                break ;
                                    
                                case 'male' :
                                    {
                                        c('.update-profile-container-selection li.cur span').html() && 
                                        ( postObj[k] = c('.update-profile-container-selection li.cur span').html() );
                                    }
                                break ;
                                    
                                break; 
                                    
                                default :
                                    {
                                        c(`*[data-key="${ k }"]`).val() && (postObj[k] = c(`*[data-key="${ k }"]`).val());
                                    }
                                break ;
                            }
                            
                        });
                        
                        for(var key in postObj){
                            ( postObj[key].length > 500 ) && ( isPass = false );
                        }
                        
                        if(!isPass){
                            return fn.dialog('长度不正确');
                        }
                        
                        if(global.eventLock){
                            return ;
                        }
                        
                        fn.eventLock();

                        var cerf = ( fn.simpleKey.keygen() ),
                            preObj = {
                                cerf:cerf
                            };
                        
                        //set cerficate
                        queryObj['token'] = global.token;
                        queryObj['key'] = global.key;
                        
                        var datas = fn.simpleKey.encode(preObj,global.key);
                        queryObj['datas'] = datas;
                        
                        c.post('/user/postKey',queryObj,function(response){

                            fn.setToken(response.key);

                            if(response.msg){
                                fn.eventUnlock();
                                return fn.dialog(response.msg);
                            }

                            global.publicKey = ( response.result );

                            var objData = preObj;
                            
                            fn.simpleKey.rsaEncode(objData,global.publicKey,function( rsa ){
                                
                                preObj['rsa'] = rsa;
                                
                                var queryObj = {};

                                preObj = Object.assign(preObj,postObj);
                                
                                //set cerficate
                                queryObj['token'] = global.token;
                                queryObj['key'] = global.key;
                                
                                var datas = fn.simpleKey.encode(preObj,global.key);
                                queryObj['datas'] = datas;
                                
                                c.post('/user/update',queryObj,function(response){
                                    
                                    fn.eventUnlock();
                                    fn.setToken(response.key);

                                    if(response.msg){
                                        return fn.dialog(response.msg);
                                    }

                                    fn.dialog( response.result );
                                    fn.eventLock();
                                    setTimeout(function(){
                                        location.href = '/user';
                                    },2500);

                                }).fail(function(response){
                                    fn.eventUnlock();
                                    fn.dialog(response.statusText);
                                });
                                
                            });

                        }).fail(function(response){

                            fn.eventUnlock();
                            fn.dialog(response.statusText);

                        });
                        
                    }
                };
                
                
                
                
                
                
                //====== portEvent
                
                var portEvent = [
                    {
                        name:'openReg',
                        eventName:'getRegPage',
                        selector:'.reg-event'
                    },
                    {
                        name:'openLogin',
                        eventName:'getLoginPage',
                        selector:'.login-event'
                    },
                    {
                        name:'openRest',
                        eventName:'getRestPage',
                        selector:'.getrest-event'
                    },
                ];
                
                portEvent.forEach(function(evt){
                    global.eventList.push({
                        type:'click',
                        selector:evt.selector,
                        eventName:evt.name
                    });
                    
                    global.eventObj[evt.name] = function(e){
                        e.preventDefault();
                        
                        if( fn.isLogin() ){
                            return ;
                        }
                        
                        c('.openfixed').remove();
                        
                        c('body').append(fn[evt.eventName]());
                        
                        setTimeout( function(){
                            c('.openfixed').addClass('open');
                        },50 );
                    }
                });
                
                //====== portEvent END
                
                
                
                fn.eventBind(global.eventList);
                c('#comments')[0] && fn.initComments();
                c('#scene')[0] && fn.initScene();
                ( c('#preview-mode')[0] && fn.getUrlParam('share') ) && fn.dialog(`您正在访问的是 <a target="_blank" href="http://www.cwebgl.com"><span class="orange">Cwebgl平台</span></a> 提供的代码,版权归原作者所有`);
                
                c('code')[0] && fn.initialCode();
                c('cloud')[0] && fn.initialCloud();
                
                ( c('.display-content attachment')[0] || c('.forum-content attachment')[0] ) && fn.initialAttachment();
                
                c('.display-content h3')[0] && fn.initialGuide();
                
                window.addEventListener("message", global.eventObj.logMsg, false );
            }
        });
        
        //App luanch
        c(window).on('load',fn.init).on('resize',fn.resize.bind(this));
        
    });
}) )(jQuery,function(){
	return window.globalFn || {};
},window.global || {});