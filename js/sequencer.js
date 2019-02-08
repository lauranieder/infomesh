var Sequencer = {
  options: {
    frameCount: 0,
    baseName: '',
    ext: 'jpg'
  },


  init: function(options) {
    this.options = $.extend(options);

    console.log(options);
  }
}
