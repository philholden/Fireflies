function createIOArray(){
  var ioa;
  var frames=[];
  var head=0;
  
  ioa.addEvent = function(obj,frame){
    frames[frame] = frames[frame] === undefined ? [] : frames[frame];
    frames[frame].push(obj);
    head = head > frame ? frame : head;
  }
  
  return ioa;
}