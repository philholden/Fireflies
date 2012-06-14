function gameChannel(){
  console.log("load");
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
    location.reload();
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
    console.log(req);
    lobby.update(req);
  });
  
  socket.on('gameover', function(req){
    console.log('gameover');
    en.stop();
  });
  
  gc.newUser = function(name) {
     socket.json.emit('newuser', {
       name: name,
       dbId: dbId
     }); 
  };
}