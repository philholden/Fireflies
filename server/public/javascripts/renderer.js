function Renderer(wrapper,w) {
  var rd = this;
  var ctx;
  var bg = new Image();
  var fish = new Image();
  var halo = new Image();
  var lily = new Image();
  var fg = new Image();
  var ref = 3;
  rd.w = w;
 
  rd.init = function() {
    //wrapper.append('<canvas id="screen" width="'+w.w+'" height="'+w.h+'"></canvas>');
    rd.canvas = document.getElementById('screen');
    //$("#screen").click(function(){screenfull.request(rd.canvas)});
    rd.ctx = ctx = rd.canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w.w,w.h);
    bg.src = "images/background5.png";
    fish.src = "images/fish.png";
    halo.src = "images/halo.png";
//    fg.src = "images/foreground.png";
    lily.src = "images/lily.png"
  }
  
  rd.draw = function(en){
    ctx.drawImage(bg,0,0,rd.w.w,rd.w.wl,0,0,rd.w.w,rd.w.wl);
    rd.drawFlies(en);
    rd.drawFish(en);
    ctx.drawImage(bg,0,rd.w.wl,rd.w.w,rd.w.h-rd.w.wl,0,rd.w.wl,rd.w.w,rd.w.h-rd.w.wl);
    rd.drawFliesReflection(en);
    rd.drawFishReflection(en);
//    ctx.drawImage(fg,0,316);
    rd.fps();
  }
  
  rd.drawFlies = function(en){
    var players = en.frames[en.end].players;
    players.forEach(function(player,i){
      rd.drawFly(i,players.length,en);
    });
  };
  
  rd.drawFliesReflection = function(en){
    var players = en.frames[en.end].players;
    players.forEach(function(player,i){
      rd.drawReflection(i,players.length,en);
    });
  };
  
  rd.drawFly = function(i,n,en) {
    var pl = en.frames[en.end].players[i];
    var c = pl.fly;
    var length = i == en.me ? 15 : 10;
    //flash if invulnerable
    var opacity = c.invulnerable ? c.invulnerable/2%2|0 : 1;
    
    if(c.dead) {
      return;
    }
    
    ctx.beginPath();
    var hue = 360/n * i + 0;
    hue = pl.userInfo.hue;
    ctx.lineTo(c.x,c.y);
    if(i==en.me){
      //rd.drawHalo(en.me,players.length,en);
      ctx.drawImage(halo,c.x-8,c.y-8);
    }
    for (j = 1;j < length; j++) {
      
      ctx.strokeStyle = "hsla("+hue+",100%,50%,"+((1-j/length)*opacity)+")";
      if((en.end - j)>0){
        c = en.frames[en.end - j].players[i].fly;  
        ctx.lineTo(c.x,c.y);
        ctx.stroke();
      }
    }
//    ctx.fillText(pl.userInfo.score,c.x,c.y - 5);
    var minus = 2;
    if((en.end - minus)>0){
      c = en.frames[en.end - minus].players[i].fly;
    };
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'center';
    ctx.font = 'normal 9px Arial';
    ctx.fillText(pl.userInfo.name,c.x,c.y - 26);
    ctx.fillText(pl.fly.lives +" : " + (pl.userInfo.score|0),c.x,c.y - 15);
    ctx.lineWidth = i == en.me ? 1 : 1;
    //ctx.lineWidth = 1;
  }
/*  
  rd.drawHalo = function(i,n,en) {
    var c = en.frames[en.end].players[i].fly;
    if(c.dead) {
      return;
    }
    
    ctx.lineCap = 'round';
    ctx.lineWidth = 10;
    ctx.beginPath();
    
    var hue = 360/n * i + 0;
    for (j = 0;j < 10; j++) {
      ctx.strokeStyle = "rgba(255,255,255,0.06)";

      if((en.end - j)>0){
        c = en.frames[en.end - j].players[i].fly;
        ctx.lineTo(c.x,c.y);
        ctx.lineCap = 'round';
        ctx.lineWidth = (10-j)/2;
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(c.x,c.y);
      }
    }
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1;
  }
*/  
  rd.fps = function(){
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.textAlign = 'left';
    ctx.font = 'normal 9px Arial';
    var secs = Date.now() - en.startTime;
    ctx.fillText("fps: " + (en.render/(secs/1000)|0) ,4,10);
  };

  rd.drawReflection = function(i,n,en) {
    var pl = en.frames[en.end].players[i];
    var c = en.frames[en.end].players[i].fly;
    var opacity = c.invulnerable ? c.invulnerable/2%2|0 : 1;
    if(c.dead) {
      return;
    }
    ctx.lineWidth = i == en.me ? 2 : 1;
    ctx.beginPath();
    var hue = 360/n * i + 0;
    hue = pl.userInfo.hue;
    ctx.lineTo(c.x,w.wl+(w.wl-c.y)/ref);
    for (j = 1;j < 10; j++) {
      ctx.strokeStyle = "hsla("+hue+",100%,50%,"+(((1-j/10)/3)*opacity)+")";
      if((en.end - j)>0){
        c = en.frames[en.end - j].players[i].fly;
        ctx.lineTo(c.x,w.wl+(w.wl-c.y)/ref);
        ctx.stroke();
      }
    }
   // ctx.lineWidth = 1;
  }
  
  rd.drawFish = function(en){
    var c = en.frames[en.end].fish;
    var w = 10;
    var scale = c.xs < 0 ? -1 : 1;
    var theta = (-45 - (c.jump) /360)*Math.PI*2*scale;
    ctx.save();
//    ctx.rect(0,0,rd.w.w,rd.w.wl);
//    ctx.clip();
    ctx.translate(c.x,c.y);
    ctx.rotate(theta);ctx.scale(scale,1);
    ctx.drawImage(fish,-44,-8);
    ctx.restore();
  }
  
  rd.drawFishReflection = function(en){
    var c = en.frames[en.end].fish;
    var w = 10;
    var scale = c.xs < 0 ? -1 : 1;
    var theta = (-45 - (c.jump) /360)*Math.PI*2*scale;    
    ctx.save();
    ctx.rect(0,rd.w.wl,rd.w.w,rd.w.h-rd.w.wl);
    ctx.clip();
    ctx.translate(c.x,rd.w.wl+((rd.w.wl-c.y)));
    ctx.rotate(-theta);
    ctx.scale(scale,-1/ref);
    ctx.drawImage(fish,-44,-8);
    ctx.restore();
  }
  
}