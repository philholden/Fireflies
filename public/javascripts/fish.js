function Fish(p,players,w) {

  var c = this;
  
  if(!(p instanceof Fish)){
    init();
    return;
  }
//  console.log(p);
  c.jump = p.jump <= 0 ? 0 : p.jump - 1;
  findTarget(players);
  move();
  shouldJump();
  
        
  /* The fish will target the closest fly */
  function findTarget(players) {
    var mindist = 4000;
    var tar = players[0].fly;
    //console.log(tar);
    var dist,x,y;
    players.forEach(function(pl) {
      var f = pl.fly;
      x=Math.abs(f.x-p.x);
      y=Math.abs(f.y-p.y);
      dist=Math.sqrt((x*x)+(y*y));
      if(dist < mindist){
        mindist = dist;
        tar = pl;
      }
    });
    c.t = tar;
 //   $('#col').html("x:"+mindist +"y:"+c.t.y);
  }
  
  function move() {
    var fric = c.jump ? 0.95 :0.95; 
    c.xa = p.xa;
    if(!c.jump){
      c.xa = p.x < c.t.fly.x ? 0.15 : -0.15;
    }
    c.xs = (p.xs + c.xa)*fric;
    c.ys = (p.ys + w.gy)*0.97;
    
    c.x = p.x + c.xs;
    c.y = p.y + c.ys;
    c.y = c.y > w.wl + 10 ? w.wl+10 : c.y;
  }
  
  function jump() {
    if(c.jump == 0) {
      audio[4].play();
      c.ys = -7;
      c.jump = 80;
    } 
  }
  
  function shouldJump(){
    var x,y,dist;
    var js = -7;
    for(i=0;i<10;i++){
      if(Util.nearerThan(
        c.x+c.xs*i,
        c.y+js*i,
        c.t.fly.x+c.t.fly.xs*i,
        c.t.fly.y+c.t.fly.ys*i,
        10
      )) {
        jump();
      }
    }
  }
  
  function init(){
    c.x = 100;
    c.y = w.wl;
    c.xs = 0;
    c.ys = 0;
    c.xa = 0;
    c.ya = 0;
    c.jump = 0;
  }
  
  
}