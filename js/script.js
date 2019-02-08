var projectsData;
var currentProjectID = 0;
var siteTitle = document.title;
var timelinePosition = 0;
var isPopupReduced = false;
var ignoreURLS = true;

function getProjectIdFromName(name) {
  var projectID = -1;

  $.each(projectsData, function(index, item) {
    if (item.slug == name) projectID = index;
  });

  return projectID;
}

function toggleInformation() {
  $('#container-side').toggleClass('reduced');
  $('#navigation').toggleClass('alone');
  $('#container-main').toggleClass('extended main');
}

function init() {
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

function loadProject(index, direction) {
  currentProjectID = index;

  $('#project-title').text(projectsData[index].title);
  $('#project-text').text(projectsData[index].text);
  $('#project-credits').text("<Project>"+projectsData[index].student);

  $('.current-iframe').addClass('previous-iframe').removeClass('current-iframe');

  var iframe = $('<iframe class="current-iframe appear-' + direction + '" src="/projects/' + projectsData[index].slug + '">');
  $('#container-main').append(iframe);

  setTimeout(function() {
    $('.previous-iframe').addClass('move-' + direction);
    $('.current-iframe').removeClass('appear-' + direction);
  }, 100);

  setTimeout(function() {
    $('.previous-iframe').remove();
  }, 500);
}

function loadProjectsPreview(){
  $.each(projectsData, function(index, project) {
    var link = $('<a href="#" class="font-large button-open-project" data-id="'+index+'">'+project.slug+'</a>');
    $('#container-projects').append(link);
  });
}

$(document).ready(function() {
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
    $('#project-text').text("");
    $('#project-credits').text("");

    if (!ignoreURLS) history.pushState({}, siteTitle , '/about');
  });

  $('#button-open-projects').on('click', function(e) {
    e.preventDefault();

    $('.selected').removeClass('selected');
    $(this).addClass('selected');

    $('#navigation nav').addClass('d-none');

    $('#container-projects').addClass('main').removeClass('reduced');
    $('#container-about, #container-main').addClass('reduced').removeClass('main');

    $('#project-title').text(siteTitle);
    $('#project-text').text("");
    $('#project-credits').text("");

    if (!ignoreURLS) history.pushState({}, siteTitle , '/index');
  });

  $('#button-up').on('click', function(e) {
    e.preventDefault();


    var prevProject = currentProjectID - 1;
    if (prevProject < 0) prevProject = projectsData.length - 1;

    gotoProject(prevProject, 'down');
  });

  $('#button-down').on('click', function(e) {
    e.preventDefault();

    var nextProject = currentProjectID + 1;
    if (nextProject == projectsData.length) nextProject = 0;

    gotoProject(nextProject, 'up');
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
    }
  });

  init();
});
