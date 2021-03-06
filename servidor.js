const express = require("express");
const app = express();
const path = require("path");
var body_parser = require("body-parser");
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
var request = require("request");
var cookieSession = require("cookie-session");
var router_login = require("./routes");
var Oauth1 = require("./Oauth1");

app.use(
  cookieSession({
    name: "session",
    keys: ["Rekey1", "Rekey2"]
  })
);

app.get("/", function (req, res) {
  console.log("pRINCIPAL");
  try {

    if (req.session.user_id != null) {
      console.log("/");
      console.log(req.session.user_id);

      console.log(req.session.user_id.oauth_token);
      res.redirect("/home");
    }
    else {
      console.log("ELSE /");

      res.sendFile(path.join(__dirname, "views/index.html"));
    }
  } catch (error) {
    res.sendFile(path.join(__dirname, "views/index.html"));
  }
  
});

app.get("/Authenticate", function (req, res) {

  var auto = Oauth1.getAuthorization("POST", "https://api.twitter.com/oauth/request_token", {});

  var options = {
    method: "POST",
    url: "https://api.twitter.com/oauth/request_token",
    headers: {
      Authorization: auto
    }
  };

  console.log(options);

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    if (response.statusCode == 200) {
      var formBuildID = response.body.split("&"); 
      console.log(formBuildID);
      console.log("https://api.twitter.com/oauth/authorize?" + formBuildID[0]);
      res.send("https://api.twitter.com/oauth/authorize?" + formBuildID[0]);
    } else {
      res.status(500).send({ error: "Something failed!" });
    }
  });
});
app.get("/login", function (req, res, next) { //paso3
  if (!req.query.oauth_token | !req.query.oauth_verifier) {
    console.log("Paso por /login/ if");
    res.redirect("/");
  } else {
    console.log("Paso por /login/ else");

    var AccessToken = {
      method: "POST",
      url:
        "https://api.twitter.com/oauth/access_token?oauth_token=" + req.query.oauth_token + "&oauth_verifier=" + req.query.oauth_verifier
    };

    request(AccessToken, function (error, response) {
      if (response.statusCode == 200) {

        var separadores = ["&", "="],
          textoseparado = response.body.split(
            new RegExp(separadores.join("|"), "g")
          );
        console.log(textoseparado);
        req.session.user_id = {
          access_token_key: textoseparado[1],
          access_token_secret: textoseparado[3]
        };
        res.redirect("/home");
      }
      else res.send(response);
    });
  }
});
app.get("/home", function (req, res, next) {
  console.log("MIDDLEWORD HOME");
  try {

    if (!req.session.user_id.access_token_key | !req.session.user_id.access_token_secret) {
      console.log("home to /");
      res.redirect("/");
    } else next();

  } catch (error) {
    res.redirect("/");
  }
});
app.use("/home", router_login); //PARA USAR ROUTER


app.get("/public*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/" + req.params[0]));
  console.log(req.params[0]);
});

app.listen(process.env.PORT || 4000, function () {
  console.log("Your node js server is running");
});
