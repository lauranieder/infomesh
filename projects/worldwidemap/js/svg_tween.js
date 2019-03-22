var W = window.innerWidth;
var H = window.innerHeigh;

var current_year = 1990;
var min_year = 1989;
var max_year = 2016;
var last_timeline_request = current_year;

var t = 0;
var animate = true;

var interpolators = [];

var main_svg_holder = $("#world");
var next_svg_holder = $("#next_svg_holder");

var dataType = "access_population_"; //

main_svg_holder.load(
  "./frames/" + dataType + current_year + ".svg",
  function() {
    remapColors(main_svg_holder.children("svg"));
    setupMap();
  }
);

$("#info_change_data").click(function() {
  changeData();
});
document.addEventListener(
  "keypress",
  function(e) {
    if (e.key == "d") {
      if (current_year < max_year) current_year++;
    } else if (e.key == "a") {
      if (current_year > min_year) current_year--;
    }
    updateMapWithNewYear();
  }.bind(this)
);

function updateMapWithNewYear() {
  console.log(current_year);
  next_svg_holder.load(
    "./frames/" + dataType + current_year + ".svg",
    setup_tween,
    function() {
      remapColors(next_svg_holder.children("svg"));
    }
  );
}

function setup_tween() {
  t = 0;
  animate = true;
  interpolators = [];
  var index = 0;
  main_svg_holder
    .children()
    .eq(0)
    .children()
    .each(function() {
      var next_path = next_svg_holder
        .children()
        .eq(0)
        .children()
        .eq(index);

      var path_a = $(this).attr("d");
      var path_b = next_path.attr("d");

      interpolators.push(flubber.interpolate(path_a, path_b));
      index++;
    });
  requestAnimationFrame(draw);
}

function draw() {
  t += 0.05;
  var index = 0;
  main_svg_holder
    .children()
    .eq(0)
    .children()
    .each(function() {
      $(this).attr("d", interpolators[index](t));
      index++;
    });
  if (t < 1) {
    requestAnimationFrame(draw);
  } else {
    main_svg_holder.load(
      "./frames/" + dataType + current_year + ".svg",
      function() {
        remapColors(main_svg_holder.children("svg"));
        setupMap();
      }
    );
    animate = false;
  }
}

var last_t_change;
function timeline_change(year) {
  if (last_t_change) clearTimeout(last_t_change);
  last_t_change = setTimeout(function() {
    if (year == 1989) year = 1990;
    if (year > 2016) year = 2016;
    if (year !== last_timeline_request) {
      last_timeline_request = year;
      current_year = year;
    }
    console.log(year);
    updateMapWithNewYear();
  }, 500);
}

function setupMap() {
  addHoverEvents();
  resizeMap();
}

function changeData() {
  if (dataType == "access_population_") {
    dataType = "access_";
    $("#info_description").html(
      "Percentage of the population having acces to the internet"
    );
  } else {
    dataType = "access_population_";
    $("#info_description").html(
      "Total number of people having acces to the internet"
    );
  }
  console.log("bing");
  updateMapWithNewYear();
}

function addHoverEvents() {
  $("path").hover(
    function() {
      //var path = $("this").
      var path = $(this);
      var p_offset = path.offset();
      var p_width = path.width();
      var p_height = path.height();

      var p_centerX = p_offset.left + p_width / 2;
      var p_centerY = p_offset.top + p_height / 2;

      var t = $("#tooltip");
      t.css("left", p_centerX + "px");
      t.css("top", p_centerY + "px");
      t.css("visibility", "visible");

      select_all_country_paths(path, true);

      t.children(".country").html(path.attr("name"));
      t.children(".data").html(path.attr("value"));
    },
    function() {
      var path = $(this);
      select_all_country_paths(path, false);

      var t = $("#tooltip");
      t.css("visibility", "hidden");
    }
  );
}

function select_all_country_paths(path, add) {
  var country = path.attr("name");
  $("svg.cartogram")
    .children("path")
    .each(function() {
      if ($(this).attr("name") == country) {
        if (add) $(this).addClass("selected");
        else $(this).removeClass("selected");
      }
    });
}

function remapColors(svg) {
  svg.children("path").each(function() {
    var lum = chroma($(this).attr("fill")).get("hsl.l");
    var new_color = chroma("blue").set("hsl.l", lum);
    $(this).attr("fill", new_color.hex());
  });
}
function create_legend() {
  $("#legend")
    .children("div")
    .each(function(index) {
      $(this).css(
        "background-color",
        chroma("blue")
          .set("hsl.l", 1 - index / 11)
          .hex()
      );
      $(this).css(
        "color",
        chroma("blue")
          .set("hsl.l", index / 11)
          .hex()
      );
    });
}
create_legend();

function resizeMap() {
  W = window.innerWidth;
  H = window.innerHeight;
  var svg = $("svg.cartogram");

  var svgMarginLeft = 150;
  var svgMarginTop = 100;

  var scale = (W / 2000) * 1.9;
  var padding_left = svgMarginLeft * scale;
  var padding_top = svgMarginTop * scale;
  var svg_width = 2000 * scale;
  var svg_height = 1000 * scale;

  var offset_x = W / 2 - svg.width() / 2 + padding_left;
  var offset_y = H / 2 - svg.height() / 2 + padding_top;

  svg.css("transform", "scale(" + scale + ")");
  svg.css("left", offset_x + "px");
  svg.css("top", offset_y + "px");
}
window.onresize = resizeMap;
