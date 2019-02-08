$(document).ready(function() {
  $("text").addClass("hidden");
  $("#tooltip").removeClass("hidden");

  document.addEventListener("timeline-scroll", function(e) {
    var dotDate = moment(e.detail.date);
    var scrollYear = dotDate.year();
    var yearToShow = 5; //Before elements are juste set to opacity .2

    for (var year = 1989; year <= scrollYear; year++) {
      $('.year_' + year + ':parent').removeClass('hidden');

      var opacityFactor = (1 + ((year - scrollYear) / yearToShow)) * 0.8;
      if (opacityFactor < 0) opacityFactor = 0;
      opacity = 0.2 + opacityFactor;

      $('.year_' + year + ':parent').attr('opacity', opacity);

      var diff = dotDate.diff(moment(year, "YYYY"));
      var delta_ms = moment.duration(diff).asMilliseconds();
      var max_delta = 1000.0 * 60 * 60 * 24 * 365 * 5;

      var min_pct = 0.10;
      var pct = Math.max(Math.min(delta_ms / max_delta, 1), 0);
      pct = 1.0 - pct;
      pct = Math.max(pct, min_pct);

      var maxSize = 90;
      var fontSize = maxSize * pct;

      $('.year_' + year + ':parent').attr("font-size", fontSize);
    }

    for (var year = scrollYear + 1; year <= 2019; year++) {
      $('.year_' + year + ':parent').addClass('hidden');
    }
  });
});
