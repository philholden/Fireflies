/*
 * 
 */

function Player(p,w,cio) {
  var c = this;
  if(!(p instanceof Player)) {
    init();
    return;
  }
  
  c.joy = new Joystick(p.joy,cio,0);
  c.fly = new Fly(p.fly,c.joy.state(),w);
  
  function init() {
    console.log('init');
    c.joy = new Joystick();
    c.fly = new Fly(p,c.joy,w); // p = {n:,i:}
  }
}