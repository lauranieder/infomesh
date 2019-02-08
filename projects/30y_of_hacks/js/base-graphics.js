/* globals project view Path Point */
/* globals toggleDisplacement moveToBlockBy paperReady */
/* exported onFrame onMouseMove onMouseUp onKeyDown */
/* eslint no-unused-vars: 0 */

var background = new Path.Rectangle({
  size: view.bounds.size,
  fillColor: "#000000"
});

// var circle2 = new Path.Circle({
//   radius: 150,
//   fillColor: "#FFFFFF", //"#FDE9B5"
//   opacity: 1,
//   position: new Point(500, 100)
// });

var tmp = new Path.Circle({
  radius: 50,
  fillColor: "#FBFBFB", //"#FDE9B5"
  opacity: 1,
  position: new Point(view.bounds.width / 2, view.bounds.height / 2)
});
tmp.visible = true;
tmp.applyMatrix = false;

var circles = [];
for (var j = 0; j < 10; j++) {
  var newC = {
    goal_pos: tmp.position.clone(),
    goal_scaling: 1,
    shape: tmp.clone()
  };
  circles.push(newC);
}
tmp.remove();

// var anime_circle = anime({
//   targets: circle.position,
//   x: circle.position.x - 100,
//   y: circle.position.y + 100,
//   loop: true,
//   duration: 3 * 1000,
//   direction: "alternate",
//   easing: "easeInOutSine",
//   update: function(a) {}
// });

// =========== ANIMATION ==============
function onFrame(event) {
  for (var i = 0; i < circles.length; i++) {
    var c = circles[i];
    c.shape.position += (c.goal_pos - c.shape.position) * 0.033;
    // console.log(circle.position);
  }
}

// =========== INTERACTION ==============
function onMouseMove(event) {
  // circle.position = event.point;
}

function onKeyDown(event) {
  switch (event.key) {
    // case "d":
    //   toggleDisplacement();
    //   break;
    case "left":
      moveToBlockBy(-1);
      break;
    case "right":
      moveToBlockBy(1);
      break;
    case "a":
      goToBlock(25);
      break;
    case "s":
      goToBlock(27);
      break;
    case "d":
      goToBlock(45);
      break;
  }
}

window.onNewVisual_anim = function(datapoint) {
  // ### Color
  var possibleStops = COLORS[datapoint.type];
  var stops = possibleStops[Math.floor(Math.random() * possibleStops.length)];

  // ### Scale
  var circle_scale = 1;
  if (datapoint.visualValueSuffix.indexOf("$") >= 0) {
    circle_scale = map_range(
      datapoint.visualValue,
      1000000,
      1000000000,
      0.3,
      6,
      true
    );
    console.log("Circle scale: ", circle_scale);
  } else if (datapoint.visualValue) {
    circle_scale = map_range(
      datapoint.visualValue,
      100,
      200000000,
      0.3,
      10,
      true
    );
    console.log("Circle standard scale: ", circle_scale);
  }

  var goal = getRandomPos(circle_scale);
  for (var i = 0; i < circles.length; i++) {
    var c = circles[i];
    c.shape.fillColor = {
      gradient: {
        stops: stops,
        radial: true
      },
      origin: c.shape.position,
      destination: c.shape.bounds.rightCenter
    };
    c.shape.scaling = circle_scale;
    // ### Position
    c.goal_pos = goal;
    var multipleBlobsFactor = map_range(circle_scale, 0.3, 10, 0.2, 0.0);
    if (Math.random() < multipleBlobsFactor) {
      goal = getRandomPos(circle_scale);
    }
  }
};

function getRandomPos(scaling) {
  var middleFactor = map_range(scaling, 0.3, 10, 1, 0.1);
  return (
    view.bounds.center +
    new Point(
      (Math.random() - 0.5) * middleFactor * view.bounds.width,
      (Math.random() - 0.5) * middleFactor * view.bounds.height
    )
  );
}

paperReady();
