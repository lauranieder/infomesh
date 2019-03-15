/* exported onNewVisual_renderer initPixi toggleDisplacement */
/* globals pixiReady */

// PixiJS checks
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  console.warn("WebGL isn't supported (PIXI)");
  type = "canvas";
}
PIXI.utils.sayHello(type);

// PixiJS aliases
let resources = PIXI.loader.resources;
// Runtimes
var filter_displacement, filter_ascii;

// Create a Pixi Application
let ratio = window.devicePixelRatio;
let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true, // default: false
  transparent: OPTIONS.transparentPixiCanvas,
  autoResize: true,
  resolution: ratio // default: 1
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
// Add the canvas that Pixi automatically created for you to the HTML document
var containerProject = document.getElementById("container-project");
var textblocs = document.getElementById("container-textblocs");
containerProject.insertBefore(app.view, textblocs);
app.stage.updateLayersOrder = function() {
  app.stage.children.sort((a, b) => {
    a.zIndex = a.zIndex || 0;
    b.zIndex = b.zIndex || 0;
    return b.zIndex - a.zIndex;
  });
};

PIXI.loader
  .add([{ name: "map", url: OPTIONS.displacementFile }])
  .load(imageLoaded);

function imageLoaded() {
  pixiReady();
}

function initPixi() {
  setupFilters();
  setupGraphics();

  app.ticker.add(delta => gameLoop(delta));
}

function setupFilters() {
  // Displacement sprite
  resources.map.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
  const displacementSprite = new PIXI.Sprite(resources.map.texture);
  app.stage.addChild(displacementSprite);
  displacementSprite.scale.set(2);
  // Displacement filter
  filter_displacement = new PIXI.filters.DisplacementFilter(
    displacementSprite,
    OPTIONS.displacementScaleX,
    OPTIONS.displacementScaleY
  );
  filter_displacement.enabled = OPTIONS.displacementEnabled;
  filter_displacement.global = false;
  // ASCII filter
  filter_ascii = new PIXI.filters.AsciiFilter(OPTIONS.asciiScale);
  filter_ascii.enabled = OPTIONS.asciiEnabled;
  filter_ascii.global = false;

  // var f1 = gui.addFolder("AsciiFilter");
  // f1.add(filter_ascii, "enabled");
  // f1.add(filter_ascii, "size", 1, 40);
  // f1.open();

  // Bloom filter
  // filter_bloom = new PIXI.filters.BloomFilter(
  //   OPTIONS.bloomBlur,
  //   OPTIONS.bloomQuality
  // );
  // filter_bloom.enabled = OPTIONS.bloomEnabled;
  // filter_bloom.global = true;

  app.stage.filters = [filter_displacement, filter_ascii];
}

var p;
function setupGraphics() {
  p = new PIXI.Graphics();
  p.beginFill(0xfff42f);
  p.lineStyle(12, 0x0000ff, 1);
  p.drawCircle(30, 30, 60);
  p.endFill();
  app.stage.addChild(p);
}

var frameCount = 0;
function gameLoop(_delta) {
  frameCount += 1;

  // Displacement
  filter_displacement.maskSprite.transform.position.x +=
    OPTIONS.displacementSpeedX;
  filter_displacement.maskSprite.transform.position.y +=
    OPTIONS.displacementSpeedY;

  // Animations
  p.x = Math.sin(frameCount / 10) * 350;
}

function toggleDisplacement() {
  filter_displacement.enabled = !filter_displacement.enabled;
}

function onNewVisual_renderer(datapoint) {
  // ASCII scale
  var ascii_scale = OPTIONS.asciiScale;
  if (datapoint.visualValueSuffix.indexOf("$") >= 0) {
    ascii_scale = map_range(
      datapoint.visualValue,
      1000000,
      1000000000,
      16,
      6,
      false
    );
    console.log("Ascii scale: ", ascii_scale);
  }
  filter_ascii.size = ascii_scale;
}

window.onNewVisual_anim = function() {
  console.log("new anim");
};
