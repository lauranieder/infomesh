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
					img.appendTo('.windows');
					img.hide();
				}
			}
		}

		var cln = $('.window').first().clone();
		$(".windows").prepend(cln);

	});
						//set size of foot based on image
						$("img").ready(function() {
						setTimeout(function(){
						$(".window").each(function() {

      			//contain div into parent
      			var ctnWidth = 50 * ($(".windows").width() - $(this).width()) / $(".windows").width();
      			var ctnHeight = 50 * ($(".windows").height() - $(this).height()) / $(".windows").height();

      			//randomize position
      			var x = Math.floor(Math.random() * ctnWidth);
      			var y = Math.floor(Math.random() * ctnHeight);
      			$(this).css({"left": x + "%", "top": y + "%", "z-index": 0});

      		});

		}, 0);

		// duplicate certain elements
		// differentiate elements

	});
});
