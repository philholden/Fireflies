function Keyboard() {
  var k = this;
  k.trans = {
    "37":"l",
    "38":"u",
    "39":"r",
    "40":"d"
  };
  
  k.state = {
    "u":false,
    "d":false,
    "l":false,
    "r":false
  }
  
  k.keyUp = function(key) {
    key = k.trans[key];
    if(key) {
      if(k.state[key]) {
        k.state[key]=false;
        return key;
      }
      return false;
    }
  }
  
  k.keyDown = function(key) {
    key = k.trans[key];
    if(key) {
      if(!k.state[key]) {
        k.state[key]=true;
        return key.toUpperCase();
      }
      return false;
    }
  }
}
