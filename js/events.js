/*POPUP
events
timelineWidthmobile check.*/

$(document).ready(function() {

  console.log("event.js loaded");

  //TO DEBUG doesn't fire on iphone/ipad
  $(document).on('click', '#popup', function() { //#button-toggle-popup
    console.log("clicked on button toggle popup");

    $('#popup').toggleClass('reduced');
    window.parent.postMessage({message: 'isPopReduced', status: $('#popup').hasClass('reduced')}, '*');
  });

  var events = []; //To contain timelines events
  var rootStartDate = moment('01/01/1989', 'DD/MM/YYYY');
  var rootEndDate = moment('31/12/2019', 'DD/MM/YYYY');
  var totalTime = rootEndDate.diff(rootStartDate, 'seconds');
  var timelineWidth;
  var noDurationEventSize = 30;
  var eventPadding = 30;
  var popupCallback;
  var cellwidth = 8.333; //cells have different size on mobile or not
  function isMobileF(x){
    if (x) { // If media query matches
      console.log("isMobile");
      cellwidth = 16.666;
      $('body').addClass("mobile");
      $('html').addClass("mobile");
    } else {
      //document.body.style.backgroundColor = "pink";
      //console.log("desktop")
      console.log("isnotMobile");;
      cellwidth = 8.333;
      $('body').removeClass("mobile");
      $('html').removeClass("mobile");
      //$('.timeline-containers').removeClass("mobile");
    }
    computeEvents();
  }
  function isExtendedF(status){
    if (status) { // If side panel is hidden
      $('body').addClass("extended");
      $('html').addClass("extended");
    } else {  //If side panel is shown
      $('body').removeClass("extended");
      $('html').removeClass("extended");
    }
    //computeEvents(); ???
  }

function createPopup() {
  console.log("create popup");
  var popupContainer = $('<div id="popup-container"></div>');
  $('body').append(popupContainer);
  $('#popup-container').load('/template/popup.html');
}

function loadEvents() {
  //wikitest();
  jQuery.getJSON('./events.json', function(data) {
    events = data;
    computeEvents();
  });
}

//combine with formatDate
function parseDate(date){
  var dateS = String(date);
  var full = dateS.match(/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/g);
  var month = dateS.match(/[0-9]{1,2}\/[0-9]{2,4}/g);
  var year = dateS.match(/[0-9]{2,4}/g);
  if(full){
    //console.log("regular date " + date);
    return date;
  }else if(month){
    //console.log("month date " + date);
    return "01/"+date;
  }else if(year){
    //console.log("year date " + date);
    return "01/01/"+date;
  }else{
    //console.log("CHECK DATA");
    //alert("CHECK DATA in "+date);
    return "01/01/1989";
  }
  // supposedly better regex that doesn't work https://www.sitepoint.com/jquery-basic-regex-selector-examples/  ^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.](19|20)dd$
}

function formatDate(date){
  var dateS = String(date);
  /*Dates can either match 1-2 digits*/
  var full = dateS.match(/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/g);
  var month = dateS.match(/[0-9]{1,2}\/[0-9]{2,4}/g);
  var year = dateS.match(/[0-9]{2,4}/g);
  if(full){
    //console.log("regular date " + date);
    return moment(date, 'DD/MM/YYYY').format('MMMM Do, YYYY');
  }else if(month){
    //console.log("month date " + date);
    return moment("01/"+date , 'DD/MM/YYYY').format('MMMM YYYY');
  }else if(year){
    //console.log("year date " + date);
    return moment("01/01/"+date, 'DD/MM/YYYY').format('YYYY');
  }else{
    //console.log("CHECK DATA");
    //alert("CHECK DATA in "+date);
    return moment("01/01/1989", 'DD/MM/YYYY').format('MMMM Do, YYYY');
  }
  // supposedly better regex that doesn't work https://www.sitepoint.com/jquery-basic-regex-selector-examples/  ^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.](19|20)dd$
}

function computeEvents() {
  console.log("computeEvents");
  //getResponsive message
  timelineWidth = cellwidth * 31;
  /*if($('.timeline-cell').width() != null){
    var cellwidth = $('.timeline-cell').css("width");
    //console.log("cellwidth  "+cellwidth);
  }*/
  $('.event-marker').remove();

  $.each(events, function(index, item) {

    var startDate = moment(parseDate(item.start), 'DD/MM/YYYY');
    var endDate, className;

    if (item.end) {
      endDate = moment(item.end, 'DD/MM/YYYY');
      className = 'has-duration';
    } else {
      endDate = moment(startDate).add(noDurationEventSize, 'd');
      className = 'no-duration';
    }

    var startTime = startDate.diff(rootStartDate, 'seconds');
    var endTime = endDate.diff(rootStartDate, 'seconds');

    var startPosition = startTime * timelineWidth / totalTime;
    var endPosition = endTime * timelineWidth / totalTime;
    var width = endPosition - startPosition;
    var block = $('<div id="marker-' + index + '" class="event-marker ' + className + '" style="left:calc(50vw + '+startPosition+'vw);width:'+width+'vw;"></div>');
    //console.log(block);
    $('#timeline-scrollable').prepend(block);

    if (item.wikifetch) {
      wikifetching(item.wikifetch, index);
    }
    /*TO PUT BACK*/
    /*console.log(item.readmore);

      var containReadmore = item.readmore.match(/id='readmore'/g);
      if(item.readmore != null && item.readmore != "" && !containReadmore){
        item.content += "<a target='_blank' id='readmore' href='"+item.readmore+"'>Read more</a>";
      }*/

    //TODO : regex to improve, replace link with target blank
    if(item.content){
      var temp = item.content;
      var temp = temp.replace("<a", "<a target='_blank' ");
      item.content = temp;
    }
  });
}

function wikifetching(wiki, index){
  wikitoload = "https://en.wikipedia.org/api/rest_v1/page/summary/"+wiki;
  $.getJSON(wikitoload, function(data){
    var content = data.extract_html;

    //Remove the stupid citation-needed-content span from wiki
    content = content.replace(/<\/?span[^>]*>/g, '');
    content += "<a target='_blank' href='https://en.wikipedia.org/wiki/"+wiki+"'>Read full article on Wikipédia</a>";
    events[index].content = content;
  });
}

function wikitest(){
  var url = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=wikitext&page=Timeline_of_Facebook&section=1';
  // $.getJSON(url, function(data){
  //   //console.log(data);
  // });
  //postData = function() {
     $.ajax({
       headers: {
        'Access-Control-Allow-Origin': 'https://en.wikipedia.org'
    },
     });
     var settings = {
       "async": true,
       "crossDomain": true,
       "url": "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=wikitext&page=Timeline_of_Facebook&section=1",
       "method": "GET",

     }
     $.ajax(settings).done(function (response) {
       //console.log(response);
     });
  // }

}


  loadEvents();
  createPopup();
  window.parent.postMessage({message: 'getResponsive'}, '*');

  var lastPopupIndex;
  $(window).resize(function(){
    //console.log("resized");
    //computeEvents();
    window.parent.postMessage({message: 'getResponsive'}, '*');
  });


  $(document).on('timeline-scroll', function(e) {
    var currentPopupIndex = -1;
    console.log(e);

    $.each(events, function(index, item) {
      var startDate = moment(parseDate(item.start), 'DD/MM/YYYY');

      if (item.end) {
        var endDate = moment(item.end, 'DD/MM/YYYY');
      } else {
        var endDate = moment(startDate).add(noDurationEventSize, 'd');
      }

      startDate.subtract(eventPadding, 'days');
      endDate = endDate.add(eventPadding, 'days');

      if (e.detail.date.unix() >= startDate.unix() && e.detail.date.unix() <= endDate.unix()) {
        currentPopupIndex = index;
      }
    });

    if (lastPopupIndex != currentPopupIndex) {
      lastPopupIndex = currentPopupIndex;

      if (popupCallback) {
        $('.event-marker').removeClass('active');
        $('#marker-' + currentPopupIndex).addClass('active');

        popupCallback(currentPopupIndex);
        return;
      }

      if (currentPopupIndex == -1) {
        $('.event-marker').removeClass('active');
        $('#popup').removeClass('opened');
      } else {
        $('.event-marker').removeClass('active');
        $('#marker-' + currentPopupIndex).addClass('active');
        $('#popup').addClass('opened');
        $('#popup-title').text(events[currentPopupIndex].title);
        $('#popup-content').html(events[currentPopupIndex].content);

        //$('#popup-date').html(moment(events[currentPopupIndex].start, 'DD/MM/YYYY').format('MMMM Do, YYYY'));
        //console.log(events[currentPopupIndex].title);
        $('#popup-date').html(formatDate(events[currentPopupIndex].start));


      }
    }
  });

  //////communication / was previously in communication.js
  //console.log("communication.js loaded");
  $(window).on('message', function(e) {
    if (e.originalEvent.data.message == 'receiveScrollPosition') {
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
      console.log("isExtended "+ e.originalEvent.data.status);
      isExtendedF(e.originalEvent.data.status);
    }

    if (e.originalEvent.data.message == 'hideTimeline') {

      $('#container-timeline').addClass('hidden');
    }

    if (e.originalEvent.data.message == 'showTimeline') {
      console.log("show");
      $('#container-timeline').removeClass('hidden');

    }


  });

  $('#container-timeline').on('scroll', function() {
    window.parent.postMessage({message: 'setScrollPosition', position: $('#container-timeline').scrollLeft()}, '*');
  });

  window.parent.postMessage({message: 'getScrollPosition'}, '*');
  window.parent.postMessage({message: 'getPopupStatus'}, '*');

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
