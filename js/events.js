/*POPUP
events
timelineWidthmobile check.*/

var events = [];
var rootStartDate = moment('01/01/1989', 'DD/MM/YYYY');
var rootEndDate = moment('31/12/2019', 'DD/MM/YYYY');
var totalTime = rootEndDate.diff(rootStartDate, 'seconds');
var timelineWidth;
var noDurationEventSize = 30;
var eventPadding = 30;
var popupCallback;
var cellwidth = 8.333;
function isMobileF(x){
  //console.log("[event.js] mobile checker");
  //console.log("isMobile = "+x);
  if (x) { // If media query matches
    //document.body.style.backgroundColor = "yellow";
    //console.log("mobile");
    cellwidth = 16.666;
    //$('.timeline-containers').addClass("mobile");
    $('body').addClass("mobile");
    $('html').addClass("mobile");
  } else {
    //document.body.style.backgroundColor = "pink";
    //console.log("desktop");
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

    $('#timeline-scrollable').prepend(block);

    if (item.wikifetch) {
      wikifetching(item.wikifetch, index);
    }
    var containReadmore = item.readmore.match(/id='readmore'/g);
    if(item.readmore != null && item.readmore != "" &&!containReadmore){
      item.content += "<a target='_blank' id='readmore' href='"+item.readmore+"'>Read more</a>";
    }
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
  window.parent.postMessage({message: 'getResponsive'}, '*');

  var lastPopupIndex;
  $(window).resize(function(){
    //console.log("resized");
    //computeEvents();
    window.parent.postMessage({message: 'getResponsive'}, '*');
  });


  $(document).on('timeline-scroll', function(e) {
    var currentPopupIndex = -1;

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

  $('body').on('click', '#button-toggle-popup', function() {
    console.log("clicked on button toggle popup");
    $('#popup').toggleClass('reduced');
    window.parent.postMessage({message: 'isPopReduced', status: $('#popup').hasClass('reduced')}, '*');
  });
});
