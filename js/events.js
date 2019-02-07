$(document).ready(function() {
  var rootStartDate = moment('1989/01/01', 'YYYY/MM/DD');
  var rootEndDate = moment('2019/12/31', 'YYYY/MM/DD');

  var totalTime = rootEndDate.diff(rootStartDate, 'seconds');
  var timelineWidth = $('.timeline-cell').width() * 31;

  jQuery.getJSON('./events.json', function(data) {
    $.each(data, function(index, item) {
      var startDate = moment(item.start, 'YYYY/MM/DD');
      var endDate = moment(item.end, 'YYYY/MM/DD');

      var startTime = startDate.diff(rootStartDate, 'seconds');
      var endTime = endDate.diff(rootStartDate, 'seconds');

      var startPosition = startTime * timelineWidth / totalTime;
      var endPosition = endTime * timelineWidth / totalTime;

      var width = endPosition - startPosition;
      if (isNaN(width) || width < 10) width = 10;
      var block = $('<div style="border:1px solid red;position:absolute;top:0px;left:calc(50vw + '+startPosition+'px);width:'+width+'px;height:100%"></div>');

      $('#timeline-scrollable').append(block);
    });
  });
});
