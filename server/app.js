
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
var usr = new user.Users(gcs);
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
//    client.join(req.channel);
//    gcs.getChannel(req.channel).addClient(client,gcs);
//    var user = usr.addUser(client,req.name);
//    usr.makeAvailable(user.id);
//    broadcastLobby();
  });
  
  client.json.on('newuser', function(req){
    client.join('lobby');
    var user = usr.addUser(client,req.name);
    usr.makeAvailable(user.id);
    //push lobby users
    var msg = usr.lobbyMessage(client);
    client.json.broadcast.to('lobby').emit('lobby',msg);
    //tell the new user their id 
    msg.me = user ? user.id : undefined;
    client.json.emit('lobby',msg);
  });
  
  client.json.on('dies',function(req){
    console.log("dies");
    console.log(req);
    var channel = gcs.getClientChannel(client);
    var dead = usr.getUserById(req.userid);
    if(!channel){
      return;
    }
    console.log(dead.name);
    //tithe
    var users = usr.users.filter(function(user){
      return user.alive &&
        user.channelid == channel.id && 
          user.id != req.userid;
    });
    
    var tithe = dead.score/10;
    if(users.length && dead.alive) {
      dead.score = dead.score - tithe;
      dead.alive = false;
      users.forEach(function(user){
        user.score += tithe/users.length;
      });
      console.log("doom");
      console.log(users.length);
      console.log(tithe);
      console.log(tithe);
    }
    
    exitGame(dead);
    if(users.length < 2) {
      users.forEach(exitGame);
      io.sockets.in(channel.id).emit('gameover',{});
    }

    broadcastLobby();
    //leave game
      
    function exitGame(user){
      console.log(user);
      usr.makeAvailable(user.id);
      user.client.join('lobby');
      setTimeout(function(){
        user.client.leave(channel.id);
      },5000);
    }
  });
  
  client.json.on('enterlobby', function(req){
    var user = usr.getClientUser(client);
    if(!usr.isChallenged(user.id)){
      usr.makeAvailable(user.id);
    };
  });
  
  client.json.on('lobbychallenge', function(req){
    var user = usr.getClientUser(client);
    usr.makeChallenge(req.userids,broadcastLobby);
    broadcastLobby();
  });
  
  client.json.on('lobbydecline', function(req){
    var ch = usr.getChallenge(req.userid);
    if(ch){
      ch.decline(req.userid);
    };
    broadcastLobby();
  });
  
  client.json.on('lobbyaccept', function(req){
    var ch = usr.getChallenge(req.userid);
    if(ch){
      var accepted = ch.accepted;
      if(ch && ch.accept(req.userid)) {
        usr.startGame(ch,gcs,broadcastLobby);
      };
    }
    console.log(io.sockets.manager.rooms);
  });
  
  client.json.on('message', function(req){
    var channel = gcs.getClientChannel(client);
    if(channel !== undefined) {
      client.json.send(req);
      client.json.broadcast.to(channel.id).send(req);
    }
    console.log(io.sockets.manager.rooms);
  });
  
  client.on('disconnect',function(req){
    var channel = gcs.getClientChannel(client);
    if(channel){
      channel.removeClient(client);
    }
    var user = usr.getClientUser(client);
    if(user){
      usr.disconnect(user.id);
    }
    broadcastLobby();
  });
  
  function broadcastLobby(){
    var msg = usr.lobbyMessage(client);
    io.sockets.in('lobby').emit('lobby',msg);
  }
  
});