/*
 * 
 */

function player(p,w) {
  var c = this;
  if(!(p instanceof player)) {
    init();
    return;
  }
  
  c.joy = new joy(p.joy);
  c.fly = new fly(p.fly,c.joy,w);
  
  function init() {
    c.joy = new joy();
    c.fly = new fly(p,c.joy,w); // p = {n:,i:}
  }
}