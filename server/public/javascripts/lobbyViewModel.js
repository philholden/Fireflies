
function LobbyViewModel() {
  var self = this;
  self.users = ko.observableArray([]);
  self.availables = ko.observableArray([]);
  self.maxSelected = 2;
  self.selected = [];
  self.timer = null;
  self.challenge = ko.observableArray([]);
  self.myChallengers = ko.observableArray([]);
  self.me = null;
  self.myName = ko.observable("");
  self.savedName = ko.observable("");
  self.meUndecided = ko.observable(false);
  self.challengeEnabled = ko.observable(false);
  self.displayLobby = ko.observable(false);
  self.displayGame = ko.observable(true);
  self.displayChallenge = ko.observable(false);
  self.challengeSec = ko.observable(5);
  self.loaded = ko.observable(false);
  
  self.nameOkEnabled = ko.computed(function(){
    return self.myName() != "" && self.myName() != self.savedName();
  },this);
  
  self.update = function(req) {
    var availables = []; //available
    var isSelected;
    self.me = req.me === undefined ? self.me : req.me;
    req.users.sort(function(a,b){return a.score-b.score});
    req.users.forEach(function(user) {
      if(user.id == self.me) {
        self.savedName(user.name);
        self.color(user.hue);
        if(self.myName()=="") {
          self.myName(user.name);
        }
      }
      isSelected = _.include(self.selected,user.id);
      isAvailable = _.include(req.availables,user.id);
      if (isAvailable) {
        availables.push(new User(user,isSelected));
      };
    });
    if(_.include(req.availables,self.me)){
      self.mode("lobby");
    }
    self.availables(availables);
    self.updateSelection();
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
    var accepted;
    if(challenge){
      self.mode("challenge");
      req.users.forEach(function(user) {
        accepted = _.include(challenge.accepted,user.id);
        if(_.include(all2,user.id)){
          myChallengers.push(new User(user,false,accepted));
          if(user.id == self.me) {
            self.meUndecided(!accepted);
          }
        }
      });
    } else {
      self.meUndecided(false);
      if(!_.include(req.availables,self.me)){
        self.mode("game");
      }
    }
    self.myChallengers(myChallengers);
  }
  
  self.mode = function(mode){
    if(mode == "challenge" && !self.displayChallenge()){
      //timer
      self.challengeSec(11);
      (function (){
        self.challengeSec(self.challengeSec()-1);
        if(self.challengeSec()>1){
          clearTimeout(self.timer);
          self.timer = setTimeout(arguments.callee,1000);
        }
      }) ();
    }
    self.displayLobby(mode == "lobby" || mode == "challenge");
    self.displayGame(mode == "game");
    self.displayChallenge(mode == "challenge");
//    if(mode == "game" && $("#game").requestFullscreen){
//      $("#game").requestFullscreen();
//    }
  }
  
  self.selected = [];
  
  self.addSelection = function(user) {
    if(user.id == self.me) {
      return;
    }
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
    self.challengeEnabled(self.selected.length>0);
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
  
  self.sendName = function(a){
    if(self.nameOkEnabled()){
      gc.newUser($("#name").val());
    }
  };
  
  self.color = function(hue){
    $('#color div').removeClass('selected');
    var tar = $('#color div[rel='+hue+']');
    tar.addClass('selected');
  };
}

function User(user,selected,accepted) {
  var self = this;
  console.log(user);
  self.id = user.id;
  self.name = user.name;
  self.score = user.score;
  self.hue = user.hue;
  self.hsla = "hsla("+self.hue+",100%,50%,1)";
  self.hsla2 = "hsla("+self.hue+",100%,30%,1)";
  self.selected = ko.observable();
  self.accepted = ko.observable(accepted);
  self.selected(_.include(selected,self.id));
  
  self.classes = ko.computed(function(){
    return (self.selected() ? "selected" : "") +
      (self.id == lobby.me ? "me" : "");
  });
  
  self.styles = ko.computed(function(){
    var shadow = self.hsla + " 0 0 0.5em";
    var out = {};
    out.color = self.selected()? self.hsla : self.hsla2;
    out['text-shadow'] = self.selected() ? shadow : "none";
    return out;
  });

  self.toggleSelected = function(user) {
    user.selected = !user.selected;
  }
  self.userInfo = ko.computed(function() {
    return self.name + " " + self.score;    
  }, this);

  self.userTip = ko.computed(function() {
    return self.id == lobby.me ? "Me" : self.selected() ? "Click to unselect" : "Click to select";
  }, this);

  self.challengeStatus = ko.computed(function() {
    return self.accepted() ? "accepted" : "waiting";    
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