/* exported setupFilters toggleDisplacement */
/* globals resources app */

var filter_displacement, filter_ascii;
var filter_frameCount = 0;

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
  filter_displacement.global = true;
  // ASCII filter
  filter_ascii = new PIXI.filters.AsciiFilter(OPTIONS.asciiScale);
  filter_ascii.enabled = OPTIONS.asciiEnabled;
  filter_ascii.global = true;

  var f1 = gui.addFolder("AsciiFilter");
  f1.add(filter_ascii, "enabled");
  f1.add(filter_ascii, "size", 1, 40);
  f1.open();

  // Bloom filter
  // filter_bloom = new PIXI.filters.BloomFilter(
  //   OPTIONS.bloomBlur,
  //   OPTIONS.bloomQuality
  // );
  // filter_bloom.enabled = OPTIONS.bloomEnabled;
  // filter_bloom.global = true;

  app.stage.filters = [filter_displacement, filter_ascii];
  app.ticker.add(delta => filterGameLoop(delta));
}

function filterGameLoop(_delta) {
  filter_frameCount += 1;

  // Displacement
  filter_displacement.maskSprite.transform.position.x +=
    OPTIONS.displacementSpeedX;
  filter_displacement.maskSprite.transform.position.y +=
    OPTIONS.displacementSpeedY;
}

function toggleDisplacement() {
  filter_displacement.enabled = !filter_displacement.enabled;
}
