exports.Users = function() {
  var usr = this;
  usr.users=[];
  usr.clientUser={};
  
  usr.addUser = function(client,name) {
    if (usr.users[client.id] === undefined) {
      var user = new exports.User(usr.users.length,client.id);
      usr.users.push(user);
      usr.clientUser[client.id] = user;
    }
    return usr.clientUser[client.id];
  };
  
  usr.getClientUser = function(client){
    return usr.clientUser[client.id];
  };
}

exports.User = function(id,client) {
  var user = this;
  user.id = id;
  user.clientId = client.id;
  user.name = name;
  user.score = 100;
}

