$(document).ready(function() {
  $("text").addClass("hidden");
  $("#tooltip").removeClass("hidden");

  document.addEventListener("timeline-scroll", function(e) {
    var dotDate = moment(e.detail.date);
    var scrollYear = dotDate.year();
    var yearToShow = 5; //Before elements are juste set to opacity .2

    for (var year = 1989; year <= scrollYear; year++) {
      $('.year_' + year + ':parent').removeClass('hidden');
      //2010   //2009  /0.2 0,16   0.96  1.75
      var opacityFactor = (1 + ((year - scrollYear) / yearToShow)) * 0.8;
      if (opacityFactor < 0) opacityFactor = 0;
      //if (opacityFactor == 0.8) opacityFactor = 1;
      opacity = 0.2 + opacityFactor;
      opacityFactor = opacityFactor * opacityFactor * opacityFactor * opacityFactor;

      //opacity = linear(0.2 + opacityFactor,0.5);
      //var test = (1 + ((year - scrollYear) / yearToShow)) * 0.8;
      //var log = Math.log(test);  //0-1log1p(1)
      //console.log(" test "+opacityFactor);
      //console.log(" linear "+linear(opacityFactor,0.5));
      //var test = map_range((year - scrollYear) / yearToShow,0,1,1, 0.2);
      //console.log(test);


      //console.log("year "+year+ " scrollYear "+scrollYear+" opacityFactor "+opacityFactor+" opacity "+ opacity);

      $('.year_' + year + ':parent').attr('opacity', opacity);

      var diff = dotDate.diff(moment(year, "YYYY"));
      var delta_ms = moment.duration(diff).asMilliseconds();
      var max_delta = 1000.0 * 60 * 60 * 24 * 365 * 5;

      var min_pct = 0.10;
      var pct = Math.max(Math.min(delta_ms / max_delta, 1), 0);
      pct = 1.0 - pct;
      pct = Math.max(pct, min_pct);

      var maxSize = 3;
      //var fontRatio = linear(0.2 + opacityFactor,0.1);
      var fontSize = maxSize * pct * pct * pct * pct;
      fontSize = Math.max(0.8, fontSize)
      // if(fontSize<10){
      //   fontSize = 10;
      // }
      //var fontSize = map_range(fontRatio, 0.0,1.0,10.0,maxSize);
      $('.year_' + year + ':parent').attr("font-size", fontSize + "rem");
    }

    for (var year = scrollYear + 1; year <= 2019; year++) {
      $('.year_' + year + ':parent').addClass('hidden');
    }
  });
});

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function linear(k, p) {
  return 1.0 - Math.pow(1.0 - k, p);
}
