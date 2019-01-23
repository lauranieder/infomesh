
		(function($) {





   		$(document).ready(function() {
				//alert("d");
				var nbr = 2;
				var inter = (1/nbr)*2;
				var beginAT = -(nbr-1)*(inter/2); // commence en négatif (inverse au milieu)
				//var beginAT = -inter;
				var lr = 1024;
				var ht = 768;
				var moveDist = 25;
				var maxi = 100;

				var maxPL = 0;
				var minPL = 0;
				var maxPT = 0;
				var minPT = 0;

				$('body').click(function() {
					//alert("s");

				});

   			window.ondeviceorientation = function(event) {
   			//$(window).mousemove(function(event) {
					//var pl = ((event.pageX-lr/2)/lr)*100;
					//var pt = ((event.pageY-ht/2)/ht)*100;
					var pl = ((event.gamma-Math.PI)/(Math.PI*2));
					var pt = ((event.beta-Math.PI)/(Math.PI));

					if(pl>maxPL){
						maxPL = pl;
					}
					if(pl<minPL){
						minPL = pl;
					}
					if(pt>maxPT){
						maxPT = pt;
					}
					if(pt<minPT){
						minPT = pt;
					}
					console.log("maxpl     "+maxPL+"     maxpt     "+maxPT);
					console.log("minpl     "+minPL+"     minpt     "+minPT);

					//
					if(pl>maxi) {
						pl = maxi;
					}
					if(pl<-maxi) {
						pl = -maxi;
					}
					if(pt>maxi) {
						pt = maxi;
					}
					if(pt<-maxi) {
						pt = -maxi;
					}
					//
					var crt = beginAT;
					//var zzz = 1000;
					//
					$(".mover").each(function() {
						$(this).css({
							left: lr/2-pl*crt,
							top: ht/2-pt*crt

						});
						//$(this).css("zIndex", zzz);
						//zzz++;
						crt+=inter;
					});
				}
   		});
   	})( jQuery );



 //SLIDER DEBUG
     function updateSlider(dist) {

         console.log("hey");


         Sequencer.call(this, updateSlider, dist);




     }

