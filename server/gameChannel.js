exports.gameChannels = function() {
  var gcs = this;
  gcs.channels={};
  gcs.clientChannel={};
  gcs.n = 0;
  
  gcs.getChannel = function(id) {
//    if (gcs.channels[id] === undefined) {
//      gcs.channels[id] = new exports.gameChannel(id,gcs);
//    }
    return gcs.channels[id];
  };
  
  gcs.getNewChannel = function(n) {
    var id = gcs.n++;
    gcs.channels[id] = new exports.gameChannel(id,gcs,n);
    return gcs.channels[id];
  }
  
  gcs.getClientChannel = function(client){
    console.log(client.id);
    return gcs.clientChannel[client.id];
  };
}

exports.gameChannel = function(id,gcs,n) {
  var gc = this;
  gc.id = id;
  gc.startNumber = n;
  gc.firstClientTime = Date.now();
  gc.clients = [];
  gc.started = false;
  gc.gcs = gcs;
  
  gc.addClient = function(client){
    client.join(gc.id);
    gc.clients.push(client);
    console.log(client.id);
    gc.gcs.clientChannel[client.id] = gcs.getChannel(gc.id);
    console.log(gcs.clientChannel);
    if(gc.canStart()){
      setTimeout(start,100);
      function start(){
        gc.started = true;
        gc.clients.forEach(function(client,i) {
          client.json.emit('start',{n:gc.startNumber,i:i});
        });
      }
    }
  };
  
  gc.removeClient = function(client){
    var channel = gc.gcs.clientChannel[client.id];
    delete gc.gcs.clientChannel[client.id];
    gc.clients = gc.clients.filter(function(clnt){
      return clnt.id !== client.id;
    });
  }
  
  gc.canStart = function(){
    return (gc.clients.length >= gc.startNumber) && !gc.started;
  };
}

