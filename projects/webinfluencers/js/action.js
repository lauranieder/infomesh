$(document).ready(function() {
  var elVideo = document.querySelector("#vid-influencer");

  Sequencer.init({
    video: elVideo
  });

  document.addEventListener('timeline-scroll', function(e) {
    Sequencer.draw(e.detail.normal);
  });
});
