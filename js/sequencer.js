var Sequencer = {
  highResTimeout: 0,
  lastFrameId: 0,
  options: {
    frameCount: 0,
    folder: '',
    baseName: '',
    ext: 'jpg'
  },

  init: function(options) {
    this.options = $.extend(this.options, options);
  },

  draw: function(normalizedPosition) {
    var id = parseInt(this.map_range(normalizedPosition, 0, 1, 0, this.options.frameCount));

    if (id > this.frameCount) id = this.frameCount;

    if (this.lastFrameId != id) {
      clearTimeout(this.highResTimeout);

      this.drawImage(this.options.folder + '/' +  this.options.baseName + id + '.' + this.options.ext);

      var self = this;
      this.highResTimeout = setTimeout(function() {
        self.drawImage(self.options.folder + '/' +  self.options.baseName + id + '.' + self.options.ext);
      }, 250);

      this.lastFrameId = id;
    }
  },

  drawImage: function(url) {
    var image = new Image();
    image.src = url;

    image.onload = () => {
      $('#sequencer').css('background-image', 'url(' + url + ')');
    }
  },

  map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
}
