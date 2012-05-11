function Engine() {
  var en=this;
  var frames = en.frames = [];
  var io = en.io = [];
  var timer;
  
  en.startTime;
  en.head = 0; //the last clean frame
  en.end = 0; //the last frame that is required
  en.fps = 60;
  en.fpms = 1000/en.fps;
  en.world = new World();
  en.me = undefined; //number of this player
  en.numPlayers = undefined;
  en.go = false;
  en.render = 0;

  
  //create a frame
  en.tick = function(){
    
    var pf = frames[en.head];
    //en.head++;
    
    var cio = io[en.head] === undefined ? [] : io[en.head];
    var cf = new Frame(pf,cio,en.world);
    
    en.head++; //io taken from prev frame
    frames[en.head] = cf;
  }
  
  //create any new frames that are needed
  en.refresh=function(){
    while(en.head<en.end){
      en.tick();
    }
  }
  
  en.start=function(obj,gc){
 //   frames = en.frames = [];
    io = en.io = [];
    en.stop();
    en.render = 0;
    en.go = true;
    en.startTime = Date.now();
    console.log(obj);
    frames[0] = new Frame(obj,null,en.world);
    en.head = 0;
    en.me = obj.i;
    en.numPlayers = obj.n;
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
    en.go = false;
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