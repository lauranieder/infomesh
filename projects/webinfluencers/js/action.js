$(document).ready(function() {
  var elVideo = document.querySelector("#vid-influencer");

  Sequencer.init({
    video: elVideo
  });

  var normal = 0;
  var targetNormal = 0;

  function animate () {
    normal += (targetNormal - normal) * 0.15;
    Sequencer.draw(normal);
    requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener('timeline-scroll', function(e) {
    targetNormal = e.detail.normal;
  });
});
