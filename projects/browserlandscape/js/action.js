var _cy = 1989;
var _py = 1989;

$(document).ready(function(){
  document.addEventListener("timeline-scroll", function(e) {
    console.log("[student-action.js] -----callback timeline-scroll");
    //
    let normal = moment(e.detail.normal);
    let dotDate = moment(e.detail.date);
    console.log(dotDate.format("DD/MM/YYYY"));

    _cy = dotDate.year();

    if (_py != _cy) {
        var event = new CustomEvent('newyear', { detail: _cy });
        document.dispatchEvent(event);
    } 

    _py = _cy;

    //$('#container-main').html(dotDate.format("DD/MM/YYYY"))

   });



   document.addEventListener("timeline-loadDotContent", function(e) {
     let dotID = e.detail.id;


     console.log("[student-action.js] -----callback timeline-loadDotContent "+ dotID );
     //console.log(e.detail.normal);


     let dot = $(".timeDot[idToLoad='" + dotID + "']");
     dot.attr("startdate");
     console.log("Loaded date : "+dot.attr("startdate"));

    });
});
