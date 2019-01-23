/* exported pixiReady paperReady dataReady */

var isPaperReady = false;
function paperReady() {
  isPaperReady = true;
  testReady();
}

var isDataReady = false;
function dataReady() {
  isDataReady = true;
  testReady();
}

var isPixiReady = false;
function pixiReady() {
  isPixiReady = true;
  testReady();
}

function testReady() {
  if (isPaperReady && isDataReady && isPixiReady) {
    initPixi();
    initDom();
  }
}
