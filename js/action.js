$(document).ready(function(){


  $(document).on('click','.less', function() {
    $("#container-side").hide();
    $("#container-titre").show();
  });

  $(document).on('click','.more', function() {
    $("#container-titre").hide();
    $("#container-side").show();

  });

  $(document).on('click','.up', function() {
    console.log("up");
    let actualtop = $( "#wrapper-timelines" ).css("top");
    
    console.log(actualtop);
    $( "#wrapper-timelines" ).animate({
      top: "0"
    }, 300, function() {
      // Animation complete.
    });
  });
  $(document).on('click','.down', function() {
    console.log("down");
    $( "#wrapper-timelines" ).animate({
      top: "-100%"
    }, 300, function() {
      // Animation complete.
    });
  });

  function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

});
