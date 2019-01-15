$(document).ready(function() {
  let database = [];
  initwithJson();
  document.addEventListener("timeline-scroll", function(e) {
    console.log(e.detail.normal);
    console.log(moment(e.detail.date).format("MMM Do YY"));

    let testDate = findClosestDate(e.detail.date);
    console.log(testDate);
    displayEntry(testDate);
  });

  //Return the closest Date entry from the database
  function findClosestDate(searchedDate){
    let i = 0;
    let closestDate = Infinity;
    let chosenEntry;
    database.forEach(function(entry){
      var a = moment(entry.date);
      var b = moment(searchedDate);
      let diff = Math.abs(a.diff(b));
      if(diff < closestDate){
        closestDate = diff;
        chosenEntry = entry;
      }
    });
    return chosenEntry;
  }

  /* à améliorer*/
  $(document).on('click','.style-popup', function() {
    console.log("click");
    $(".style-popup").css("z-index",0);
    $(this).css("z-index",1);
  });

  function displayEntry(entry){

    $("#container-project").html("");
    //project title
    console.log(entry.title);
    let divtitle = $("<div/>").attr('id', 'project-title').addClass("style-popup");
    let poptitle = $("<div/>").addClass("pop-inside")
    let entrytitle = $("<h2/>").html(entry.title+"</br></br>").appendTo(poptitle);
    //console.log(moment(entry.date, "DD/MM/YYYY").format('MMMM Do, YYYY'));
    let entrytitle2 = $("<h2/>").html(moment(entry.date, "DD/MM/YYYY").format('MMMM Do, YYYY')).appendTo(poptitle);
    poptitle.appendTo(divtitle);
    $("#container-project").append(divtitle);

    if(entry.content != null && entry.content != ""){
      let divcontent = $("<div/>").attr('id', 'project-content').addClass("style-popup");
      let popcontent = $("<div/>").addClass("pop-inside")
      let entrycontent = $("<p/>").html(entry.content).appendTo(popcontent);
      popcontent.appendTo(divcontent);
      $("#container-project").append(divcontent);
    }

    if(entry.context != null && entry.context != ""){
      let divcontext = $("<div/>").attr('id', 'project-context').addClass("style-popup");
      let popcontext = $("<div/>").addClass("pop-inside")
      let entrycontext = $("<p/>").html(entry.context).appendTo(popcontext);
      popcontext.appendTo(divcontext);
      $("#container-project").append(divcontext);
    }




    //
    // //$("#project-title").children().html("");
    // //$("#project-title").children().append(entrytitle);
    //
    // //project content
    // if(entry.content != null && entry.content != ""){
    //   $("#project-content").children().html(entry.content);
    // }
    // //$("#project-title").children().html(entry.title);
    //
    // //project context
    // $("#project-context").children().html(entry.context);


  }

  function initwithJson() {
    console.log("init with json");
    $.ajax({
      //url: "data/emojicons.json",
      url: "data/data.json",
      type: "GET", //type:"GET"
      dataType: "JSON"
    }).done(function(data) {
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        console.log(data[i].post_title);
        let titre = data[i].post_title;
        let startdate = data[i].startdate;
        let endate = "";
        let description = data[i].post_content;
        let context = data[i].context;
        let info = data[i].titre + "";
        let id = i;

        let momentD = moment(data[i].startdate, "DD/MM/YYYY").utc();

        let entry = {
          title: data[i].post_title,
          date: data[i].startdate,
          content: data[i].post_content,
          context: data[i].context
        };
        database.push(entry);
        database.sort();


        database.sort(function (a, b) {
          console.log("sort");
          return moment(a.date, "DD/MM/YYYY" ).diff(moment(b.date, "DD/MM/YYYY"))
        });

        // var customDiv = $("<div/>");
        // customDiv.addClass("timeDot"); //.appendTo('body')
        // customDiv.attr("idToLoad", data[i].yearonly);
        // customDiv.attr("info", info);
        // customDiv.attr("target", "_blank");
        // customDiv.attr("href", data[i].link);
        // customDiv.attr("title", description);
        // if (startdate != null) {
        //   customDiv.attr("startDate", startdate);
        // } else {
        //   customDiv.attr("startDate", "01/01/1989");
        // }
        // if (enddate != null) {
        //   customDiv.attr("endDate", info);
        // }
        //$("#containertimeline-content").append(customDiv);
      }
      //initTimeline();
      console.log(database);

    });
  } //end of init
});
