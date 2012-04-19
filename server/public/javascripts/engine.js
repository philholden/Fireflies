function engine(fr) {
  var en=this;
  var frames = en.frames = [];
  var io = en.io = [];
  var timer;
  
  en.startTime;
  en.head = 0; //the last clean frame
  en.end = 0; //the last frame that is required
  en.fps = 20;
  en.fpms = 1000/en.fps;
  
  //create a frame
  en.tick = function(){
    
    var pf = frames[en.head];
    //en.head++;
    
    var cio = io[en.head] === undefined ? [] : io[en.head];
    var cf = new Frame(pf,cio);
    
    en.head++; //io taken from prev frame
    frames[en.head] = cf;
  }
  
  //create any new frames that are needed
  en.refresh=function(){
    while(en.head<en.end){
      en.tick();
    }
  }
  
  en.start=function(obj){
    en.stop();
    en.startTime = Date.now();
    frames[0] = new Frame(obj);
    en.head = 0;
    timer = setInterval(function() {
      en.end = en.frameId();
      en.refresh();
 //     console.log(en.head+" "+en.end+" ("+frames[en.head].x+", "+frames[en.head].y+")");
    },en.fpms);
  }
  
  en.stop=function(){
    if(timer) {
      clearInterval(timer);
    }
  }
  
  /* e: event
   * frame: frame number event happens on
   */
  en.addIOEvent = function(e,frameId){
    io[frameId] = io[frameId] === undefined ? [] : io[frameId];
    io[frameId].push(e);
    en.head = en.head > frameId ? frameId : en.head;
  }
  
  en.frameId = function() {
    return ((Date.now() - en.startTime)/en.fpms)|0;
  }
}