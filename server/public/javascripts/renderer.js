function Renderer(wrapper,w) {
  var rd = this;
  var ctx;
  var bg = new Image();
 
  rd.init = function() {
    wrapper.append('<canvas id="screen" width="'+w.w+'" height="'+w.h+'"></canvas>');
    rd.canvas = document.getElementById('screen');
    rd.ctx = ctx = rd.canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w.w,w.h);
    bg.src = "images/fireflies-bg.png";
  }
  
  rd.drawFlies = function(en){
    //ctx.fillRect(0,0,w.w,w.h);
    ctx.drawImage(bg,0,0);
    var players = en.frames[en.end].players;
    players.forEach(function(player,i){
      rd.drawFly(i,players.length,en);
      rd.drawReflection(i,players.length,en);
    });
  };
  
  rd.drawFly = function(i,n,en) {
    ctx.beginPath();
    var c = en.frames[en.end].players[i].fly;
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
  }
  
  rd.drawReflection = function(i,n,en) {
    ctx.beginPath();
    var c = en.frames[en.end].players[i].fly;
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
  }
  
  rd.drawFish = function(en){
    var c = en.frames[en.end].fish;
    var w = 10;
    ctx.fillStyle = "red";
    ctx.fillRect(c.x - w/2,c.y - w/2,w,w);
  }
  
}