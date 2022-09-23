const Twitter = require('twitter')
const config = require('../config/config.js')
const co = require('co')
const T = new Twitter(config)

function ObjetoUsuario () {
  class Usuario {
    constructor (Id, Username, Aname, Imagen, followed_by) {
      this.Id = Id
      this.Username = Username
      this.Aname = Aname
      this.Imagen = Imagen
      this.followed_by = followed_by
    }
  }
  return new Usuario()
}
function ObjetoPagina (Anterior, Siguiente) {
  class Pagina {
    constructor (Anterior, Siguiente) {
      this.Anterior = Anterior
      this.Siguiente = Siguiente
    }
  }

  return new Pagina(Anterior, Siguiente)
}
function ObjetoRateLimit (limit_seguidos, limit_seguidores) {
  class RateLimit {
    constructor (limit_seguidos, limit_seguidores) {
      this.limite_seguidos = limit_seguidos
      this.limite_seguidores = limit_seguidores
    }
  }

  return new RateLimit(limit_seguidos, limit_seguidores)
}
function Rate_limit (callback) { // Nose si poner user_id, por que es limite es de la aplicacion
  console.log('Entro Rate')
  const params_rate = {
    resources: 'followers,friends',
    skip_status: 1
  }

  T.get('application/rate_limit_status', params_rate, (err, data, response) => {
    if (err) {
      return console.log(err)
    }
    const limit_seguidores = data.resources.followers['/followers/list'].remaining
    const limit_seguidos = data.resources.friends['/friends/list'].remaining
    console.log('valores Rate: ')
    const rate = ObjetoRateLimit(limit_seguidos, limit_seguidores)
    callback(null, rate)
  })
}

// QUIENES ME SIGUEN
function Seguidores (page, user_id, callback) {
  T.options.request_options.oauth.token = user_id.access_token_key
  T.options.request_options.oauth.token_secret = user_id.access_token_secret

  const params = {
    cursor: page,
    include_followed_by: 1,
    skip_status: 1
  }

  console.log('Loque hay en page')
  console.log(page)
  T.get('followers/list', params, (err, data, response) => {
    if (err) {
      return console.log(err)
    }
    console.log('Seguidores')

    console.log(data.users.length)
    const ListaUsers = []

    data.users.forEach(function (valor) {
      const user = new ObjetoUsuario()

      user.Id = valor.id_str
      user.Aname = valor.screen_name
      user.Username = valor.name
      user.Imagen = valor.profile_image_url_https
      user.followed_by = valor.followed_by
      ListaUsers.push(user)
    })

    const pagi = new ObjetoPagina(
      data.previous_cursor_str,
      data.next_cursor_str
    )

    ListaUsers.push(pagi)
    callback(null, ListaUsers)
  })
}
function Seguidos_n (page, user_id, callback, n_users) {
  // AQUIENES YO SIGO
  T.options.request_options.oauth.token = user_id.access_token_key
  T.options.request_options.oauth.token_secret = user_id.access_token_secret
  const params = {
    cursor: page,
    include_followed_by: 1,
    skip_status: 1,
    count: n_users
  }
  console.log('AQUIENES YO SIGO')

  console.log('Loque hay en page')
  console.log(page)
  T.get('friends/list', params, (err, data, response) => {
    if (err) {
      return console.log(err) // PONER RATE_LIMIT SI ERROR
    }
    console.log('Amigos == Yo sigo')

    console.log(data.users.length)
    const ListaUsers = []

    data.users.forEach(function (valor) {
      const user = new ObjetoUsuario()

      user.Id = valor.id_str
      user.Aname = valor.screen_name
      user.Username = valor.name
      user.Imagen = valor.profile_image_url_https
      user.followed_by = valor.followed_by
      ListaUsers.push(user)
    })

    const pagi = new ObjetoPagina(
      data.previous_cursor_str,
      data.next_cursor_str
    )
    console.log(pagi)
    ListaUsers.push(pagi)
    callback(err, ListaUsers)
  })
}
function thunkRate () {
  return function (callback) {
    Rate_limit(callback)
  }
}
function Seguidos (page, user_id, callback) {
  return Seguidos_n(page, user_id, callback, 20)
}
function thunkSeguidores (value, user_id) { // Modificar nombre value por pagina (mas descriptivo)
  return function (callback) {
    Seguidores(value, user_id, callback)
  }
}
function thunkSeguidos (page, user_id, n_users) { // Modificar nombre value por pagina (mas descriptivo)
  return function (callback) {
    Seguidos_n(page, user_id, callback, n_users)
  }
}

function Nosiguen (page, user_id, callback) { // Devolver tiempo de esperar de rate_limit?
  console.log('entra no me siguen /hay en page:')

  console.log(page)
  const tem_page = page
  T.options.request_options.oauth.token = user_id.access_token_key
  T.options.request_options.oauth.token_secret = user_id.access_token_secret
  co(function * () {
    let Antersigo = 1
    let Pagsigo = tem_page
    console.log('Pagsigo= ')

    console.log(Pagsigo)
    const ListaUsers = []
    let rate = yield thunkRate()
    console.log(rate)
    while (ListaUsers.length < 10 && rate.limite_seguidos > 1 && Pagsigo != 0) {
      const sigo = yield thunkSeguidos(Pagsigo, user_id, 200)
      Pagsigo = sigo[sigo.length - 1].Siguiente
      Antersigo = sigo[sigo.length - 1].Anterior

      sigo.forEach(function (valor) {
        if (valor.followed_by == false) ListaUsers.push(valor)
      })

      ListaUsers.forEach(function (valor) { // Solo para mostrar
        console.log(valor.Aname)
      })
      console.log(ListaUsers.length)
      rate = yield thunkRate()
      console.log(rate)
    }

    const pagi = new ObjetoPagina(
      Antersigo,
      Pagsigo
    )

    ListaUsers.push(pagi)
    callback(null, ListaUsers)
  })
}

function Unfollower (user_id, id, callback) {
  T.options.request_options.oauth.token = user_id.access_token_key
  T.options.request_options.oauth.token_secret = user_id.access_token_secret
  const params = {
    screen_name: id
  }
  console.log('LLego este id')

  console.log(id)
  // callback(null, id);
  // DESCOMENTAR SI O SI

  T.post('friendships/destroy', params, (err, response) => {
    // Eliminar
    if (err) {
      // return console.log(err[0].message);
      callback(err[0].message, 1)
    } else {
      console.log(response.screen_name + ' Eliminado')
      callback(null, response.screen_name)
    }
    // const respu = response.status;
    // if (respu != null) {
    //   // console.log(' Eliminado')
    //   console.log(id + " Eliminado");
    //   callback(null, id);
    // }
    // console.log(response.screen_name + " Eliminado");
  })
}
exports.ObjetoUsuario = ObjetoUsuario
exports.ObjetoPagina = ObjetoPagina
exports.Seguidos = Seguidos
exports.Seguidores = Seguidores
exports.Nosiguen = Nosiguen
exports.Unfollower = Unfollower
