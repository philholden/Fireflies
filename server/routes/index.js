
/*
 * GET home page.
 */

var config = require('./config')

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  res.redirect(config.entrySite);
};

exports.gameLobby = function(req, res){
  //res.render('index', { title: 'Express' });
  console.log(req.body);
  res.render('gameLobby.ejs', {body:JSON.stringify(req.body)});
  //res.redirect("/gameLobby.html");
};

exports.hello = function(req, res){
  res.render('gameLobby.html');
};