exports.Users = function() {
  var usr = this;
  usr.users=[];
  usr.clientUser={};
  
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
}

exports.User = function(id,client) {
  var user = this;
  user.id = id;
  user.clientId = client.id;
  user.name = 'anonymous';
  user.score = 100;
}

