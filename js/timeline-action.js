/*NEW ONE*/
$(document).ready(function(){

  $("#container-timeline").scroll(function(event) {

      let scroll = $("#container-timeline").scrollLeft();
      let maxScroll = $("#timeline-scrollable").width();
      let normalized = map_range(scroll, 0,maxScroll, 0,1);

      //seulement ppour l'instant
      let contwidth = $("#container-timeline").width();
      //console.log("[scrolling] scroll "+scroll +"  normalized  "+normalized);

      let rightscroll = Math.round(maxScroll-contwidth);
      //console.log("[scrolling] scroll "+scroll + "  maxscroll "+maxScroll+" rightscroll "+rightscroll);

      let startdate = moment("01/01/1989", "D/M/YYYY");
      var enddatetest = moment("01/01/2019", "D/M/YYYY");
      var diffSeconds = enddatetest.diff(startdate, "seconds");
      let secondsToFind = map_range(normalized, 0, 1, 0, diffSeconds);
      let searchdate = moment("01/01/1989", "D/M/YYYY");
      searchdate = moment(searchdate).add(secondsToFind, "seconds");
      //console.log("searchdate "+searchdate);

      var event = new CustomEvent("timeline-scroll", {
        detail: {
          normal: normalized,
          date: searchdate
        }
      });
      // var event = new CustomEvent("timeline-scroll", {
      //   detail: {
      //     normal: normalized
      //   }
      // });
      document.dispatchEvent(event);

  });





  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

});
