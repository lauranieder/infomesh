$(document).ready(function(){

  $("#timeline-scrollable").scroll(function (event) {
      scroll = $("#container-scrollable").scrollLeft();
      //window.requestAnimationFrame(draw);
      let normalized = map_range(scroll, 0,maxScroll, 0,1);
      console.log("[scrolling] scroll "+scroll +"  normalized  "+normalized);
  });

  document.addEventListener("timeline-scrollable", function(e) {
    console.log(e);

    // let normal = moment(e.detail.normal);
    // let dotDate = moment(e.detail.date);
    //
    //
    // var scroll_year = dotDate.year();
    //
    // for (var year = 1989; year <= scroll_year; year++) {
    //   var selector = "." + year + ":parent";
    //   $("." + year + ":parent").removeClass("hidden");
    //
    //   // diff temps
    //   var diff = dotDate.diff(moment(year, "YYYY"));
    //   var delta_ms = moment.duration(diff).asMilliseconds();
    //   // console.log(d);
    //   // console.log(d.asMilliseconds());
    //   var max_delta = 1000.0 * 60 * 60 * 24 * 365 * 5;
    //   // console.log(delta_ms)
    //   //console.log(max_delta)
    //
    //   // console.log(delta_ms / max_delta);
    //   var min_pct = 0.10;
    //   var pct = Math.max(Math.min(delta_ms / max_delta, 1), 0); // clamp 0 - 1
    //   pct = 1.0 - pct;
    //   pct = Math.max(pct, min_pct);
    //
    //   var maxSize = 90;
    //   ;var fontSize = maxSize * pct;
    //
    //   $("." + year + ":parent").attr("font-size", fontSize);
    //
    // }
    //
    // for (var year = scroll_year + 1; year <= 2019; year++) {
    //   var selector = "." + year + ":parent";
    //   $("." + year + ":parent").addClass("hidden");
    // }
    //


  });

  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

});