var Sequencer = (function(){
    var current = -1;
    var images = [];
    var playInterval;
    var playDir = 1;
    var lastLoaded = -1;



    // configuration defaults
    var config = {
        folder              : "",           // folder containing the image sequence
        baseName            : "",           // a basename of the files, for example "DSC00"
        from                : 1,            // first image of the sequence, will be combined with the basename
        to                  : 11,           // last image of the sequence
        ext                 : "jpg",        // file extention, case sensitive
        step                : 1,            // increment: to load only even images use 2, etc
        bgColor             : "#000",    // page background color
        scaleMode           : "contain",      // as in CSS3, can be: auto, cover, contain
        mouseDirection      : "x",          // mouse direction, can be x, -x, y, -y, applies only if playMode == "mouse"
        playMode            : "none",      // can be: mouse, loop, pong or none (in this case a nextImage() call has to be made somewhere
        playInterval        : 40,           // interval in milliseconds beteen each frame, applies only if playMode != "mouse"
        progressDiam        : "90",        // progress diameter
        progressFontFamily  : "Proxima Nova",
        progressFontSize    : "0.9em",
        progressBgColor     : "#FFF",
        progressFgColor     : "#000",
        progressMode        : "circle",     // can be: circle, bar, none
        progressHeight      : "5px",        // if progressMode == "bar"
        progressShowImages  : "true",         // display images while loaded
        simultaneousLoads   : 4,            // how many images to load simultaneously, browser limit is 4?
    }


    //SLIDER DEBUG
     function updateSlider(dist) {

         console.log("heyseq");
       document.querySelector('#distance').value = dist +" cm";



        var t = images.length;


       // var id = Math.min(t, Math.max(0, Math.floor(m / w * t)));
         var distMax = 300;
         var distMin = 1;
         var id = Math.floor(Math.map(dist,distMin,distMax, 0, t));
		console.log(id);

        if (id != current){

            showImage(id);
            current = id;
        }



     }


    function init(customConfig){
        // config override
        for(prop in customConfig){
            config[prop] = customConfig[prop];
        }

        window.onload = function(){
            configureBody();
            Preloader.init(config, images, onImageLoaded, onPreloadComplete);
        }

        window.addEventListener( 'resize', onWindowResize, false );
    }

    function onImageLoaded(e){
        if (e.id > lastLoaded && config.progressShowImages){ // to not have a back and forward hickup… but some images will be skipped
            showImage(e.id);
            lastLoaded = e.id;
        }
    }

    function onPreloadComplete(e){
        setPlayMode(config.playMode);
        play();
    }

    function setPlayMode(mode){
        stop();
        config.playMode = mode;
    }

    function play(){
			console.log("play");
        stop();
        if (config.playMode == "mouse"){
            document.addEventListener('mousemove', onMouseMove, false);
            document.ontouchmove = function(e){
                onMouseMove(e.touches[0]);
                return false;
            }
        } else if (config.playMode == "loop" || config.playMode == "pong") {
            playInterval = setInterval(nextImage, config.playInterval);
        }
    }

    function stop(){
        document.removeEventListener('mousemove', onMouseMove);
        if (playInterval) {
            clearInterval(playInterval);
            playInterval == null;
        }
    }

    function nextImage(mode){
        if (!mode) mode = config.playMode;
        if(mode == "pong") {
            current += playDir;
            if (current >= images.length-1) { //current could ev. change by other playmodes, so extra-checks are necessary
                playDir = -1;
                current = images.length-1;
            } else if (current <= 0){
                playDir = 1;
                current = 0;
            }
            showImage(current);
        } else {
            showImage(++current % images.length); //loop
        }
    }


    function onMouseMove(e){
        var t = images.length;
        var m, w;
        if (config.mouseDirection == "x") {
            w = window.innerWidth;
            m = e.pageX;
        } else if (config.mouseDirection == "-x") {
            w = window.innerWidth;
            m = w - e.pageX - 1;
        } else if (config.mouseDirection == "y") {
            w = window.innerHeight;
            m = e.pageY;
        } else if (config.mouseDirection == "-y") {
            w = window.innerHeight;
            m = w - e.pageY - 1;
        }

        var id = Math.min(t, Math.max(0, Math.floor(m / w * t)));


        if (id != current){
            showImage(id);
            current = id;
        }
    }

		function showImagebyId(id){
			console.log("showImagebyId id");
			if (id != current){
					showImage(id);
					current = id;
			}

		}


    //
    function onWindowResize(){
        //canvas.height = canvas.parentNode.parentElement.height;
				/*canvas.height = "100%";
				canvas.width = "100%";*/
				canvas.height = $(canvas).parent().height();

				canvas.width = $(canvas).parent().width();
        //canvas.width = canvas.parentNode.parentElement.width;
        showImage(current);
    }

    function configureBody(){
			console.log("configure body");
        canvas = document.getElementById('canvas');


				console.log(canvas);
				console.log("canvas "+canvas.parentNode.parentElement.height);
        //canvas.height = canvas.parentNode.parentElement.height;
        //canvas.width = canvas.parentNode.parentElement.width;
				canvas.height = $(canvas).parent().height();

				canvas.width = $(canvas).parent().width();
        context = canvas.getContext('2d');
        //document.body.appendChild(canvas);

        //document.body.style.margin ="0";
        //document.body.style.padding ="0";
        //document.body.style.height = "100%";
        //document.body.style.backgroundColor = config.bgColor;
        //document.body.style.overflow = "hidden"; //canvas is a few pixels taller than innerHeight… (?)
    }

    function showImage(id){
        if (id >= 0 && id < images.length){
            var img = images[id];
            var ca = canvas.width / canvas.height;
            var ia = img.width / img.height;
            var iw, ih;

            if (config.scaleMode == "cover") {
                if (ca > ia) {
                    iw = canvas.width;
                    ih = iw / ia;
                } else {
                    ih = canvas.height;
                    iw = ih * ia;
                }
            } else if (config.scaleMode == "contain") {
                if (ca < ia) {
                    iw = canvas.width;
                    ih = iw / ia;
                } else {
                    ih = canvas.height;
                    iw = ih * ia;
                }
            } else if (config.scaleMode == "auto") {
                iw = img.width;
                ih = img.height;
            }

            var ox = canvas.width/2 - iw/2;
            var oy = canvas.height/2 - ih/2;
            context.drawImage(img, 0, 0, img.width, img.height, Math.round(ox), Math.round(oy), Math.round(iw), Math.round(ih));
        }
    }

    return {init : init, nextImage : nextImage, setPlayMode : setPlayMode, play : play, stop : stop, showImagebyId : showImagebyId};
})();

