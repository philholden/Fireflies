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
    var rq = keyDecode(req);
    en.addIOEvent({id:rq.id,k:rq.e},rq.f);
  });
  
  socket.on('start', function(req){
    if(en){
      en.start(req,gc);
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
       'name':name
     }); 
  };
  
  function keyDecode(c){
    var sp = c.split(':');
    return {
      e:c.charAt(0),
      id:parseInt(sp[0].substr(1)),
      f:parseInt(sp[1])
    };
  }
}