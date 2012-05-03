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
  
  usr.challenge = function(challenged) {
    var challengable = usr.availables.filter(function(user){
      _.include(challenged,user);
    });
    
    if((challengable[0] === challenged[0]) &&
        (challengable.length > 1)) {
      var challenger = challengable[0];
      usr.challenges[challenger](challengable);
    }
  };
  
  
  
  function Challenge(challenged){
    var ch = this;
    ch.accepted = [];
    ch.undecided = challenged;
    
    ch.accept = function(userid) {
      ch.undecided.filter(function(id){
        return userid != id;
      });
      ch.accepted.push(userid);
    }
    
    ch.decline = function(userid) {
      ch.undecided.filter(function(id){
        return userid != id;
      });
      usr.availables.push(userid);
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


