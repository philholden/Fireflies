/*
 * 
 */

function player(p,w,cio) {
  var c = this;
  if(!(p instanceof player)) {
    init();
    return;
  }
  
  c.joy = new joystick(p.joy,cio,0);
  c.fly = new fly(p.fly,c.joy.state(),w);
  
  function init() {
    console.log('init');
    c.joy = new joystick();
    c.fly = new fly(p,c.joy,w); // p = {n:,i:}
  }
}