var Util = {};
Util.dist2 = function(x,y,x2,y2) {
  x = x2 - x;
  y = y2 - y;
  return x * x + y * y;
}

Util.dist = function(x,y,x2,y2) {
  x = x2 - x;
  y = y2 - y;
  return Math.sqrt(x * x + y * y);
}

Util.nearerThan = function(x,y,x2,y2,dist) {
  x = x2 - x;
  y = y2 - y;
  return x * x + y * y < dist * dist;
}