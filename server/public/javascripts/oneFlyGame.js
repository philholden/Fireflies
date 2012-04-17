function game(){
  var ga = {};
  var w = new world();
  
  function frame(p,cio) {
    var c = this;
    if(!arguments.length) {
      console.log("init");
      init();
      return;
    }
 
    c.joy = new joystick(p.joy,cio,0);
    c.fly = new fly(p.fly,c.joy.state(),w);
    
    function init() {
      c.joy = new joystick();
      c.fly = new fly({n:1,i:0},c.joy,w);
    }
  }
  
  ga.firstFrame = function() {
    var cf = new frame();
    return cf; 
  }
  
  /* the current frame (cf) is derived from the
   * previous frame (pf) based on incoming io events
   */ 
  ga.next = function(pf,cio) {
    var cf = new frame(pf,cio);
    return cf;
  }
  return ga;
}