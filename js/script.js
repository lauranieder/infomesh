var projectsData;
var currentProjectID = 0;
var siteTitle = document.title;
var timelinePosition = 0;
var ignoreURLS = true;

function toggleInformation() {
  $('#container-side').toggleClass('reduced');
  $('#navigation').toggleClass('alone');
  $('#container-main').toggleClass('extended main');
}

function init() {
  $.getJSON('data/projects.json', function(data) {
    projectsData = data;
  });
}

function gotoProject(index, direction) {
  if (!direction) direction = 'none';

  if (!ignoreURLS) history.pushState({index: index, direction: direction}, siteTitle + ' - ' + projectsData[index].title, projectsData[index].slug);
  loadProject(index, direction);
}

function loadProject(index, direction) {
  currentProjectID = index;

  $('#project-title').text(projectsData[index].title);
  $('#project-text').text(projectsData[index].text);
  $('#project-credits').text(projectsData[index].student);

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
  });

  $('#button-open-projects').on('click', function(e) {
    e.preventDefault();

    $('.selected').removeClass('selected');
    $(this).addClass('selected');

    $('#navigation nav').addClass('d-none');

    $('#container-projects').addClass('main').removeClass('reduced');
    $('#container-about, #container-main').addClass('reduced').removeClass('main');
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

    $('#navigation nav').removeClass('d-none');

    $('#container-main').addClass('main').removeClass('reduced');
    $('#container-about, #container-projects').addClass('reduced').removeClass('main');

    gotoProject($(this).data('id'), 'up');
  });

  $(window).bind('popstate', function(data) {
    if (!data.originalEvent.state) loadProject(0, 'up');

    loadProject(data.originalEvent.state.index, data.originalEvent.state.direction);
  });

  $(window).on('message', function(e) {
    console.log(e.originalEvent.data);
    switch (e.originalEvent.data.message) {
      case 'setScollPosition':
        timelinePosition = e.originalEvent.data.position;
        break;
      case 'getScollPosition':
        $('.current-iframe').get(0).contentWindow.postMessage({message: 'receiveScrollPosition', position: timelinePosition}, '*')
        break;
    }
  });

  init();
});
