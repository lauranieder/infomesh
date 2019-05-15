var Sequencer = {
  video: null,

  options: {
    video: null
  },

  init: function(options) {
    this.options = $.extend(this.options, options);
    this.video = options.video;
  },

  draw: function(normalizedPosition) {
    var id = parseInt(this.map_range(normalizedPosition, 0, 1, 1, 300));
    this.video.currentTime = id;
  },

  map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
}
