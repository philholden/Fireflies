function Renderer(wrapper,w) {
  var rd = this;
  var ctx;
  var bg = new Image();
  var fish = new Image();
  var ref = 3;
  rd.w = w;
 
  rd.init = function() {
    wrapper.append('<canvas id="screen" width="'+w.w+'" height="'+w.h+'"></canvas>');
    rd.canvas = document.getElementById('screen');
    rd.ctx = ctx = rd.canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w.w,w.h);
    bg.src = "images/fireflies-bg3.jpg";
    fish.src = "images/fish.png"
  }
  
  rd.draw = function(en){
    ctx.drawImage(bg,0,0,rd.w.w,rd.w.wl,0,0,rd.w.w,rd.w.wl);
    rd.drawFlies(en);
    rd.drawFish(en);
    ctx.drawImage(bg,0,rd.w.wl,rd.w.w,rd.w.h-rd.w.wl,0,rd.w.wl,rd.w.w,rd.w.h-rd.w.wl);
    rd.drawFliesReflection(en);
    rd.drawFishReflection(en);
  }
  
  rd.drawFlies = function(en){
    var players = en.frames[en.end].players;
    //rd.drawHalo(en.me,players.length,en);
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
    var c = en.frames[en.end].players[i].fly;
    if(c.dead) {
      return;
    }
    ctx.lineWidth = i == en.me ? 2 : 1;
    ctx.beginPath();
    var hue = 360/n * i + 0;
    ctx.lineTo(c.x,c.y);
    for (j = 1;j < 10; j++) {
      ctx.strokeStyle = "hsla("+hue+",100%,50%,"+(1-j/10)+")";
      if((en.end - j)>0){
        c = en.frames[en.end - j].players[i].fly;
        ctx.lineTo(c.x,c.y);
        ctx.stroke();
      }
    }
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
  rd.drawReflection = function(i,n,en) {
    var c = en.frames[en.end].players[i].fly;
    if(c.dead) {
      return;
    }
    ctx.lineWidth = i == en.me ? 2 : 1;
    ctx.beginPath();
    var hue = 360/n * i + 0;
    ctx.lineTo(c.x,w.wl+(w.wl-c.y)/ref);
    for (j = 1;j < 10; j++) {
      ctx.strokeStyle = "hsla("+hue+",100%,50%,"+((1-j/10)/3)+")";
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