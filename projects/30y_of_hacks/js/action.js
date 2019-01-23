/* globals moment */

// addEventListener support for IE8
function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, eventHandler);
  }
}

// Create project iframe
var iframe = document.createElement("iframe");
iframe.setAttribute("src", "./project/index.html");
iframe.style.width = "100%";
iframe.style.height = "100%";
// document.body.appendChild(iframe);

// Send a message to the child iframe
var sendMessage = function(msg) {
  // Make sure you are sending a string, and to stringify JSON
  iframe.contentWindow.postMessage(msg, "*");
};
// Send random messge data on every button click
// bindEvent(messageButton, 'click', (e) => {
//     var random = Math.random();
//     sendMessage('' + random);
// });

// Listen to message from child window
bindEvent(window, "message", e => {
  console.log(e.data);
  var data = JSON.parse(e.data);
  console.log(data.id);
  console.log("Hey");
  let dot = $(".timeDot[idToLoad='" + data.id + "']");
  console.log("Hey");
  dot.click();
  window.goToDot(dot);
  console.log(dot);
  // console.log(goToDot);
});

$(document).ready(() => {
  // Add iframe
  var mainContainer = document.getElementById("container-project");
  mainContainer.style.overflowY = "hidden";
  mainContainer.appendChild(iframe);

  document.addEventListener("timeline-scroll", e => {
    console.log("[student-action.js] -----callback timeline-scroll");
    // let normal = moment(e.detail.normal);
    let dotDate = moment(e.detail.date);
    console.log(dotDate.format("DD/MM/YYYY"));
    // $("#container-main").html(dotDate.format("DD/MM/YYYY"));
  });

  document.addEventListener("timeline-loadDotContent", e => {
    let dotID = e.detail.id;

    console.log(
      "[student-action.js] -----callback timeline-loadDotContent " + dotID
    );
    //console.log(e.detail.normal);
    // let dot = $(".timeDot[idToLoad='" + dotID + "']");
    // dot.attr("startdate");
    // console.log("Loaded date : " + dot.attr("startdate"));
    sendMessage(JSON.stringify({ id: dotID }));
  });
});
