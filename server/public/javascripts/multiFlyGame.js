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
  c.fish = new Fish(p.fish,w);
  collision();
  
  function init() {
    for(i = 0;i < p.n;i++){
      c.players.push(new Player({n:p.n,i:i},w,cio));
    }
    c.fish = new Fish({},w);
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
        $('#col').html("dist:"+p[i].fly.uc);
        if ((p[i].fly.uc==0)&&(p[j].fly.uc==0))
        {
          x=Math.abs(p[i].fly.x-p[j].fly.x);
          y=Math.abs(p[i].fly.y-p[j].fly.y);
          dist= x * x + y * y;
 //         $('#col').html("dist:"+dist);
          if (dist<196)
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