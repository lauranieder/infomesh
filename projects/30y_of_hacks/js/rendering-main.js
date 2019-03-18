/* exported onNewVisual_renderer initPixi setupGraphics setupFilters */
/* exported resources */
/* globals pixiReady setupFilters setupGraphics */

// PixiJS checks
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  console.warn("WebGL isn't supported (PIXI)");
  type = "canvas";
}
PIXI.utils.sayHello(type);

// PixiJS aliases
let resources = PIXI.Loader.shared.resources;

// Create a Pixi Application
let ratio = window.devicePixelRatio;
var VH, VW;
let app = new PIXI.Application({
  antialias: true, // default: false
  transparent: OPTIONS.transparentPixiCanvas,
  autoDensity: true,
  resolution: ratio // default: 1
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
// Add the canvas that Pixi automatically created for you to the HTML document
var containerProject = document.getElementById("container-project");
var textYear = document.getElementById("text-year");
containerProject.insertBefore(app.view, textYear);
onResizeWindow();
app.stage.updateLayersOrder = function() {
  app.stage.children.sort((a, b) => {
    a.zIndex = a.zIndex || 0;
    b.zIndex = b.zIndex || 0;
    return b.zIndex - a.zIndex;
  });
};

for (var i = 0; i < TYPES.length; i++) {
  PIXI.Loader.shared.add(TYPES[i], "assets/textures/img-" + TYPES[i] + ".png");
}

PIXI.Loader.shared
  .add([{ name: "map", url: OPTIONS.displacementFile }])
  .load(pixiReady);

function initPixi() {
  setupFilters();
  setupGraphics();
}

// Resizing code from: https://stackoverflow.com/a/50915858/1017472
window.addEventListener("resize", debounce(() => onResizeWindow(), 150));

// From underscrore.js
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let args = arguments;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

function onResizeWindow() {
  const canvas = app.renderer.view;
  VW = containerProject.clientWidth;
  VH = containerProject.clientHeight;
  canvas.style.width = VW + "px";
  canvas.style.height = VH + "px";
  canvas.width = VW;
  canvas.height = VH;
  app.renderer.resize(VW, VH);
  var event = new CustomEvent("canvasResize", {
    detail: { width: VW, height: VH }
  });
  canvas.dispatchEvent(event);
}
