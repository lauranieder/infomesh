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
  lissajousEnabled: false,
  speedLissajous: 0,
  lissajousA: 0,
  lissajousB: 0,
  lissajousProgress: 0,
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
    if (s.lissajousEnabled) {
      s.lissajousProgress += s.speedLissajous;
      var lx = 0.5 * (Math.cos(s.lissajousA * s.lissajousProgress) + 1);
      var ly = 0.5 * (Math.sin(s.lissajousB * s.lissajousProgress) + 1);
      s.targetX = ly * 0.84 * VW + 0.08 * VW;
      s.targetY = lx * 0.84 * VH + 0.08 * VW;
    }
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
  var now = Date.now();

  // Clear up previous sprites.
  for (var i = 0; i < sprites.length; i += 1) {
    var s = sprites[i];
    // If a deathTime is set and it's over.
    if (s.deathTime > 0 && s.deathTime < now) {
      console.log("Remove " + i);
      app.stage.removeChild(sprites[i].sprite);
      sprites.splice(i, 1);
      i -= 1;
    } else if (s.deathTime === 0) {
      // Send the old ones to their death;
      s.deathTime = now + 1000;
      s.lissajousEnabled = false;
      if (event.detail.forward) {
        s.targetX = -(400 + s.sprite.width);
      } else {
        s.targetX = VW + (200 + s.sprite.width);
      }
      s.targetY = Math.random() * VH;
    }
  }
  createSprites(event);
}

function createSprites(event) {
  var data = event.detail.data;
  // Initial values
  var x = Math.random() * VW;
  var y = Math.random() * VH;
  var scale = 0.5 + Math.random() * 1;
  var count = 1;
  // Calc values
  if (data.visualValue) {
    var l10 = Math.log(data.visualValue) / Math.log(10);
    if (data.visualValue < 1) {
      // = percent data.
    } else if (data.visualValue < 10) {
      // = no data yet.
    } else if (l10 < 7) {
      scale = map_range(l10, 0, 7, 0.5, 6);
    } else if (l10 >= 7 && l10 < 9) {
      count = map_range(l10, 7, 9, 2, 10);
    } else if (l10 > 9) {
      scale = 8;
    }
  }

  for (var i = 0; i < count; i += 1) {
    var s = new PIXI.Sprite(resources[data.type].texture);
    s.anchor.set(0.5);
    s.x = event.detail.forward ? VW + s.width + 300 : -s.width - 300;
    var sData = Object.assign({}, spriteModel, {
      sprite: s,
      targetX: x,
      targetY: y,
      targetScale: scale
    });

    if (!data.visualValue) {
      sData.lissajousEnabled = true;
      sData.lissajousA = 1 + Math.random() * 10;
      sData.lissajousB = sData.lissajousA * Math.ceil(Math.random() * 4);
      sData.lissajousProgress = Math.random();
      sData.speedLissajous =
        (Math.random() * 0.003 + 0.0003) / sData.lissajousA;
      sData.lockOnTarget = false;
    }

    app.stage.addChild(s);
    sprites.push(sData);
  }
}
