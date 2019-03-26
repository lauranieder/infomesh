var W = window.innerWidth;
var H = window.innerHeigh;

var current_year = 1990;
var min_year = 1990;
var max_year = 2016;
var last_timeline_request = current_year; //holder for an interval id

var t = 0; // time variable for the SVG tween animation
var animate = true;

var interpolators = [];
// holds the interpolator class of flubber
//one for every path/country

var main_svg_holder = $("#world");
var next_svg_holder = $("#next_svg_holder");
// they hold the current SVG world map and the next one to be tween with

var dataType = "access_population_"; //

var id_timer_autoshow;
var total_countries;
var last_selected_country;

// UI interactions and events //////////////////////////////////////////////////
$("#info_change_data").click(function() {
  changeData();
});

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
  updateMapWithNewYear();
}

// manual a&d control to test the year change
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

// Timeline scrolling (with buffer for multiple events)
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
    updateMapWithNewYear();
  }, 500);
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

function addHoverEvents() {
  $("path").hover(
    function() {
      clearInterval(id_timer_autoshow);
      deactivateCountrySelection(last_selected_country);
      activateCountrySelection($(this));
    },
    function() {
      deactivateCountrySelection($(this));
      autoShowCountries();
    }
  );
}

function activateCountrySelection(path) {
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
}

function deactivateCountrySelection(path) {
  select_all_country_paths(path, false);

  var t = $("#tooltip");
  t.css("visibility", "hidden");
}

function autoShowCountries() {
  total_countries = $("svg.cartogram").children("path").length;
  console.log(total_countries);
  id_timer_autoshow = setInterval(
    function() {
      if (last_selected_country)
        deactivateCountrySelection(last_selected_country);
      var choice = Math.floor(Math.random() * total_countries);
      var path = $("svg.cartogram")
        .children("path")
        .eq(choice);
      last_selected_country = path;
      activateCountrySelection(last_selected_country);
    }.bind(window),
    4000
  );
}

////////////////////////////////////////////////////////////////////////////////

//First loading of th first map
main_svg_holder.load(
  "./frames/" + dataType + current_year + ".svg",
  function() {
    remapColors(main_svg_holder.children("svg"));
    setupMap();
    autoShowCountries();
  }
);

function setupMap() {
  parseDataFormat();
  addHoverEvents();
  resizeMap();
}

// updates the map (and if it is the case tween it to another map) with
// whatever map correspond to the current_year
function updateMapWithNewYear() {
  next_svg_holder.load(
    "./frames/" + dataType + current_year + ".svg",
    function() {
      setup_tween();
      // remapColors(next_svg_holder.children("svg"));
      tween_colors(
        main_svg_holder.children("svg"),
        next_svg_holder.children("svg")
      );
    }
  );
}

/////// TWEEN ANIMATION FUNCTIONS //////////////////////////////////////////////

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

///// SETUP a LOADED MAP ///////////////////////////////////////////////////////

function remapColors(svg) {
  svg.children("path").each(function() {
    var lum = chroma($(this).attr("fill")).get("hsl.l");
    var new_color = chroma("blue").set("hsl.l", lum);
    $(this).attr("fill", new_color.hex());
  });
}

function tween_colors(svg1, svg2) {
  svg1.children("path").each(function(index) {
    var path1 = $(this);
    var path2 = svg2.children("path").eq(index);
    var lum = chroma(path2.attr("fill")).get("hsl.l");
    var new_color = chroma("blue").set("hsl.l", lum);
    $(this).css("fill", new_color.hex());
  });
}

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

//// UTILITY ///////////////////////////////////////////////////////////////////
function parseDataFormat() {
  main_svg_holder
    .children("svg")
    .children("path")
    .each(function(index) {
      var val = $(this).attr("value");

      if (val.charAt(val.length - 1) == "%") return;
      if (val.charAt(val.length - 1) == "m") return;

      if (dataType == "access_") {
        if (val == "") val = "0";
        if (val.charAt(0) == ".") val = "0" + val;
        if (val.length > 6) val = val.substring(0, val.length - 3);

        //Store max-high and max-low value to be displayed later in the legend
        if (index == 0) {
          window._minimum_val = parseFloat(val);
          window._maximum_val = parseFloat(val);
        }
        if (parseFloat(val) > window._maximum_val)
          window._maximum_val = parseFloat(val);
        if (parseFloat(val) < window._minimum_val)
          window._minimum_val = parseFloat(val);
        //Give attribute value
        val = val + "%";
        $(this).attr("value", val);
      }
      if (dataType == "access_population_") {
        if (val == "") val = "0";
        if (val.charAt(0) == ".") val = "0" + val;
        val = parseInt(val);
        val = val / 100 / 1000000;
        val = val.toFixed(2);
        //Store max-high and max-low value to be displayed later in the legend
        if (index == 0) {
          window._minimum_val = parseFloat(val);
          window._maximum_val = parseFloat(val);
        }
        if (parseFloat(val) > window._maximum_val)
          window._maximum_val = parseFloat(val);
        if (parseFloat(val) < window._minimum_val)
          window._minimum_val = parseFloat(val);
        //Give attribute value
        val = val + "m";
        $(this).attr("value", val);
      }
    });
  var suffix = "m";
  if (dataType == "access_") suffix = "%";

  $("#leg1").html(window._minimum_val + suffix);
  $("#leg11").html(window._maximum_val + suffix);
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
