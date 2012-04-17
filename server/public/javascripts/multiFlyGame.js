function game(){
  var ga = {};
  var w = new world();
  
  ga.frame = function(p,cio) {
    var c = this;
    c.players = [];
    if(!(p instanceof ga.frame)) {
      init();
      return;
    }
    
    c.players = [];
    p.players.forEach(function(obj){
      c.players.push(new player(obj,w,cio));
    });
    
    function init() {
      for(i = 0;i < p.n;i++){
        c.players.push(new player({n:p.n,i:i},w,cio));
      }
    }
  }
  

  /* the current frame (cf) is derived from the
   * previous frame (pf) based on incoming io events
   */ 
  ga.next = function(pf,cio) {
    var cf = new ga.frame(pf,cio);
    return cf;
  }
  return ga;
}