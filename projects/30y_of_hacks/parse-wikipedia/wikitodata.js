console.log("hey");

var year = 1900;
var data = [];

for (var i = 0; i < document.body.children.length; i++) {
  var child = document.body.children[i];
  // console.log(child.tagName);
  switch (child.tagName) {
    case "H2":
      document.body.removeChild(child);
      i--;
      break;
    case "H3":
      analyseH3(child);
      break;
    case "UL":
      analyseUL(child);
      break;
  }
  // console.log(child);
  // if (i > 5) break;
}
console.log(data);

var dataStr =
  "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
var dlAnchorElem = document.getElementById("downloadAnchorElem");
dlAnchorElem.setAttribute("href", dataStr);
dlAnchorElem.setAttribute("download", "scene.json");
// dlAnchorElem.click();

function analyseH3(e) {
  year = parseInt(e.children[0].textContent);
  console.log(year);
}

function analyseUL(e) {
  for (var j = 0; j < e.children.length; j++) {
    var child = e.children[j];
    if (child.tagName === "LI") {
      analyseLI(child);
    }
  }
}

function analyseLI(e) {
  var citations = e.getElementsByTagName("sup");
  for (var i = 0; i < citations.length; i++) {
    e.removeChild(citations[i]);
    i--;
  }
  // console.log(e);
  // console.log(Date.parse(e.textContent));
  var timestamp = findDate(e.textContent);
  // console.log(timestamp);

  var newData = {
    name: "",
    description: e.innerHTML,
    descriptionText: e.textContent,
    source: "https://en.wikipedia.org/wiki/List_of_security_hacking_incidents",
    year: year,
    timestamp: timestamp,
    type: "incident",
    visualValue: 0
  };
  data.push(newData);
}

function findDate(str) {
  var twoDotsIndex = str.indexOf(":");
  if (twoDotsIndex < 0) return yearDate();

  // Extract the text until the first semicolon, where the date probably is (if any).
  var text = str.substring(0, twoDotsIndex);
  // If the year is missing, add it at the end.
  if (text.indexOf(String(year)) < 0) {
    text += ", " + year;
  }
  // Parse our string.
  var timestamp = Date.parse(text);
  // If parsing failed, return the beginning of the year by default.
  if (!timestamp) {
    return yearDate();
  }

  return timestamp;
}

function yearDate() {
  return Date.parse("" + year);
}
