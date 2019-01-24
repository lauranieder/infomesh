$(document).ready(function() {
  $(window).on('message', function(e) {
    if (e.originalEvent.data.message == 'receiveScrollPosition') {
      $('#container-timeline').scrollLeft(e.originalEvent.data.position);
    }
  });

  $('#container-timeline').on('scroll', function() {
    window.parent.postMessage({message: 'setScollPosition', position: $('#container-timeline').scrollLeft()}, '*');
  });

  window.parent.postMessage({message: 'getScollPosition'}, '*');
});
