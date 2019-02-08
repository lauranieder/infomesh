/* globals moment */

var iframe;

function popupCallback(id) {
  console.log(id, events[id]);
  if (id >= 0) sendMessage(JSON.stringify({ id: id }));
}

// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, eventHandler);
  }
}

// Send a message to the child iframe
function sendMessage(msg) {
  // Make sure you are sending a string, and to stringify JSON
  iframe.contentWindow.postMessage(msg, "*");
}

// Listen to message from child window
bindEvent(window, "message", e => {});

$(document).ready(() => {
  // Create project iframe
  iframe = document.createElement("iframe");
  iframe.setAttribute("src", "./project/index.html");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  // Add iframe
  var mainContainer = document.getElementById("container-project");
  mainContainer.style.overflowY = "hidden";
  mainContainer.appendChild(iframe);

  document.addEventListener("timeline-scroll", e => {
    let dotDate = moment(e.detail.date);
  });

  document.addEventListener("timeline-loadDotContent", e => {
    let dotID = e.detail.id;
    // Communicate to my iframe
    sendMessage(JSON.stringify({ id: dotID }));
  });
});
