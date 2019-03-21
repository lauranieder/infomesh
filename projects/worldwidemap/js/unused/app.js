// Controls
//const cartogram = Cartogram().valFormatter(n => n.toPrecision(6))(
const cartogram = Cartogram().valFormatter(n => "")(
  document.getElementById("world")
);

var ACCESS = 101;
var POPULATION = 102;
var ACCESS_POP = 103;
var INFRASTRUCTURE = 104;

var current_data = ACCESS_POP;
var current_year = 1990;

$(".year").html(current_year);
$("input").attr("value", current_year);

var world;
var ccData;
var color_show = false;
var last_timeline_request = current_year;

/////////////////////////////
var dataset1 = {};
d3.csv("./data/data1_access/internet_access.csv", function(data) {
  data.forEach(function(d) {
    dataset1[iso3to2(d["Country Code"])] = {};
    dataset1[iso3to2(d["Country Code"])].access = {};
    for (var i = 0; i < 57; i++) {
      dataset1[iso3to2(d["Country Code"])].access[1960 + i + ""] =
        d[1960 + i + ""];
    }
  });
  ////////
  d3.csv("./data/data2_pop/population.csv", function(data) {
    data.forEach(function(d) {
      dataset1[iso3to2(d["Country Code"])].pop = {};
      for (var i = 0; i < 57; i++) {
        dataset1[iso3to2(d["Country Code"])].pop[1960 + i + ""] =
          d[1960 + i + ""];
      }
      dataset1[iso3to2(d["Country Code"])].access_pop = {};
      for (var i = 0; i < 57; i++) {
        var val =
          parseFloat(
            dataset1[iso3to2(d["Country Code"])].access[1960 + i + ""]
          ) *
            parseFloat(d[1960 + i + ""]) +
          "";
        if (isNaN(val)) val = "0";
        dataset1[iso3to2(d["Country Code"])].access_pop[1960 + i + ""] = val;
      }
    });
    ////////
    d3.csv("./data/data4_webinfra/infrastructure.csv", function(data) {
      data.forEach(function(d) {
        dataset1[iso3to2(d["Country Code"])].infra = {};
        for (var i = 0; i < 57; i++) {
          dataset1[iso3to2(d["Country Code"])].infra[1960 + i + ""] =
            d[1960 + i + ""];
        }
      });
    });
    d3.json("./data/world_map_simpi.json", onMapLoad.bind(this));
  });
});
/////////////////////////////

function onMapLoad(error, _world) {
  //console.log(dataset1);

  if (error) throw error;

  world = _world;

  // exclude antarctica
  world.objects.countries.geometries.splice(
    world.objects.countries.geometries.findIndex(
      d => d.properties.ISO_A2 === "AQ"
    ),
    1
  );
  // cartogram.width(600);
  // cartogram.height(300);
  // cartogram.scale(10);
  //cartogram.projection(d3.geoMercator);

  ccData = cartogram
    .topoJson(world)
    .topoObjectName("countries")
    .value(function({ properties: { ISO_A2 } }) {
      return ccData[ISO_A2];
    })
    .color(function({ properties: { ISO_A2 } }) {
      return "rgb(0, 0, 0)";
    })
    .label(function({ properties: p }) {
      return `:${p.NAME}`;
      //return `${p.NAME} (${p.ISO_A2})`;
    });
  //.onClick(d => console.info(d));

  go_to_year(current_year);
}

///////////////////
///////////////////
function go_to_year(y) {
  genVals(y);
  render();
}
///////////////////

function genVals(year) {
  ////////////    PLACE DATA

  ccData = Object.assign(
    ...world.objects.countries.geometries.map(function({
      properties: { ISO_A2 }
    }) {
      var d = extract_country_data("" + ISO_A2);
      d = dataset_format(d, year);
      //console.log(d);
      return { [ISO_A2]: d };
    })
  );

  //console.log("hey");
  //console.log(ccData);
  $("svg.cartogram")
    .children()
    .each(function() {
      var iso2 = $(this).attr("ISO_A2");
      $(this).attr("coeff", ccData[iso2]);
      var val_spec;
      var name = $(this).attr("name");
      try {
        if (current_data == ACCESS)
          val_spec = dataset1[iso2].access["" + current_year];
        if (current_data == POPULATION)
          val_spec = dataset1[iso2].pop["" + current_year];
        if (current_data == INFRASTRUCTURE)
          val_spec = dataset1[iso2].infra["" + current_year];
        if (current_data == ACCESS_POP)
          val_spec = dataset1[iso2].access_pop["" + current_year];
      } catch (e) {
        //console.log(name + " - " + iso2);
        val_spec = "unknown";
      }

      $(this).attr("value", val_spec);
    });

  ////////////    COLORIZE MAP
  if (color_show) {
    color_by_infra();
  } else {
    color_by_data();
  }
}

