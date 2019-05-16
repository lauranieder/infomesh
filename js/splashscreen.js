/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */

window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

window.requestTimeout = function(fn, delay) {
	if( !window.requestAnimationFrame      	&&
	    !window.webkitRequestAnimationFrame &&
	    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
	    !window.oRequestAnimationFrame      &&
	    !window.msRequestAnimationFrame )
		return window.setTimeout(fn, delay);

	var start = new Date().getTime(),
		handle = new Object();

	function loop(){
		var current = new Date().getTime(),
			delta = current - start;

		delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
	};

	handle.value = requestAnimFrame(loop);
	return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
    clearTimeout(handle);
};




(function () {
  const facts = [
		"The top search term on Google in 2019 was Facebook.",
	 "30,000 websites are identified as hosting malware every day.",
	 "10% of Americans do not use the Internet.",
	 "The first webcam was aimed at a coffee pot.",
	 "380 websites are created every 60 seconds.",
	 "There were only 623 websites in 1993.",
	 "44.9% of world’s population lacks internet access.",
	 "Finland declared Internet access a legal right in 2010.",
	 "A 75 year-old woman in Georgia cut the internet cable for 90% of Armenia in 2011. She said she had never heard of the World Wide Web.",
	 "As of 2014, mobile devices outnumbered human beings.",
	 "The most-read biography on Wikipedia in 2018 was Meghan, Duchess of Sussex.",
	 "Google's search engine is visited by 1.17 billion users monthly.",
	 "The first search engine was called Archie. It was created in 1990, when there were 10 websites.",
	 "With 1990's Web speeds and compression rates, a 4-minute song would take 3.5 hours to download.",
	 "One of the first video-on-demand services launched in Hong Kong in 1998. It went bankrupt in 2002."

  ]

  const TextAnimator = function() {
    let isWriting = false;
    let isSelecting = false;
    let isEnabled = false;
    let currentTimeout = null;
    let currentResolve = null;

    return {
      async write(element, text) {
        isWriting = true;
        let index = 0;

        return new Promise(resolve => {
          this.currentResolve = resolve
          const writeLetter = () => {
            this.currentTimeout = requestTimeout(() => {
              element.insertAdjacentHTML('beforeend', text[index]);
              index++;
              if (index < text.length && isWriting && !isEnabled) {
                writeLetter();
              } else {
                isWriting = false;
                resolve();
              }
            }, 20 + Math.random() * 20);
          };

          writeLetter();
        })
      },

      async erase(element) {
        const selection = await this.select(element);
        await this.wait(200);
        deleteSelectionContent(selection);
      },

      async select(element) {
        isSelecting = true;

        const { innerText: text } = element;
        let index = text.length;

        return new Promise(resolve => {
          currentResolve = resolve
          const selectLetter = () => {
            currentTimeout = setTimeout(() => {
              const selection = selectText(element, index, text.length);
              if (index > 0 && isSelecting && !isEnabled) {
                index--;
                selectLetter();
              } else {
                isSelecting = false;
                resolve(selection);
              }
            }, 10 + Math.random() * 10);
          }

          selectLetter();
        })
      },

      async wait(delay) {
        if (!isEnabled) {
          return new Promise(resolve => {
            currentResolve = resolve;
            currentOffset = setTimeout(resolve, delay);
          })
        }
      },

      enable() {
        isEnabled = false;
      },

      disable() {
        isEnabled = true;
        isWriting = false;
        isSelecting = false;

        clearTimeout(currentTimeout);
        if (currentResolve) {
          currentResolve();
        }
      }
    }
  }

  const titleText = 'Information mesh';
  const subTitle = '30 years of facts about the World Wide Web';
  const firstFact = 'Information Mesh was a potential name for the web in Tim Berners Lee\'s 1989 original proposal.';
  const title = document.querySelector('.splashscreen-main-title h5');
  const body = document.querySelector('body');
  const textAnimator = new TextAnimator()

  window.startSplashscreen = function () {
    requestAnimationFrame(() => {
      enableSplashScreen(true);
      textAnimator.enable();
      startSplashscreenSequence()
    });
  }

  window.stopSplashscreen = function () {
    requestAnimationFrame(() => {
      enableSplashScreen(false);
      enableSplashScreenTitles(false);
      textAnimator.disable();
    });
  }

  function isSplashscreenEnabled() {
    return body.classList.contains('show-splashscreen');
  }

  function enableSplashScreen(enable) {
    if (enable) {
      body.classList.add('show-splashscreen');
    } else {
      body.classList.remove('show-splashscreen');
    }
  }

  function enableSplashScreenTitles(enable) {
    if (enable) {
      body.classList.add('enable-splashscreen-titles');
    } else {
      body.classList.remove('enable-splashscreen-titles');
    }
  }

  async function startSplashscreenSequence() {
    if (isSplashscreenEnabled()) {
      highlight(true);
      enableCaret(false);
      await textAnimator.erase(title);
      await textAnimator.wait(100);
      enableCaret(true);
      await textAnimator.write(title, titleText);
      await textAnimator.wait(3000);
      enableCaret(false);
      await textAnimator.erase(title);
      await textAnimator.wait(100);
      enableCaret(true);
      await textAnimator.write(title, subTitle);
      await textAnimator.wait(3000);
      enableCaret(false);
      await textAnimator.erase(title);
      await textAnimator.wait(100);
      highlight(false);
      enableCaret(true);
      await textAnimator.write(title, firstFact);
      await textAnimator.wait(3000);
      runSequence();
    }
  }

  async function runSequence() {
    highlight(false);
    enableCaret(false);
    await textAnimator.erase(title);
    enableSplashScreenTitles(isSplashscreenEnabled());
    await textAnimator.wait(100);
    const text = getRandomFact();
    enableCaret(true);
    await textAnimator.write(title, text);

    if (isSplashscreenEnabled()) {
      await textAnimator.wait(3000);
      runSequence();
    }
  }

  function enableCaret(enable) {
    if (enable) {
      title.classList.add('enable-caret');
    } else {
      title.classList.remove('enable-caret');
    }
  }

  function highlight(highlight) {
    if (highlight) {
      title.classList.add('title-bold');
    } else {
      title.classList.remove('title-bold');
    }
  }

  function getRandomFact() {
    var number = 100;
    if(window.isMobile){
      number = 70;
    }
    const fileteredFacts = facts.filter(it => it.length < number);
    return fileteredFacts[Math.floor(Math.random() * fileteredFacts.length)];
  }

  // Select a part of a text node
  function selectText(textElement, startOffset, endOffset) {
    if (window.isMobile) {
      return; // Deactivated on mobile layout - buggy
    }

    // Reset window selections
    removeSelections();
    const { innerText } = textElement;

    if (innerText.length > 0) {
      // Create a new range from the offsets
      const anchorNodeInfos = getTextNodeInformations(textElement, startOffset);
      const focusNodeInfos = getTextNodeInformations(textElement, endOffset);
      const range = document.createRange();
      const selection = window.getSelection();
      if (anchorNodeInfos) {
        range.setStart(anchorNodeInfos.textNode, anchorNodeInfos.textNodeOffset);
        range.setEnd(focusNodeInfos.textNode, focusNodeInfos.textNodeOffset);
        // Select the range
        selection.addRange(range);
      }
      return selection;
    }
  }

  function deleteSelectionContent(selection) {
    if (selection) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      return selection;
    }
  }

  function removeSelections() {
    const selection = window.getSelection();
    selection.empty();
  }

  function getTextNodeInformations(textElement, offset) {
    let currentOffset = 0;
    let textNodeOffset = 0;
    let textNode = null;

    // Traverse childNodes to find #text nodes.
    traverseChidNodes(textElement, child => {
      // Find the right #text node where we can find the correct offset
      if (
        child.nodeName === '#text' &&
        offset >= currentOffset &&
        offset <= currentOffset + child.nodeValue.length
      ) {
        textNode = child;
        textNodeOffset = offset - currentOffset;
      }
      currentOffset += child.nodeValue.length;
    })
    return {
      textNode,
      textNodeOffset
    }
  }

  function traverseChidNodes(element, callback) {
    for (const child of element.childNodes) {
      callback(child);
      if (child.childNodes) {
        traverseChidNodes(child, callback);
      }
    }
  }
})();
