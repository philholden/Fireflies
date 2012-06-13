function Frame(p,cio,w){
  var c = this;
  var deadTime = 120;
  c.players = [];
  
  if(!(p instanceof Frame)) {
    console.log(p);
    init();
    return;
  }
  
  c.players = [];
  p.players.forEach(function(obj){
    c.players.push(new Player(obj,w,cio));
  });
  c.fish = new Fish(p.fish,c.players,w);
  collisionFlies3(p.players);
  collisionFish();
  handelDeaths();
  
  function init() {
    for(i = 0;i < p.n;i++){
      c.players.push(new Player({
        n:p.n,
        i:i,
        userInfo: p.userInfos[i]
      },w,cio));
    }
    c.fish = new Fish({},c.players,w);
  }
  
  function collisionFlies()
  {
    var x,y,dist;
    var p = c.players;
    var n = p.length;
//    $('#col').html(n);
    for(var j=0;j<p.length;j++)
    {
      if(!p[j].fly.uc && !p[j].fly.dead && !p[j].fly.invulnerable) {
        for(var i=j+1;i<p.length;i++)
        {
          if (!p[i].fly.uc && !p[i].fly.dead && !p[i].fly.invulnerable)
          {
            x=Math.abs(p[i].fly.x-p[j].fly.x);
            y=Math.abs(p[i].fly.y-p[j].fly.y);
            dist= x * x + y * y;
 
            if (dist<169)
            {
              audio[0].play();
              if(p[i].fly.ys>p[j].fly.ys)
              {
                p[j].fly.uc=250;
              } else
              {
                p[i].fly.uc=250;
              }
            }
          }
        }
      }
    }
  }
  
  function collisionFlies2(p2)
  {
    var x,y,dist;
    var p = c.players;
    var pp = p2;
    var n = p.length;
//    $('#col').html(n);
    for(var j=0;j<p.length;j++)
    {
      if(!p[j].fly.uc && !p[j].fly.dead && !p[j].fly.invulnerable) {
        for(var i=j+1;i<p.length;i++)
        {
          if (!p[i].fly.uc && !p[i].fly.dead && !p[i].fly.invulnerable)
          { 
            x=Math.abs(p[i].fly.x-p[j].fly.x);
            if(p[i].fly.y - p[j].fly.y < 0 && pp[i].fly.y-pp[j].fly.y >= 0 && x < 16) {
              p[i].fly.uc=250;
              audio[0].play();
            } else if (p[j].fly.y - p[i].fly.y < 0 && pp[j].fly.y-pp[i].fly.y >= 0 && x < 16) {
              p[j].fly.uc=250;
              audio[0].play();
            }
          }
        }
      }
    }
  }
  
  function collisionFlies3(p2)
  {
    var x,y;
    var dist =15;
    var p = c.players;
    var pp = p2;
    var n = p.length;
//    $('#col').html(n);
    for(var j=0;j<p.length;j++)
    {
      if(!p[j].fly.uc && !p[j].fly.dead && !p[j].fly.invulnerable) {
        for(var i=j+1;i<p.length;i++)
        {
          if (!p[i].fly.uc && !p[i].fly.dead && !p[i].fly.invulnerable)
          { 
            if(xCross(p[i].fly,p[j].fly,pp[i].fly,pp[j].fly,dist)
              || hemi(p[i].fly,p[j].fly,pp[i].fly,pp[j].fly,dist)) {
                p[j].fly.uc=250;
            } else if (xCross(p[j].fly,p[i].fly,pp[j].fly,pp[i].fly,dist)
              || hemi(p[j].fly,p[i].fly,pp[j].fly,pp[i].fly,dist)) {
                p[i].fly.uc=250;
            }
          }
        }
      }
    }
  }
  
  //goes from being above to being below
  function xCross(f1,f2,pf1,pf2,dist) {
    //was above now below?
    if(!(pf1.y < pf2.y && f1.y > f2.y)) {
      return false;
    }
    var dy = pf1.y - f1.y;
    var dx = pf1.x - f1.x;
    var x = f1.x - f2.x;
    var y = f1.y - f2.y;
    if (dx === 0 && Math.abs(x) < dist) {
      return true; //going stright down
    }
    var m = dy / dx;
    var c =  y - m*x;
    if (m === 0) {
      return false;
    }
    var cx = -c/m;
    return Math.abs(cx)<dist;
  }
  
  //is inside the hemisphere above
  function hemi(f1,f2,pf1,pf2,dist) {
    //was above now above?
    if(!(pf1.y < pf2.y && f1.y < f2.y)) {
      return false;
    }
    var x = f1.x - f2.x;
    var y = f1.y - f2.y;
    return f1.ys > f2.ys && x*x+y*y<dist*dist;
  }
  
  function collisionFish() {
    var a = c.fish;
    var b = c.fish.t.fly;
    if(Util.nearerThan(a.x,a.y,b.x,b.y,10) && !b.dead) {
      b.dead = deadTime;
      b.lives -= 1;
      audio[0].play();
    }
  }
  
  //death is handeled after 1 sec so client can agree
  function handelDeaths() {
    c.players.forEach(function(pl){
      if(pl.fly.dead == deadTime - 60 && !pl.fly.lives){
        if(!en.replay) {
          gc.socket.emit('dies',{userid:pl.userInfo.userid});
          if (gameOver()) {
            console.log(en.replayData());
            rp = en.replayData();
            $.post("/add-replay",en.replayData());
          }
        } 
      }
    });
  }
  
  function gameOver() {
    var alive = 0;
    c.players.forEach(function(pl){
      if(pl.fly.lives){
        alive++;
      }
    });
    return alive == 1;
  }
  
}