const express = require("express");
const path = require("path");
var tweet = require("./negocio.js");
var router = express.Router();

router.get("/", function(req, res) {
    // req.session.user_id = {
    //   access_token_key: req.query.oauth_token,
    //   access_token_secret: req.query.oauth_token_secret
    // };
  // req.session = null; //Eliminar Cookies
  console.log("routes /");
  // console.log(req.session.user_id);
  res.sendFile(path.join(__dirname, "./views/Usuario_a.html"));
  // console.log(req.query.oauth_token);
  // FUNCION MODIFICAR T
});
router.get("/Salir", function(req, res, next) {
  console.log("routes /Salir");
  req.session = null; //Eliminar Cookies
  res.redirect("/");  
});

  
//Seguidores Seguidos Nosiguen NoFollow deben recibir Oauth siempre
router.post("/Seguidores", function(req, res) {  
  console.log("Seguidores Servidor");
  // console.log(req.body.Page);
  // console.log(req.session.user_id);  

  tweet.Seguidores(req.body.Page, req.session.user_id, function(error, data) {
    if (error) console.error(error);
    else {
      // var ls=data;
      // console.log(ls);
      res.json(data);
    }
  });
});
router.post("/Seguidos", function(req, res) {
  console.log(req.body.Page);

  tweet.Seguidos(req.body.Page, req.session.user_id, function(error, data) {
    if (error) console.error(error);
    else {
      // var ls=data;
      // console.log(ls);
      res.json(data);
    }
  });
});
router.get("/Nosiguen", function(req, res) {
  tweet.Nosiguen(req.session.user_id,function(error, data) {
    if (error) console.error(error);
    else {
      // var ls=data;
      // console.log(ls);
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