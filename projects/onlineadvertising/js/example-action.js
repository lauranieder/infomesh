document.addEventListener("timeline-scroll", function(e) {
    let normal = e.detail.normal;
    let dotDate = moment(e.detail.date);

    // hello
    let year = dotDate.year();

    // filter
    var images = $('.window').toArray();
    //console.log( $($('.window')[0]).data("year"));

    // images.forEach(function(img){
    //   console.log(img);
    //
    // })

    let before = images.filter(image => $(image).attr("data-year") <= year );
    let after = images.filter(image => $(image).attr("data-year") > year );

    console.log(before);

    before.forEach(el => $(el).removeClass("hidden"));
    after.forEach(el => $(el).addClass("hidden"));

    // Show everything

    // Trouver comment comparer avec datas des images
    // Foreach
    // Afficher les nouvelles images
    // Cacher ce qui est derriere la tete de lecture

    //$('#container-main').html(dotDate.format("DD/MM/YYYY"));
   });

   document.addEventListener("timeline-loadDotContent", function(e) {
     let dotID = e.detail.id;

     console.log("[student-action.js] -----callback timeline-loadDotContent "+ dotID );
     //console.log(e.detail.normal);

     let dot = $(".timeDot[idToLoad='" + dotID + "']");
     dot.attr("startdate");
     console.log("Loaded date : "+dot.attr("startdate"));
    });


var year = 1977;
var q = false;

$(document).click(function() {
year +=1;
console.log(year);

$("."+year+"").show();

});
var tl_data =[
  {
    "date": "3/7/1978",
    "year": 1978,
    "event": "The first instance of email spam is sent, the purpose of which is advertising."
  },
  {
    "date": "1/1/1980",
    "year": 1980,
    "event": "Usenet, a popular discussion forum, launches, and is occasionally overwhelmed with advertising spam posts."
  },
  {
    "date": "27/10/1994",
    "year": 1994,
    "event": "The first ever banner is sold to AT&T, and is visible on the first issue of HotWired."
  },
  {
    "date": "1/1/1996",
    "year": 1996,
    "event": "DoubleClick, a prominent online advertising company, launches."
  },
  {
    "date": "1/1/1997",
    "year": 1997,
    "event": "Pop-up ads are invented by Ethan Zuckerman, and considered to be a more aggressive and disliked advertising strategy."
  },
  {
    "date": "1/1/1998",
    "year": 1998,
    "event": "OpenX, one of the first ad exchanges, launches as an open source project."
  },
  {
    "date": "23/10/2000",
    "year": 2000,
    "event": "Google launches the prominent AdWords service, which allows for advertising based on a user's browsing habits and their search keywords."
  },
  {
    "date": "1/1/2002",
    "year": 2002,
    "event": "With the annoyance brought about by pop-up ads, many prominent web browsers such as Firefox, Netscape, and Opera begin to roll out features to block these ads."
  },
  {
    "date": "1/1/2006",
    "year": 2006,
    "event": "Adblock, a very prominent ad-blocking add-on for web browsers, is released."
  },
  {
    "date": "1/1/2007",
    "year": 2007,
    "event": "Facebook launches Beacon, an intricate advertising platform that tracks Facebook user's activities on websites outside of Facebook."
  },
  {
    "date": "12/4/2010",
    "year": 2010,
    "event": "Twitter launches Promoted Tweets, which allows advertisers to pay for tweets to be shown in a user's feed."
  },
  {
    "date": "1/10/2013",
    "year": 2013,
    "event": "Instagram, a popular image sharing platform, releases its feature of having sponsored posts appear on user's feeds."
  },
  {
    "date": "14/6/2016",
    "year": 2016,
    "event": "Snapchat, a popular messaging app, begins to include advertisements between user's \"stories\"."
  }
];

$(document).ready(function() {

  // Create explanations

  tl_data.forEach(d => {
    var div_explanation = $('<div><p>' + d.date + ' ' + d.event + '<br><br><a href="#" class="blink_me">CLICK HERE!!!</a><br>'  + '</p></div>');
    div_explanation.addClass("window");
    div_explanation.addClass("hidden");
    div_explanation.addClass("explanation");
    div_explanation.attr('data-year', d.year);
    div_explanation.appendTo('.windows');
    div_explanation.attr('data-z', 10);


/*
<div class="explanation " style="left:10px; position:absolute;">
  <p>1/1/1998 Facebook launches Beacon, an intricate advertising platform that tracks Facebook user's activities on websites outside of Facebook.<br><br><a href="#" class="blink_me">CLICK HERE!!!</a><br></p>
</div>
*/


  });


	$.getJSON( "ads/images.json", function( data ) {

		console.log(data);
		for (var i = 1977; i < 2019; i++) {

			if (i in data) { // if the key exists
				var list_img = data[i];

				for (var j= 0; j < list_img.length; j++){
					var img = $('<img class="'+ i +'">'); //Equivalent: $(document.createElement('img'))
					img.attr('src', "ads/" + list_img[j]);
					img.addClass("window");
					img.addClass(i);
          img.attr('data-year', i + Math.random());
          img.attr('data-z', 0);

					img.appendTo('.windows');
          img.addClass("hidden");
				}
			}
		}

		var cln = $('.window').first().clone();
		$(".windows").prepend(cln);

	});
						//set size of foot based on image
						$("img").ready(function() {
						setTimeout(function(){
              var i = 0;
						$(".window").each(function() {
              i++;
      			//contain div into parent
      			var ctnWidth = 50 * ($(".windows").width() - $(this).width()) / $(".windows").width();
      			var ctnHeight = 50 * ($(".windows").height() - $(this).height()) / $(".windows").height();

      			//randomize position
      			var x = Math.floor(Math.random() * ctnWidth);
      			var y = Math.floor(Math.random() * ctnHeight);
      			$(this).css({"left": x + "%", "top": y + "%", "z-index":  parseInt($(this).attr("data-z")) +  i });

      		});

		}, 0);

		// duplicate certain elements
		// differentiate elements

	});
});
