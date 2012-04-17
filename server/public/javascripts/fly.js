/* p: previous frames fly objects
 * j: joystick state for this player
 * w: world defines the play area for the game
 */

function fly(p,j,w) {
  
  var c = this;
  if(!(p instanceof fly)){
    init();
    return;
  }
//  console.log(j);
  if(p.uc>0) //if unconcious no joy response
  {
    j.h=0;
    j.v=0;
    p.uc--;
  }
  
    c.wrx = 1.0; //wind resistance
    c.wry = 1.0;
    c.xi = 1.0;  //inertia
    c.yi = 1.0;
    c.uc = 0;
  
  c.xa = (j.h*c.xi)+w.gx; //acceleration joystick inertia and gravity
  c.ya = p.y<30?w.gy*4:(j.v*p.yi)+w.gy;

  c.xa = p.x<50?w.gy*5:c.xa; //bounds
  c.xa = p.x>w.w-50?-w.gy*5:c.xa;
  c.xs = p.xs + c.xa; //speed
  c.ys = p.ys + c.ya;

  c.wrx = p.wrx;
  c.wry = p.wry;
  c.xs -= (c.xs-w.wsx)*(w.av*c.wrx); //interaction between speed, wind speed, wind resistance
  c.ys -= (c.ys-w.wsy)*(w.av*c.wry); //and air viscosity
  
  c.x = p.x + c.xs;
  c.y = p.y + c.ys;
  
  if (c.y>w.wl) //bounds
  {
    c.y=w.wl;
    c.ys=0;
    c.xs*=.3;
  }
  
  function init() {
    
    c.x = (w.w/(p.n+2))+p.i;
    console.log(c.x);
    c.y = 0.0;
    c.xs = 0.0;
    c.ys = 0.0;
    c.xa = 0.0;
    c.ya = 0.0;
    c.wrx = 1.0; //wind resistance
    c.wry = 1.0;
    c.xi = 1.0;  //inertia
    c.yi = 1.0;
    c.uc = 0;
  }
}