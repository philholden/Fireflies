
/*
 * GET home page.
 */

var config = require('../config');
var db = require('../database');

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  res.redirect(config.entrySite);
};

exports.gameLobby = function(req, res){
  var res = res;
  console.log(req.body);
  var id = 'undefined';
  if(req.body.fbid){
    req.body.json = "{}";
    req.body.displayname = "123456789101112";
    req.body.hue = Math.random()*360|0;
    req.body.score = 100;
    db.addUser(req.body,response);
  } else {
    res.render('gameLobby.ejs', {id:'null'});
  }
  function response(user){
    //user = JSON.parse(user);
    var id = user.user ? user.user.User ? user.user.User.id : 'null' : 'null';
    res.render('gameLobby.ejs', {id:id});
  }
  //res.redirect("/gameLobby.html");
};

exports.hello = function(req, res){
  res.render('gameLobby.html');
};

exports.editHue = function(req, res){
  db.editHue();
  res.json({});
};

exports.addReplay = function(req, res){
  try{
    var json=JSON.stringify(req.body);
    var dbIds = getDbIds(req);
    //console.log("body");
    //console.log(dbIds);
    //console.log(req.body);
    if(dbIds.length){
      db.addReplay(dbIds,json);
    }
    res.json({});
  } catch (e){
    console.log('no encode');
    console.log(e);
  }
  function getDbIds(req){
    var uis;
    console.log("uis");console.log(req.body);
    if((uis = req.body) && (uis = uis.startInfo) && (uis = uis.userInfos)){
       console.log("uis");console.log(uis);
      console.log(uis.filter(getDbId));
      var dbIds = [];
      return uis.filter(getDbId).map(getDbId);
      function getDbId(ui){
        return parseInt(ui.dbId)?parseInt(ui.dbId):0;
      };
    }
    return [];
  }
}