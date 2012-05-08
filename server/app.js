
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , gameChannel = require('./gameChannel')
  , user = require('./user')
  , _ = require('underscore');

io = require('socket.io');

var gcs = new gameChannel.gameChannels();
var usr = new user.Users();
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
var httpServer = http.createServer(app);
io = io.listen(httpServer);
httpServer.listen(3000);

console.log("Express server listening on port 3000");

io.sockets.on('connection', function(client){
  console.log('connected');
  client.json.on('subscribe', function(req){
    client.join(req.channel);
    gcs.getChannel(req.channel).addClient(client,gcs);
  });
  
  client.json.on('newuser', function(req){
    client.join('lobby');
    var user = usr.addUser(client,req.name);
    usr.makeAvailable(user.id);
    console.log(usr);
    //push lobby users
    broadcastLobby();
  });
  
  client.json.on('enterlobby', function(req){
//    client.join('lobby');
    var user = usr.getClientUser(client);
    usr.makeAvailable(user.id);
    console.log(usr);
    //push lobby users
//    client.json.broadcast.to('lobby').emit('lobby',usr.users);
//    client.json.emit('lobby',usr.users);
  });
  
  client.json.on('message', function(req){
    var channel = gcs.getClientChannel(client);
    if(channel !== undefined) {
//      console.log(req);
      client.json.send(req);
      client.json.broadcast.to(channel.id).send(req);
    }
  });
  
  client.on('disconnect',function(req){
    var channel = gcs.getClientChannel(client);
    channel.removeClient(client);
    var user = usr.getClientUser(client);
    usr.disconnect(user.id);
    broadcastLobby();
  });
  
  function broadcastLobby() {
    var msg = {
      users: usr.getLobbyUsers(),
      availables: usr.availables,
      challenges: usr.challenges
    }
    client.json.broadcast.to('lobby').emit('lobby',msg);
    client.json.emit('lobby',msg);
  }
  
});