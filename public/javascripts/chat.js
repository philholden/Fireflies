var socket = io.connect('http://localhost:3000');
socket.on('connect', function(data){
  var message = {
    channel: $('#channel').attr('value')
  }; 
  socket.json.emit('subscribe', message);
  console.log('send hello');
});
socket.on('message', function(req){
  console.log(req);
  addMessage(req);
});
$(document).ready(function(){
  
  $('#name').bind('keyup',function(e){
    if((e.which === 13) && ($('#name').search(/\w/) !== -1)){
      $('#edit').focus();
    }
  });
  $('#edit').bind('keyup',function(e){
    var name = $('#name').attr('value');
    var text = $('#edit').attr('value');
    if(e.which === 13) {
      if (name.search(/\w/) === -1) {
        console.log('hello');
        addMessage({
          channel: $('#channel').attr('value'),
          user: 'Server', 
          text: 'Please enter a name'
        });
        return;
      }
      var message = {
        channel: $('#channel').attr('value'),
        user: name,
        text: text
      };
      $(this).attr('value','');
      socket.json.send(message);
    }
  });
});

function addMessage (message) {
  console.log(message);
  $('#messages').append(
    $('<div class="message">\n' +
      '  <div class="user">' + message.user +':</div>\n'+
      '  <div class="text">' + message.text +'</div>\n'+ 
      '</div>\n'+
      '<div class="clear"></div>'));
  $('#m_port').animate({
    scrollTop: $('#messages').height() - $('#m_port').height()
  },500);
}
