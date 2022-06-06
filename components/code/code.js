let express = require('express');
let router = express.Router();

const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const getRsa = require('../../utils/getRsa');

const getIp = require('remote-ip');

const querystring = require('querystring');

const QRCode = require('qrcode-svg');

//render api

const preview = async (req, res, next) => {
    
    let renderObj = {
        title:'展示代码'
    };
    
    
    runnerCode = req.session.jsCode || '';
    runnerCode = runnerCode.replace(/console\.log/g,'sendMsg');
    let libs = [];
    req.session.libs.forEach( (lib) => {
        lib && libs.push( lib );
    } )
    
    renderObj['htmlCode'] = req.session.htmlCode || '';
    renderObj['jsCode'] = runnerCode || '';
    renderObj['lib'] = req.session.lib || [];
    renderObj['libs'] = libs || [];
    
    res.render('codeResult.ejs', renderObj);
    
}

const getDetail = async (req, res, next) => {
    let uuid = req.params.uuid || null;
    
    if(!uuid){
        return next();
    }
    
    let sDate = new Date().getTime();
    
    let queryKey = ['sort','p'];
    
    let userUUID = req.session.userData ? req.session.userData.uuid : null;
    
    let detail = await controller.getDetail(seqModel,{
        uuid:uuid
    });
    
    if(!detail || detail.msg){
        return res.redirect('/redirect.html');
    }
    
    let author = await controller.getUserSimple(seqModel,{
        uuid:detail.author
    });
    
    let isEditor = (detail.author == userUUID) || (detail.author=='admin') ? true : false;
    
    if(!isEditor && detail.status!='normal'){
        return res.redirect('/redirect.html');
    }
    
    let renderObj = {
            title:detail.title+' by '+author.name+' - 代码 '
        };
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['querystring'] = querystring;
    renderObj['position'] = 'code';
    
    renderObj['data'] = detail;
    
    renderObj['htmlCode'] = detail.html || '<!-- HTML代码 -->\n';
    renderObj['jsCode'] = detail.js || '//JS代码\n';
    renderObj['lib'] = detail.dependencies || [];
    
    renderObj['userDetail'] = author;
    renderObj['isEditor'] = isEditor;
    
    renderObj['position'] = 'code';
    renderObj['unfooter'] = true;
    
    req.session.htmlCode = renderObj['htmlCode'];
    req.session.jsCode = renderObj['jsCode'];
    
    //get libDetail
    task = [];
    
    renderObj['lib'].forEach( (libUuid) => {
        task.push( controller.getLibDetail(seqModel,libUuid) );
    } );
    
    let libDetail = await Promise.all(task);
    
    req.session['libs'] = renderObj['libs'] = libDetail;
    //END
    
    renderObj['isCollect'] = null;
    ( req.session.userData && req.session.userData.uuid ) && ( renderObj['isCollect'] = await controller.collectExist(seqModel,{target:uuid,author:req.session.userData.uuid,type:'code'}) );
    
    renderObj.data['postDate'] = ( dateParse(new Date( renderObj.data.postDate * 1 ),'yyyy-MM-dd hh:mm') );
    
    let template = req.query.f ? 'previewCode.ejs' : 'editCode.ejs';
    
    renderObj['isVr'] = req.query.vr ? 'vr' : '';
    
    let shareSvg = new QRCode({
          content: `https://www.cwebgl.com/code/${ detail.uuid }?f=1&share=1`,
          padding: 2,
          width: 160,
          height: 160,
          color: "#000000",
          background: "#ffffff",
          ecl: "M"
        }).svg(),
        vrSvg = new QRCode({
          content: `https://www.cwebgl.com/code/${ detail.uuid }?f=1&vr=1`,
          padding: 2,
          width: 160,
          height: 160,
          color: "#000000",
          background: "#ffffff",
          ecl: "M"
        }).svg();
    
    renderObj['shareSvg'] = shareSvg;
    
    renderObj['vrSvg'] = vrSvg;
    
    renderObj['queryObj'] = req.query;
    
    Log(renderObj);
    
    res.render(template, renderObj);
}


