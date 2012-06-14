var KeyCodec = {}

KeyCodec.keyEncode = function(k) {
  return en.me + k + en.frameId(); 
};

KeyCodec.keyDecode = function(c){
  var reg = /[a-zA-Z]/;
  var k = c.split(reg);
  
  return {
    k:c.match(reg)[0],
    id:k[0],
    f:k[1]
  };
}

KeyCodec.ioEncode= function(io){
  var i;
  var out = [];
  var h;
  for(i = 0;i<io.length;i++){
    if(k = io[i]){
      k.forEach(function(h){
        out.push(h.id + h.k + i);
      });
    }
  }
  return out.join(',');
}

KeyCodec.ioDecode= function(str){
  var en = str.split(',');
  var out = [];
  var c;
  en.forEach(function(d){
    c = KeyCodec.keyDecode(d);
    out[c.f] = out[c.f] ? out[c.f] : [];
    out[c.f].push(c);
  });
  return out;
}
