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
    "The technology behind what we call the Internet today started way back in the 1960’s at MIT.",
    "The First Email Spam was sent by Gary Thuerk, who is nicknamed ‘ The Father of Spam’.",
    "China has treatment camps for Internet addicts. Sign me up!",
    "Over 37% of the internet is porn.",
    "Over 30,000 websites are hacked every day.",
    "There is high-speed Internet available on the way up to Mount Everest.",
    "The majority of Internet traffic by bots like Google and Malware, not humans.",
    "When Montenegro became independent from Yugoslavia, its Internet domain name went from .yu to .me.",
    "In the U.S., a journalist can face 105 years in jail for posting a link on the Internet.",
    "In America, 15% of the adults do not use the Internet.",
    "Researchers are debating on whether or not to recognize Internet addiction as a mental disorder.",
    "The first webcam was created in Cambridge to check the status of a coffee pot.",
    "Over 100,000 .com domains are registered every day.",
    "China has more internet users on mobile devices than on PCs.",
    "One-third of Italians have never used the Internet.",
    "Over 70% of all the emails sent are spam.",
    "The “Fi” in “WiFi” doesn’t stand for anything.",
    "By the end of 1993, there were only 623 websites on the Internet.",
    "It is estimated that 6% of the world’s population has an Internet addiction.",
    "LOL used to mean “lots of love” before “Laughing Out Loud” cemented its place.",
    "Only 38% of world’s population have access to the Internet once a year or more.",
    "In 2010, Finland became the first country in the world to make Internet access a legal right.",
    "The first pizza ever ordered on the internet was to Pizza Hut in 1994.",
    "The first physical item ever bought and sold on the Internet was a bag of marijuana around 1971.",
    "If the Internet went down for a day, 196 billion emails and 3 billion Google searches would have to wait.",
    "The current library at Alexandria has a copy of all the web pages that ever existed on the Internet since it started in 1996.",
    "The first illegal online transaction ever was Stanford students buying marijuana from MIT students.",
    "The term “surfing” the internet was coined in 1992 by an upstate New York librarian Jean Armour Polly.",
    "The most played song on Spotify is “Wake Me Up” by Avicii.",
    "Mark Zuckerberg’s original Facebook profile number ID is 4.",
    "The first ever YouTube video was uploaded on April 23, 2005. The video was called “Me at the zoo” and features Jawed Karim, one of the founders, at the San Diego Zoo.",
    "A single Google query uses 1,000 computers in 0.2 seconds to retrieve an answer.",
    "The original ‘Space Jam’ and ‘You’ve Got Mail’ websites are still live.",
    "Up to 15%-20% of the searches Google gets each day have never been Googled before.",
    "Over 500 million tweets are sent ever day. This figure is set to double within 2 years.",
    "The inventor of the modern world wide web, Tim Berners-Lee, was knighted by Queen Elizabeth.",
    "Mr. Berners-Lee uploaded the first image to the internet. It is of a joke band of women from the nuclear research lab CERN.",
    "The first website is still online: http://info.cern.ch/hypertext/WWW/TheProject.html.",
    "The most commonly searched question beginning with “What is” in 2013 was “What is twerking?”.",
    "The most expensive keyword in Google AdWords is “insurance”.",
    "The most popular Tumblr is the official updates page for Minecraft.",
    "Gangnam Style” by Psy is the undisputed champion of videos with most views on YouTube. It’s been viewed over two billion times.",
    "The first email was sent in 1971 by Ray Tomlinson to himself. He doesn’t remember what it said!",
    "The first registered domain was symbolics.com.",
    "The world record for the fastest time to log into a Gmail account stands at 1.16 seconds.",
    "It took only 5 years for the internet to reach a market audience of 50 million users. 5 times faster than Radio and 15 times faster than TV.",
    "The world record for fastest “texter” is held by a Brazilian teenager.",
    "Over 1 million babies have been born from people who met on Match.com.",
    "Online daters spend an average of $243 per year on online dating.",
    "WordPress, the most widely known Content Management System (CMS) approximately 63 million blogs.",
    "On the original “The Facebook” website, Al Pacino’s face can be seen in the upper left-hand corner.",
    "The “@” symbol was used to signify that the message was sent to a person instead of a machine.",
    "The first spam message sent to multiple recipients was sent in 1978 for DEC System 2020. As you can imagine, the 600 recipients were pissed off!",
    "Garfield the cartoon cat once offered a free email service.",
    "An estimated 65% of Americans watch TV and use the Internet simultaneously.",
    "Over 1 billion people watch videos on YouTube every month. That is an average of 4 hours each per month.",
    "Over 72 hours of video are uploaded to YouTube every minute.",
    "YouTube’s copyright-checking software scans over 100 years of video every day.",
    "The iPhone 3 is about 2,000 times faster than the Super Nintendo.",
    "It’s estimated that 80% of all images on the Internet are of naked women.",
    "The internet speed on the International Space Station is faster than the average internet speed in Australia.",
    "Canada is rated as “Third World” in Broadband Internet rating by Netflix.",
    "There’s a bigger part of the Internet, which is not linked with the common internet we use. It’s called ‘The Deep Web’ and is estimated to be 500 times larger than the common Internet (over 70%).",
    "In 1995, Newsweek published an article scoffing the future of the internet – the articles can be found here: http://www.newsweek.com/clifford-stoll-why-web-wont-be-nirvana-185306.",
    "In 2011, a 75 year-old woman in Georgia accidentally cut the fiber optic cable that provided internet to 90% of Armenia.",
    "An Institute in Colorado created the world’s most accurate clock, so accurate that it would not lose or gain a second in 20 million years. This is the same clock that is used for intern et time.",
    "AOL still brings in $600 million a year from dial up Internet subscriptions.",
    "There’s a whole demographic of “Homeless” Japanese youth, who live and sleep solely in Internet Cafés.",
    "Latvia has the 4th fastest average internet speeds. The US is in 14th place",
    "There is 3G cell service and internet capabilities at the peak of Mt. Everest.",
    "Robert Metcalfe predicted in 1995 that the internet would collapse a year later in 1996, and that would “eat his words” if it did not. In 1997, he blended a printed copy of that speech with liquid and drank the mixture.",
    "A 75-year-old Swedish woman has the world’s fastest Internet connection at 40 Gigabits/second.",
    "The Nigerian email scam is the modern version of another con called the Spanish Prisoner, which dates back to long before the Internet was invented.",
    "Saint Isidore of Seville is considered to be the Patron Saint of the Internet.",
    "All prisoners in Norway have internet in their cells.",
    "In 1995, the University of South California built a robotic garden that was open to anyone on the internet.",
    "Another one for the conspiracy theorists: the US military is developing software that will use fake profiles to influence internet conversations and spread pro-American propaganda.",
    "The internet took a total of 4 years to reach an audience of 50 million; it took radio 38 years, and television 13 years.",
    "35.6% of internet users are Asian.",
    "In Africa, 3 out of 100 surf the Internet.",
    "In Asia, 10 out of 100 surf the Internet.",
    "Around 18 countries still don’t have Internet connection.",
    "The first space tweet was sent in January of 2010 by Astronaut Timothy Creamer @Astro_TJ.",
    "There are 1,158 photos uploaded to Instagram every second.",
    "There are 1485 Skype calls made every second.",
    "There is 22,343GB of Internet traffic every second.",
    "Every Google query travels about 1,500 miles to a data center and back to return the answer to the user.",
    "The first emoticon is commonly credited to Kevin Mackenzie in 1979, but was a rather simple -)",
    "Remember Napster? In 1998, the first music file-sharing service Napster, went live and changed the way the Internet was used forever.",
    "Speaking of search – One THIRD of all Internet searches are specifically for pornography.",
    "The most common form of “cyber terrorism” is a DDOS, or Distributed Denial of Service attack.",
    "In developed countries, the average “digital birth” (the age at which a child first has an online presence) is around six months old.",
    "There are more devices connected to the Web than human beings.",
    "Amazon was supposed to be officially named ‘Cadabra’, Twitter named ‘Jitter’, and eBay ‘echobay’ named.",
    "Archie is considered the world’s first Internet search engine.",
    "PewDiePie is still richest YouTuber ever with a net worth of $7 million."
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


            console.log("write letter")
            // Replace with a requestAnimationFrame thing
            //this.currentTimeout = setTimeout(() => {
            this.currentTimeout = requestTimeout(() => {
              element.insertAdjacentHTML('beforeend', text[index]);
	              //element.innerHTML += text[index];
              //console.log(element.innerHTML);
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
  const mainTitle = document.querySelector('#project-title');
  const body = document.querySelector('body');
  const textAnimator = new TextAnimator()

  body.addEventListener('click', () => {
    if (isSplashscreenEnabled()) {
      // Debouce state changes to prevent event conflicts.
      requestAnimationFrame(() => {
        enableSplashScreen(false);
        enableSplashScreenTitles(false);
        textAnimator.disable();
      });
    }
  })

  mainTitle.addEventListener('click', () => {
    if (!isSplashscreenEnabled()) {
      // Debouce state changes to prevent event conflicts.
      requestAnimationFrame(() => {
        enableSplashScreen(true);
        textAnimator.enable();
        startSequence()
      });
    }
  })

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

  async function startSequence() {
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
