$(document).ready(function() {
  $(window).on('message', function(e) {
    if (e.originalEvent.data.message == 'receiveScrollPosition') {
      $('#container-timeline').scrollLeft(e.originalEvent.data.position);
    }

    if (e.originalEvent.data.message == 'receivePopupStatus') {
      if (e.originalEvent.data.status) $('#popup').addClass('reduced');
    }
  });

  $('#container-timeline').on('scroll', function() {
    window.parent.postMessage({message: 'setScrollPosition', position: $('#container-timeline').scrollLeft()}, '*');
  });

  window.parent.postMessage({message: 'getScrollPosition'}, '*');
  window.parent.postMessage({message: 'getPopupStatus'}, '*');
});
