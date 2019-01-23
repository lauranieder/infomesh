/* exported moveToBlockBy initDom */
/* globals dataReady */

var dataset = [];

$.getJSON("data/events.json", json => {
  // Remove hidden elements.
  for (var i = json.length - 1; i >= 0; i--) {
    if (json[i].hidden) {
      json.splice(i, 1);
    }
  }
  json.sort((a, b) => {
    return a.timestamp - b.timestamp;
  });
  dataset = json;
  console.log("Total dataset length:", dataset.length);
  dataReady();
});

var container;
var currentBlock = 0;

function initDom() {
  container = document.getElementById("container");

  prepareDataset();
  for (let i = 0; i < dataset.length; i++) {
    createBlock(dataset[i], i);
  }

  goToBlock(0);
}

function prepareDataset() {
  for (let i = 0; i < dataset.length; i++) {
    dataset[i].index = i;
    dataset[i].id = indexToId(i);
  }
}

function createBlock(data) {
  var eventBlockWrapper = document.createElement("div");
  eventBlockWrapper.className = "block-wrapper";
  container.appendChild(eventBlockWrapper);

  var eventBlock = document.createElement("div");
  eventBlock.id = data.id;
  eventBlock.className = "block";
  eventBlockWrapper.appendChild(eventBlock);

  eventBlock.style.width =
    map_range(data.descriptionText.length, 200, 800, 50, 100, true) + "%";

  var title = document.createElement("div");
  title.className = "block-title";
  title.textContent = data.year + ", " + data.name;
  eventBlock.appendChild(title);
  var description = document.createElement("div");
  description.className = "block-description";
  if (data.visualValue) {
    description.innerHTML = `${data.description}
    <br/><br/>
    ${data.visualValue.toLocaleString()}${data.visualValueSuffix}`;
  } else {
    description.innerHTML = data.description;
  }
  eventBlock.appendChild(description);

  // Now that we have added all the content, we can calculate the height
  // of the div to determine an offset.
  if (data.index !== 0) {
    setRandomY(eventBlockWrapper);
  }
}

function setRandomY(element) {
  var height = element.clientHeight;
  var available = window.innerHeight - height;
  var offset = Math.floor((Math.random() - 0.5) * (available + height / 4));
  element.style.transform = "translateY(" + offset + "px)";
}

function moveToBlockBy(step) {
  goToBlock(currentBlock + step);
}

function indexToId(index) {
  return "event-" + index;
}

function goToBlock(newIndex, isTimelineEvent) {
  if (newIndex >= dataset.length) {
    newIndex = 0;
  }
  if (newIndex < 0) {
    newIndex = dataset.length - 1;
  }
  var lastIndex = currentBlock;
  updateOldBlocks(lastIndex, newIndex);
  currentBlock = newIndex;

  if (!isTimelineEvent) {
    timelineGoToId(currentBlock);
  }
  updateNewBlocks();
  updateContainer();
  window.onNewVisual_renderer(dataset[currentBlock]);
  window.onNewVisual_anim(dataset[currentBlock]);
}

function updateContainer() {
  var e = document.getElementById(indexToId(currentBlock));
  container.style.transform = "translateX(" + -e.parentNode.offsetLeft + "px)";
}

function updateOldBlocks(lastIndex) {
  var e = document.getElementById(indexToId(lastIndex));
  setRandomY(e.parentNode);
}

function updateNewBlocks() {
  for (var i = 0; i < container.children.length; i++) {
    $(container.children[i].firstChild).toggleClass(
      "ancientHistory",
      Boolean(i < currentBlock)
    );
    $(container.children[i].firstChild).toggleClass(
      "futureHistory",
      Boolean(i > currentBlock)
    );
    if (i === currentBlock) {
      container.children[i].style.transform = "translateY(" + 0 + "px)";
    }
    // $(container.children[i]).toggleClass(
    //   "currentHistoryWrapper",
    //   Boolean(i === currentBlock)
    // );
  }
}

window.addEventListener("resize", () => {
  updateNewBlocks();
  updateContainer();
});
