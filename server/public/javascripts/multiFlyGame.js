function Frame(p,cio,w){
  var c = this;
  var w = new world();
 
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
  
  function init() {
    for(i = 0;i < p.n;i++){
      c.players.push(new Player({n:p.n,i:i},w,cio));
    }
  }
}