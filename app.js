
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , gameChannel = require('./gameChannel')
  , user = require('./user')
  , _ = require('underscore')
  , config = require('./config')
  , fs = require('fs')
  , db = require('./database');

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

app.locals.use(function(req, res) {
  res.locals.session = req.session;
});
 
app.configure('development', function(){
  app.use(express.errorHandler());
});

app.engine('html', function(path, options, fn){
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    fn(null, str);
  });
});

app.post('/', routes.gameLobby);
app.get('/', routes.index);

app.get('/edit-hue', routes.editHue);

app.get('/hello', routes.hello);

var httpServer = http.createServer(app);
io = io.listen(httpServer);
httpServer.listen(config.port);

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
    var req = req;
    client.join('lobby');
    var user;
    if (req.dbId) {
      console.log(req);
      db.getUser(req.dbId,response);
    } else {
      response(null);
    }
    function response(data){
      var user = usr.addUser(client,req.name);
      if(data && data.user){
        user.name = data.user.User.firstname;
        user.hue = data.user.User.hue;
        user.dbId = data.user.User.id;
        user.fbScore = parseInt(data.user.User.score);
      }
      usr.makeAvailable(user.id);
      //push lobby users
      var msg = usr.lobbyMessage(client);
      client.json.broadcast.to('lobby').emit('lobby',msg);
      //tell the new user their id 
      msg.me = user ? user.id : undefined;
      client.json.emit('lobby',msg);
    };
  });
  
  client.json.on('dies',function(req){
    console.log("dies");
    console.log(req);
    var channel = gcs.getClientChannel(client);
    var dead = usr.getUserById(req.userid);
    if(!channel||!dead){
      return;
    }
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
      fbScore(users,dead);
    }
    
    exitGame(dead);
    if(users.length < 2) {
      users.forEach(exitGame);
      io.sockets.in(channel.id).emit('gameover',{});
    }

    broadcastLobby();
    
    function fbScore(users,dead) {
      if(!dead.dbId){
        return;
      }
      console.log(dead);
      var fbAlive = users.filter(function(user){
        return user.dbId!==0;
      });
      var fbAliveIds = fbAlive.map(function(user){
        return user.dbId;
      });
      if(fbAliveIds.length){
        db.userDies(dead.dbId,fbAliveIds);
        var tithe = dead.fbScore/10;
        dead.fbScore -= tithe;
        fbAlive.forEach(function(user){
          user.fbScore += tithe/fbAlive.length;
        });      
      }
    }
    
    //leave game
      
    function exitGame(user){
      var us = user;
      usr.makeAvailable(user.id);
      user.client.join('lobby');
      //this causes errors on refresh
      setTimeout(function(){
      //  console.log(channel.id);
      //  console.log(channel);
      //  console.log(io.sockets.manager.rooms);
      //  console.log(us);
        var clts = io.sockets.manager.rooms[channel.id];
          if((clts instanceof Array) && (_.include(clts,channel.id))) {
            
//        if(channel.id !== null) {
          us.client.leave(channel.id);
        }
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
        usr.startGame(ch,broadcastLobby);
      };
    }
    broadcastLobby();
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
  
  client.json.on('color', function(req){
    var user = usr.getClientUser(client);
    if(user !== undefined) {
      user.hue = req.hue;
      var msg = usr.lobbyMessage(client);
      client.json.emit('lobby',msg);
    }
    console.log("color");
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
  
  broadcastLobby = function(){
    var msg = usr.lobbyMessage(client);
    io.sockets.in('lobby').emit('lobby',msg);
  }
  
});