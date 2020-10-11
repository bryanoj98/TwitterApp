function MakeMediaObject(url,User,A_name,id,seguidor){
  var MediaObject="<li class="+"media"+
  "><a class ="+'"pull-left"'+"><img src="+url+" class="+'"align-self-center mr-3 img-rounded"'+
  "></a><div class="+'"media-body"'+
  "><h5 class="+"media-heading"+">"+User+"</h5>@"+A_name;
  if(seguidor==1)
    MediaObject+=" <span class="+'"badge badge-secondary"'+">Te sigue</span>";
  MediaObject+="</div>"+
  "<div class=" + '"media-right"'+
  "><button type="+'"button"'+" class="+'"btn btn-danger"'+" onclick=" + "NoFollow("+'"'+A_name+'"'+ ")"+">Unfollow</button></div></li>"

    return MediaObject;
}
function MakePagObject(antes,despues,cod){
  var PagObject="<nav id="+'"pagination"'+
  "><ul class="+'"pagination"'+
  "><li class=";
  if(antes=="0")
    PagObject+='"page-item disabled"'
  else
    PagObject+='"page-item"'
  PagObject+=" onclick=" + "Antes("+cod+',"'+antes+'"'+ ")"+
  "><a class="+'"page-link"'+">Previous</a></li><li class="+'"page-item"'+"><a class="+
   '"page-link"'+">...</a></li><li class="+'"page-item"'+
   "><a class="+'"page-link"'+" onclick=" + "Despues("+cod+',"'+despues+'"'+ ")"+" >Next</a></li></ul></nav>"
   return PagObject;
}
window.onload=function(){
  Seguidores();
}
function NoFollow(i){
  $.post("NoFollow",
  {
    Id: i.toString()
  },
  function(data, status){
    // alert("Data: " + data );
    $("#success-alert").slideDown();
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
      $("#success-alert").slideUp(500);
    });
  });

}
function Seguidores(page) {
  $("#seguidores").attr("class", "active");
  $("#seguidos").attr("class", "");
  $("#nsiguen").attr("class", "");
  if (page==null)
    page="-1";
    // alert(page)
    
  // $.post("Seguidores",
  $.post("home/Seguidores",
  {
    Page: page.toString()
  },
  function(data, status){
    dataList.innerHTML="";
    for (let i = 0; i < data.length-1; i++) {
      dataList.innerHTML+=MakeMediaObject(data[i].Imagen,data[i].Username,data[i].Aname,data[i].Id,1);
    }
    dataList.innerHTML+=MakePagObject(data[data.length-1].Anterior,data[data.length-1].Siguiente,"1");

  });

  // $.ajax({
  //   url: "Seguidores",
  //   type: "GET"
  // }).done(function(data){
  //   dataList.innerHTML="";
  //   for (let i = 0; i < data.length-1; i++) {
  //     dataList.innerHTML+=MakeMediaObject(data[i].Imagen,data[i].Username,data[i].Aname,data[i].Id,1);
  //   }
  //   dataList.innerHTML+=MakePagObject(data[data.length-1].Anterior,data[data.length-1].Siguiente,"1");

  // });
}
function Seguidos(page) {
  $("#seguidos").attr("class", "active");
  $("#seguidores").attr("class", "");
  $("#nsiguen").attr("class", "");
  if (page==null)
    page="-1";
    // alert(page)
  $.post("home/Seguidos",
  {
    Page: page.toString()
  },
  function(data, status){
    dataList.innerHTML="";
    for (let i = 0; i < data.length-1; i++) {
      dataList.innerHTML+=MakeMediaObject(data[i].Imagen,data[i].Username,data[i].Aname,data[i].Id);
    }
    dataList.innerHTML+=MakePagObject(data[data.length-1].Anterior,data[data.length-1].Siguiente,"2");

  });

  // $.ajax({
  //   url: "Seguidos",
  //   type: "GET"
  // }).done(function(data){
  //   dataList.innerHTML="";
  //   for (let i = 0; i < data.length-1; i++) {
  //     dataList.innerHTML+=MakeMediaObject(data[i].Imagen,data[i].Username,data[i].Aname,data[i].Id);
  //   }
  //   dataList.innerHTML+=MakePagObject(data[data.length-1].Anterior,data[data.length-1].Siguiente,"2");

  // });
}
function Nsiguen() {
  $("#seguidos").attr("class", "");
  $("#seguidores").attr("class", "");
  $("#nsiguen").attr("class", "active");
  $.ajax({
    url: "home/Nosiguen",
    type: "GET"
  }).done(function(data){
    dataList.innerHTML="";
    for (let i = 0; i < data.length-1; i++) {
      dataList.innerHTML+=MakeMediaObject(data[i].Imagen,data[i].Username,data[i].Aname,data[i].Id);
    }
    dataList.innerHTML+=MakePagObject(data[data.length-1].Anterior,data[data.length-1].Siguiente,"3");

  });
}
function Despues(donde,NextPage){
  if (donde==1)
    Seguidores(NextPage);
  else if (donde==2)
    Seguidos(NextPage);
  else if (donde==3)
    Nsiguen(NextPage);
}
function Antes(donde,AfterPage){
  if (donde==1 && AfterPage!="0")
    Seguidores(AfterPage);
  else if (donde==2 && AfterPage!="0")
    Seguidos();
  else if (donde==3 && AfterPage!="0")
    Nsiguen();
}
