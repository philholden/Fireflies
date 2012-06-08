
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
    var id = user.user.User ? user.user.User.id : 'null';
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