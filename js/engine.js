function createEngine() {
  var en={};
  var frames = en.frames = [];
  var timer;
  en.startTime;
  en.head = 0; //the last clean frame
  en.end = 0; //the last frame that is required
  en.fps = 1;
  en.fpms = 1000/en.fps;
  
  //create a frame
  en.tick = function(){
    var pf = frames[en.head];
    var cf = {x:pf.x + 1};
    en.head++;
    frames[en.head] = cf;
  }
  
  //create any new frames that are needed
  en.refresh=function(){
    while(en.head<en.end){
      en.tick();
    }
  }
  
  en.start=function(){
    if(timer) {
      clearInterval(timer);
    }
    en.startTime = Date.now();
    frames[0] = {x:0};
    en.head = 0;
    timer = setInterval(function() {
      en.end = ((Date.now() - en.startTime)/en.fpms)|0;
      en.refresh();
      console.log(en.head+" "+en.end+" "+frames[en.head].x);
    },en.fpms);
  }
  
  return en;
}