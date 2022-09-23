(function ($) {
  'use strict'

  // Preloader (if the #preloader div exists)
  $(window).on('load', function () {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function () {
        $(this).remove()
      })
    }
  })

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow')
    } else {
      $('.back-to-top').fadeOut('slow')
    }
  })
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo')
    return false
  })

  // Initiate the wowjs animation library
  new WOW().init()

  // Header scroll class
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled')
    } else {
      $('#header').removeClass('header-scrolled')
    }
  })

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled')
  }

  // Smooth scroll for the navigation and links with .scrollto classes
  $('.main-nav a, .mobile-nav a, .scrollto').on('click', function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      const target = $(this.hash)
      if (target.length) {
        let top_space = 0

        if ($('#header').length) {
          top_space = $('#header').outerHeight()

          if (!$('#header').hasClass('header-scrolled')) {
            top_space = top_space - 40
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo')

        if ($(this).parents('.main-nav, .mobile-nav').length) {
          $('.main-nav .active, .mobile-nav .active').removeClass('active')
          $(this).closest('li').addClass('active')
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active')
          $('.mobile-nav-toggle i').toggleClass('fa-times fa-bars')
          $('.mobile-nav-overly').fadeOut()
        }
        return false
      }
    }
  })

  // Navigation active state on scroll
  const nav_sections = $('section')
  const main_nav = $('.main-nav, .mobile-nav')
  const main_nav_height = $('#header').outerHeight()

  $(window).on('scroll', function () {
    const cur_pos = $(this).scrollTop()

    nav_sections.each(function () {
      const top = $(this).offset().top - main_nav_height
      const bottom = top + $(this).outerHeight()

      if (cur_pos >= top && cur_pos <= bottom) {
        main_nav.find('li').removeClass('active')
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active')
      }
    })
  })

  // jQuery counterUp (used in Whu Us section)
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  })

  // Porfolio isotope and filter
  $(window).on('load', function () {
    const portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item'
    })
    $('#portfolio-flters li').on('click', function () {
      $('#portfolio-flters li').removeClass('filter-active')
      $(this).addClass('filter-active')

      portfolioIsotope.isotope({ filter: $(this).data('filter') })
    })
  })

  // Testimonials carousel (uses the Owl Carousel library)
  $('.testimonials-carousel').owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    items: 1
  })

  // Clients carousel (uses the Owl Carousel library)
  $('.clients-carousel').owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: { 0: { items: 2 }, 768: { items: 4 }, 900: { items: 6 } }
  })
})(jQuery)
function Authenticate () {
  $.ajax({
    url: 'Authenticate',
    type: 'GET'
  })
    .done(function (data) {
      // alert(data);
      window.location.href = data
    })
    .fail(function (data, textStatus, xhr) {
      alert(xhr)
    })
}
// NUEVOOOOOOOOOO

function MakeMediaObject (url, User, A_name, id, seguidor) {
  let MediaObject = '<li class=' + 'media' +
    '><div class=' + '"media-left"' + '><img src=' + url +
    ' ></div><div class=' + '"media-body"' +
    '><p class=' + 'media-heading' + '>' + User + '</p>@' + A_name
  if (seguidor == 1) { MediaObject += ' <span class=' + '"badge badge-secondary"' + '>Te sigue</span>' }
  MediaObject += '</div>' +
    '<div class=' + '"media-right"' +
    '><button type=' + '"button"' + ' class=' + '"btn btn-danger"' + ' onclick=' + 'NoFollow(' + '"' + A_name + '"' + ')' + '>Unfollow</button></div></li>'

  return MediaObject
}

