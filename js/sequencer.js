var Sequencer = {
  lowresImages: [],
  highResTimeout: 0,
  lastFrameId: 0,
  loadIndex: 0,
  imageLoaded: 1,
  loadStart: 0,

  options: {
    frameCount: 0,
    folder: '',
    baseName: '',
    ext: 'jpg'
  },

  init: function(options) {
    this.options = $.extend(this.options, options);

    this.loader();
  },

  loader: function () {
    this.loadStart = new Date();

    for (var i = 1; i < this.options.frameCount; i++) {
      this.loadImage(i, this.options.folder + '/lowres/' +  this.options.baseName + i + '.' + this.options.ext);
    }
  },

  loadImage: function(index, url) {
    var image = new Image();
    image.src = url;

    var self = this;
    image.onload = function() {
      self.imageLoaded++;

        console.log(self.imageLoaded, self.options.frameCount);
      if (self.imageLoaded == self.options.frameCount) {
        var date = new Date();
        console.log('Low res loaded in ' + (date.getTime() - self.loadStart.getTime()));
      }
    };

    this.lowresImages.push(image);
  },

  draw: function(normalizedPosition) {
    var id = parseInt(this.map_range(normalizedPosition, 0, 1, 1, this.options.frameCount));

    if (id > this.frameCount) id = this.frameCount;

    if (this.lastFrameId != id) {
      clearTimeout(this.highResTimeout);

      this.drawLowres(this.options.folder + '/lowres/' +  this.options.baseName + id + '.' + this.options.ext);

      var self = this;
      this.highResTimeout = setTimeout(function() {
        self.drawHighres(self.options.folder + '/highres/' +  self.options.baseName + id + '.' + self.options.ext);
      }, 250);

      this.lastFrameId = id;
    }
  },

  drawLowres: function(url) {
    $('#sequencer').css('background-image', 'url(' + url + ')');
  },

  drawHighres: function(url) {
    this.loadIndex++;
    var image = new Image();
    image.src = url;

    var currentIndex = this.loadIndex;
    var self = this;
    image.onload = function() {
      if (self.loadIndex > currentIndex) return;

      $('#sequencer').css('background-image', 'url(' + url + ')');
    }
  },

  map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
}
