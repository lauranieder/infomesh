/* exported OPTIONS COLORS TYPES */

/***************************************
 * PREFERENCES
 ***************************************/
var OPTIONS = {
  displacementSpeedX: 1.5,
  displacementSpeedY: 1.5,
  // Effects
  displacementEnabled: true,
  displacementFile: "assets/textures/displacement_map.png",
  displacementScaleX: 300,
  displacementScaleY: 300,
  asciiEnabled: true,
  asciiScale: 16,
  bloomEnabled: false,
  bloomBlur: 6,
  bloomQuality: 5,
  bloomResolution: undefined,
  transparentPixiCanvas: false,
  hideControls: true
};

var gui = new dat.gui.GUI();
gui.close();
// Completely hide dat.gui at will
if (OPTIONS.hideControls) dat.GUI.toggleHide();

var f2 = gui.addFolder("DisplacementFilter");
f2.add(OPTIONS, "displacementSpeedX", 0.1, 10);
f2.add(OPTIONS, "displacementSpeedY", 0.1, 10);
f2.open();

var COLORS = {
  incident: [[["white", 0.05], ["blue", 0.8], ["black", 1]]],
  breach: [[["aqua", 0.05], ["blue", 0.8], ["black", 1]]],
  steal: [[["green", 0.05], ["#119944", 0.8], ["black", 1]]],
  theory: [[["yellow", 0.05], ["yellow", 0.5], ["black", 1]]],
  media: [[["blue", 0.05], ["aqua", 0.8], ["black", 1]]],
  foundation: [[["purple", 0.05], ["purple", 0.7], ["black", 1]]],
  law: [[["black", 0.5], ["blue", 0.8], ["blue", 0.9], ["black", 1]]],
  meeting: [[["teal", 0.5], ["navy", 0.8], ["black", 1]]]
};

var TYPES = [
  "media",
  "newAttackType",
  "incident",
  "law",
  "foundation",
  "moneyTheft",
  "loss",
  "virus",
  "defacement",
  "infiltration",
  "breach",
  "dataTheft",
  "hack",
  "leak",
  "destructive"
];
