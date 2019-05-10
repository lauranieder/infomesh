/*in iframe*/
$(document).ready(function() {
  console.log("[communication.js] loaded");
  $(window).on('message', function(e) {
    if (e.originalEvent.data.message == 'receiveScrollPosition') {
      //console.log("scrollleft");
      $('#container-timeline').scrollLeft(e.originalEvent.data.position);
    }

    if (e.originalEvent.data.message == 'receivePopupStatus') {
      if (e.originalEvent.data.status) $('#popup').addClass('reduced');
    }

    if (e.originalEvent.data.message == 'goright') {
      var left = $('#container-timeline').scrollLeft();
      var space = $('.timeline-cell').first().width();
      //$('#container-timeline').scrollLeft(left+space);
      //$('#container-timeline').animate({scrollLeft: left+space}, 400);
      //console.log(getClosestDot(true));
      var scrolltarget = getClosestDot(true);
      //console.log("scrolltarget " +scrolltarget);
      $('#container-timeline').animate({scrollLeft: scrolltarget}, scrollDist(scrolltarget,left));
    }

    if (e.originalEvent.data.message == 'goleft') {
      var left = $('#container-timeline').scrollLeft();

      var space = $('.timeline-cell').first().width();
      //$('#container-timeline').scrollLeft(left-space);
      //$('#container-timeline').animate({scrollLeft: left-space}, 400);
      //use distance instead of time
      //console.log(getClosestDot(false));
      var scrolltarget = getClosestDot(false);
      //console.log("scrolltarget "+scrolltarget);
      if(scrolltarget != null){


        $('#container-timeline').animate({scrollLeft: scrolltarget}, scrollDist(scrolltarget,left));
      }
    }

    if (e.originalEvent.data.message == 'isMobile') {
      //$('#container-timeline').scrollLeft(e.originalEvent.data.position);
      //console.log("isMobile ");
      isMobileF(e.originalEvent.data.status);
    }

    if (e.originalEvent.data.message == 'isExtended') {
      //$('#container-timeline').scrollLeft(e.originalEvent.data.position);
      //console.log("isExtended "+ e.originalEvent.data.status);
      isExtendedF(e.originalEvent.data.status);
    }

    if (e.originalEvent.data.message == 'hideTimeline') {

      $('#container-timeline').addClass('hidden');
    }

    if (e.originalEvent.data.message == 'showTimeline') {
      //console.log("show");
      $('#container-timeline').removeClass('hidden');

    }


  });

  $('#container-timeline').on('scroll', function() {
    window.parent.postMessage({message: 'setScrollPosition', position: $('#container-timeline').scrollLeft()}, '*');
  });

  window.parent.postMessage({message: 'getScrollPosition'}, '*');
  window.parent.postMessage({message: 'getPopupStatus'}, '*');
  console.log("window.websiteMode " +window.websiteMode);
  window.parent.postMessage({message: 'getMode', mode: window.websiteMode}, '*');

  //window.parent.postMessage({ mode: window.websiteMode });

  //TO CONTINUE
  //Calculate which is is the closest dot.
  function getClosestDot(next) {
    //console.log("[timeline.js] Get closest dot !");
    scrollcenter = $("#container-timeline").scrollLeft() + $("#container-timeline").width() / 2;
    var positions = [];
    //console.log("scrollcenter "+scrollcenter);
    $(".event-marker").each(function() {
      positions.push({ position: $(this).position().left, element: $(this) });
    });
    //console.log(positions);
    var closestEl = closest(positions, scrollcenter,next);
    if(closestEl != null){
      return getClosest = AbsToRel(closest(positions, scrollcenter,next));
    }else{
      return null;
    }
  }


  // finds the nearest position (from an array of objects) to the specified number
  function closest(array, ref, next) {
    var num = -1;
    for (var i = array.length - 1; i >= 0; i--) {
      var pos = array[i].position;
      if(num != -1){
        var pos2 = array[num].position;
      }else {
        var pos2 = 0;
      }
      var dist = Math.abs(ref - pos);

      if (Math.abs(ref - pos) < Math.abs(ref - pos2) && dist > 2) {
        if(next == true){
          if(pos > ref){
          //console.log("NEEEXT");
            num = i;
          }
        }else{
          //console.log("LEEEFT");
          //console.log("dist  "+dist);
          if(pos < ref){
            //console.log("nono");
            num = i;
          }
        }
      }
    }
    //console.log("num  "+num);
    if(num != -1){
      //console.log("array[num].position  "+ array[num].position);
      return array[num].position;
    }else{
      return null
    }
  }
  function scrollDist(centerTarget,scroll){
    var scrollDistance = 0;
    if (centerTarget > scroll) {
      scrollDistance = centerTarget - scroll;
    } else {
      scrollDistance = scroll - centerTarget;
    }
    return scrollDistance *2;
  }
  /*Transform Absolute Position of event to Relative Distance to cursor*/
  function AbsToRel(left) {
    var width = $(window).width() / 2;
    var centerTarget = left - width;
    return centerTarget;
  }
});
