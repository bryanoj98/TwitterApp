const express = require("express");
const app = express();
const path = require("path");
var body_parser = require("body-parser");
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
var request = require("request");

var tweet = require("./negocio_test.js");

const Twitter = require("twitter"); //BORRRRRAAR
const config = require("./config_test.js"); //BORRRRRAAR
const T = new Twitter(config); //BORRRRRAAR


// tweet.Nosiguen("borrar", function (error, data) {
//   if (error) console.error(error);
//   console.error(data);
// });




app.get("/", function(req, res) { 
  console.log("Principal Prueba");    
  // res.sendFile(path.join(__dirname, "./views/cliente.html"));
  res.sendFile(path.join(__dirname, "./views/Usuario_a.html"));


});
////////////////////////////////////////////////

app.get("/public*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/" + req.params[0]));
  console.log(req.params[0]);
});

//Seguidores Seguidos Nosiguen NoFollow deben recibir Oauth siempre
app.post("/home/Seguidores", function (req, res) {
  console.log("Seguidores Servidor");
  // console.log(req.body.Page);
  // console.log(req.session.user_id);  
 
  tweet.Seguidores(req.body.Page, "req.session.user_id", function (error, data) {
    if (error) console.error(error);
    else {
      // var ls=data;
      // console.log(ls);
      res.json(data);
    }
  });
});
app.post("/home/Seguidos", function (req, res) {
  console.log(req.body.Page);

  tweet.Seguidos(req.body.Page, "req.session.user_id", function (error, data) {
    if (error) console.error(error);
    else {
      // var ls=data;
      // console.log(ls);
      res.json(data);
    }
  });
});
app.post("/home/Nosiguen", function (req, res) {    
  console.log(req.body.Page);
  tweet.Nosiguen(req.body.Page,"req.session.user_id", function (error, data) {
    if (error) console.error(error);
    else {
      // var ls=data;
      // console.log(ls);
      res.json(data);
    }
  });
});
app.post("/home/NoFollow", function (req, res) {
  console.log("NoFollow");
  console.log(req.body.Id);
  tweet.Unfollower("req.session.user_id",req.body.Id, function (error, data) {
    if (error) console.error(error);
    else {
      var ls = data;
      console.log(ls);
      res.json(data);
    }
  });
});

// app.listen(process.env.PORT || 4000, function() {  //CAMBIAR 
app.listen(4000, function () { //SOLO PARA DEBUG

  console.log("Your node js server is running");
});
