$(document).ready(function() {
  Sequencer.init({
    frameCount: 300,
    folder: 'sequence',
    baseName: 'anime_',
    ext: 'jpg'
  });

  document.addEventListener('timeline-scroll', function(e) {
    Sequencer.draw(e.detail.normal);
  });
});
