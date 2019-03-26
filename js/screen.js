$(document).ready(function(){

  $("#screensize").html("window.screen.availHeight : "+window.screen.availHeight+" window.screen.availWidth : "+window.screen.availWidth +"</br> window.screen.height : "+ window.screen.height +" window.screen.width : "+window.screen.width+"</br> window.devicePixelRatio : "+ window.devicePixelRatio
);

  $( window ).resize(function() {
    $("#screensize").html("window.screen.availHeight : "+window.screen.availHeight+" window.screen.availWidth : "+window.screen.availWidth +"</br> window.screen.height : "+ window.screen.height +" window.screen.width : "+window.screen.width+"</br> window.devicePixelRatio : "+ window.devicePixelRatio);
  });

});
