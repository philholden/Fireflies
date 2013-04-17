/**
 * A key press is encoded as U L R D, a key release as u l r d
 * each frame has a frame id and may have several direction events
 * seporated by commas. e.g. 1L1000  
 * id of the player who pressed the key 
 * @type {Object}
 */
var KeyCodec = {};

/**
 * Encodes a key event to a string
 * @param  {object} k 
 * @return {string}
 */
KeyCodec.keyEncode = function(k) {
  return en.me + k + en.frameId();
};

/**
 * Decodes string of formart: 1u1000
 * 1: player id
 * u: direction event (up released) 
 * 1000: frame number 
 * 
 * @param  {string} c encoded direction event
 * @return {object}   direction event object
 */
KeyCodec.keyDecode = function(c){
  var reg = /[a-zA-Z]/;
  var k = c.split(reg);

  return {
    k:c.match(reg)[0],
    id:k[0],
    f:k[1]
  };
};

/**
 * Takes in an array where the index represents the frame number
 * the value is also an array of key presses objects consisting of 
 * a direction code and an player id e.g.
 * 
 * io[1000] = [{k: 'u',id: 1}, {k: 'D', id: 2}]
 *
 * on frame 1000 player 1 released the up key 
 * and player 2 released the down key is encoded as
 *
 * ...,1u1000,2D1000,...
 * 
 * @param  {array} io array of frame containing key presses
 * @return {string}   encoded io events
 */
KeyCodec.ioEncode= function(io){
  var out = [];
  var i;
  var k;

  for (i = 0;i<io.length;i++){
    k = io[i];
    if (k){
      for (j = 0; j < k.length; j++) {
        out.push(k.id + K.k + i);
      }
    }
  }
  return out.join(',');
};

/**
 * Takes in a string consisting of comma separated key events 
 * 
 * ...,1u1000,2D1000,...
 * 
 * on frame 1000 player 1 released the up key 
 * and player 2 released the down key is decoded as
 * 
 * io[1000] = [{k: 'u',id: 1}, {k: 'D', id: 2}]
 * 
 * where the index represents the frame number
 * 
 * @param  {array} io array of frame containing key presses
 * @return {string}   encoded io events
 */
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
