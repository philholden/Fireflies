var _ = require('underscore');

exports.Users = function(gcs) {
  var usr = this;
  usr.users=[];
  usr.n = 0;
  usr.clientUser={};
  usr.gcs=gcs;
  
  usr.availables=[]; //id of available users
  usr.challenges=[]; //arrays of challenges
  usr.defaultNames = ['Spark','Lightning','Flash','Lumen','Photon','Neon',
    'Glow','Ignite','Kindle','Comet','Halo','Flare','Bokeh','Light','Energy',
    'Tinder','Glory','Torch','Meteorite','Radient','Flame','Spectrum',
    'Ambient','Starlight','Moonbeam','Supernova','Phosphorescence','Plasma'];
  
  usr.addUser = function(client,name) {
    if (usr.clientUser[client.id] === undefined) {
      var user = new exports.User(usr.n++,client);
      usr.users.push(user);
      usr.clientUser[client.id] = user;
    }
    var defname = usr.defaultNames[usr.n%usr.defaultNames.length];
    usr.clientUser[client.id].name = name !== "" ? name : defname;
    return usr.clientUser[client.id];
  };
  
  usr.getClientUser = function(client){
    return usr.clientUser[client.id];
  };
  
  usr.getUserById = function(userid){
    var u = usr.users.filter(function(user){
      return user.id == userid;
    });
    return u[0];
  };
  
  //brute force remove user from lobby
  usr.purge = function(userid) {

    usr.challenges.forEach(function(ch,i){
      ch.purge(userid);
    });
    //delete empty challenges
    usr.challenges = usr.challenges.filter(function(ch){
      return !(ch.accepted.length == 0 && ch.undecided.length == 0);
    });
    usr.availables = _.without(usr.availables,userid);
  }
  
  usr.isChallenged = function(userid){
    var out = false;
    usr.challenges.forEach(function(ch,i){
      if(_.include(ch.accepted,userid) || _.include(ch.undecided,userid)){
        out = true;
      }
    });
    return out;
  };
  
  usr.getChallenge = function(userid){
    var out = null;
    usr.challenges.forEach(function(ch,i){
      if(_.include(ch.accepted,userid) || _.include(ch.undecided,userid)){
        out = ch;
      }
    });
    return out;
  };
  
  usr.makeAvailable = function(userid) {
    usr.availables = _.union(usr.availables,userid);
    //could delete from accepteds
  }
  
  usr.makeChallenge = function(userids,fn) { //userids[0] = challenger
    //filter for challengable users 
    var challengable = _.intersection(userids,usr.availables);
    var next =  fn;
    //create new challenge
    if((challengable[0] === userids[0]) && //one who made challenge is available
        (challengable.length > 1)) {
      var challenger = challengable[0];
      var ch = new Challenge(challengable)
      usr.challenges.push(ch);
      ch.timer = setTimeout(autoStart,5000);
    };

    function autoStart() {
      if(ch.accepted.length < 2) {
        usr.availables = _.union.apply(_,[usr.availables].concat(ch.accepted));
        usr.availables = _.union.apply(_,[usr.availables].concat(ch.undecided));
        usr.challenges = _.without(usr.challenges,ch);
        next();
      } else {
        usr.startGame(ch,next);
      }
    }
  };
  
  usr.disconnect = function(userid) {
    var user = usr.users[userid];
    usr.purge(userid);
    delete(usr.clientUser[user.client.id]);
    delete(usr.users[userid]);
  }
  
  //returns lobby users available and challenged
  usr.getLobbyUsers = function() {
    var userids = [usr.availables];
    var users = [];
    usr.challenges.forEach(function(ch) {
      userids.push(ch.undecided);
      userids.push(ch.accepted);
    });
    userids = _.union.apply(_,userids);
    var user;
    userids.forEach(function(userid){
      user = usr.users[userid];
      users.push({
        id:user.id,
        name:user.name,
        score:user.score
      });
    });
    return users;
  }
  
  usr.startGame = function(ch,next){
    if(ch.timer){
      clearTimeout(ch.timer);
    }
    //start game
    var channel = usr.gcs.getNewChannel(ch.accepted.length,usr);
    var users = usr.users.filter(function(user){
      return _.include(ch.accepted,user.id);
    });
    //delete challenge and availble users
    usr.availables = _.without.apply(_,[usr.availables].concat(ch.accepted));
    usr.availables = _.union.apply(_,[usr.availables].concat(ch.undecided));
    usr.challenges = _.without(usr.challenges,ch);
    next();
    //add user to channel
    users.forEach(function(user){
      channel.addClient(user.client,usr);
      user.client.leave('lobby');
      user.alive = true;
      user.channelid = channel.id;
    });
  };
  
  usr.lobbyMessage = function(client) {
    var cl;
    var challenges = usr.challenges.map(function(ch){
      cl = _.clone(ch);
      delete(cl.timer);
      return cl;
    });
    var user = usr.getClientUser(client);
    var msg = {
      users: usr.getLobbyUsers(),
      availables: usr.availables,
      challenges: challenges
    }
    return msg;
  }
  
  function Challenge(challenged){
    var ch = this;
    ch.accepted = [_.first(challenged)];
    ch.undecided = _.rest(challenged);
    
    usr.availables = _.without.apply(_,[usr.availables].concat(challenged));
    ch.accept = function(userid) {
      ch.undecided = _.without(ch.undecided,userid);
      ch.accepted.push(userid);
      if(ch.undecided.length === 0) {
        return true;
      }
    }
    
    ch.decline = function(userid) {
      ch.undecided = _.without(ch.undecided,userid);
      usr.makeAvailable(userid);
      var union = _.union(ch.undecided,ch.accepted);
      if(union.length < 2) {
        union.forEach(function(id){
          usr.makeAvailable(id);
        })
        usr.challenges = _.without(usr.challenges,ch);
      }
    }
    
    ch.purge = function(userid){
      ch.undecided = _.without(ch.undecided,userid);
      ch.accepted = _.without(ch.accepted,userid); 
      //if less than 2 put remaining user as available;
      if(ch.undecided.length + ch.accepted.length < 2) {
        usr.availables = _.union(usr.availables,ch.undecided,ch.accepted);
        ch.accepted = [];
        ch.undecided = [];
      }
    }
  }
}

exports.User = function(id,client) {
  var user = this;
  user.id = id;
  user.client = client;
  user.name = 'anonymous';
  user.score = 100;
  user.alive = true;
  user.channeid = null;
}


