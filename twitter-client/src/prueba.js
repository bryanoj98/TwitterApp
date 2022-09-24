const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const tweet = require('./service/negocio.js')

const config = require('./config/config_test.js')

const userId = {
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
}

app.get('/', function (req, res) {
  console.log('Principal Prueba')
  // res.sendFile(path.join(__dirname, "./views/cliente.html"));
  res.sendFile(path.join(__dirname, './views/Usuario_a.html'))
})

app.get('/public*', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/' + req.params[0]))
  console.log(req.params[0])
})

// Seguidores Seguidos Nosiguen NoFollow deben recibir Oauth siempre
app.post('/home/Seguidores', function (req, res) {
  console.log('Seguidores Servidor')
  // console.log(req.body.Page);
  // console.log(req.session.user_id);

  tweet.Seguidores(req.body.Page, userId, function (error, data) {
    if (error) console.error(error)
    else {
      // var ls=data;
      // console.log(ls);
      res.json(data)
    }
  })
})
app.post('/home/Seguidos', function (req, res) {
  console.log(req.body.Page)

  tweet.Seguidos(req.body.Page, userId, function (error, data) {
    if (error) console.error(error)
    else {
      // var ls=data;
      // console.log(ls);
      res.json(data)
    }
  })
})
app.post('/home/Nosiguen', function (req, res) {
  console.log(req.body.Page)
  tweet.Nosiguen(req.body.Page, userId, function (error, data) {
    if (error) console.error(error)
    else {
      // var ls=data;
      // console.log(ls);
      res.json(data)
    }
  })
})
app.post('/home/NoFollow', function (req, res) {
  console.log('NoFollow')
  console.log(req.body.Id)
  tweet.Unfollower(userId, req.body.Id, function (error, data) {
    if (error) console.error(error)
    else {
      const ls = data
      console.log(ls)
      res.json(data)
    }
  })
})

// app.listen(process.env.PORT || 4000, function() {  //CAMBIAR
app.listen(4000, function () { // SOLO PARA DEBUG
  console.log('Your node js server is running')
})
