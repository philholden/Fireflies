function gameChannel(){
  console.log("load");
  var gc = this;
  var socket = gc.socket = io.connect('http://192.168.147.79:3000');
  
  socket.on('connect', function(data){
    var message = {
      channel: $('#channel').attr('value')
    }; 
    socket.json.emit('subscribe', message);
    console.log('send hello');
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
    en.start(req);
    loop();
  });
  
  function keyDecode(c){
    var sp = c.split(':');
    return {
      e:c.charAt(0),
      id:parseInt(sp[0].substr(1)),
      f:parseInt(sp[1])
    };
  }
}