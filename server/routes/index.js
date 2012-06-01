
/*
 * GET home page.
 */

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  res.redirect("http://fireflies.kraya.net");
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