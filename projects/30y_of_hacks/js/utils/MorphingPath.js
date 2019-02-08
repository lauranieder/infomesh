// Code by sasensi from:
// https://stackoverflow.com/questions/50825267/paper-js-how-to-morph-one-path-to-another-path
// Adapter by Nathan Vogel

/**
 * A path that can be morphed between two other paths.
 * @param {Path} path1
 * @param {Path} path2
 * @constructor
 */
function MorphingPath(path1, path2) {
  // internal variables
  var self = this,
    clone1,
    clone2,
    lastMorphTime;

  //
  // API
  //

  // allow direct access to morphing path
  self.path = null;

  /**
   * interpolate path from path1 to path2
   * @param time must be a value from 0 to 1
   */
  self.morph = function(time) {
    // Don't morph if it's unnecessary.
    if (lastMorphTime === time) return;
    lastMorphTime = time;

    var segments = [];
    for (var i = 0; i < self.path.segments.length; i++) {
      // morph segments
      var segment1 = clone1.segments[i],
        segment2 = clone2.segments[i],
        point = rampPoint(segment1.point, segment2.point, time),
        handleIn = rampPoint(segment1.handleIn, segment2.handleIn, time),
        handleOut = rampPoint(segment1.handleOut, segment2.handleOut, time);

      segments.push(new Segment(point, handleIn, handleOut));
    }
    self.path.segments = segments;
  };

  //
  // INTERNAL METHODS
  //

  function init() {
    // store local copies of source paths
    clone1 = path1.clone();
    clone2 = path2.clone();

    // hide them
    clone1.visible = false;
    clone2.visible = false;

    // init morphing path
    self.path = createMorphingPath();
  }

  /**
   * Create the path that will later be morphed.
   * Points are added when needed, for a smoother result.
   * @returns {Path}
   */
  function createMorphingPath() {
    var paths = [clone1, clone2],
      offsets = [[], []];

    // store paths segments offsets (except for first and last)
    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      // loop segments
      for (var j = 1; j < path.segments.length - 1; j++) {
        // store offset
        offsets[i].push(path.segments[j].location.offset);
      }
    }

    // add missing points
    for (var i = 0; i < paths.length; i++) {
      // get current path offsets array
      var pathOffsets = offsets[i];
      // get a reference to the other path
      var thisPath = paths[i];
      var otherPath = i == 0 ? paths[i + 1] : paths[0];
      var ratio = otherPath.length / thisPath.length;
      // loop current path offsets
      for (var j = 0; j < pathOffsets.length; j++) {
        // add a corresponding point for that offset in the other path
        otherPath.divideAt(otherPath.getLocationAt(pathOffsets[j] * ratio));
      }
    }

    return clone1.clone();
  }

  function rampPoint(p1, p2, t) {
    return p1 + (p2 - p1) * t;
  }

  self.remove = function() {
    clone1.remove();
    clone2.remove();
    self.path.remove();
  };

  init();
}

// Export for use in other scripts
window.MorphingPath = MorphingPath;
