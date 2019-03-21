var svgson = require("svgson");
var read = require("read-file");
var fs = require("fs");

var index = 1989;
var index_max = 2017;

var typeInfo = "access_";
var fileName = "";
convertNextFile();

function convertNextFile() {
  if (index < 2017) {
    fileName = typeInfo + index;
    splitMySVG();
    index++;
  }
}

function splitMySVG() {
  console.log("converting " + fileName);

  var file = read.sync("../frames/" + fileName + ".svg", "utf8");

  svgson.parse(file).then(json => {
    //console.log(JSON.stringify(json, null, 2));

    var final_svg = '<svg width="1020" height="673" class="cartogram">';

    for (var i in json.children) {
      var main_path = json.children[i];
      var resultant_paths = split_multi_path(main_path.attributes.d);

      for (var j in resultant_paths) {
        final_svg += '<path style="' + main_path.attributes.style + '" ';
        final_svg += 'd="' + resultant_paths[j] + '" ';
        final_svg += 'ISO_A2="' + main_path.attributes.ISO_A2 + '" ';
        final_svg += 'ISO_A3="' + main_path.attributes.ISO_A3 + '" ';
        final_svg += 'name="' + main_path.attributes.name + '" ';
        final_svg += 'coeff="' + main_path.attributes.coeff + '" ';
        final_svg += 'value="' + main_path.attributes.value + '" ';
        final_svg += 'class="' + main_path.attributes.class + '" ';
        final_svg += "/>";
      }
    }

    final_svg += "</svg>";
    fs.writeFile(fileName + ".svg", final_svg, function(err) {
      if (err) throw err;
      console.log("converted!");
      convertNextFile();
    });
  });
}

function split_multi_path(string) {
  var paths = string.split("ZM");

  for (var i = 0; i < paths.length; i++) {
    if (i < paths.length) paths[i] += "Z";
    if (i > 0) paths[i] = "M" + paths[i];
  }

  return paths;
}
