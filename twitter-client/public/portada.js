function Authenticate () {
  $.ajax({
    url: 'Authenticate',
    type: 'GET'
  })
    .done(function (data) {
      alert(data)
      window.location.href = data
    })
    .fail(function (data, textStatus, xhr) {
      alert(xhr)
    })
}
