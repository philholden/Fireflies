function game(){
  var ga = this;
  
  function frame() {
    this.x = 0.0;
    this.y = 0.0;
    this.xs = 0.0;
    this.ys = 0.0;
  }
  
  ga.firstFrame = function() {
    var cf = new frame();
    return cf; 
  }
  
  /* the current frame (cf) is derived from the
   * previous frame (pf) based on incoming io events
   */ 
  ga.next = function(pf,cio) {
    var cf = new frame();
    
    cf.xs = pf.xs;
    cf.ys = pf.ys;
    
    cio.forEach(function(io){
      cf.xs = [0,1,0,-1,0][io];
      cf.ys = [1,0,-1,0,0][io];
    });
    
    cf.x = pf.x + cf.xs * 2;
    cf.y = pf.y + cf.ys * 2;
    return cf;
  }
}