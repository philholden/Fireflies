function Frame(p,cio,w){
  var c = this;
 
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
  collision();
  
  function init() {
    for(i = 0;i < p.n;i++){
      c.players.push(new Player({n:p.n,i:i},w,cio));
    }
  }
  
  function collision()
  {
    var x,y,dist;
    var p = c.players;
    var n = p.length;
    for(var j=0;j<p.length;j++)
    {
      for(var i=j+1;i<p.length;i++)
      {
        if ((p[i].fly.uc==0)&&(p[j].fly.uc==0))
        {
          x=Math.abs(p[i].fly.x-p[j].fly.x);
          y=Math.abs(p[i].fly.y-p[j].fly.y);
          dist= x * x + y * y;
          if (dist<144)
          {
            if(p[i].fly.ys>p[j].fly.ys)
            {
              p[j].fly.uc=125;
            } else
            {
              p[i].fly.uc=125;
            }
          }
        }
      }
    }
  }
}