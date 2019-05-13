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
  var ignoreURLS = false; //put back to false !!!
  var isMobile = false;

  function init() {
    console.log('[script.js] init');
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
        if (currentPagetName == 'index') {
          $('#button-open-projects').trigger('click');
        } else if (currentPagetName == 'about') {
          $('#button-open-about').trigger('click');
        } else {
          var currentProjectID = getProjectIdFromName(currentPagetName);
          if (currentProjectID != -1) gotoProject(currentProjectID, 'up');
        }
      }
    })
  }

  //load each project
  function loadProjectsPreview(){
    $.each(projectsData, function(index, project) {
      var link = $('<a href="#" class="font-large button-open-project" data-id="'+index+'">'+project.title+'</a>');
      $('#container-projects').append(link);
    });
  }

  function getProjectIdFromName(name) {
    var projectID = -1;
    $.each(projectsData, function(index, item) {
      if (item.slug == name) projectID = index;
    });
    return projectID;
  }

  function gotoProject(index, direction) {

    $('#navigation nav').removeClass('d-none');
    $('#container-main').addClass('main').removeClass('reduced');
    $('#container-about, #container-projects').addClass('reduced').removeClass('main');
    if (!direction) direction = 'none';
    if (!ignoreURLS) history.pushState({index: index, direction: direction}, siteTitle + ' - ' + projectsData[index].title, projectsData[index].slug);
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
    $('#timeline-barre').css('background-color','rgba(255,255,255,1)');


    $('#navigation').removeClass('background-blue');
    $('#navigation').removeClass('background-white');
    $('#navigation').removeClass('background-black');
    var style = projectsData[currentProjectID].style;
    $('#navigation').addClass(style); //alone
    console.log("addClass "+style);


    /*back here*/
    //ajouter extended reduced en fonction

    /*debugger le settimout iframe*/
    setTimeout(function() {

      $('.previous-iframe').addClass('move-' + direction);
      $('.current-iframe').removeClass('appear-' + direction);
      if($('.previous-iframe').get(0) != null && $('.previous-iframe').get(0) != undefined){
        $('.previous-iframe').get(0).contentWindow.postMessage({message: 'hideTimeline'}, '*');
      }

      $('.current-iframe').get(0).contentWindow.postMessage({message: 'hideTimeline'}, '*');
      //applyStyleToIframe();
      console.log("Set timeout iframe 1 sended");

      //$('#timeline-barre').css('background-color','white');
    }, 100); //100

    setTimeout(function() {
      if($('.previous-iframe').get(0) != null && $('.previous-iframe').get(0) != undefined){
        $('.previous-iframe').get(0).contentWindow.postMessage({message: 'showTimeline'}, '*');
      }
      $('.current-iframe').get(0).contentWindow.postMessage({message: 'showTimeline'}, '*');
      console.log("[main] showTimeline sended / current iframe "+$('.current-iframe'));
      $('.previous-iframe').remove();
      $('#timeline-barre').css('transition','all 500ms cubic-bezier(0.23, 1, 0.32, 1)');
      $('#timeline-barre').css('background-color','rgba(255,255,255,0)');

    }, 3000); //500
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
    e.preventDefault();
    toggleInformation();
  });
  $('#button-open-about').on('click', function(e) {
    e.preventDefault();
    openAboutPage();
  });
  $('#button-open-projects').on('click', function(e) {
    e.preventDefault();
    openProjectsPage();
  });


  //Toggle left container
  function toggleInformation() {
    $('#container-side').toggleClass('reduced');
    console.log("toggle info and deal with style");
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
    console.log("openMenu");
    if(isMobile){
      console.log("open menu : is reduced was " +$('#container-side').hasClass('mobile-reduced'));
      console.log("main is reduced " +$('#container-main').hasClass('reduced')); //if it is not reduced means a project is open
      if($('#container-main').hasClass('reduced')){ //not project open
        $('#project-title').text(siteTitle);
        $('#container-title').text(siteTitle);
        //$('nav-mobile').addClass('d-none');
      }else{
          $('#button-closeOverlay').removeClass('d-none');
      }
      $('#button-menu').addClass('d-none');

      $('#container-side').removeClass('mobile-reduced');
      mobile_applyStyleToNav();
    }
  }

  function closeOverlay(){
    console.log("open menu : is reduced was " +$('#container-side').hasClass('mobile-reduced'));
    console.log("main is reduced " +$('#container-main').hasClass('reduced')); //if it is not reduced means a project is open
    if(isMobile){
      console.log("closeOverlay");
      $('#button-menu').removeClass('d-none');
      $('#button-closeOverlay').addClass('d-none');
      $('#container-side').addClass('mobile-reduced');
      mobile_applyStyleToNav();
    }
  }


  $(window).resize(function(){
    //console.log("resized");
    handleResize();
  });

  function openAboutPage(){
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        $('#navigation nav').addClass('d-none');

        $('#container-about').addClass('main').removeClass('reduced');
        $('#container-main, #container-projects').addClass('reduced').removeClass('main');

        if(!isMobile){
          /*$('#navigation nav-mobile').addClass('d-none');*/
          $('#project-title').text(siteTitle);
          $('#container-title').text(siteTitle);
        }else{ //mobile
          $('#project-title').text("About");
          $('#container-title').text("About");
          $('#button-closeOverlay').addClass('d-none');
          $('#button-menu').removeClass('d-none');

        }

        $('#project-text p:first').text("");
        $('#project-credits p:first').text("");

        /*to improve*/
        //only for mobile
        $('#container-side').addClass('mobile-reduced');

        if (!ignoreURLS) history.pushState({}, siteTitle , '/about');
  }

  function openProjectsPage(){
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
    $('#navigation nav').addClass('d-none');

    $('#container-projects').addClass('main').removeClass('reduced');
    $('#container-about, #container-main').addClass('reduced').removeClass('main');

    /*to improve*/
    //only for mobile
    $('#container-side').addClass('mobile-reduced');


    if(!isMobile){

      $('#project-title').text(siteTitle);
      $('#container-title').text(siteTitle);
    }else{
      $('#project-title').text("30 years of");
      $('#container-title').text("30 years of");
      $('#button-closeOverlay').addClass('d-none');
      $('#button-menu').removeClass('d-none');
    }

    $('#project-text p:first').text("");
    $('#project-credits p:first').text("");

    if (!ignoreURLS) history.pushState({}, siteTitle , '/index');
  }



  $('.button-up').on('click', function(e) {
    e.preventDefault();
    var prevProject = currentProjectID - 1;
    if (prevProject < 0) prevProject = projectsData.length - 1;

    gotoProject(prevProject, 'down');
  });

  $('.button-down').on('click', function(e) {
    e.preventDefault();
    var nextProject = currentProjectID + 1;
    if (nextProject == projectsData.length) nextProject = 0;

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

  $('body').on('click', '.button-open-project', function(e) {
    e.preventDefault();
    gotoProject($(this).data('id'), 'up');
  });


  function handleResize(){
    console.log("handleResize -> isMobile "+isMobile);
    if(isMobile){

    }
  }

  $(window).bind('popstate', function(data) {
    if (!data.originalEvent.state) loadProject(0, 'up');
    loadProject(data.originalEvent.state.index, data.originalEvent.state.direction);
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
        console.log("iframe ask scroll position");
        $('.current-iframe').get(0).contentWindow.postMessage({message: 'receiveScrollPosition', position: timelinePosition}, '*');
        break;
      case 'getResponsive':
        $('.current-iframe').get(0).contentWindow.postMessage({message: 'isMobile', status: isMobile}, '*');
        break;
      case 'getStyles':
        console.log("iframe ask styles position");
        applyStyleToIframe();
        break;
        /*continue here pietro*/
      case 'getMode':

        console.log("getmode sended by iframe "+data.mode);
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
