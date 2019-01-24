$(document).ready(function() {

  let pyear = 1989;
  let inc_year;
  let startdate = moment("01/01/1989", 'D/M/YYYY'); /*make global variable for stardate*/
  let enddate = moment("01/01/2019", 'D/M/YYYY');

  initwithJson();
  //placement des contenus images dans container-projects
  function initwithJson() {
    console.log("init with json");
    $.ajax({
      url: "data/newspapers_talk_final.json",
      type: "GET", //type:"GET"
      dataType: "JSON"
    })
      .done(function(data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let titre = data[i].titre;
          let startdate = data[i].startdate;
          let journal = data[i].journal;
          let article = data[i].article;
          let link = data[i].link;
          let id = i;

          var img_box = $("<div/>");
          img_box.addClass("image_box");
          var img_smallbox = $("<div/>");
          var img_info = $("<div/>");
          img_info.addClass("img_info");
          var div1 = $("<div/>");
          let dateToDisplay = moment(startdate).format("MMMM YYYY");
          div1.html("SOURCE :" + journal + "</br>" + dateToDisplay + "</br>" + "<a href='" + link + "' target='_blank'>read more</a>");
          img_smallbox.addClass("fitimg");
          var img = $('<img>');
          img.attr('src', "img/" + titre);
          let year = moment(startdate).year();
          if (year == pyear) {
            inc_year++;
          } else {
            inc_year = 0;
          }
          pyear = year;

          console.log("yearToCalc " + year);
          w = $('body').width();
          var co_w = $('#container-images').width();
          var maxyears = 30;
          let ydif = year - 1989;
          var offset = getImagePosition(startdate, co_w, inc_year);

          img_box.css("left", offset + "px");

          img_info.append(div1);
          img_smallbox.append(img_info);
          img_smallbox.append(img);
          img_box.append(img_smallbox);
          img.attr('inc', inc_year);
          $("#container-images").append(img_box);
        }
      });
  } //end of init

  function getImagePosition(fulldate, containerwidth, inc) {
    let yearwidth = containerwidth / (30);
    let date = moment(fulldate, 'D/M/YYYY');

    var diffHours = date.diff(startdate, 'hours'); /*global variable for startdate*/
    var diffYears = date.diff(startdate, 'years');
    let targetLeft = ((diffYears) * yearwidth);
    /*calculate offsetdays*/
    let startYear = moment().date(1).month(0).year(date.year()).format('DD/MM/YYYY');
    let diffDays = date.diff(startYear, 'days');
    targetLeft = targetLeft + (w / 4 * inc);
    return targetLeft;
  }

  document.addEventListener("timeline-scroll", function(e) {
    console.log("[diane action.js] -----callback timeline-scroll");
    let normal = e.detail.normal;
    let dotDate = moment(e.detail.date);
    let w = $("#container-images").width();
    let scrollTarget = map_range(normal, 0, 1, 0, w);
    document.getElementById('container-project').scrollLeft = scrollTarget;

  });

  $(document).on({
    mouseenter: function() {
      let child = $(this).children().children().first();
      console.log(child);
      child.fadeIn(100, function() {});
    },
    mouseleave: function() {
      let child = $(this).children().children().first();
      console.log(child);
      child.fadeOut(100, function() {});
    }
  }, ".image_box"); //pass the element as an argument to .on

  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

});
