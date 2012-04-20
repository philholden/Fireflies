function Renderer(wrapper,w) {
  var rd = this;
  var ctx;
 
  rd.init = function() {
    wrapper.append('<canvas id="screen" width="'+w.w+'" height="'+w.h+'"></canvas>');
    rd.canvas = document.getElementById('screen');
    rd.ctx = ctx = rd.canvas.getContext('2d');
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,w.w,w.h);
  }
  
  rd.drawFlies = function(en){
    ctx.fillRect(0,0,w.w,w.h);
    var players = en.frames[en.end].players;
    players.forEach(function(player,i){
      rd.drawFly(i,players.length,en);
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
  
}