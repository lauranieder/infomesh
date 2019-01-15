$(document).ready(function(){

  $(document).on('click','.less', function() {
    $("#container-side").hide();
    $("#container-titre").show();
  });

  $(document).on('click','.more', function() {
    $("#container-titre").hide();
    $("#container-side").show();

  });

  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

});
