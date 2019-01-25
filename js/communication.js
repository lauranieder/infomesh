$(document).ready(function() {
  $(window).on('message', function(e) {
    if (e.originalEvent.data.message == 'receiveScrollPosition') {
      console.log("set scroll");
      $('#container-timeline').scrollLeft(e.originalEvent.data.position);
    }
  });

  $('#container-timeline').on('scroll', function() {
    console.log("on scroll");
    window.parent.postMessage({message: 'setScrollPosition', position: $('#container-timeline').scrollLeft()}, '*');
  });

  window.parent.postMessage({message: 'getScrollPosition'}, '*');
});