const editCode = async (req, res, next) => {
    
    let sDate = new Date().getTime(),
        isInit = req.query.init || null;
    
    let queryKey = ['sort','p'];
    
    let renderObj = {
            title:'新的代码'
        },
        queryObj = {
            
        };
    
    if( isInit ){
        req.session['htmlCode'] = `
<!-- HTML代码 -->

<script id="vertexShader" type="x-shader/x-vertex">
    varying vec2 vUv;
    void main()	{
        vUv = uv;
        gl_Position = vec4( position, 1.0 );
    }
</script>

<script id="fragmentShader" type="x-shader/x-fragment">
    varying vec2 vUv;
    uniform float u_time;
  	uniform vec2 u_resolution;
  	uniform vec2 u_mouse;
    
    void main()	{
  		vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec3 color = vec3( abs( sin( u_time ) ), u_mouse.x / u_resolution.x, vUv.y );
        gl_FragColor = vec4( color, 1.0 );
    }
</script>

<div id="container"></div>
<div id="showfps"></div>
`;
        req.session['jsCode'] = `
//JS代码
/*
    @Author:
    @Date:
*/

var container;
var camera, scene, renderer;
var uniforms;

init();
animate();

function init() {
    container = document.getElementById( 'container' );
    camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    scene = new THREE.Scene();
    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
    
    /*
        material, video
        more about video material, see
        https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_video.html
    */
    
    var loader = new THREE.TextureLoader();
  	loader.crossOrigin = true;
  
    uniforms = {
        u_time: { value: 1.0 },
        u_resolution: { type:'v2',value: new THREE.Vector2() },
        u_mouse: { type:'v2',value: new THREE.Vector2() },
        //u_map:{ value:loader.load( '/disturb.jpg' ) },
      	//u_map:{ value:loader.load( 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg' ) }
    };
    
    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    } );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );
    onWindowResize();

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousemove', onMouseMove, false );
}

function onWindowResize( event ) {
    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove( event ) {
    uniforms.u_mouse.value.x = event.clientX;
    uniforms.u_mouse.value.y = event.clientY;
}

function updateFPS(){
    var current_time, dt;
    if(!window.last_time){
        window.last_time = (new Date).getTime();
    }
    current_time = (new Date).getTime();
    dt = (current_time - last_time) / 1000;
    last_time = current_time;
    window.fps = 1 / dt;
    fps = ~~(window.fps);
    document.getElementById('showfps').innerHTML = 'FPS:'+fps;
}

//
function animate( timestamp ) {
    window.fps = 0;
    requestAnimationFrame( animate );
    uniforms.u_time.value = timestamp / 1000;
    renderer.render( scene, camera );
    updateFPS();
}
`;
        renderObj['lib'] = ['33f2ff9e-fefa-4631-9a8e-051138485a1d'];
    }
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['querystring'] = querystring;
    renderObj['position'] = 'code';
    renderObj['htmlCode'] = req.session.htmlCode || '<!-- HTML代码 -->\n';
    renderObj['jsCode'] = req.session.jsCode || '//JS代码\n';
    renderObj['lib'] = renderObj['lib'] || [];
    
    let task = []
    
    //get libDetail
    task = [];
    
    renderObj['lib'].forEach( (libUuid) => {
        task.push( controller.getLibDetail(seqModel,libUuid) );
    } );
    
    let libDetail = await Promise.all(task);
    
    req.session['libs'] = renderObj['libs'] = libDetail;
    //END
    
    renderObj['unfooter'] = true;
    
    res.render('newCode.ejs', renderObj);
};

const getList = async (req, res, next) => {
    
    let sDate = new Date().getTime();
    
    let queryKey = ['sort','p'];
    
    let renderObj = {
            title:'代码'
        },
        queryObj = {
            
        };
    
    queryKey.forEach( (key) => {
        req.query[key] && ( queryObj[key] = req.query[key] );
    } );
    
    let brige = new Array({status:'normal'},{sort:{postDate:1},limit:15});
    
    for(let key in queryObj){
        switch(key){
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
    
    lists.offset = queryObj.p || 1;
    
    lists.sort = brige[1].sort || {postDate:1};
    
    (!brige[1].sort) && (lists.sort = 'postDate-1');
    
    lists.result.forEach( (item) => {
        item.postDate = ( dateParse(new Date( item.postDate * 1 ),'yyyy-MM-dd') );
    } );
    
    let showCase = await controller.getShowCase( seqModel,'code' );
    
    renderObj['showcase'] = showCase;
    
    lists['option'] = brige[0];
    
    renderObj['data'] = lists;
    
    renderObj['timestamp'] = (new Date().getTime() - sDate) + ' (ms)';
    
    renderObj['queryObj'] = req.query;
    
    renderObj['querystring'] = querystring;
    
    renderObj['position'] = 'code';
    
    res.render('code.ejs', renderObj);
};

const thumnbnail = async (req,res,next) => {
    
    let uuid = req.query.uuid || null;
    
    if(!uuid){
        return res.redirect('/redirect.html');
    }
    
    let url = await controller.thumnbnail( seqModel.code,uuid );
    
    return res.redirect( url || '/redirect.html' );
}

module.exports = {
    getList:getList,
    editCode:editCode,
    preview:preview,
    getDetail:getDetail,
    thumnbnail:thumnbnail,
};
