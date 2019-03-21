var events = [];
var rootStartDate = moment('01/01/1989', 'DD/MM/YYYY');
var rootEndDate = moment('31/12/2019', 'DD/MM/YYYY');
var totalTime = rootEndDate.diff(rootStartDate, 'seconds');
var timelineWidth;
var noDurationEventSize = 30;
var eventPadding = 30;
var popupCallback;
var cellwidth = 8.333;

function mobileCheck(x) {
  if (x.matches) { // If media query matches
    //document.body.style.backgroundColor = "yellow";
    console.log("mobile");
    cellwidth = 16.666;
  } else {
    //document.body.style.backgroundColor = "pink";
    console.log("desktop");
    cellwidth = 8.333;
  }
}

var x = window.matchMedia("(max-width: 992px)");
//@media only screen and (max-width: 992px)
mobileCheck(x) // Call listener function at run time
x.addListener(mobileCheck) // Attach listener function on state changes

function createPopup() {
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

function computeEvents() {
  timelineWidth = cellwidth * 31;
  /*if($('.timeline-cell').width() != null){
    var cellwidth = $('.timeline-cell').css("width");
    console.log("cellwidth  "+cellwidth);
  }*/
  $('.event-marker').remove();

  $.each(events, function(index, item) {
    //console.log(item.title);
    var startDate = moment(item.start, 'DD/MM/YYYY');
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

    $('#timeline-scrollable').prepend(block);

    if (item.wikifetch) {
      wikifetching(item.wikifetch, index);
    }
    //TODO : regex to improve, replace link with target blank
    if(item.content){
      var temp = item.content;
      //console.log(temp);
      var temp = temp.replace("<a", "<a target='_blank' ");
      //console.log(temp);
      item.content = temp;
    }
  });
}

function wikifetching(wiki, index){
  //console.log("wikifetch");
  wikitoload = "https://en.wikipedia.org/api/rest_v1/page/summary/"+wiki;
  //console.log(wikitoload);
  $.getJSON(wikitoload, function(data){
    events[index].content = data.extract_html;
    //console.log(data);
    //console.log(data.extract_html);
  });
}

function wikitest(){
  var url = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=wikitext&page=Timeline_of_Facebook&section=1';
  // $.getJSON(url, function(data){
  //   console.log(data);
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

function wikifetchingnew(wiki,index){
  // postData = function() {
 //   $.ajax({
 //      url : 'more_com.php' // La ressource ciblée
 //   });
 //   var settings = {
 //     "async": true,
 //     "crossDomain": true,
 //     "url": "http://10.0.10.18:8000/api/v1/documents/bac85005-5c6d-43b4-9d6a-6f6a89e20d52/status",
 //     "method": "GET",
 //     "headers": {
 //       "Content-Type": "application/x-www-form-urlencoded",
 //       "cache-control": "no-cache",
 //       "Postman-Token": "d6d93159-3e42-49ec-b06d-4bb884844dcf"
 //     }
 //   }
 //   $.ajax(settings).done(function (response) {
 //     //console.log(response);
 //   });
 // }


}

$(document).ready(function() {
  //console.log("[event.js]");
  loadEvents();
  createPopup();

  var lastPopupIndex;

  $(window).resize(computeEvents());

  $(document).on('timeline-scroll', function(e) {
    var currentPopupIndex = -1;

    $.each(events, function(index, item) {
      var startDate = moment(item.start, 'DD/MM/YYYY');




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
        $('#popup-date').html(moment(events[currentPopupIndex].start, 'DD/MM/YYYY').format('MMMM Do, YYYY'));


      }
    }
  });

  $('body').on('click', '#button-toggle-popup', function() {
    $('#popup').toggleClass('reduced');

    window.parent.postMessage({message: 'isPopReduced', status: $('#popup').hasClass('reduced')}, '*');
  });
});
