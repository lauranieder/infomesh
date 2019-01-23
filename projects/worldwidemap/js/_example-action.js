$(document).ready(function(){
  document.addEventListener("timeline-scroll", function(e) {
    console.log("[student-action.js] -----callback timeline-scroll");
    //
    //let normal = moment(e.detail.normal);
    let dotDate = moment(e.detail.date);
    console.log(dotDate.format("DD/MM/YYYY"));

    $('#container-main').html(dotDate.format("DD/MM/YYYY"));
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