function render() {
  if (current_data == ACCESS) cartogram.iterations(30);
  if (current_data == POPULATION) cartogram.iterations(60);
  if (current_data == INFRASTRUCTURE) cartogram.iterations(30);
  if (current_data == ACCESS_POP) cartogram.iterations(60);
}

///////////////////
var last_t_change;
function timeline_change(year) {
  if (last_t_change) clearTimeout(last_t_change);
  last_t_change = setTimeout(function() {
    console.log(year);
    if (year == 1989) year = 1990;
    if (year > 2016) year = 2016;
    if (year !== last_timeline_request) {
      last_timeline_request = year;
      current_year = year;
    }
    reset();
  }, 500);
}
$("#color_t").click(function() {
  $(this).toggleClass("active");
  color_show = !color_show;
  wait();
  setTimeout(function() {
    if (color_show) {
      color_by_infra();
    } else color_by_data();
  }, 300);
});
function reset() {
  $(".year").addClass("fade");
  setTimeout(function() {
    $(".year").html(current_year);
    $(".year").removeClass("fade");
  }, 1000);
  go_to_year(current_year);
}
$("#reset").click(function() {
  current_year = parseInt($("input").val());
  reset();
});
$("#data1").click(function() {
  current_data = ACCESS_POP;
  jqClick($(this));
});
$("#data2").click(function() {
  current_data = ACCESS;
  jqClick($(this));
});
$("#data3").click(function() {
  current_data = POPULATION;
  jqClick($(this));
});

function jqClick(t) {
  wait();
  $("#data1").removeClass("active");
  $("#data2").removeClass("active");
  $("#data3").removeClass("active");
  t.addClass("active");
  setTimeout(function() {
    go_to_year(current_year);
  }, 100);
}
function wait() {
  $(".option").addClass("wait");
  $("#color_t").addClass("wait");
  setTimeout(function() {
    $(".option").removeClass("wait");
    $("#color_t").removeClass("wait");
  }, 1000);
}

function color_by_infra() {
  cartogram
    .topoJson(world)
    .topoObjectName("countries")
    .color(function({ properties: { ISO_A2 } }) {
      var d = extract_country_data("" + ISO_A2);
      d = Math.floor(dataset_infrastructure_format(d, current_year, 0));
      var col = parseInt(map(d, 0, 7, 0, 255));
      console.log(d);
      if (d <= 1) return "rgb(0, 0, 255)";
      if (d === 2) return "rgb(20, 20, 255)";
      if (d === 3) return "rgb(50, 50, 255)";
      if (d === 4) return "rgb(150, 150, 255)";
      if (d === 5) return "rgb(230, 230, 255)";
      if (d >= 6) return "rgb(255, 255, 255)";
    });
}
function color_by_data() {
  cartogram
    .topoJson(world)
    .topoObjectName("countries")
    .color(function({ properties: { ISO_A2 } }) {
      var d = extract_country_data("" + ISO_A2);
      d = dataset_format(d, current_year);
      var col = map(d, 0, getDataMax(current_year), 0, 255);
      return (
        "rgb(" + (255 - col) + ", " + (255 - col) + ", " + (255 - col) + ")"
      );
    });
}

function dataset_format(d, year, _small) {
  if (current_data == ACCESS) return dataset_access_format(d, year, _small);
  if (current_data == POPULATION)
    return dataset_population_format(d, year, _small);
  if (current_data == INFRASTRUCTURE)
    return dataset_infrastructure_format(d, year, _small);
  if (current_data == ACCESS_POP)
    return dataset_population_access_format(d, year, _small);
}
//
function dataset_access_format(d, year, _small) {
  var small = _small ? _small : 0.005;
  if (d !== undefined) {
    d = d[data_selector()][year + ""];
    if (d !== "") {
      d = parseFloat(d);
      if (d === 0 || d < small) d = small;
    } else {
      d = small;
    }
  } else {
    d = small;
  }
  return d;
}
function dataset_population_format(d, year, _small) {
  var small = _small ? _small : 10000;
  if (d !== undefined) {
    d = d[data_selector(current_data)][year + ""];
    if (d !== "") {
      d = parseFloat(d);
      if (d === 0 || d < small) d = small;
    } else {
      d = small;
    }
  } else {
    d = small;
  }
  //console.log(d);
  return d;
}
function dataset_population_access_format(d, year, _small) {
  var small = _small ? _small : 100000;
  if (d !== undefined) {
    d = d[data_selector(current_data)][year + ""];
    if (d !== "") {
      d = parseFloat(d);
      if (d === 0 || d < small) d = small;
    } else {
      d = small;
    }
  } else {
    d = small;
  }
  return d;
}
function dataset_infrastructure_format(d, year, _small) {
  var small = _small ? _small : 0.1;
  if (d !== undefined) {
    d = d["infra"][year + ""];
    if (d !== "") {
      d = parseFloat(d);
      if (d === 0 || d < small) d = small;
    } else {
      d = small;
    }
  } else {
    d = small;
  }
  return d;
}

