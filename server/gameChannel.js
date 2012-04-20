exports.gameChannels = function() {
  var gcs = this;
  gcs.channels={};
  
  gcs.getChannel = function(id) {
    if (gcs.channels.id === undefined) {
      gcs.channels.id = new exports.gameChannel(id);
    }
    return gcs.channels.id;
  }
}

exports.gameChannel=function(id) {
  var gc = this;
  gc.id = id;
  gc.startNumber = 3;
  gc.firstClientTime = Date.now();
  gc.clients = [];
  gc.started = false;
  
  gc.addClient = function(client){
    gc.clients.push(client);
    if(gc.canStart()){
      gc.started = true;
      gc.clients.forEach(function(client,i) {
        client.json.emit('start',{n:gc.startNumber,i:i});
        console.log(gc.id);
        console.log(gc.clients.length);
      });
    }
  };
  
  gc.canStart = function(){
    return (gc.clients.length >= gc.startNumber) && !gc.started;
  }
}

