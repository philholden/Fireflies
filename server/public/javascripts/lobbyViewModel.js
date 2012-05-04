
function LobbyViewModel() {
  var self = this;
  self.users = ko.observableArray([]);
  
  self.update = function(req) {
    var selected = self.selected();
    var users = [];
    var isSelected;
    req.users.forEach(function(user) {
      isSelected = _.include(selected,user.id);
      users.push(new User(user,selected));
    });
    self.users(users);
  }
  
  //returns array of selected userIds
  self.selected = function(){
    var selected = [];
    console.log(self.users());
    self.users().forEach(function(user){
      console.log(user.selected());
      if(user.selected()){
        selected.push(user.id);
      }
    });
    return selected;
  }
  
  self.changeName = function() {
    gc.newUser($("#name").val());
  }
  
  self.toggleSelected = function(user) {
    user.selected(!user.selected());
    console.log(user.selected());
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