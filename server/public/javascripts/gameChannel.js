var socket = io.connect('http://localhost:3000');

socket.on('connect', function(data){
  var message = {
    channel: $('#channel').attr('value')
  }; 
  socket.json.emit('subscribe', message);
  console.log('send hello');
});

socket.on('message', function(req){
  var fId = en.frameId();
  en.addIOEvent({id:0,k:req.e},req.f);
  console.log(req);
});

$(document).ready(function(){
  
});


