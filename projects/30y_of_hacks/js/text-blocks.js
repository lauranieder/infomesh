/* exported moveToBlockBy initDom */
/* globals dataReady */

var dataset = [];
var resizing = false;

$.getJSON("./events.json", json => {
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
  container = document.getElementById("container-textblocs");

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

  // TODO recall on resize
  if (window.innerWidth < 768) {
    eventBlock.style.width = "auto";
  } else
    eventBlock.style.width =
      map_range(data.contentText.length, 200, 400, 70, 100, true) + "%";

  var title = document.createElement("div");
  title.className = "block-title";
  title.textContent = data.title;
  eventBlock.appendChild(title);
  var description = document.createElement("div");
  description.className = "block-description";
  description.innerHTML = data.content;
  eventBlock.appendChild(description);

  var stats = document.createElement("div");
  stats.className = "block-stats";
  eventBlock.appendChild(stats);
  var icon = document.createElement("img");
  icon.src = `assets/imgs/img-${data.type}-icon.png`;
  icon.className = "vertical-center";
  stats.appendChild(icon);
  var legend = document.createElement("span");
  var legendStr = getTypeName(data.type);
  if (data.visualValue) {
    legendStr += `: ${data.visualValue.toLocaleString(
      "en-US"
    )} ${data.visualValueSuffix.trim()}`;
  }
  legend.textContent = legendStr;
  legend.className = "vertical-center";
  stats.appendChild(legend);

  if (data.readmore) {
    var readmore = document.createElement("div");
    var readmoreLink = document.createElement("a");
    readmoreLink.href = data.readmore;
    readmoreLink.textContent = "Read more";
    readmoreLink.target = "_blank";
    readmore.appendChild(readmoreLink);
    eventBlock.appendChild(readmore);
  }

  // Now that we have added all the content, we can calculate the height
  // of the div to determine an offset.
  if (data.index !== 0) {
    setRandomY(eventBlockWrapper);
  }
}

var typeNames = {
  media: "New media",
  newAttackType: "New attack type",
  incident: "Security incident",
  law: "Legislation event",
  foundation: "Foundation",
  moneyTheft: "Money theft",
  other: "Other",
  virus: "Virus",
  defacement: "Defacement",
  infiltration: "Infiltration",
  breach: "Data breach",
  dataTheft: "Data theft",
  hack: "Hack",
  ransomware: "Ransomware",
  destructive: "Destructive hack"
};

function getTypeName(type) {
  return typeNames[type];
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
  var forward = newIndex > currentBlock;
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
  updateYear();

  window.dispatchEvent(
    new CustomEvent("blockchange", {
      detail: { data: dataset[currentBlock], forward: forward }
    })
  );
}

var yearBlock = document.getElementById("text-year");
function updateYear() {
  yearBlock.textContent = dataset[currentBlock].year;
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
  // Don't update if we're in a resizing event from the left infomesh panel.
  if (!resizing) {
    updateNewBlocks();
    updateContainer();
  }
});

// Receive the UI resizing events from infomesh, to avoid glitchy UI.
$(window).on("message", e => {
  if (e.originalEvent.data.message == "isExtended") {
    resizing = true;
    setTimeout(() => {
      resizing = false;
      updateNewBlocks();
      updateContainer();
    }, 3000); // TODO: update with final transition value.
  }
});
