/*
main script
- iframe

*/
var projectsData;
var currentProjectID = 0;
var siteTitle = document.title;
var timelinePosition = 0;
var isPopupReduced = false;
var ignoreURLS = false; //put back to false !!!
var isMobile = false;

function mobileCheck(x) {
  if (x.matches) { // If media query matches
    console.log("mobile");
    isMobile = true;
    //cellwidth = 16.666;
    //$('.current-iframe').get(0).contentWindow.postMessage({message: 'responsive'}, '*');
  } else {
    //document.body.style.backgroundColor = "pink";
    console.log("desktop");
    isMobile = false;
    //cellwidth = 8.333;
    //$('.current-iframe').get(0).contentWindow.postMessage({message: 'responsive'}, '*');
  }
}
var x = window.matchMedia("(max-width: 800px)");
mobileCheck(x); // Call listener function at run time
x.addListener(mobileCheck); // Attach listener function on state changes

function getProjectIdFromName(name) {
  var projectID = -1;
  $.each(projectsData, function(index, item) {
    if (item.slug == name) projectID = index;
  });
  return projectID;
}

function toggleInformation() {
  $('#container-side').toggleClass('reduced');
  var style = projectsData[currentProjectID].style;

  $('#container-main').toggleClass('extended main');
  if($('#container-main').hasClass('extended')){
    $('.current-iframe').get(0).contentWindow.postMessage({message: 'isExtended', status: true}, '*');
    $('#navigation').addClass(style); //alone
  }else{
    $('.current-iframe').get(0).contentWindow.postMessage({message: 'isExtended', status: false}, '*');
    $('#navigation').removeClass(style);
  }
}

function toggleMenu(){
  $('#container-side').toggleClass('mobile-reduced');
}

function init() {
  console.log("init");
  $.getJSON('data/projects.json', function(data) {
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
  });
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
  currentProjectID = index;

  $('#project-title').text(projectsData[index].title);
  $('#container-title').text(projectsData[index].title);
  $('#project-title').attr("slug",projectsData[index].slug);
  $('#project-text p:first').text(projectsData[index].text);
  $('#project-credits p:first').html("&lt;Project by&gt;</br>"+projectsData[index].student);

  $('.current-iframe').addClass('previous-iframe').removeClass('current-iframe');



  var iframe = $('<iframe class="current-iframe appear-' + direction + '" src="/projects/' + projectsData[index].slug + '">');
  $('#container-main').append(iframe);
  $('#timeline-barre').css('transition','all 100ms cubic-bezier(0.23, 1, 0.32, 1)');
  $('#timeline-barre').css('background-color','rgba(255,255,255,1)');


  setTimeout(function() {
    $('.previous-iframe').addClass('move-' + direction);
    $('.current-iframe').removeClass('appear-' + direction);
    if($('.previous-iframe').get(0) != null && $('.previous-iframe').get(0) != undefined){
      $('.previous-iframe').get(0).contentWindow.postMessage({message: 'hideTimeline'}, '*');
    }

    $('.current-iframe').get(0).contentWindow.postMessage({message: 'hideTimeline'}, '*');


    //$('#timeline-barre').css('background-color','white');
  }, 100); //100

  setTimeout(function() {
    if($('.previous-iframe').get(0) != null && $('.previous-iframe').get(0) != undefined){
      $('.previous-iframe').get(0).contentWindow.postMessage({message: 'showTimeline'}, '*');
    }
    $('.current-iframe').get(0).contentWindow.postMessage({message: 'showTimeline'}, '*');
    $('.previous-iframe').remove();
    $('#timeline-barre').css('transition','all 500ms cubic-bezier(0.23, 1, 0.32, 1)');
    $('#timeline-barre').css('background-color','rgba(255,255,255,0)');

  }, 3000); //500
}

function loadProjectsPreview(){
  $.each(projectsData, function(index, project) {
    var link = $('<a href="#" class="font-large button-open-project" data-id="'+index+'">'+project.title+'</a>');
    $('#container-projects').append(link);
  });
}

$(document).ready(function() {
  $(window).resize(function(){
    console.log("resized");
  });

  $('#button-toggle-informations').on('click', function(e) {
    e.preventDefault();
    toggleInformation();
  });

  $('#button-open-about').on('click', function(e) {
    e.preventDefault();

    $('.selected').removeClass('selected');
    $(this).addClass('selected');

    $('#navigation nav').addClass('d-none');

    $('#container-about').addClass('main').removeClass('reduced');
    $('#container-main, #container-projects').addClass('reduced').removeClass('main');

    $('#project-title').text(siteTitle);
    $('#container-title').text(siteTitle);
    $('#project-text p:first').text("");
    $('#project-credits p:first').text("");

    //only for mobile
    $('#container-side').addClass('mobile-reduced');

    if (!ignoreURLS) history.pushState({}, siteTitle , '/about');
  });

  $('#button-open-projects').on('click', function(e) {
    e.preventDefault();

    $('.selected').removeClass('selected');
    $(this).addClass('selected');

    $('#navigation nav').addClass('d-none');

    $('#container-projects').addClass('main').removeClass('reduced');
    $('#container-about, #container-main').addClass('reduced').removeClass('main');
    //only for mobile
    $('#container-side').addClass('mobile-reduced');

    $('#project-title').text(siteTitle);
    $('#container-title').text(siteTitle);
    $('#project-text p:first').text("");
    $('#project-credits p:first').text("");

    if (!ignoreURLS) history.pushState({}, siteTitle , '/index');
  });

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
    toggleMenu();
  });

  $('body').on('click', '.button-open-project', function(e) {
    e.preventDefault();
    gotoProject($(this).data('id'), 'up');
  });

  $(window).bind('popstate', function(data) {
    if (!data.originalEvent.state) loadProject(0, 'up');
    loadProject(data.originalEvent.state.index, data.originalEvent.state.direction);
  });

  $(window).on('message', function(e) {
    switch (e.originalEvent.data.message) {
      case 'isPopReduced':
        isPopupReduced = e.originalEvent.data.status;
        break;
      case 'getPopupStatus':
        $('.current-iframe').get(0).contentWindow.postMessage({message: 'receivePopupStatus', status: isPopupReduced}, '*')
        break;
      case 'setScrollPosition':
        timelinePosition = e.originalEvent.data.position;
        break;
      case 'getScrollPosition':
        $('.current-iframe').get(0).contentWindow.postMessage({message: 'receiveScrollPosition', position: timelinePosition}, '*')
        break;
      case 'getResponsive':
        $('.current-iframe').get(0).contentWindow.postMessage({message: 'isMobile', status: isMobile}, '*')
        break;
    }
  });
  init();
});
