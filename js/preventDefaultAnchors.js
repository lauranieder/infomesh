//console.log('[preventDefaultAnchors.js] started script');
(function () {
  window.addEventListener('dom-ready', function () {
    //console.log('[preventDefaultAnchors.js] dom ready');
    window.parent.postMessage({
      message: 'request-mode'
    }, '*');

    $(window).on('message', function (e) {
      var data = e.originalEvent.data;
      var mode = data.mode;

      if (mode && mode === 'expo') {
        //console.log('*****************************');
        //console.log('********* EXPO MODE *********');
        //console.log('*****************************');
        var anchors = document.querySelectorAll('a');
      //console.log(anchors.length + ' links found');

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
              var iframeType = this.getAttribute('iframeType');

              switch (iframeType) {
                case 'proxy':
                  window.parent.postMessage({
                    message: 'anchor',
                    href: 'http://localhost/proxy.php/?url=' + href
                  }, '*');
                break;
                case 'twitter':
                  window.parent.postMessage({
                    message: 'anchor',
                    href: 'http://localhost/twitter.php/?url=' + href
                  }, '*');
                break;
                default:
                  window.parent.postMessage({
                    message: 'anchor',
                    href: href
                  }, '*');
                break;
              }
            }
          })
        }
      }
    })
  })
})()
