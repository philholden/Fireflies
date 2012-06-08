
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
  //res.render('index', { title: 'Express' });
  console.log(req.body);
  if(req.body.fbid){
    req.body.json = "{}";
    req.body.displayname = "123456789101112";
    req.body.hue = Math.random()*360|0;
    db.addUser(req.body);
  }
  
  res.render('gameLobby.ejs', {body:JSON.stringify(req.body)});
  //res.redirect("/gameLobby.html");
};

exports.hello = function(req, res){
  res.render('gameLobby.html');
};

exports.editHue = function(req, res){
  db.editHue();
  res.json({});
};