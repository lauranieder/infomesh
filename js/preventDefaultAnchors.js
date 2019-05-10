(function () {
  $(window).on('message', function (e) {
    var data = e.originalEvent.data;
    var mode = data.mode;

    if (mode === 'expo') {
      console.log('EXPO MODE');
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

              var useBaseUrl = this.getAttribute('useBaseUrl');
              if (!useBaseUrl || useBaseUrl === 'true') {
                if (href.indexOf(window.location.origin) === -1) {
                  window.parent.postMessage({
                    message: 'anchor',
                    href: href
                  }, '*');
                }
              } else if (useBaseUrl === 'false') {
                e.preventDefault();
                if (href.indexOf(window.location.origin) === -1) {
                  window.parent.postMessage({
                    message: 'anchor',
                    href: 'http://localhost/infomesh/proxy.php/?url=' + href
                  }, '*');
                }
              }
            })
          }
          clearInterval(findAnchorsInterval);
        }
      }, 100);
    }
  })
})()