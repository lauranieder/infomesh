var events = [];
var rootStartDate = moment('01/01/1989', 'DD/MM/YYYY');
var rootEndDate = moment('31/12/2019', 'DD/MM/YYYY');
var totalTime = rootEndDate.diff(rootStartDate, 'seconds');
var timelineWidth;
var noDurationEventSize = 30;
var eventPadding = 30;
var popupCallback;

function createPopup() {
  var popupContainer = $('<div id="popup-container"></div>');
  $('body').append(popupContainer);

  $('#popup-container').load('/template/popup.html');
}

function loadEvents() {
  jQuery.getJSON('./events.json', function(data) {
    events = data;

    computeEvents();
  });
}

function computeEvents() {
  timelineWidth = 8.33 * 31;

  $('.event-marker').remove();

  $.each(events, function(index, item) {
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
  });
}

function wikifetching(wiki, index){
  $.getJSON(wiki, function(data){
    events[index].content = data.extract_html;
  });
}

$(document).ready(function() {
  console.log("[event.js]");
  loadEvents();
  createPopup();

  var lastPopupIndex;

  $(window).resize(computeEvents());

  $(document).on('timeline-scroll', function(e) {
    var currentPopupIndex = -1;

    $.each(events, function(index, item) {
      var startDate = moment(item.start, 'DD/MM/YYYY')


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
      }
    }
  });

  $('body').on('click', '#button-toggle-popup', function() {
    $('#popup').toggleClass('reduced');

    window.parent.postMessage({message: 'isPopReduced', status: $('#popup').hasClass('reduced')}, '*');
  });
});
