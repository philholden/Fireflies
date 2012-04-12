function game(){
  var ga = {};
  
  ga.firstFrame = function() {
    var cf = {x:0};
    return cf; 
  }
  
  /* the current frame (cf) is derived from the
   * previous frame (pf) based on incoming io events
   */ 
  ga.next = function(pf,cio) {
    var cf = {x:pf.x+1};
    return cf;
  }
  return ga;
}