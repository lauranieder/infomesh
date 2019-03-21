// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, eventHandler);
  }
}

// Send a message to the parent
var sendMessage = function(msg) {
  // Make sure you are sending a string, and to stringify JSON
  window.parent.postMessage(msg, "*");
};

// Listen to messages from parent window
bindEvent(window, "message", e => {
  //console.log("Received event:", e.data);
  var data = JSON.parse(e.data);
  // if (typeof data.id === "number") {
  timeline_change(parseInt(data.id));
  // }
});

// Send random message data on every button click
// bindEvent(messageButton, "click", (e) => {
//   var random = Math.random();
//   sendMessage("" + random);
// });
