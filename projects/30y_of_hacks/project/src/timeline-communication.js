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
  console.log("Send", msg);
  // Make sure you are sending a string, and to stringify JSON
  window.parent.postMessage(msg, "*");
};

function timelineGoToId(id) {
  sendMessage(JSON.stringify({ id: id }));
}

// Listen to messages from parent window
bindEvent(window, "message", e => {
  console.log("Received event:", e.data);
  var data = JSON.parse(e.data);
  console.log(data.id);
  // if (typeof data.id === "number") {
  goToBlock(parseInt(data.id), true);
  // }
});

// Send random message data on every button click
// bindEvent(messageButton, "click", (e) => {
//   var random = Math.random();
//   sendMessage("" + random);
// });
