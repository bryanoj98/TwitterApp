const express = require('express');
const app = express();
const path = require('path');
var body_parser = require('body-parser');
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname,'public')));
var tweet=require('./negocio.js');

app.get('/', function(req, res) { 
    // res.sendFile(path.join(__dirname, 'views/cliente_pruebas.html'));
    res.sendFile(path.join(__dirname, 'views/cliente.html'));
});
app.get("/public*", function(req, res) {
  res.sendFile(path.join(__dirname, '/public/'+req.params[0]));
  console.log(req.params[0]);
});
app.post("/Seguidores", function(req, res) {
  console.log("Seguidores Servidor");
  console.log(req.body.Page);  
  
  tweet.Seguidores(req.body.Page,function (error, data) {
    if (error) console.error (error);
    else
    {
      // var ls=data;
      // console.log(ls);
      res.json(data);
    }
  });
});
app.post("/Seguidos", function(req, res) {
  console.log(req.body.Page);  

  tweet.Seguidos(req.body.Page,function (error, data) {
    if (error) console.error (error);
    else
    {
      // var ls=data;
      // console.log(ls);
      res.json(data);
    }
  });
});
app.get("/Nosiguen", function(req, res) {
  tweet.Nosiguen(function (error, data) {
    if (error) console.error (error);
    else
    {
      // var ls=data;
      // console.log(ls);
      res.json(data);
    }
  });
});
app.post("/NoFollow",function(req, res) {
  console.log("NoFollow")
  console.log(req.body.Id);  
  tweet.Unfollower(req.body.Id,function (error, data) {
    if (error) console.error (error);
    else
    {
      var ls=data;
      console.log(ls);
      res.json(data);
    }
  });

});

app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});
