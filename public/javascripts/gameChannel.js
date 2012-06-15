function gameChannel(){
  var gc = this;
  var socket = gc.socket = io.connect(window.location.origin);
  
  socket.on('connect', function(data){
    gc.newUser("");
/*    var message = {
      channel: "physics"
    }; 
    socket.json.emit('subscribe', message);
    console.log('send hello');*/
  });
  
  socket.on('disconnect', function(data){
    window.location="http://fireflies.kraya.net/";
  });
  
  socket.on('message', function(req){
    var fId = en.frameId();
    var rq = KeyCodec.keyDecode(req);
    en.addIOEvent({id:rq.id,k:rq.k},rq.f);
  });
  
  socket.on('start', function(req){
    if(en){
      en.start(req);
      loop();
    }
  });
  
  socket.on('lobby', function(req){
    lobby.update(req);
  });
  
  socket.on('gameover', function(req){
    en.stop();
  });
  
  gc.newUser = function(name) {
     socket.json.emit('newuser', {
       name: name,
       dbId: dbId
     }); 
  };
}