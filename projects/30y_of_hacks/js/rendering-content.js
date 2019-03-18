/* exported setupGraphics */
/* globals resources app */

var g_frameCount = 0;
var background;
var sprites = [];
var spriteModel = {
  targetScale: 1,
  targetX: 200,
  targetY: 200,
  targetRotation: 0,
  speedX: 0,
  speedY: 0,
  rate: 0.03,
  speedRotation: 0,
  deathTime: 0,
  sprite: null,
  lockOnTarget: false // if targetXY are animated, we should follow it.
};

function setupGraphics() {
  // Background
  background = new PIXI.Graphics();
  background.beginFill(0x000000);
  background.drawRect(0, 0, VW, VH);
  background.endFill();
  app.stage.addChild(background);

  // Event loops
  app.ticker.add(delta => graphicsGameLoop(delta));
  app.renderer.view.addEventListener("canvasResize", e => {
    background.drawRect(0, 0, e.detail.width, e.detail.height);
  });
}

function graphicsGameLoop(_delta) {
  g_frameCount += 1;

  for (var i = 0; i < sprites.length; i += 1) {
    var s = sprites[i];
    if (s.lockOnTarget) {
      s.sprite.x = s.targetX;
      s.sprite.y = s.targetY;
      s.sprite.scale.x = s.targetScale;
      s.sprite.scale.y = s.targetScale;
    } else {
      // Move the target if it has speed.
      s.targetX += s.speedX;
      s.targetY += s.speedY;
      s.targetRotation += s.speedRotation;
      // Move closer to the target.
      s.sprite.x += (s.targetX - s.sprite.x) * s.rate;
      s.sprite.y += (s.targetY - s.sprite.y) * s.rate;
      s.sprite.rotation += (s.targetRotation - s.sprite.rotation) * s.rate;
      s.sprite.scale.x += (s.targetScale - s.sprite.scale.x) * s.rate;
      s.sprite.scale.y += (s.targetScale - s.sprite.scale.y) * s.rate;
    }
  }
}

window.addEventListener("blockchange", onNewBlock);

function onNewBlock(event) {
  var newData = event.detail.data;
  var now = Date.now();

  // Clear up previous sprites.
  for (var i = 0; i < sprites.length; i += 1) {
    var s = sprites[i];
    // If a deathTime is set and it's over.
    if (s.deathTime > 0 && s.deathTime < now) {
      sprites.slice(i, 1);
      i--;
    } else if (s.deathTime === 0) {
      if (event.detail.forward) {
        s.targetX = -(400 + s.sprite.width);
      } else {
        s.targetX = VW + (200 + s.sprite.width);
      }
      // s.targetY = Math.random() * VH;
      // s.deathTime = now + 1000;
    }
  }

  // console.log(e);
  // var newData = e.detail.data;
  createSprites(newData);
}

function createSprites(data) {
  console.log(app.stage);
  console.log(app);
  // Initial values
  var x = Math.random() * VW;
  var y = Math.random() * VH;
  var scale = 0.5 + Math.random() * 1;
  // Calc values
  var l10 = Math.log(data.visualValue);
  var count = 1;
  if (data.visualValue < 1) {
    // = percent data.
  } else if (data.visualValue < 10) {
    // = no data yet.
  } else if (l10 < 7) {
    scale = map_range(data.visualValue, 0, 100000000, 0.5, 4);
  } else if (l10 >= 7 && l10 < 9) {
    count = map_range(l10, 7, 9, 2, 10);
  } else if (l10 > 9) {
    scale = 8;
  }

  for (var i = 0; i < count; i += 1) {
    var s = new PIXI.Sprite(resources[data.type].texture);
    s.anchor.set(0.5);
    s.x = VW + 300;
    var sData = Object.assign({}, spriteModel, {
      sprite: s,
      targetX: x,
      targetY: y,
      targetScale: scale
    });

    app.stage.addChild(s);
    sprites.push(sData);
  }
}
