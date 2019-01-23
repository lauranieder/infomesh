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
iframe.setAttribute("src", "./index2.html");
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
// bindEvent(window, 'message', (e) => {
//     results.innerHTML = e.data;
// });

$(document).ready(() => {
  // Add iframe
  var mainContainer = document.getElementById("container-project");
  mainContainer.style.overflowY = "hidden";
  mainContainer.appendChild(iframe);

  //continuous scrolling vs une fois qu'on a fini de scroller*/
  document.addEventListener("timeline-scroll", e => {
    // console.log("[student-action.js] -----callback timeline-scroll");
    // let normal = moment(e.detail.normal);
    let normal = e.detail.normal;
    let date = e.detail.date;
    let year = date.year();
    // let dotDate = moment(e.detail.date);
    // console.log(dotDate.format("DD/MM/YYYY"));
    // $("#container-main").html(dotDate.format("DD/MM/YYYY"));
    sendMessage(JSON.stringify({ year: year }));
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
