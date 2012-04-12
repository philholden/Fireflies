function engine(ga) {
  var en={};
  var frames = en.frames = [];
  var io = en.io = [];
  var timer;
  en.startTime;
  en.head = 0; //the last clean frame
  en.end = 0; //the last frame that is required
  en.fps = 1;
  en.fpms = 1000/en.fps;
  
  //create a frame
  en.tick = function(){
    var pf = frames[en.head];
    //en.head++;
    var cio = io[en.head] === undefined ? [] : io[en.head];
    var cf = ga.next(pf,cio);
    en.head++; //io taken from prev frame
    frames[en.head] = cf;
  }
  
  //create any new frames that are needed
  en.refresh=function(){
    while(en.head<en.end){
      en.tick();
    }
  }
  
  en.start=function(){
    en.stop();
    en.startTime = Date.now();
    frames[0] = {x:0};
    en.head = 0;
    timer = setInterval(function() {
      en.end = ((Date.now() - en.startTime)/en.fpms)|0;
      en.refresh();
      console.log(en.head+" "+en.end+" "+frames[en.head].x);
    },en.fpms);
  }
  
  en.stop=function(){
    if(timer) {
      clearInterval(timer);
    }
  }
  
  /* e: event
   * frame: frame event happens on
   */
  en.addIOEvent = function(e,frame){
    io[frame] = io[frame] === undefined ? [] : io[frame];
    io[frame].push(e);
    en.head = en.head > frame ? frame : en.head;
  }
  
  return en;
}