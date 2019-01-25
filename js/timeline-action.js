/*NEW ONE*/
$(document).ready(function(){
  console.log("loaded");

  //$("#timeline-scrollable" ).draggable({ axis: "x" });

  $("#container-timeline").scroll(function(event) {

      let scroll = $("#container-timeline").scrollLeft();
      let maxScroll = $("#timeline-scrollable").width();
      let normalized = map_range(scroll, 0,maxScroll, 0,1);

      //seulement ppour l'instant
      let contwidth = $("#container-timeline").width();

      let rightscroll = Math.round(maxScroll-contwidth);

      let startdate = moment("01/01/1989", "D/M/YYYY");
      var enddatetest = moment("01/01/2019", "D/M/YYYY");
      var diffSeconds = enddatetest.diff(startdate, "seconds");
      let secondsToFind = map_range(normalized, 0, 1, 0, diffSeconds);
      let searchdate = moment("01/01/1989", "D/M/YYYY");
      searchdate = moment(searchdate).add(secondsToFind, "seconds");

      var event = new CustomEvent("timeline-scroll", {
        detail: {
          normal: normalized,
          date: searchdate
        }
      });
      document.dispatchEvent(event);

  });


  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  //const slider = document.getElementById("container-timeline");
  const slider = $("#container-timeline");
  let startX;
  let scrollLeft;
  let isDown;

  slider.on('mousedown', function(e) {
    isDown = true;
    slider.addClass('active');
    startX = e.pageX - slider.offset().left;
    scrollLeft = slider.scrollLeft();
  });

  /* slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

  });*/

  slider.on('mouseleave', function(e) {
    isDown = false;
    slider.addClass('active');
  });

  /*slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });*/

  slider.on('mouseup', function(e) {
    isDown = false;
    slider.removeClass('active');
  });


  /*slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });*/
  slider.on('mousemove', function(e) {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offset().left;
    console.log(e);
    //const walk = (x - startX) * 3; //scroll-fast
    const walk = (x - startX);
    //slider.scrollLeft = scrollLeft - walk;
    slider.scrollLeft(scrollLeft - walk);
    console.log(walk);

  });

  /*slider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    //const walk = (x - startX) * 3; //scroll-fast
    const walk = (x - startX);
    slider.scrollLeft = scrollLeft - walk;
    console.log(walk);
  });*/

});
