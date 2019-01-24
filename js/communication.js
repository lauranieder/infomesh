$(document).ready(function() {
  $(window).on('message', function(e) {
    if (e.originalEvent.data.message == 'receiveScrollPosition') {
      window.scrollTo(e.originalEvent.data.position, 0);
    }
  });

  $(window).on('scroll', function() {
    window.parent.postMessage({message: 'setScollPosition', position: $(window).scrollLeft()}, '*');
  });

  window.parent.postMessage({message: 'getScollPosition'}, '*');
});
