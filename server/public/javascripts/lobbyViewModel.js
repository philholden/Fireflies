
function LobbyViewModel() {
  var self = this;
  self.users = ko.observableArray([]);
  self.availables = ko.observableArray([]);
  self.maxSelected = 2;
  self.selected = [];
  self.challenge = ko.observableArray([]);
  
  self.me = null;
  
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
    self.me = req.me;
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
  
  function availableUserIds() {
    var userIds = [];
    self.availables().forEach(function(user){
      userIds.push(user.id);
    });
    return userIds;
  }
}

function User(user,selected) {
  var self = this;
  
  self.id = user.id;
  self.name = user.name;
  self.selected = ko.observable();
  self.selected(_.include(selected,self.id));
  self.toggleSelected = function(user) {
    user.selected = !user.selected;
  }
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