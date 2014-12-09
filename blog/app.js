
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./settings')
  , flash = require('connect-flash')
  , partials = require('express-partials');  
var app = express();

app.configure(function(){ 
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views'); 
  app.set('view engine', 'ejs'); 
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser()); 
  app.use(express.methodOverride()); 
  app.use(express.cookieParser()); 
  app.use(flash());
  // express-partials
  app.use(partials());
  // MongoDB
  app.use(express.session({ 
    secret: settings.cookieSecret, 
    store: new MongoStore({ 
      db: settings.db 
    }) 
  })); 
  // ������ʵ��dynamichelper���ܵ�use����ŵ� app.usr(app.router)ǰ�� 
  // app.usr(app.router)�ŵ� ��̬�ļ�����֮ǰ��app.use(express.static(__dirname + '/public'))��
  app.use(function(req, res, next) {
	res.locals.error = req.flash('error').toString();
	res.locals.success = req.flash('success').toString();
	res.locals.user = req.session ? req.session.user : null;
	next();
  });
  app.use(app.router);//����ԭ����
  //app.use(express.router(routes));//node.js����ָ������ģ�ע�͵���
  
  app.use(express.static(__dirname + '/public')); 
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);//������¼ӵ�

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
