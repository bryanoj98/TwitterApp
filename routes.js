const express = require("express");
const path = require("path");
var tweet = require("./negocio.js");
var router = express.Router();

router.get("/", function(req, res) {
  console.log("routes /");
  res.sendFile(path.join(__dirname, "./views/Usuario_a.html"));
});
router.get("/Salir", function(req, res, next) {
  console.log("routes /Salir");
  req.session = null; //Eliminar Cookies
  res.redirect("/");  
});

  
//Seguidores Seguidos Nosiguen NoFollow deben recibir Oauth siempre
router.post("/Seguidores", function(req, res) {  
  console.log("Seguidores Servidor");

  tweet.Seguidores(req.body.Page, req.session.user_id, function(error, data) {
    if (error) console.error(error);
    else {
      res.json(data);
    }
  });
});
router.post("/Seguidos", function(req, res) {
  console.log(req.body.Page);

  tweet.Seguidos(req.body.Page, req.session.user_id, function(error, data) {
    if (error) console.error(error);
    else {
      res.json(data);
    }
  });
});
router.post("/Nosiguen", function(req, res) {
  console.log("Page: ",req.body.Page);
  console.log("Entrooo a router /Nosiguen");
  tweet.Nosiguen(req.body.Page, req.session.user_id,function(error, data) {
    if (error) console.error(error);
    else {
      res.json(data);
    }
  });
});
router.post("/NoFollow", function(req, res) {
  console.log("NoFollow");
  console.log(req.body.Id);
  tweet.Unfollower(req.session.user_id,req.body.Id, function(error, data) {
    if (error) console.error(error);
    else {
      var ls = data;
      console.log(ls);
      res.json(data);
    }
  });
});
module.exports=router;