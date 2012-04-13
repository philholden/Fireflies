/* 
 * p: previous frames joystick
 * io: all the io events for this frame
 * pid: id for the player
 */

function joystick(p,io,pid) {
  var c = this;
  
  if(!p) {
    init();
    console.log(p.keys);
  }
  
  var controls = "lurd"; //left up right down
  
  c.keys = _.clone(p.keys);
  
  if(io){
    io.forEach(update);
  }
  
  /*
   * detect which key is pressed or released and set key state for
   * this key
   */
  
  function update(e) {
    if(e.id == pid) {
      console.log(e);
      var l = e.k.toLowerCase();
      if(controls.indexOf(l) != -1){
        console.log(l);
        var keyDown = controls.indexOf(e.k) == -1;
        console.log(keyDown); 
        c.keys[l] = keyDown;
        console.log(c.keys);
      } 
    }
  }
  
  function init(){
    p={};
    p.keys = {
      l:false,
      u:false,
      r:false,
      d:false
    };
  }
  
  c.state = function() {
    return {
      h: (c.keys.l === c.keys.r) ? 0 : c.keys.l ? -1 : 1,
      v: (c.keys.u === c.keys.d) ? 0 : c.keys.u ? -1 : 1
    };
  }
  /*
  c.horz = function(){
    return (c.keys.l === c.keys.r) ? 0 : c.keys.l ? -1 : 1;
  }
  
  c.vert = function(){
    return (c.keys.u === c.keys.d) ? 0 : c.keys.u ? -1 : 1;
  }*/
}
