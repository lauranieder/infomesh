$(document).ready(function() {
  Sequencer.init({
    frameCount: 360,
    folder: 'sequence',
    baseName: 'bastienanime_',
    ext: 'jpg'
  });

  document.addEventListener('timeline-scroll', function(e) {
    Sequencer.draw(e.detail.normal);
  });
});
