var vids = [1989, 1990, 1993, 2005];

var cy = 1989;
var py = 1989;

$(document).ready(function() {
  document.addEventListener("timeline-scroll", function(e) {
    // console.log("[student-action.js] -----callback timeline-scroll");
    //
    let normal = moment(e.detail.normal);
    let dotDate = moment(e.detail.date);
    // onsole.log(dotDate.format("DD/MM/YYYY"));

    var slide_year = dotDate.year();
    var video_src = "video/" + getVideo(slide_year) + ".mp4";
    cy = video_src;

    if (cy != py) {
      $("#vid").attr("src", video_src);
      console.log(video_src);
    }

    py = cy;

    //$('#container-main').html(dotDate.format("DD/MM/YYYY"));
  });

  function getVideo(year) {

    var res = vids[0];
    for (var i = 1; i < vids.length; i++) {
      var vid = vids[i];
      if (vid <= year) {
        res = vid;
      }
    }

    return res;
  }

  document.addEventListener("timeline-loadDotContent", function(e) {
    let dotID = e.detail.id;

    console.log(
      "[student-action.js] -----callback timeline-loadDotContent " +
      dotID);
    // console.log(e.detail.normal);

    let dot = $(".timeDot[idToLoad='" + dotID + "']");
    dot.attr("startdate");
    console.log("Loaded date : " + dot.attr("startdate"));

  });
});

/*¨

1989" class="timeDot  idToLoad="1" info="1982: First use and invention of
smileys by Scott Fahlman to clear communication misunderstandings over the net."
startDate="01/01/1989" endDate="31/12/1989"></div> <div id="1990"
class="timeDot" idToLoad="2" info="Diversification." startDate="01/01/1990"
endDate="31/12/1990" ></div> <div id="1993" class="timeDot" idToLoad="3"
info="Spreading of kaomojis to the Western World. Invented in 1986 and spread on
ASCII NET" startDate="01/01/1993" endDate="31/12/1993"></div> <div id="2005"
*/
