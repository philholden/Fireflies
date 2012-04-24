function Renderer(wrapper,w) {
  var rd = this;
  var ctx,fctx;
  var bg = new Image();
  var fish = new Image();
  rd.w = w;
 
  rd.init = function() {
    wrapper.append('<canvas id="screen" width="'+w.w+'" height="'+w.h+'"></canvas>');
    wrapper.append('<canvas id="fishscreen" width="'+100+'" height="'+100+'"></canvas>');
    rd.canvas = document.getElementById('screen');
    rd.fcanvas = document.getElementById('fishscreen');
    rd.ctx = ctx = rd.canvas.getContext('2d');
    rd.fctx = fctx = rd.fcanvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w.w,w.h);
    bg.src = "images/fireflies-bg.png";
    fish.src = "images/fish.png"
  }
  
  rd.drawFlies = function(en){
    //ctx.fillRect(0,0,w.w,w.h);
    ctx.drawImage(bg,0,0);

    var players = en.frames[en.end].players;
    //rd.drawHalo(en.me,players.length,en);
    players.forEach(function(player,i){
      rd.drawFly(i,players.length,en);
      rd.drawReflection(i,players.length,en);
    });
    
  };
  
  rd.drawFly = function(i,n,en) {
    var c = en.frames[en.end].players[i].fly;
    if(c.dead) {
      return;
    }
    ctx.lineWidth = i == en.me ? 2 : 1;
    if(i = en.me){
      ctx.lineWidth = 2;
    }
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
    ctx.lineWidth = 1;
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
    if(i = en.me){
      ctx.lineWidth = 2;
    }
    ctx.beginPath();
    var hue = 360/n * i + 0;
    ctx.lineTo(c.x,w.wl+(w.wl-c.y)/2);
    for (j = 1;j < 10; j++) {
      ctx.strokeStyle = "hsla("+hue+",100%,50%,"+((1-j/10)/2)+")";
      if((en.end - j)>0){
        c = en.frames[en.end - j].players[i].fly;
        ctx.lineTo(c.x,w.wl+(w.wl-c.y)/2);
        ctx.stroke();
      }
    }
    ctx.lineWidth = 1;
  }
  
  rd.drawFish = function(en){
    var c = en.frames[en.end].fish;
    var w = 10;
    var scale = c.xs < 0 ? -1 : 1;
    var theta = (-45 - (c.jump) /360)*Math.PI*2*scale;
//    ctx.fillStyle = "red";
//    ctx.fillRect(c.x - w/2,c.y - w/2,w,w);

    ctx.save();
    ctx.translate(c.x,c.y);
    ctx.rotate(theta);ctx.scale(scale,1);
    ctx.drawImage(fish,-44,-8);
    ctx.restore();

  }
  
}