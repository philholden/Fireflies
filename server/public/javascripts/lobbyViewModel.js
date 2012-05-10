
function LobbyViewModel() {
  var self = this;
  self.users = ko.observableArray([]);
  self.availables = ko.observableArray([]);
  self.maxSelected = 2;
  self.selected = [];
  self.challenge = ko.observableArray([]);
  self.myChallengers = ko.observableArray([]);
  self.me = null;
  self.meUndecided = ko.observable(false);
  
  self.update = function(req) {
    var availables = []; //available
    var isSelected;
    req.users.forEach(function(user) {
      isSelected = _.include(self.selected,user.id);
      isAvailable = _.include(req.availables,user.id);
      if (isAvailable) {
        availables.push(new User(user,isSelected));
      };
    });
    self.availables(availables);
    self.updateSelection();
    self.me = req.me === undefined ? self.me : req.me;
    getChallengers(req);
  }
  
  function getChallengers(req) {
    var chs = req.challenges;
    var challenge;
    var myChallengers = [];
    var all;
    var all2 = [];
    chs.forEach(function(ch){
      all = _.union(ch.undecided,ch.accepted);
      console.log(all);
      if(_.include(all,self.me)) {
        challenge = ch;
        all2 = all;
      }
    });
    console.log(challenge);
    var accepted;
    if(challenge){
      req.users.forEach(function(user) {
        accepted = _.include(challenge.accepted,user.id);
        if(_.include(all2,user.id)){
          myChallengers.push(new User(user,false,accepted));
          if(user.id == self.me) {
            self.meUndecided(!accepted);
          }
        }
      });
    }
    self.myChallengers(myChallengers);
  }
  
  self.selected = [];
  
  self.addSelection = function(user) {
    var hasUser = _.include(self.selected,user.id);
    if(hasUser){
      self.selected = _.without(self.selected,user.id);
    } else {
      self.selected.push(user.id);
    }
    self.selected = self.selected.splice(-self.maxSelected);
    self.updateSelection();
  }
  
  self.updateSelection = function() {
    self.selected = _.intersection(self.selected,availableUserIds());
    self.availables().forEach(function(user){
      var hasUser = _.include(self.selected,user.id);
      if(hasUser != user.selected()) {
        user.selected(hasUser);
      }
    });
  }
  
  self.changeName = function() {
    gc.newUser($("#name").val());
  }
  
  self.toggleSelected = function(user) {
    user.selected(!user.selected());
    console.log(user.selected());
  }
  
  self.sendChallenge = function(){
    var userids = _.union(self.me,self.selected);
    gc.socket.emit('lobbychallenge',{userids:userids});
    console.log(userids);
  }
  
  self.accept = function() {
    gc.socket.json.emit('lobbyaccept', {
      'userid':self.me
    }); 
  };
  
  self.decline = function() {
    gc.socket.json.emit('lobbydecline', {
      'userid':self.me
    }); 
  }
  
  function availableUserIds() {
    var userIds = [];
    self.availables().forEach(function(user){
      userIds.push(user.id);
    });
    return userIds;
  }
}

function User(user,selected,accepted) {
  var self = this;
  
  self.id = user.id;
  self.name = user.name;
  self.score = user.score;
  self.selected = ko.observable();
  self.accepted = accepted;
  self.selected(_.include(selected,self.id));
  self.toggleSelected = function(user) {
    user.selected = !user.selected;
  }
  self.userInfo = ko.computed(function() {
    return self.name + " " + self.score;    
  }, this);
  self.challengeInfo = ko.computed(function() {
    return self.name + " " + self.score + " " +(self.accepted ? "accepted" : "waiting");    
  }, this);
}

ko.bindingHandlers.executeOnEnter = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
    var allBindings = allBindingsAccessor();
    $(element).keypress(function (event) {
      var keyCode = (event.which ? event.which : event.keyCode);
      if (keyCode === 13) {
        allBindings.executeOnEnter.call(viewModel);
        return false;
      }
      return true;
    });
  }
};