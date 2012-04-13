function game(){
  var ga = {};
  
  function frame() {
    this.users = {
      
    };
  }
  
  function() user {
    var u = this;
    u.fly;
    u.joy;
  }
  
  function world() {
    var w = this;
    w.w = 800;     
    w.h = 450;
    wl = 380;   //waterlevel
    av = 0.05;  //air viscosity or friction
    gx = 0.00;  //gravity (horizontal gravity )
    gy = 0.5;
    wsx = 0.0;  //windspeed
    wsy = 0.0;  
  }
  
  function fly(p,j,w) {
    var c = this;
    if(p.uc>0) //if unconcious no joy response
    {
      j.h=0;
      j.v=0;
      p.uc--;
    }
    c.xa = (j.h*p.xi)+w.gx; //acceleration joystick inertia and gravity
    c.ya = p.y<30?w.gy*4:(j.v*p.yi)+w.gy;
  
    c.xa = p.x<50?w.gy*5:p.xa; //bounds
    c.xa = p.x>w.w-50?-w.gy*5:p.xa;
  
    c.xs = p.xs + p.xa; //speed
    c.ys = p.ys + p.ya;
    c.wrx = p.wrx;
    c.wry = p.wry;
    c.xs -= (c.xs-w.wsx)*(w.av*c.wrx); //interaction between speed, wind speed, wind resistance
    c.ys -= (c.ys-w.wsy)*(w.av*c.wry); //and air viscosity
    
    c.x+=c.xs;
    c.y+=c.ys;
    
    if (c.y>381) //bounds
    {
      c.y=381;
      c.ys=0;
      c.xs*=.3;
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
    var cf = new frame();
    
    cf.xs = pf.xs;
    cf.ys = pf.ys;
    
    cio.forEach(function(io){
      cf.xs = [0,1,0,-1,0][io];
      cf.ys = [1,0,-1,0,0][io];
    });
    
    cf.x = pf.x + cf.xs * 2;
    cf.y = pf.y + cf.ys * 2;
    return cf;
  }
  return ga;
}