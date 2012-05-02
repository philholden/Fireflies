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
    en.addIOEvent({id:req.id,k:req.e},req.f);
  });
  
  socket.on('start', function(req){
    en.start(req);
    loop();
  });
}