/* p: previous frames fly objects
 * j: joystick state for this player
 * w: world defines the play area for the game
 */

function fly(p,j,w) {
  var c = this;
  if(!arguments.length){
    c = init();
    return;
  }
  
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
  
  if (c.y>w.wl) //bounds
  {
    c.y=w.wl;
    c.ys=0;
    c.xs*=.3;
  }
  
  function init() {
    var out = {
      x:0.0,
      y:0.0,
      xs:0.0,
      ys:0.0,
      xa:0.0,
      ya:0.0,
      px:0.0,
      py:0.0,
      wrx:1.0, //wind resistance
      wry:1.0,
      xi:1.0,  //inertia
      yi:1.0,
      uc:0
    }
    return out; 
  }
}