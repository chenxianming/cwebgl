var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//defined session
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

//defined minify
const minify = require('express-minify');
const compression = require('compression');
const uglifyEs = require('uglify-es');

//defined redis
var Redis = require('ioredis');

var redisClient = new Redis(process.env.redisOption.port, process.env.redisOption.host);

global.redis = redisClient;

//requires
const RateLimit = require('express-rate-limit');
const customHeaders = require('./middleware/customHeaders');
const appendToLog = require('./middleware/guestlog');

//defined utils
const sessionKey = require('./middleware/sessionKey');

//defined routes
var user = require('./components/user');
var sms = require('./components/sms');

var collection = require('./components/collection');
var collections = require('./components/collections');
var comment = require('./components/comment');
var pick = require('./components/pick');
var lib = require('./components/lib');


var homepage = require('./components/article/homepage');

var article = require('./components/article');
var website = require('./components/website');
var code = require('./components/code');
var community = require('./components/community');

var app = express();

//minify middleware
app.use(compression());
app.use(minify({
    cache: false,
    uglifyJsModule: uglifyEs,
    errorHandler: null,
    //jsMatch: /javascript/,
    cssMatch: /css/,
    jsonMatch: /json/,
    sassMatch: /scss/,
    lessMatch: /less/,
    stylusMatch: /stylus/,
    //coffeeScriptMatch: /coffeescript/,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'limit':'3000kb',extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//set session

app.use(session({
    secret: process.env.secret,
    saveUninitialized: false, // don't create session until something stored 
    resave: false, //don't save session if unmodified 
    cookie: {maxAge: 30*24*60*60*1000 }, 
    store: new RedisStore({
        client:redisClient
    }),
}));

//request limit
let limiter = new RateLimit({
    windowMs: 1000, // 1000 ms
    max: 5, // limit each IP to 100 requests per windowMs 
    delayMs: 0, // disable delaying - full speed until the max limit is reached 
    message:'请勿重复提交,谢谢'
});

app.use(limiter);
app.use(customHeaders);

//set session
app.use('/', sessionKey);

//set guest middleware
app.use('/', appendToLog);

//set routes
app.use('/user', user);
app.use('/sms', sms);
app.use('/lib', lib);

app.use('/collection', collection);
app.use('/collections', collections);
app.use('/comment', comment);
app.use('/pick', pick);


app.use('/', homepage);

app.use('/article', article);
app.use('/website', website);
app.use('/code', code);
app.use('/community', community);

//initial database
const initalData = () => {
    for(var key in seqModel){
        seqModel[key].sync({
            force:true
        });
    }
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
