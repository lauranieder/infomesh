var events = [];
var rootStartDate = moment('1989/01/01', 'YYYY/MM/DD');
var rootEndDate = moment('2019/12/31', 'YYYY/MM/DD');
var totalTime = rootEndDate.diff(rootStartDate, 'seconds');
var timelineWidth;

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
    var startDate = moment(item.start, 'YYYY/MM/DD');
    var endDate, className;

    if (item.end) {
      endDate = moment(item.end, 'YYYY/MM/DD');
      className = 'has-duration';
    } else {
      endDate = moment(startDate).add(12, 'd');
      className = 'no-duration';
    }

    var startTime = startDate.diff(rootStartDate, 'seconds');
    var endTime = endDate.diff(rootStartDate, 'seconds');

    //var startPosition = (startDate.year() - 1989) * 8.33;
    var startPosition = startTime * timelineWidth / totalTime;
    var endPosition = endTime * timelineWidth / totalTime;

    var width = endPosition - startPosition;

    var block = $('<div id="marker-' + index + '" class="event-marker ' + className + '" style="left:calc(50vw + '+startPosition+'vw);width:'+width+'vw;"></div>');

    $('#timeline-scrollable').append(block);
  });
}

$(document).ready(function() {
  loadEvents();
  createPopup();

  var lastPopupIndex;
  var eventPadding = 12;

  $(window).resize(computeEvents());

  $(document).on('timeline-scroll', function(e) {
    var currentPopupIndex = -1;

    $.each(events, function(index, item) {
      var startDate = moment(item.start, 'YYYY/MM/DD')

      //startDate.subtract(eventPadding, 'days');

      if (item.end) {
        var endDate = moment(item.end, 'YYYY/MM/DD');
      } else {
        var endDate = moment(startDate).add(12, 'd');
      }

      //endDate = endDate.add(eventPadding, 'days');

      if (e.detail.date.unix() >= startDate.unix() && e.detail.date.unix() <= endDate.unix()) {
        currentPopupIndex = index;
      }
    });

    if (lastPopupIndex != currentPopupIndex) {
      lastPopupIndex = currentPopupIndex;

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
