$(document).ready(function() {
  document.addEventListener("timeline-scroll", function(e) {
    console.log("[student-action.js] -----callback timeline-scroll");
    //
    let normal = moment(e.detail.normal);
    let dotDate = moment(e.detail.date);
    console.log(dotDate.format("DD/MM/YYYY"));

  //$('#container-main').html(dotDate.format("DD/MM/YYYY"));
  });

});


$.getJSON("data.json", function(d) {
  console.log(d);

  // nom

  for (var i = 0; i < d.length; i++) {
    var img = $('<img>'); //Equivalent: $(document.createElement('img'))
    if (d[i].nom.length == 0) {
      continue;
    }
    img.attr('src', "img/" + d[i].nom);

    var year = d[i].year;
    var w = $('body').width();
    var offset = w / 3 * (year - 1989);

    img.css("left", offset + "px");
    console.log(w);

    img.appendTo(".container");
  }
});

$(document).ready(function() {
  $("img".nom).mouseover(function() {
    $("img".nom).css("background-color", "yellow");
  });
  $("img").mouseout(function() {
    $("img").css("background-color", "lightgray");
  });
});


/*$("body").scroll(function(d) {
  console.log(d);
  var p = $("img");
  var position = p.position();
  $("img").text("left: " + position.left + ", top: " + position.top);
}); */
