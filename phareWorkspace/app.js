var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var login = require('./routes/login');
var reg = require('./routes/reg');
var say = require('./routes/say');


// for store session
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');

/**
 * 用户注册功能需要实现“显示注册成功或错误的信息”的功能，
 * 而新版本的express不再支持flash模块，需要自己安装“connect-flash”包”
 */
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// START -  setup html engine to view
// var ejs = require('ejs');
// app.engine('.html',ejs.__express);
// app.set('view engine','html');
// END

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cookie解析的中间件
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//提供session支持
app.use(session({
  secret: settings.cookieSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost/' + settings.db //new MongoDBStore里面包url after connect-mongodb@1.0.2
  })
}));

/**视图交互：实现用户不同登录状态下显示不同的页面及显示不同页面及显示登录注册等成功和错误等提示信息
 * 创建视图助手，在视图中获取session中的数据和要显示的错误或成功信息。
 * 该段代码放在 “app.use('/', routes)”之前。
 */
app.use(function(req, res, next){
    console.log("app.usr local");
    res.locals.user = req.session.user;
    res.locals.post = req.session.post;
    var error = req.flash('error');
    res.locals.error = error.length ? error : null;

    var success = req.flash('success');
    res.locals.success = success.length ? success : null;
    next();
});

app.use('/', routes);
app.use('/login', login);
app.use('/reg', reg);
app.use('/say', say);


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
