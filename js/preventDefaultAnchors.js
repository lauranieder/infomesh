(function () {
  var anchors = document.querySelectorAll('a');
  var findAnchorsInterval = setInterval(function () {
    anchors = document.querySelectorAll('a');
    if (anchors.length > 0) {
      for (var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          var target = e.target;
          var href = target.href;

          if (!href) {
            var parentNode = target.parentNode;
            href = parentNode.href.baseVal;
          }

          if (href.indexOf(window.location.origin) === -1) {
            window.parent.postMessage({
              message: 'anchor',
              href: href
            }, '*');
          }
        })
      }
      clearInterval(findAnchorsInterval);
    }
  }, 100);
})()