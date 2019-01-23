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
    dataset1[d["Country Name"]] = {};
    dataset1[d["Country Name"]].access = {};
    for (var i = 0; i < 57; i++) {
      dataset1[d["Country Name"]].access[1960 + i + ""] = d[1960 + i + ""];
    }
  });
  ////////
  d3.csv("./data/data2_pop/population.csv", function(data) {
    data.forEach(function(d) {
      dataset1[d["Country Name"]].pop = {};
      for (var i = 0; i < 57; i++) {
        dataset1[d["Country Name"]].pop[1960 + i + ""] = d[1960 + i + ""];
      }
      dataset1[d["Country Name"]].access_pop = {};
      for (var i = 0; i < 57; i++) {
        var val =
          parseFloat(dataset1[d["Country Name"]].access[1960 + i + ""]) *
            parseFloat(d[1960 + i + ""]) +
          "";
        if (isNaN(val)) val = "0";
        dataset1[d["Country Name"]].access_pop[1960 + i + ""] = val;
      }
    });
    ////////
    d3.csv("./data/data4_webinfra/infrastructure.csv", function(data) {
      data.forEach(function(d) {
        dataset1[d["Country Name"]].infra = {};
        for (var i = 0; i < 57; i++) {
          dataset1[d["Country Name"]].infra[1960 + i + ""] = d[1960 + i + ""];
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

  ////////////    COLORIZE MAP
  if (color_show) {
    color_by_infra();
  } else {
    color_by_data();
  }
}
function go_to_year(y) {
  genVals(y);
  render();
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

function extract_country_data(iso) {
  //console.log(iso);
  if (iso == -99) return undefined;

  var name_a = iso_names[iso];
  //console.log(name_a);
  var name_b = data1_names[name_a];
  if (name_b == "") name_b = name_a;
  //console.log(name_b);
  var value = dataset1[name_b];

  if (value === undefined) {
    //console.log(iso + ' : ' + name_a + ' : ' + name_b);
    return undefined;
  }
  return value;
}
function getDataMax(year) {
  var max = 0;

  for (var iso in iso_names) {
    var n = data1_names[iso_names[iso]];
    if (n == "") n = iso_names[iso];
    n = dataset1[n];

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

function map(x, a1, a2, b1, b2) {
  return ((x - a1) / a2) * (b2 - b1) + b1;
}
