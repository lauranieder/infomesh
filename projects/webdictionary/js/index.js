$(document).ready(function() {
  var entries;

  jQuery.getJSON('./entries.json', function(data) {
    var filteredEntries = [];
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      console.log(d.url);
    }
    entries = data;

    createSVG();
  });

  function createSVG() {
    var settings = {
      entries: entries,
      width: $(window).width(),
      height: $(window).height() / 100 * 90,
      radius: "65%",
      radiusMin: 35,
      bgDraw: false,
      opacityOver: 1.0,
      opacityOut: 0.05,
      opacitySpeed: 0,
      fov: 150,
      speed: 0.2,

      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: "18",
      fontColor: "#000",
      fontWeight: "normal",
      fontStyle: "normal",
      fontStretch: "expanded",
      fontToUpperCase: true,

      tooltipFontFamily: 'sans-serif',
      tooltipFontSize: '18',
      tooltipFontColor: 'black',
      tooltipFontWeight: 'normal',
      tooltipFontStyle: 'normal',
      tooltipFontStretch: 'normal',
      tooltipFontToUpperCase: false,
      tooltipTextAnchor: 'left',
    };

    $('#container-project').svg3DTagCloud(settings, 'svgEE');
  }
});
