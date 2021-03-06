/* p: previous frames fly objects
 * j: joystick state for this player
 * w: world defines the play area for the game
 */

function Fly(p,j,w) {
  
  var c = this;
  if(!(p instanceof Fly)){
    init();
    return;
  }
//  console.log(j);
  if(p.uc>0) //if unconcious no joy response
  {
    j.h=0;
    j.v=0;
    c.uc = p.uc - 1;
  } else {
    c.uc =0;
  }
  
  if(p.invulnerable){
    c.invulnerable = p.invulnerable - 1;
  }
  
//  c.invulnerable 
    c.wrx = 1.0; //wind resistance
    c.wry = 1.0;
    c.xi = 0.4;  //inertia
    c.yi = 0.4;
    c.xInit = p.xInit;
    
  c.lives = p.lives;
  c.xa = (j.h*c.xi)+w.gx; //acceleration joystick inertia and gravity 
  var acc = (j.v==-1?-1.1:j.v)*p.yi+w.gy;
  c.ya = p.y<20?Math.max(w.gy*1,acc):acc;
  c.xa = p.x<40?Math.max(w.gy*1,c.xa):c.xa; //bounds
  c.xa = p.x>w.w-40?Math.min(-w.gy*1,c.xa):c.xa;
  c.xs = p.xs + c.xa; //speed
  c.ys = p.ys + c.ya;

  c.wrx = p.wrx;
  c.wry = p.wry;
  c.xs -= (c.xs-w.wsx)*(w.av*c.wrx); //interaction between speed, wind speed, wind resistance
  c.ys -= (c.ys-w.wsy)*(w.av*c.wry); //and air viscosity
  
  c.x = p.x + c.xs;
  c.y = p.y + c.ys;

  c.plop = c.y < (w.wl - 5) ? true : p.plop;

  if(p.dead > 0){
    c.dead = p.dead - 1;
    c.xs = 0;
    c.y = 40;
    c.ys = -5;
    c.uc = 0;
    c.invulnerable = 120;
    c.x = c.xInit;
    if(!c.lives) {
      c.dead = c.dead == 1 ? 2:c.dead;
    }
  } else {
    c.dead = 0;
  }

  if (c.y>w.wl) //bounds
  {
    if(c.plop) {
      audio[1].play();
    }
    c.plop = false;
    c.y=w.wl;
    c.ys=0;
    c.xs*=.3;
  }
  
  function init() {
    c.xInit = (w.w/p.n)*(p.i+.5);
    c.invulnerable = 0;
    c.x = c.xInit;
    c.y = 0.0;
    c.xs = 0.0;
    c.ys = 0.0;
    c.xa = 0.0;
    c.ya = 0.0;
    c.wrx = 1.0; //wind resistance
    c.wry = 1.0;
    c.xi = 1.5;  //inertia
    c.yi = 1.5;
    c.uc = 0;
    c.plop = true;
    c.dead = 0;
    c.lives = 3;
  }
}