var Preloader = (function(){
    var progress;
    var queue;
    var images;
    var loaded = 0;
    var onImageLoadedf, onPreloadCompletef; //needs a better way. Override?


    function init(config, arrayToPopulate, onImageLoaded, onPreloadComplete){

        images = arrayToPopulate; //the array that will be populated with the loaded images
        onImageLoadedf = onImageLoaded; //event functions… crappy way.
        onPreloadCompletef = onPreloadComplete;

        var tot = Math.floor((config.to - config.from + 1) / config.step);
        queue = new Array(tot);
        //images = new Array(tot);

        buildProgress(config);

        for (var i=0; i<tot; i++){
            var num = config.from + i * config.step;
            var src = config.folder + "/" + config.baseName + num + "." + config.ext;
            queue[i] = {src : src, id : i}; //two distinct arrays just to keep a "clean" image list instead of a custom loaderObject list, maybe this approach is overcomplicated
            images[i] = new Image();
        }

        setTimeout(function(){ //give it a bit of breath… safari needs to need that.
            var num = Math.max(1, config.simultaneousLoads);
            for (var i=0; i<num; i++){
                loadNext();
            };
        }, 300);
    }

    function onPreloadComplete(e){
        //console.log(e.length + " images loaded.");
        if (onPreloadCompletef) onPreloadCompletef(e); //needs absolutely a better way
    }

    function onImageLoaded(e){
        //console.log("loaded image [" + e.id + "]");
        if (onImageLoadedf) onImageLoadedf(e); //needs absolutely a better way
    }

    function loadNext(){
        if (queue.length > 0){
            var o = queue.shift();
            images[o.id].src = o.src;
            //images[o.id].id = o.id; // UGLY HACK!
            images[o.id].onload = function(){
                var id = images.indexOf(this); //not the fastest way to get an id. should be stored in a property somewhere. loaderObject?
                onImageLoaded({img:this, id:id});
                progress.update(loaded);
                loaded++;
                if (loaded == images.length ){
                    removeProgress();
                    onPreloadComplete({images:images, length:images.length});
                } else {
                    loadNext();
                }
            }
        }
    }

	//barre de chargement
    function buildProgress(config){
        if (config.progressMode == "circle"){
            progress = document.createElement('div');
            progress.id = "progress";
            progress.style.width = config.progressDiam + "px";
            progress.style.height = config.progressDiam + "px";
            progress.style.lineHeight = config.progressDiam + "px";
            progress.style.textAlign = "center";
            progress.style.color = config.progressFgColor;
            progress.style.backgroundColor = config.progressBgColor;
            progress.style.borderRadius = config.progressDiam / 2 + "px";
            progress.style.position = "fixed";
            progress.style.left = "50%";
            progress.style.top = "50%";
            progress.style.marginTop = - config.progressDiam / 2 + "px";
            progress.style.marginLeft = - config.progressDiam / 2 + "px";
            progress.style.fontFamily = config.progressFontFamily;
            progress.style.fontSize = config.progressFontSize;
            progress.style.zIndex = 1000;
            progress.innerHTML = "loading";
            progress.update = function(num){
                var t = Math.floor((config.to - config.from + 1) / config.step);
                progress.innerHTML = (num + 1) + "/" + t;
            }
            document.body.appendChild(progress);
        } else if (config.progressMode == "bar") {
            progress = document.createElement('div');
            progress.id = "progress";
            progress.style.width = "0%";
            progress.style.height = config.progressHeight + "px";
            progress.style.backgroundColor = config.progressBgColor;
            progress.style.position = "fixed";
            progress.style.left = "0";
            progress.style.height = config.progressHeight;
            progress.style.bottom = "0";
            progress.style.zIndex = 1000;
            progress.update = function(num){
                var p = Math.round(num / (config.to - config.from) * 100);
                progress.style.width = p + "%";
            }
            document.body.appendChild(progress);
        }
    }

    function removeProgress(){
        if (progress) {
            document.body.removeChild(progress);
            progress = null;
        }
    }

    if (!Array.prototype.indexOf){
        Array.prototype.indexOf = function(elt /*, from*/){
            var len = this.length;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) from += len;
            for (; from < len; from++){
                if (from in this && this[from] === elt) return from;
            }
            return -1;
        };
    }



    return {init : init, images : images};
})();
