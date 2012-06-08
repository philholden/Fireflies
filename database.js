var config = require('./config');
var http = require('http');
var querystring = require('qs');

exports.editHue = function(id,hue) {
  send({User:{id:id,hue:hue}},'/users/edit_hue.json','POST');
};

exports.editDisplayname = function(id,displayname) {
  send({User:{id:id,displayname:displayname}},'/users/edit_displayname.json','POST');
};

exports.getUser = function(id,next) {
  send({},'/users/view/'+id +'.json','GET',next);
};

exports.addUser = function(user,next) {
  send(user,'/users/add2.json','POST',next);
};

exports.userDies = function(deadId,aliveIds) {
  send({User:{deadId:deadId},aliveIds:aliveIds},'/users/user_dies.json','POST');
};

//exports.getUser(1);
/*
exports.editDisplayname(1,"philholden");
exports.editHue(1,123);
exports.addUser({
  fbid: 5452,
  displayname: "",
  firstname: "Phil",
  lastname: "Holden",
  json: "{}"
},function(txt){console.log(txt)});
*/
function send(obj,path,method,next) {
  method = method === undefined ? 'POST' : method;
  var out = [];
  var post_data = querystring.stringify(obj);
  console.log(post_data);
  var options = {
    host: config.dbSite,
    port: 80,
    path: config.dbFrag + path,
    method: method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': post_data.length
    }
  }
  var req = http.request(options,function(cres){
    cres.setEncoding('utf8');
    var out = "";
    cres.on('data',function(chunk){
      out+=chunk;
    });
    cres.on('end',function(){
      if(next) {
        try {
          out = JSON.parse(out);
        } catch(e) {
          out = {error: out};
          console.log(out);
        };
        next(out);
      }
//      console.log(out);
    });
//    console.log('STATUS: '+cres.statusCode);
//    console.log('HEADERS: '+JSON.stringify(cres.headers));
  });
  req.write(post_data);
  req.end();
}

