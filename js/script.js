/*
main script
- iframe gestion
- hide/show left container
- create projects
*/
$(document).ready(function() {
  console.log("[script.js] loaded");
  var projectsData;
  var currentProjectID = 0;
  var siteTitle = document.title;
  var timelinePosition = 0;
  var isPopupReduced = false;
  var isMobile = false;
  var historyState = {};

  function init() {
    loadProjectsJson();
  }

  //PROJECTS LISTS___________________________________________________________________________________________________
  //load the list of projects from json
  function loadProjectsJson(){
    $.ajax({
      dataType: "json",
      url: "./data/projects.json",
      mimeType: "application/json",
      success: function(data){
        projectsData = data;
        loadProjectsPreview();
        enableHistory();
        renderState(getUrlParam());
      }
    })
  }

  // History management
  function enableHistory () {
    var links = $('a');

    links.click(function (e) {
      if (!e.currentTarget.hasAttribute("data-externallink")) {
        e.preventDefault()
        var target = e.target;
        var href = target.href;
        window.history.pushState(historyState, '', href);
  
        // We have to wait a bit until the url is updated
        window.requestAnimationFrame(function () {
          renderState(getUrlParam());
        })
      } 

      
    });

    $(window).on('popstate', function () {
      // We have to wait a bit until the url is updated
      window.requestAnimationFrame(function () {
        renderState(getUrlParam());
      })
    });
  }

  function getUrlParam () {
    return window.location.href.split('/').pop();
  }

  function renderState (state) {
    if (isMobile) {
      $('#container-side').addClass('mobile-reduced');
      mobile_applyStyleToNav();
    }

    // Wait on the next frame to compute height with content.
    requestAnimationFrame(function () {
      updateDescriptionShadow();
    })

    switch (state) {
      case '':
        $('#container-main').removeClass('main');
        $('#container-main').addClass('reduced');

        window.startSplashscreen();
      break;

      case 'index':
        window.stopSplashscreen();
        openProjectsPage();
      break;

      case 'about':
        window.stopSplashscreen();
        openAboutPage();
      break;

      default:
        window.stopSplashscreen();
        var projectId = findProjectIdBySlug(state);

        // If a project correspond to the URL
        if (projectId !== undefined) {
          gotoProject(projectId, 'up');
        }
      break;
    }
  }

  //load each project
  function loadProjectsPreview(){
    $.each(projectsData, function() {
      var link = $('<a href="'+ this.slug +'" class="font-large">'+this.title+'</a>');
      $('#container-projects').append(link);
    });
  }

  function findProjectIdBySlug (slug) {
    for (var i = 0; i < projectsData.length; i++) {
      if (slug === projectsData[i].slug) {
        return i;
      }
    }
  }

  function gotoProject(index, direction) {
    $('#button-open-projects').addClass('selected');
    $('#button-open-about').removeClass('selected');
    $('#navigation nav').removeClass('d-none');
    $('#container-main').addClass('main').removeClass('reduced');
    $('#container-about, #container-projects').addClass('reduced').removeClass('main');
    if (isMobile) {
      $('.mobile-onlytimeline').removeClass('d-none');
      $('#button-closeOverlay').addClass('d-none');
      $('#button-menu').removeClass('d-none');
    }else{

    }
    if (!direction) direction = 'none';
    loadProject(index, direction);
  }

  /*OPEN A PROJECT*/
  function loadProject(index, direction) {
    //console.log("loadProject");
    currentProjectID = index;
    const project = projectsData[index];

    $('#project-title').text(project.title);
    $('#container-title').text(project.title);
    $('#project-title').attr("slug",project.slug);
    if(project.source !=null){
      $('#project-text p:first').html(project.text+"<br/><br/>"+project.source);
    }else{
      $('#project-text p:first').html(project.text);
    }

    $('#project-credits p:first').html("Designed by "+project.student); //or created by

    $('.current-iframe').addClass('previous-iframe').removeClass('current-iframe');

    // 🤔not sure if ok in every case
    if (isMobile) {
      $('#navigation').removeClass("background-white");
      $('#navigation').removeClass("background-black");

      $('#navigation').addClass(project.style);
    }

    var iframe = $('<iframe class="current-iframe appear-' + direction + '" src="./projects/' + project.slug + '">');
    $('#container-main').append(iframe);
    $('#timeline-barre').css('transition','all 100ms cubic-bezier(0.23, 1, 0.32, 1)');
    $('#timeline-barre #timeline-background').css('transition','all 100ms cubic-bezier(0.23, 1, 0.32, 1)');
    //$('#timeline-barre').css('background-color','rgba(255,255,255,1)');
    $('#timeline-barre #timeline-background').css('opacity','1');

    $('#navigation').removeClass('background-blue');
    $('#navigation').removeClass('background-white');
    $('#navigation').removeClass('background-black');
    var style = projectsData[currentProjectID].style;
    $('#navigation').addClass(style); //alone
    console.log("[script.js] iframe append");

    /*back here*/
    //ajouter extended reduced en fonction


    /*debugger le settimout iframe*/

    setTimeout(function() {
      console.log("[script.js] iframe move");

      $('.previous-iframe').addClass('move-' + direction);
      $('.current-iframe').removeClass('appear-' + direction);
      if($('.previous-iframe').get(0) != null && $('.previous-iframe').get(0) != undefined){
        $('.previous-iframe').get(0).contentWindow.postMessage({message: 'hideTimeline'}, '*');
      }
      $('.current-iframe').get(0).contentWindow.postMessage({message: 'hideTimeline'}, '*');
      console.log("offset "+$('.current-iframe').get(0).getBoundingClientRect().top);

    }, 100); //100

    function checkLoop () {
      if (!checkIframePos()) {
        requestAnimationFrame(checkLoop);
      } else {
        removePreviousIframe();
      }
    }

    checkLoop();

    function checkIframePos(){
      var offsetTop = $('.current-iframe').get(0).getBoundingClientRect().top;
      return offsetTop <= 0;
    }

    function removePreviousIframe(){
      if(
        $('.previous-iframe').get(0) != null
        && $('.previous-iframe').get(0) != undefined
      ){
        $('.previous-iframe').get(0).contentWindow.postMessage({message: 'showTimeline'}, '*');
      }
      $('.current-iframe').get(0).contentWindow.postMessage({message: 'showTimeline'}, '*');
      $('.previous-iframe').remove();
      $('#timeline-barre').css('transition','all 500ms cubic-bezier(0.23, 1, 0.32, 1)');
      $('#timeline-barre #timeline-background').css('transition','all 500ms cubic-bezier(0.23, 1, 0.32, 1)');
      $('#timeline-barre #timeline-background').css('opacity','0');
    }
  }



  //__________________________________________________________________________
  //MOBILE
  function mobileCheck(x) {
    if (x.matches) { // If media query matches
      //console.log("[mobileCheck] mobile");
      isMobile = true;
    } else {
      //console.log("[mobileCheck] desktop");
      isMobile = false;
    }
  }
  var x = window.matchMedia("(max-width: 800px)");
  mobileCheck(x); // Call listener function at run time
  x.addListener(mobileCheck); // Attach listener function on state changes


  //BUTTONS___________________________________________________________________________________________________
  $('#button-toggle-informations').on('click', function(e) {
    toggleInformation();
  });

  //Toggle left container
  function toggleInformation() {
    $('#container-side').toggleClass('reduced');
    //console.log("toggle info and deal with style");
    $('#container-main').toggleClass('extended');
    applyStyleToIframe();
  }

  //Apply style extended/not extended
  function applyStyleToIframe(){
    if($('#container-main').hasClass('extended')){
      $('.current-iframe').get(0).contentWindow.postMessage({message: 'isExtended', status: true}, '*');
      if(isMobile){
        mobile_applyStyleToNav();
      }else{
        $('#navigation').removeClass('not-extended'); //alone
      }

    }else{
      $('.current-iframe').get(0).contentWindow.postMessage({message: 'isExtended', status: false}, '*');
      //$('#navigation').removeClass(style);
      if(isMobile){
        mobile_applyStyleToNav();
      }else{
        $('#navigation').addClass('not-extended'); //alone
      }
    }
  }

  //Apply style extended/not extended mobile
  function mobile_applyStyleToNav(){
    if($('#container-side').hasClass('mobile-reduced')){
        $('#navigation').removeClass('not-extended');
    }else{
      $('#navigation').addClass('not-extended');
    }
  }

  //only on mobile with burger menu
  function openMenu(){
    //console.log("openMenu");
    if(isMobile){
      //console.log("open menu : is reduced was " +$('#container-side').hasClass('mobile-reduced'));
      //console.log("main is reduced " +$('#container-main').hasClass('reduced')); //if it is not reduced means a project is open
      if($('#container-main').hasClass('reduced')){ //not project open
        $('#project-title').text(siteTitle);
        $('#container-title').text(siteTitle);
        //$('nav-mobile').addClass('d-none');
      }else{
        $('#button-closeOverlay').removeClass('d-none');
      }
      $('#button-menu').addClass('d-none');
      $('.mobile-onlytimeline').addClass('d-none');

      $('#container-side').removeClass('mobile-reduced');
      mobile_applyStyleToNav();
    }
  }

  function closeOverlay(){
    //console.log("open menu : is reduced was " +$('#container-side').hasClass('mobile-reduced'));
    //console.log("main is reduced " +$('#container-main').hasClass('reduced')); //if it is not reduced means a project is open
    if(isMobile){
      //console.log("closeOverlay");
      $('#button-menu').removeClass('d-none');
      $('.mobile-onlytimeline').removeClass('d-none');
      $('#button-closeOverlay').addClass('d-none');
      $('#container-side').addClass('mobile-reduced');
      mobile_applyStyleToNav();
    }
  }

  function updateDescriptionShadow () {
    var containerCredits = $('#container-credit');
    var containerCreditsInner = $('#container-credit-inner');

    if (containerCreditsInner.height() > containerCredits.height()) {
      $('#container-menu').addClass('enable-shadow');
    } else {
      $('#container-menu').removeClass('enable-shadow');
    }
  }

  $(window).resize(function(){
    renderState(getUrlParam());
  });


  function openAboutPage(){
    console.log('[script.js] openAboutPage/ isMobile '+isMobile);
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
    $('#navigation nav').addClass('d-none');

    $('#container-about').addClass('main').removeClass('reduced');
    $('#container-main, #container-projects').addClass('reduced').removeClass('main');

    $('#navigation').removeClass('background-blue');
    $('#navigation').removeClass('background-white');
    $('#navigation').removeClass('background-black');

      if (isMobile) {
        $('#project-title').text("About");
        $('#container-title').text("About");
        $('#button-closeOverlay').addClass('d-none');
        $('#button-menu').removeClass('d-none');
        $('.mobile-onlytimeline').addClass('d-none');
        //$('#navigation').addClass('background-blue');
      }else{
        $('#project-title').text(siteTitle);
        $('#container-title').text(siteTitle);
      }

      $('#button-open-projects').removeClass('selected');
      $('#button-open-about').addClass('selected');
      $('#container-main').removeClass('main');
      $('#container-main').addClass('reduced');

      $('#container-side').removeClass('reduced');
      $('#container-main').removeClass('extended');

      $('#project-text p:first').text("");
      $('#project-credits p:first').text("");

      /*to improve*/
      //only for mobile
      $('#container-side').addClass('mobile-reduced');
  }


  function openProjectsPage(){
    console.log('[script.js] openProjectsPage/ isMobile '+isMobile);
    $('#navigation nav').addClass('d-none');

    $('#container-projects').addClass('main').removeClass('reduced');
    $('#container-about, #container-main').addClass('reduced').removeClass('main');

    $('#button-open-projects').addClass('selected');
    $('#button-open-about').removeClass('selected');
    $('#container-main').removeClass('main');
    $('#container-main').addClass('reduced');

    $('#container-side').removeClass('reduced');
    $('#container-main').removeClass('extended');

    $('#navigation').removeClass('background-blue');
    $('#navigation').removeClass('background-white');
    $('#navigation').removeClass('background-black');

    /*to improve*/
    //only for mobile
    $('#container-side').addClass('mobile-reduced');

    if(isMobile){
      $('#project-title').text("30 years of");
      $('#container-title').text("30 years of");
      $('#button-closeOverlay').addClass('d-none');
      $('#button-menu').removeClass('d-none');
      $('.mobile-onlytimeline').addClass('d-none');
      //$('#navigation').addClass('background-blue');


    }else{
      $('#project-title').text(siteTitle);
      $('#container-title').text(siteTitle);

    }

    $('#project-text p:first').text("");
    $('#project-credits p:first').text("");
  }



  $('.button-up').on('click', function(e) {
    var prevProject = currentProjectID - 1;
    if (prevProject < 0) prevProject = projectsData.length - 1;

    window.history.pushState(historyState, '', projectsData[prevProject].slug);
    gotoProject(prevProject, 'down');
  });

  $('.button-down').on('click', function(e) {
    var nextProject = currentProjectID + 1;
    if (nextProject == projectsData.length) nextProject = 0;

    window.history.pushState(historyState, '', projectsData[nextProject].slug);
    gotoProject(nextProject, 'up');
  });

  $('#button-timeline-left').on('click', function(e) {
    $('.current-iframe').get(0).contentWindow.postMessage({message: 'goleft'}, '*');
  });
  $('#button-timeline-right').on('click', function(e) {
    $('.current-iframe').get(0).contentWindow.postMessage({message: 'goright'}, '*');
  });

  //Only in mobile version
  $('#button-menu').on('click', function(e) {
    e.preventDefault();
    openMenu();
  });

  $('#button-closeOverlay').on('click', function(e) {
    e.preventDefault();
    closeOverlay();
  });


  var iframeClass = 'show-iframe-popup';

  $('.iframe-popup').click(function () {
    $('body').removeClass(iframeClass);
  });

  $(window).on('message', function(e) {
    var data = e.originalEvent.data;
    var message = data.message;

    switch (message) {
      case 'isPopReduced':
        isPopupReduced = data.status;
        break;
      case 'getPopupStatus':
        $('.current-iframe').get(0).contentWindow.postMessage({message: 'receivePopupStatus', status: isPopupReduced}, '*');
        break;
      case 'setScrollPosition':
        timelinePosition = data.position;
        break;
      case 'getScrollPosition':
        console.log("[script.js] iframe ask scroll position");
        $('.current-iframe').get(0).contentWindow.postMessage({message: 'receiveScrollPosition', position: timelinePosition}, '*');
        break;
      case 'getResponsive':
        $('.current-iframe').get(0).contentWindow.postMessage({message: 'isMobile', status: isMobile}, '*');
        break;
      case 'getStyles':
        console.log("[script.js] iframe ask styles");
        applyStyleToIframe();
        break;
      case 'request-mode':
        $('.current-iframe').get(0).contentWindow.postMessage({mode: window.appMode}, '*');
        break;
      case 'anchor':
        var href = data.href;
        var iframe = document.querySelector('.iframe-popup__content');
        iframe.src = href;

        if (!iframe.onload) {
          iframe.onload = function () {
            $('body').addClass(iframeClass);
          }
        }
        break;
    }
  });
  init();
});