function MakePagObject (antes, despues, cod) {
  let PagObject = '<nav id=' + '"pagination"' +
    '><ul class=' + '"pagination"' +
    '><li class='
  if (antes == '0') { PagObject += '"page-item disabled"' } else { PagObject += '"page-item"' }
  PagObject += ' id=' + '"prev"' + ' onclick=' + 'Antes(' + cod + ',"' + antes + '"' + ')' +
    '><a class=' + '"page-link"' + '>Previous</a></li><li class=' + '"page-item"' + '><a class=' +
    '"page-link"' + ' id=' + '"opcion"' + '>...<p hidden>' + cod + '</p></a></li><li class=' + '"page-item"' +
    '><a class=' + '"page-link"' + ' id=' + '"next"' + ' onclick=' + 'Despues(' + cod + ',"' + despues + '"' + ')' + ' >Next<p hidden>' + despues + '</p></a></li></ul></nav>'
  return PagObject
}
window.onload = function () {
  Seguidores()
}
function NoFollow (i) {
  $.post('home/NoFollow',
    {
      Id: i.toString()
    },
    function (data, status) {
      // alert("Data: " + data );
      // $("#success-alert").slideDown();
      // $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
      //   $("#success-alert").slideUp(500);
      // });
      if (data != 1) {
        $('.col-lg-8 ul li div:contains(' + data + ')').parentsUntil('ul').fadeTo(500, 500).slideUp(500, function () {
          $('.col-lg-8 ul li div:contains(' + data + ')').parentsUntil('ul').slideUp(500)
        })
      }
    })
}
function Seguidores (page) {
  $('.active').attr('class', 'btn')
  $('#seguidores a').attr('class', 'btn active')
  $('.spinner-border').show()
  // faqlist.innerHTML = "";  //Borrar
  if (page == null) { page = '-1' }
  // alert(page)

  // $.post("Seguidores",
  $.post('home/Seguidores',
    {
      Page: page.toString()
    },
    function (data, status) {
      faqlist.innerHTML = ''
      for (let i = 0; i < data.length - 1; i++) {
        faqlist.innerHTML += MakeMediaObject(data[i].Imagen, data[i].Username, data[i].Aname, data[i].Id, data[i].followed_by)
      }
      faqlist.innerHTML += MakePagObject(data[data.length - 1].Anterior, data[data.length - 1].Siguiente, '1')
      $('.spinner-border').hide()
    })

  // $.ajax({
  //   url: "Seguidores",
  //   type: "GET"
  // }).done(function(data){
  //   faqlist.innerHTML="";
  //   for (let i = 0; i < data.length-1; i++) {
  //     faqlist.innerHTML+=MakeMediaObject(data[i].Imagen,data[i].Username,data[i].Aname,data[i].Id,1);
  //   }
  //   faqlist.innerHTML+=MakePagObject(data[data.length-1].Anterior,data[data.length-1].Siguiente,"1");

  // });
}
function Seguidos (page) {
  $('.active').attr('class', 'btn')
  $('#seguidos a').attr('class', 'btn active')
  $('.spinner-border').show()
  faqlist.innerHTML = ''
  if (page == null) { page = '-1' }
  // alert(page)
  $.post('home/Seguidos',
    {
      Page: page.toString()
    },
    function (data, status) {
      faqlist.innerHTML = ''
      for (let i = 0; i < data.length - 1; i++) {
        faqlist.innerHTML += MakeMediaObject(data[i].Imagen, data[i].Username, data[i].Aname, data[i].Id, data[i].followed_by)
      }
      faqlist.innerHTML += MakePagObject(data[data.length - 1].Anterior, data[data.length - 1].Siguiente, '2')
      $('.spinner-border').hide()
    })

  // $.ajax({
  //   url: "Seguidos",
  //   type: "GET"
  // }).done(function(data){
  //   faqlist.innerHTML="";
  //   for (let i = 0; i < data.length-1; i++) {
  //     faqlist.innerHTML+=MakeMediaObject(data[i].Imagen,data[i].Username,data[i].Aname,data[i].Id);
  //   }
  //   faqlist.innerHTML+=MakePagObject(data[data.length-1].Anterior,data[data.length-1].Siguiente,"2");

  // });
}
function Nsiguen (page) {
  $('.active').attr('class', 'btn')
  $('#nsiguen a').attr('class', 'btn active')
  $('.spinner-border').show()
  faqlist.innerHTML = ''
  if (page == null) { page = '-1' }
  // $.ajax({
  //   url: "home/Nosiguen",
  //   type: "GET"
  // }).done(function (data) {
  $.post('home/Nosiguen',
    {
      Page: page.toString()
    },
    function (data, status) {
      faqlist.innerHTML = ''
      for (let i = 0; i < data.length - 1; i++) {
        faqlist.innerHTML += MakeMediaObject(data[i].Imagen, data[i].Username, data[i].Aname, data[i].Id, data[i].followed_by)
      }
      faqlist.innerHTML += MakePagObject(data[data.length - 1].Anterior, data[data.length - 1].Siguiente, '3')
      $('.spinner-border').hide()
    })
}
function Despues (donde, NextPage) {
  if (donde == 1) { Seguidores(NextPage) } else if (donde == 2) { Seguidos(NextPage) } else if (donde == 3) { Nsiguen(NextPage) }
}
function Antes (donde, AfterPage) {
  if (donde == 1 && AfterPage != '0') { Seguidores(AfterPage) } else if (donde == 2 && AfterPage != '0') { Seguidos(AfterPage) } else if (donde == 3 && AfterPage != '0') { Nsiguen(AfterPage) }
}
// PONER UN BOTON DE CARGAR MAS O VERM AS PARA LA PETICIONES DE SIGUINTE PAGINA

// $(window).scroll(function () {
//   if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
//     var NextPage = $("#next p").text();
//     var donde = $("#opcion p").text();
//     _.debounce(function () {
//       alert("zapato");
//     }, 50, { leading: true, trailing: false })
//   }
// });
// $(document).on('scroll', _.debounce(function () {
//   alert("zapato");
// }, 5000, { leading: true, trailing: false }));

// $("footer").on('scroll', alert("zapato"));
