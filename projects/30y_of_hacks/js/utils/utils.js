/* exported map_range */

// function map_range(value, low1, high1, low2, high2) {
//   return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
// }

function map_range(value, start1, stop1, start2, stop2, withinBounds) {
  var newval =
    ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
}

function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}
