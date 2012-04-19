/*
 * 
 */

function Player(p,w,cio) {
  var c = this;
  if(!(p instanceof Player)) {
    init();
    return;
  }
  
  c.id = p.id;
  c.joy = new Joystick(p.joy,cio,c.id);
  c.fly = new Fly(p.fly,c.joy.state(),w);
  
  function init() {
    c.id = p.i;
    c.joy = new Joystick();
    c.fly = new Fly(p,c.joy,w); // p = {n:,i:}
  }
}