function extract_country_data(iso) {
  if (iso == -99) return undefined;

  //var name_a = iso_names[iso];
  //var name_b = data1_names[name_a];
  //if (name_b == "") name_b = name_a;

  var value = dataset1[iso];

  if (value === undefined) {
    return undefined;
  }
  return value;
}
function getDataMax(year) {
  var max = 0;

  for (var iso in iso_names) {
    //var n = data1_names[iso_names[iso]];
    //if (n == "") n = iso_names[iso];
    n = dataset1[iso];

    n = dataset_format(n, year, 0);

    if (n > max) max = n;
  }

  return max;
}

var reset_sizes = function() {
  genValsReset();
  render();
};

function genValsReset() {
  ccData = Object.assign(
    ...world.objects.countries.geometries.map(function({
      properties: { ISO_A2 }
    }) {
      return { [ISO_A2]: 0 };
    })
  );
}
function data_selector() {
  if (current_data == ACCESS) return "access";
  if (current_data == POPULATION) return "pop";
  if (current_data == INFRASTRUCTURE) return "infra";
  if (current_data == ACCESS_POP) return "access_pop";
}

var saveData = (function() {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  $("svg.cartogram")
    .children()
    .each(function() {
      convertToAbsolute($(this).get(0));
    });
  return function() {
    var data = $("svg.cartogram").get(0).outerHTML,
      blob = new Blob([data], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    var type_of_data;
    if (current_data == ACCESS) type_of_data = "access";
    if (current_data == POPULATION) type_of_data = "population";
    if (current_data == INFRASTRUCTURE) type_of_data = "infrastructure";
    if (current_data == ACCESS_POP) type_of_data = "access_population";
    a.download = type_of_data + "_" + current_year + ".svg";
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();

function map(x, a1, a2, b1, b2) {
  return ((x - a1) / a2) * (b2 - b1) + b1;
}

document.addEventListener("keypress", function(e) {
  if (e.key == "s") {
    saveData();
    timeline_change(current_year + 1);
    setInterval(save_and_change_year, 8000);
  }
});

function save_and_change_year() {
  saveData();
  timeline_change(current_year + 1);
}

function convertToAbsolute(path) {
  var x0,
    y0,
    x1,
    y1,
    x2,
    y2,
    segs = path.pathSegList;
  for (var x = 0, y = 0, i = 0, len = segs.numberOfItems; i < len; ++i) {
    var seg = segs.getItem(i),
      c = seg.pathSegTypeAsLetter;
    if (/[MLHVCSQTA]/.test(c)) {
      if ("x" in seg) x = seg.x;
      if ("y" in seg) y = seg.y;
    } else {
      if ("x1" in seg) x1 = x + seg.x1;
      if ("x2" in seg) x2 = x + seg.x2;
      if ("y1" in seg) y1 = y + seg.y1;
      if ("y2" in seg) y2 = y + seg.y2;
      if ("x" in seg) x += seg.x;
      if ("y" in seg) y += seg.y;
      switch (c) {
        case "m":
          segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
          break;
        case "l":
          segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
          break;
        case "h":
          segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
          break;
        case "v":
          segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
          break;
        case "c":
          segs.replaceItem(
            path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2),
            i
          );
          break;
        case "s":
          segs.replaceItem(
            path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2),
            i
          );
          break;
        case "q":
          segs.replaceItem(
            path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1),
            i
          );
          break;
        case "t":
          segs.replaceItem(
            path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y),
            i
          );
          break;
        case "a":
          segs.replaceItem(
            path.createSVGPathSegArcAbs(
              x,
              y,
              seg.r1,
              seg.r2,
              seg.angle,
              seg.largeArcFlag,
              seg.sweepFlag
            ),
            i
          );
          break;
        case "z":
        case "Z":
          x = x0;
          y = y0;
          break;
      }
    }
    if (c == "M" || c == "m") {
      x0 = x;
      y0 = y;
    }
  }
}
