
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

io = require('socket.io');

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");

io = io.listen(app);
io.sockets.on('connection', function(client){
  console.log('connected');
  client.json.on('subscribe', function(req){
    client.join(req.channel);
    client.json.send({
      user: 'Server',
      text: 'subscribed to ' + req.channel
    });
  });
  client.json.on('message', function(req){
    if(req.channel !== undefined) {
      client.json.send(req);
      client.json.broadcast.to(req.channel).send(req);
    }
  });
});