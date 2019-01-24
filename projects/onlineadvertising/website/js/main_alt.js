$(document).ready(function() {

	//set size of foot based on image
	$("img").ready(function() {

		$(".window").each( function() {

			$(".foot", this).width($("img", this).width());


				//randomize windows + draggable stack fix

				var zIndex=(Math.random() * 1000);

      			//contain div into parent
      			var ctnWidth = 100 * ($(".windows").width() - $(this).width()) / $(".windows").width();
      			var ctnHeight = 100 * ($(".windows").height() - $(this).height()) / $(".windows").height();
      			//console.log($(this).width());

      			//randomize position
      			var x = Math.floor(Math.random() * ctnWidth);
      			var y = Math.floor(Math.random() * ctnHeight);

      			$(this).css({"left": x + "%", "top": y + "%", "z-index": zIndex++});

      		});

	});

	$("#burger").click(function(){
		$("ul.header li").slice(1).slideToggle(200);
		$(this).toggleClass("toggled");
	});

	$(window).resize(function(){
		if ( $("#burger").css("display") == "none") {
			$("ul.header li").slice(1).css("display", "inline-block");
			
		} else {
			$("ul.header li").slice(1).css("display", "none");
			$("#burger").removeClass("toggled");
		}
	});

	$(".close-btn").click(function() {
		$(this).closest(".window").fadeOut(100);
	});

	$("#sort").click(function() {
		$(".settings").stop().slideToggle(300);		
	});
	$("#about").click(function() {
		$(".about").stop().slideToggle(300);		
	});

	$(".word_checkbox").click(function(event){
		event.preventDefault();

		var Checkbox = $(this).find("input");
		var Value = Checkbox.val();

		Checkbox.prop("checked", !Checkbox.prop("checked"));

		if($(Checkbox).prop('checked')) {
			$("."+Value).show("fade", 100);
		} else {
			$("."+Value).hide("fade", 100);
		}

	});

	var draggable = false;
	$(".window").mouseenter(function(){
		if(!draggable){
			//show footer when hover + prevent showing font while dragging window
			$(".contain", this).first().stop().slideDown(200);
			$(".element", this).first().css("display", "none").show( "slide", { direction: "up"  }, 200, function(){
				//console.log("done");
				//$elem = $(this);
				$elem = $(this).closest(".window");
				CheckScroll($elem);
			});
		}
		//scroll down when window outside of screen
	});

	//hide footer when not hover + prevent hiding footer+font while dragging window
	$(".window").mouseleave(function(){
		if(!draggable){

			$(".contain", this).stop().slideUp(200);
			$(".element", this).first().hide( "slide", { direction: "up"  }, 200, function() {
				$(".element").css("display", "flex");
			});
			$(".arrow-btn", this).removeClass("clicked");
		}
	});

	//click to show/hide content
	$(".contain").click(function(){
		if($(this).next().css('display') == 'none'){
			$(this).next().slideDown(200);

			$(this).next().children().first().css("display", "none").show( "slide", { direction: "up"  }, 200, function(){
				$elem = $(this).closest(".window");
				CheckScroll($elem);
			});
			$(".arrow-btn", this).first().addClass("clicked");
			
		} else {
			$(".arrow-btn", this).first().removeClass("clicked");
			$(this).nextAll().find(".arrow-btn").removeClass("clicked");
			$(this).nextAll().slideUp(200);
			$(this).nextAll().children().first().hide( "slide", { direction: "up"  }, 200, function() {
				$(".element").css("display", "flex");
			});
		}
	});

	var Drag=true;
	CheckDrag();

	function CheckDrag(){
		if($(window).width() > 500){
			$(".window").draggable({disabled: false});
		} else {
			$(".window").draggable({disabled: true});
		}
	}
	$(window).resize(function(){
		CheckDrag();
		console.log(Drag);
	});

	//drag window
	$(".window").draggable({handle: ".head", cancel:".close-btn", stack: ".window", containment: ".windows", start: function(){
		draggable=true;
	}, stop: function () {
		draggable=false;

		var l = ( 100 * ($(this).position().left / $(".windows").width()) );
		var t = ( 100 * ($(this).position().top / $(".windows").height()) );
		$(this).css("left", l + "%");
		$(this).css("top", t + "%");
	}});

	//click window to put it in front
	$(".window").mousedown(function(event){
		var widget = $(this).data("ui-draggable");
		widget._mouseStart(event);
		widget._mouseDrag(event);
		widget._mouseStop(event);   
	});
	
	

	function CheckScroll($elem) {

		var windowH = $elem.height();
		var windowP = $elem.position().top;
		var currentScroll = $(".windows").scrollTop();
		var windowsH = $(".windows").height();
		var diff = windowsH - (windowH + windowP);
		if(diff < 0) {
			$elem.css("top", windowP+diff-4);
		}
	}
});