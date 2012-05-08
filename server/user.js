var _ = require('underscore');

exports.Users = function() {
  var usr = this;
  usr.users=[];
  usr.n = 0;
  usr.clientUser={};
  
  usr.availables=[]; //id of available users
  usr.challenges=[]; //arrays of challenges
  
  usr.addUser = function(client,name) {
    if (usr.clientUser[client.id] === undefined) {
      console.log("reached");
      var user = new exports.User(usr.n++,client);
      usr.users.push(user);
      usr.clientUser[client.id] = user;
    }
    usr.clientUser[client.id].name = name;
    return usr.clientUser[client.id];
  };
  
  usr.getClientUser = function(client){
    return usr.clientUser[client.id];
  };
  
  //brute force remove user from lobby
  usr.purge = function(userid) {
    usr.challenges.forEach(function(ch,i){
      ch.purge(userid);
    });
    usr.challenges = usr.challenges.filter(function(ch){
      return !(ch.accepted.length == 0 && ch.undecided.length == 0);
    });
    usr.availables = _.without(usr.availables,userid);
  }
  
  usr.isChallenged = function(userid){
    usr.challenges.forEach(function(ch,i){
      if(_.include(ch.accepted,userid) || _.include(ch.undecided,userid)){
        return true;
      }
    });
    return false;
  };
  
  usr.makeAvailable = function(userid) {
    usr.availables = _.union(usr.availables,userid);
    //could delete from accepteds
  }
  
  usr.makeChallenge = function(userids) { //userids[0] = challenger
    //filter for challengable users 
    var challengable = _.intersection(userids,usr.availables);
    
    //create new challenge
    if((challengable[0] === userids[0]) && //one who made challenge is available
        (challengable.length > 0) &&
        usr.challenges[challenger] === undefined) {
      var challenger = challengable[0];
      usr.challenges[challenger] = new Challenge(challengable);
    }
  };
  
  usr.disconnect = function(userid) {
    var user = usr.users[userid];
    usr.purge(userid);
    delete(usr.clientUser[user.clientId]);
    delete(usr.users[userid]);
  }
  
  //returns lobby users available and challenged
  usr.getLobbyUsers = function() {
    var userids = [];
    var users = [];
    userids.push(usr.availables);
    usr.challenges.forEach(function(ch) {
      userids.push(ch.undecided);
      userids.push(ch.accepted);
    });
    userids = _.union.apply(_,userids);
    var user;
    console.log(userids);
    console.log(usr.users);
    console.log(usr.challenges);
    console.log(usr.availables);
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
  
  function Challenge(challenged){
    var ch = this;
    ch.accepted = [_.first(challenged)];
    ch.undecided = _.rest(challenged);
    usr.availables = _.without(ch.availables,challenged);
    
    ch.accept = function(userid) {
      ch.undecided = _.without(ch.undecided,userid);
      ch.accepted.push(userid);
    }
    
    ch.decline = function(userid) {
      ch.undecided = _.without(ch.undecided,userid);
      usr.makeAvailable(userid);
    }
    
    ch.purge = function(userid){
      ch.undecided = _.without(ch.undecided,userid);
      ch.accepted = _.without(ch.accepted,userid);
      if(ch.undecided.length + ch.accepted.length < 2) {
        usr.availables = _.union(usr.availables,ch.undecided.length,ch.accepted.length);
        ch.accepted = [];
        ch.undecided = [];
      }
    }
  }
}

exports.User = function(id,client) {
  var user = this;
  user.id = id;
  user.clientId = client.id;
  user.name = 'anonymous';
  user.score = 100;
}


