/* exported moveToBlockBy initDom */
/* globals dataReady timelineGoToId */

var dataset = [];
var resizing = false;

$.getJSON("./events.json", function(json) {
  // Remove hidden elements.
  for (var i = json.length - 1; i >= 0; i--) {
    if (json[i].hidden) {
      json.splice(i, 1);
    }
  }
  json.sort(function(a, b) {
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
  for (var i = 0; i < dataset.length; i++) {
    createBlock(dataset[i], i);
  }

  goToBlock(0);

  const domReadyEvent = new Event('dom-ready');
  window.dispatchEvent(domReadyEvent);
}

function prepareDataset() {
  for (var i = 0; i < dataset.length; i++) {
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
  var description = document.createElement("bockquote");
  description.cite = data.readmore;
  description.className = "block-description";
  description.innerHTML = "“" + data.content + "”";
  eventBlock.appendChild(description);

  var stats = document.createElement("div");
  stats.className = "block-stats";
  eventBlock.appendChild(stats);
  var icon = document.createElement("img");
  icon.src = "assets/imgs/img-" + data.type + "-icon.png";
  icon.className = "vertical-center";
  stats.appendChild(icon);
  var legend = document.createElement("span");
  var legendStr = getTypeName(data.type);
  if (data.visualValue) {
    var suffix = data.visualValueSuffix.trim();
    var num = data.visualValue;
    if (suffix === "%") num = Math.floor(num * 100);
    legendStr += ": " + num.toLocaleString("en-US") + " " + suffix;
  }
  legend.textContent = legendStr;
  legend.className = "vertical-center";
  stats.appendChild(legend);

  var readmore = document.createElement("cite");
  var readmoreLink = document.createElement("a");
  readmoreLink.target = "_blank";
  readmoreLink.rel = "noopener noreferrer";
  if (data.readmore) {
    readmoreLink.href = data.readmore;
    readmoreLink.textContent = "Read more on " + getDomainTitle(data.readmore);
  } else {
    readmoreLink.href = data.source;
    readmoreLink.textContent =
      data.source === "https://en.wikipedia.org/wiki/List_of_data_breaches"
        ? "Source: Data breach list on Wikipedia"
        : "Source: Event list on Wikipedia";
  }
  readmore.appendChild(readmoreLink);

  eventBlock.insertBefore(readmore, stats);

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
  law: "Governmental event",
  foundation: "Foundation",
  moneyTheft: "Money theft",
  loss: "Loss",
  virus: "Virus",
  defacement: "Defacement",
  infiltration: "Infiltration",
  breach: "Data breach",
  dataTheft: "Data theft",
  hack: "Hack",
  leak: "Data leak",
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
  // Loop the timeline
  if (newIndex >= dataset.length) newIndex = 0;
  if (newIndex < 0) newIndex = dataset.length - 1;

  // Reset the randomized height
  var lastIndex = currentBlock;
  updateOldBlocks(lastIndex, newIndex);
  currentBlock = newIndex;

  if (!isTimelineEvent) timelineGoToId(currentBlock);
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
  var leftAlign = -e.parentNode.offsetLeft;
  var center = leftAlign - e.offsetWidth / 2 + window.innerWidth / 2;
  container.style.transform = "translateX(" + center + "px)";
}

function updateOldBlocks(lastIndex) {
  var e = document.getElementById(indexToId(lastIndex));
  setRandomY(e.parentNode);
}

function updateNewBlocks() {
  for (var i = 0; i < container.children.length; i++) {
    var child = $(container.children[i].firstChild);
    child.toggleClass("ancientHistory", Boolean(i < currentBlock));
    child.toggleClass("futureHistory", Boolean(i > currentBlock));
    if (i === currentBlock) {
      container.children[i].style.transform = "translateY(" + 0 + "px)";
    }
    // $(container.children[i]).toggleClass(
    //   "currentHistoryWrapper",
    //   Boolean(i === currentBlock)
    // );
  }
}

window.addEventListener("resize", function() {
  // Don't update if we're in a resizing event from the left infomesh panel.
  if (!resizing) {
    updateNewBlocks();
    updateContainer();
  }
});

// Receive the UI resizing events from infomesh, to avoid glitchy UI.
$(window).on("message", function(e) {
  if (e.originalEvent.data.message == "isExtended") {
    resizing = true;
    setTimeout(function() {
      resizing = false;
      updateNewBlocks();
      updateContainer();
    }, 540);
  }
});

function getDomainTitle(urlStr) {
  var url = new URL(urlStr);
  var domain = url.hostname;
  domain = domain.replace("www.", "").replace(/^en\./, "");
  return domain;
}
