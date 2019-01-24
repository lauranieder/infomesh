/*-------------DO NOT MODIFY-----------
You can add script under js/proposals/ and link it to a template. */
$(document).ready(function() {

  let scroll = 0;
  let scrollcenter = 0;
  let maxScroll;
  let startdate = moment("01/01/1989", 'D/M/YYYY');
  let enddate = moment("01/01/2019", 'D/M/YYYY');
  let yearwidth = 8.333; //screenwidth split in 12*/
  let offsetBefore = 6;
  let leftpad;
  let snapping = true;
  let pyear = 1989;
  let inc_year;
  var w;
  let json = $("#externalJson").attr("externalJson");
  if (json != "") {
    initwithJson();
  } else {
    initTimeline();
  }
  function initwithJson() {
    console.log("init with json");
    $.ajax({
      //url: "data/emojicons.json",
      url: json,
      type: "GET", //type:"GET"
      dataType: "JSON"
    })
      .done(function(data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          //console.log(data[i].Date);
          let titre = data[i].titre;
          let startdate = data[i].startdate;

          let journal = data[i].journal;
          let article = data[i].article;
          let link = data[i].link;
          let id = i;



          var customDiv = $("<div/>");
          customDiv.addClass("timeDot"); //.appendTo('body')
          customDiv.attr('idToLoad', i);

          if (startdate != null) {
            customDiv.attr('startDate', startdate);
          } else {
            customDiv.attr('startDate', '01/01/1989');
          }

          //$('#containertimeline-content').append(customDiv);

          var img_box = $("<div/>");
          img_box.addClass("image_box");
          var img_smallbox = $("<div/>");
          var img_info = $("<div/>");
          img_info.addClass("img_info");
          var div1 = $("<div/>");
          console.log(journal);
          let dateToDisplay = moment(startdate).format("MMMM YYYY");
          div1.html("SOURCE :" + journal + "</br>" + dateToDisplay + "</br>" + "<a href='" + link + "' target='_blank'>read more</a>");
          img_smallbox.addClass("fitimg");
          var img = $('<img>');
          img.attr('src', "img/" + titre);

          //

          //var year = d[i].year;
          let year = moment(startdate).year();

          //if (pyear != null) {
          if (year == pyear) {
            inc_year++;


          } else {
            inc_year = 0;
          }
          pyear = year;
          //} else {
          //inc_year = 0;
          //}
          console.log("yearToCalc " + year);
          w = $('body').width();
          var co_w = $('#container-images').width();
          var maxyears = 30;

          let ydif = year - 1989;

          //var offset = w / 3 * (year - 1989);
          //var offset = map_range(ydif, 0, maxyears, w / 2, co_w - (w / 2));

          var offset = getTargetLeft_img(startdate, co_w, inc_year);

          img_box.css("left", offset + "px");
          console.log(offset);


          //img.appendTo(".container-main");

          img_info.append(div1);
          img_smallbox.append(img_info);
          img_smallbox.append(img);

          img_box.append(img_smallbox);


          img.attr('inc', inc_year);

          $("#container-images").append(img_box);


        }
        initTimeline();
      });
  } //end of init

  function initTimeline() {
    let nbdot = $(".timeDot").length;
    //console.log("nb dot   "+ nbdot);
    if (nbdot == 1) {
      snapping = false;
    }

    $("#container-scrollable").on('scroll', finishedScrolling);
    var diffYears = enddate.diff(startdate, 'years');
    ////console.log(diffYears);
    let fullwidthtimeline = (yearwidth * (diffYears + offsetBefore * 2));
    let tlw_nopad = (yearwidth * (diffYears));
    ////console.log(fullwidthtimeline);
    ////console.log(tlw_nopad);
    $("#containertimeline").css("width", fullwidthtimeline + "%");


    let w1 = $("#container-scrollable").width(); //should equal device width
    let w2 = $("#containertimeline").width();


    let w3 = w2 / fullwidthtimeline * tlw_nopad;


    leftpad = (w2 - w3) / 2;

    ////console.log("w2   "+w2+"   w3  "+w3+ " leftpad "+leftpad);

    let width = $(window).width();
    maxScroll = w2;
    ////console.log("[init]w1 "+w1+" w2 "+w2+" width "+width+" maxScroll "+maxScroll);

    let startYear = 1989;

    $(".timeDot").each(function(event) {
      placeDot($(this));
    });

  }

  // add an appropriate event listener
  document.addEventListener("timeline-scroll", function(e) {
    ////console.log(e.detail.normal);
  });


  $("#container-scrollable").scroll(function(event) {
    scroll = $("#container-scrollable").scrollLeft();
    let realscroll = scroll;
    let normalized = map_range(realscroll, 0, maxScroll - (leftpad * 2), 0, 1);
    var enddatetest = moment("07/01/2019", 'D/M/YYYY');
    var diffSeconds = enddatetest.diff(startdate, 'seconds');
    let secondsToFind = map_range(normalized, 0, 1, 0, diffSeconds);
    let searchdate = moment("01/01/1989", 'D/M/YYYY');
    searchdate = moment(searchdate).add(secondsToFind, 'seconds');
    var year_floor = Math.floor(normalized * 30.0);
    var year_date = moment("01/01/" + parseInt(1989 + year_floor), "D/M/YYYY");
    var days = (normalized * 30.0 - year_floor) * 365.0;

    var res = moment(year_date).add(days, 'days').add(23, 'hours');

    var event = new CustomEvent("timeline-scroll", {
      detail: {
        "normal": normalized,
        "date": searchdate
      }
    });
    document.dispatchEvent(event);

  });







  //Calculate which is is the closest dot.
  function getClosestDot() {

    //console.log("[timeline.js] Get closest dot !");
    scrollcenter = $("#container-scrollable").scrollLeft() + ($("#container-scrollable").width() / 2);
    var positions = [];
    $('.timeDot').each(function() {
      positions.push({
        position: $(this).position().left,
        element: $(this)
      });
    });
    var getClosest = closest(positions, scrollcenter);
    var idToClosest = getClosest.attr("idToLoad");

    let dot = $(".timeDot[idToLoad='" + idToClosest + "']");
    return dot;
  }


  var finishedScrolling = debounce(function() {

    if (snapping) {

      let futureDot = getClosestDot();
      goToDot(futureDot);

    } else {

      var event = new CustomEvent("timeline-scrollstoped", {
        detail: {

        }
      });
      document.dispatchEvent(event);

    }
  }, 250);

  // finds the nearest position (from an array of objects) to the specified number
  function closest(array, number) {
    var num = 0;
    for (var i = array.length - 1; i >= 0; i--) {
      if (Math.abs(number - array[i].position) < Math.abs(number - array[num].position)) {
        num = i;
      }
    }
    return array[num].element;
  }



  /*Place the dot on the timeline*/
  function placeDot(dot) {
    ////console.log("Place dot");
    let targetLeft = getTargetLeft(dot.attr("startDate"));

    let endDate = dot.attr('endDate');
    /*If it's a duration rather than a dot*/
    if (typeof endDate !== typeof undefined && endDate !== false) {
      let targetLeftEnd = getTargetLeft(dot.attr("endDate"));

      let eventDuration = targetLeftEnd - targetLeft;
      dot.css('width', eventDuration + "vw");
      dot.addClass('stripped');
      dot.css('z-index', '1');
    } else {
      dot.css('z-index', '2');
    }
    dot.css('left', targetLeft + "vw");
  }



  function getTargetLeft(fulldate) {
    /*calculate offsetyears*/
    let offsetyear = 6;
    let yearwidth = 8.333; //screenwidth split in 12*/
    let date = moment(fulldate, 'D/M/YYYY');

    var diffHours = date.diff(startdate, 'hours');
    var diffYears = date.diff(startdate, 'years');
    let targetLeft = ((diffYears + offsetyear) * yearwidth);

    /*calculate offsetdays*/
    let startYear = moment().date(1).month(0).year(date.year()).format('DD/MM/YYYY');
    let diffDays = date.diff(startYear, 'days');
    let targetLeftOffsetDays = yearwidth / 365 * diffDays;
    targetLeft = targetLeft + targetLeftOffsetDays;

    return targetLeft;
  }

  function getTargetLeft_img(fulldate, containerwidth, inc) {
    /*calculate offsetyears*/
    //let offsetyear = 6;
    let yearwidth = containerwidth / (30);
    //let yearwidth = 8.333; //screenwidth split in 12*/
    let date = moment(fulldate, 'D/M/YYYY');

    var diffHours = date.diff(startdate, 'hours');
    var diffYears = date.diff(startdate, 'years');
    let targetLeft = ((diffYears) * yearwidth);

    /*calculate offsetdays*/
    let startYear = moment().date(1).month(0).year(date.year()).format('DD/MM/YYYY');
    let diffDays = date.diff(startYear, 'days');
    //let targetLeftOffsetDays = yearwidth / 365 * diffDays;
    //targetLeft = targetLeft + targetLeftOffsetDays;
    targetLeft = targetLeft + (w / 4 * inc);

    return targetLeft;
  }

  /*function getTargetLeft_img(fulldate, containerwidth) {


    let yearwidth = containerwidth / (30);

    let date = moment(fulldate, 'D/M/YYYY');

    var diffHours = date.diff(startdate, 'hours');
    var diffYears = date.diff(startdate, 'years');
    let targetLeft = ((diffYears) * yearwidth);


    let startYear = moment().date(1).month(0).year(date.year()).format('DD/MM/YYYY');
    let diffDays = date.diff(startYear, 'days');
    let targetLeftOffsetDays = yearwidth / 365 * diffDays;
    targetLeft = targetLeft + targetLeftOffsetDays;

    return targetLeft;
  }*/

  function getDateFromScroll(normalizedscroll) {
    let startdate = moment("01/01/1989", 'D/M/YYYY');
    let endDate = moment("01/01/2019", 'D/M/YYYY');


    return
  }

  loadDotContent = function(id) {
    var event = new CustomEvent("timeline-loadDotContent", {
      detail: {
        "id": id
      }
    });
    document.dispatchEvent(event);
  }

  /*Align dot in the center of the timeline*/
  function goToDot(dot) {
    if (dot != null) {
      //console.log("DOT is ok");
    } else {
      //console.log("DOT is null");
    }
    //console.log(dot);
    $("#container-scrollable").off('scroll', finishedScrolling);
    //console.log("[timeline-action.js] got to dot ");
    let left = dot.position().left;
    let width = $(window).width() / 2;
    let offset = dot.width() / 2;
    //let centerTarget = (left+offset)-width;
    let centerTarget = left - width;
    let scrollDistance = 0;
    if (centerTarget > scroll) {
      scrollDistance = centerTarget - scroll;
    } else {
      scrollDistance = scroll - centerTarget;
    }

    $('#container-scrollable').animate({
      scrollLeft: centerTarget + "px"
    }, scrollDistance * 2, function() {

      ////console.log("[Finished scrolling animation] centerTarget "+centerTarget +"  scroll "+scroll);
      //console.log("[timeline-action.js] arrived to dot ");

      //$('#container-scrollable').css("scrollLeft",centerTarget);
      $('#container-scrollable').attr("scrollLeft", centerTarget);
      ////console.log($('#container-scrollable').attr("scrollLeft"));
      //$("#tl-fixed-description").html(text);
      $("#container-scrollable").on('scroll', finishedScrolling);

      ////console.log(idToClosest);
      let idLoaded = $("#idLoaded").attr("idLoaded");
      var idToClosest = dot.attr("idToLoad");
      if (idLoaded != idToClosest) {

      }
      loadDotContent(idToClosest);

    });

  }

  $(document).on('click', '.timeDot', function() {
    //console.log("[timeline-action.js] ********************************");
    //console.log("[timeline-action.js] Click on dot");
    //console.log($(this));

    if (snapping) {
      goToDot($(this));
    } else {

    }
  });



  $(document).on('click', '#button_LeftArrow', function() {
    //console.log("[timeline.js] clicked on left arrow");
  });

  $(document).on('click', '#button_RightArrow', function() {
    //console.log("[timeline.js] clicked on right arrow");
  });




  /*Show info on hover*/
  $(document).on({
    mouseenter: function() {
      //stuff to do on mouse enter

      let left = $(this).css("left");
      $(".infobox").css("left", left);
      let text = $(this).attr("info");
      $(".infobox").html(text);
      $(".infobox").fadeIn(300, function() {
        // Animation complete
      });

    ////console.log(left);
    //$(".menuItem-choice").removeClass("hidden");
    },
    mouseleave: function() {
      //stuff to do on mouse leave
      ////console.log("leave");
      $(".infobox").fadeOut(300, function() {
        $(".infobox").html("");
      });

    //$(".menuItem-choice").addClass("hidden");
    }
  }, ".timeDot"); //pass the element as an argument to .on

  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  ;

});
