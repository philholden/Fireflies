var _ = require('underscore');

exports.Users = function() {
  var usr = this;
  usr.users=[];
  usr.clientUser={};
  
  usr.availables=[]; //id of available users
  usr.challenges=[]; //arrays of challenges
  
  usr.addUser = function(client,name) {
    console.log(usr.users[client.id]);
    if (usr.clientUser[client.id] === undefined) {
      console.log("reached");
      var user = new exports.User(usr.users.length,client);
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
    usr.availables = usr.availables.filter(function(id){
      return userid != id;
    });
    usr.challenges.forEach(function(challenge){
      challenge.purge(userid);
    });
  }
  
  usr.makeAvailable = function(userid) {
    console.log(userid);
    if(!_.include(usr.availables,userid)) {
      usr.availables.push(userid);
    } else {console.log("sdfsdf")}
    //could delete from accepteds
  }
  
  usr.makeChallenge = function(userids) { //userids[0] = challenger
    //filter for challengable users 
    var challengable = usr.availables.filter(function(userid){
      _.include(userids,userid);
    });
    
    //create new challenge
    if((challengable[0] === userids[0]) &&
        (challengable.length > 1) &&
        usr.challenges[challenger] === undefined) {
      var challenger = challengable[0];
      usr.challenges[challenger](new Challenge(challengable));
    }
  };
  
  function Challenge(challenged){
    var ch = this;
    ch.accepted = [];
    ch.undecided = challenged;
    
    ch.accept = function(userid) {
      ch.undecided = ch.undecided.filter(function(id){
        return userid != id;
      });
      ch.accepted.push(userid);
    }
    
    ch.decline = function(userid) {
      ch.undecided = ch.undecided.filter(function(id){
        return userid != id;
      });
      usr.makeAvailable(userid);
    }
    
    ch.purge = function(userid){
      ch.accepted = ch.accepted.filter(function(id){
        return userid != id;
      });
      ch.undecided = ch.undecided.filter(function(id){
        return userid != id;
      });
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


