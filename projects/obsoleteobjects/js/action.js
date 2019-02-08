$(document).ready(function(){
  init();
  var sequencer;

  function init() {
    seq = Sequencer.init({
      folder: 'anoukiyo',
      baseName: 'final',
      ext: 'png',
      direction:"-x"}
    );
  }

  document.addEventListener("timeline-scroll", function(e) {
    console.log("[student-action.js] -----callback timeline-scroll");
    //
    let normal = moment(e.detail.normal);
    let dotDate = moment(e.detail.date);
    console.log(dotDate.format("DD/MM/YYYY"));

    let nextid = map_range(e.detail.normal,0,1,1,nbfile);

    Sequencer.showImagebyId(Math.round(nextid));

    //$('#container-main').html(dotDate.format("DD/MM/YYYY"));
   });



   document.addEventListener("timeline-loadDotContent", function(e) {
     var dotID = e.detail.id;


     console.log("[student-action.js] -----callback timeline-loadDotContent "+ dotID );
     //console.log(e.detail.normal);




     var dot = $(".timeDot[idToLoad='" + dotID + "']");
     dot.attr("startdate");
     console.log("Loaded date : "+dot.attr("startdate"));
     //$('#container-main').html(dotDate.format("DD/MM/YYYY"));

    });


    function map_range(value, low1, high1, low2, high2) {
      return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }
});
