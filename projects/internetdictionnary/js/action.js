$(document).ready(function() {
  $("text").addClass("hidden");
  $("#tooltip").removeClass("hidden");

  document.addEventListener("timeline-scroll", function(e) {
    //
    let normal = moment(e.detail.normal);
    let dotDate = moment(e.detail.date);

    // $('#container-main').html(dotDate.format("DD/MM/YYYY"));

    // year
    var scroll_year = dotDate.year();

    for (var year = 1989; year <= scroll_year; year++) {
      var selector = "." + year + ":parent";
      $("." + year + ":parent").removeClass("hidden");

      // diff temps
      var diff = dotDate.diff(moment(year, "YYYY"));
      var delta_ms = moment.duration(diff).asMilliseconds();
      // console.log(d);
      // console.log(d.asMilliseconds());
      var max_delta = 1000.0 * 60 * 60 * 24 * 365 * 5;
      // console.log(delta_ms)
      //console.log(max_delta)

      // console.log(delta_ms / max_delta);
      var min_pct = 0.10;
      var pct = Math.max(Math.min(delta_ms / max_delta, 1), 0); // clamp 0 - 1
      pct = 1.0 - pct;
      pct = Math.max(pct, min_pct);

      var maxSize = 90;
      ;var fontSize = maxSize * pct;

      $("." + year + ":parent").attr("font-size", fontSize);

    }

    for (var year = scroll_year + 1; year <= 2019; year++) {
      var selector = "." + year + ":parent";
      $("." + year + ":parent").addClass("hidden");
    }
  });


  document.addEventListener("timeline-loadDotContent", function(e) {
    let dotID = e.detail.id;


    console.log("[student-action.js] -----callback timeline-loadDotContent " + dotID);
    //console.log(e.detail.normal);


    let dot = $(".timeDot[idToLoad='" + dotID + "']");
    dot.attr("startdate");
    console.log("Loaded date : " + dot.attr("startdate"));

  });
});
