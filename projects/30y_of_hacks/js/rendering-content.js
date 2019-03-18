/* exported setupGraphics */
/* globals resources app */

var g_frameCount = 0;

var p, p2, background;
function setupGraphics() {
  background = new PIXI.Graphics();
  background.beginFill(0x000000);
  background.drawRect(0, 0, app.renderer.width, app.renderer.height);
  background.endFill();
  app.stage.addChild(background);

  // p = new PIXI.Graphics();
  // p.beginFill(0xfff42f);
  // p.lineStyle(12, 0x0000ff, 1);
  // p.drawCircle(30, 30, 60);
  // p.endFill();
  p2 = new PIXI.Graphics();
  p2.beginFill(0x1ff42f);
  p2.lineStyle(12, 0xf000ff, 1);
  p2.drawCircle(30, 30, 60);
  p2.endFill();
  // p = new PIXI.Sprite(resources["img1.png"]);
  p = new PIXI.Sprite.fromImage("assets/textures/img0-10.png");
  p.anchor.set(0.5);
  p.scale.x = 2;
  p.scale.y = 2;

  app.stage.addChild(p);
  app.stage.addChild(p2);

  app.ticker.add(delta => graphicsGameLoop(delta));
  app.renderer.view.addEventListener("canvasResize", e => {
    background.drawRect(0, 0, e.detail.width, e.detail.height);
  });
}

function graphicsGameLoop(_delta) {
  g_frameCount += 1;

  // Animations
  p.x = Math.sin(g_frameCount / 600) * 350;
  p.y = Math.sin(g_frameCount / 600) * 350;
  p2.x = 400 + Math.sin(g_frameCount / 600) * 350;
  p2.y = 400 + Math.sin(g_frameCount / 600) * 350;
  // p.angle = Math.sin(g_frameCount * 0.003) * 360;
}

window.onNewVisual_anim = function() {
  console.log("new anim");
};
