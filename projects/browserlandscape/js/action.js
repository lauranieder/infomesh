var _cy = 1989;
var _py = 1989;

$(document).ready(function(){
  document.addEventListener("timeline-scroll", function(e) {
    console.log("[action.js] timeline scroll");
    let normal = moment(e.detail.normal);
    let dotDate = moment(e.detail.date);

    _cy = dotDate.year();

    if (_py != _cy) {
        var event = new CustomEvent('newyear', { detail: _cy });
        document.dispatchEvent(event);
    }

    _py = _cy;
   });
});
