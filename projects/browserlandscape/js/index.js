        var city, camera, scene, renderer, div;

        var mouse ={x:0, y:0};

        var building_1=[];
        var building_2=[];
        var building_3=[];
        var houses=[];

        var period = 5;
        var clock = new THREE.Clock();

        var YEAR = 1993;


        var oldR = {x: 0,y:0};

        init();
        animate();

        var bigger = false;

        function map(n, start1, stop1, start2, stop2) {
          var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;

          if (start2 < stop2) {
            return Math.max(Math.min(newval, stop2), start2);
        } else {

            return Math.max(Math.min(newval, start2), stop2);
        }
    };


    function init() {
      console.log("INIT");
            //camera
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

            // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );
            camera.position.z = 1000;

            city = new THREE.Group();

            scene = new THREE.Scene();

            //CSS3D Scene
            scene = new THREE.Scene();

            //HTML

            //GROUND
            let groundElem = document.querySelector("#ground");
            let ground = new THREE.CSS3DSprite(groundElem.cloneNode());
            ground.position.copy(new THREE.Vector3(0,-600,-500));
            ground.element.classList.remove("hidden");
            // ground.element.removeAttribute("id");

            city.add(ground);

            let scenario = {
                1993: "destroy",
                1994: "appear",

                2005: "change: ./imgs/house_1.png",
                2006: "change: ./imgs/house_2.png",

                2011: "change: ./imgs/house_2.png",
                2012: "change: ./imgs/house_3.png",
            };

            houses = [];
            let amp = 1000;
            for (let i=0; i< 20; i++) {
                houses.push(new Model(document.querySelector('#house_1'), new THREE.Vector3( Math.random()*amp-amp*0.5, 0, Math.random()*amp-amp*0.5), [], 1, i+"house1", scenario));
            }

            amp = 12;
            let offset = {x: 0, y:200};
            building_1 = [];

            scenario = {
                1995: "destroy",
                1996: "appear",

                2002: "appear",
                2003: "destroy",
            };

            for (let x=0; x< 10; x++) {
                for (let y=0; y< 10; y++) {
                    building_1.push(new Model(document.querySelector('#scrollbar_6'), new THREE.Vector3( x*amp+offset.x, 0, y*amp +offset.y), [], 1, x+""+y+"scrollbar6", scenario));
                }
            }

            scenario = {
                1996: "destroy",
                1997: "appear",

                2004: "change: ./imgs/scroll_4.png",
                2005: "change: ./imgs/scroll_7.png",
            };

            offset = {x: -400, y: -200};
            building_2 = [];

            amp = 15;
            for (let x=0; x< 5; x++) {
                for (let y=0; y< 5; y++) {
                    building_2.push(new Model(document.querySelector('#scrollbar_4'), new THREE.Vector3( x*amp+offset.x, 0, y*amp +offset.y), [], 1, x+""+y+"scrollbar4", scenario));
                }
            }

            scenario = {
                1999: "destroy",
                2000: "appear",

                2006: "change: ./imgs/scroll_5.png",
                2007: "change: ./imgs/scroll_8.png",
            };

            amp = 20;
            building_3 = [];
            offset = {x: 300, y: -100};

            for (let x=0; x< 8; x++) {
                for (let y=0; y< 5; y++) {
                    building_3.push(new Model(document.querySelector('#scrollbar_5'), new THREE.Vector3( x*amp+offset.x, 0, y*amp +offset.y), [], 1, x+""+y+"scrollbar5", scenario));
                }
            }


            scene.add(city);

            //CSS3D Renderer
            renderer = new THREE.CSS3DRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = 0;
            document.querySelector("#container-project").appendChild(renderer.domElement);
        }

        document.addEventListener('mousemove', (e)=>{
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            rotateObject(e);
        });




        function yearChange(year) {

            for (let i=0; i<building_3.length ; i++) {
                building_3[i].update(year);

            }

            for (let i=0; i<building_2.length ; i++) {
                building_2[i].update(year);

            }

            for (let i=0; i<building_1.length ; i++) {
                building_1[i].update(year);

            }

            for (let i=0; i<houses.length ; i++) {
                houses[i].update(year);
            }
        }

        document.addEventListener('newyear', function (e) {
            var YEAR = e.detail;
                yearChange(YEAR);

         }, false);



        document.addEventListener('keyup', (e)=> {


            switch(e.key) {
                case "ArrowRight":
                YEAR++;
                yearChange(YEAR);
                break;
                case "ArrowLeft":
                YEAR--;
                yearChange(YEAR);
                break;
                default:
            }

            console.log(YEAR);
        //e.preventDefault();
    });

        // document.addEventListener('click', (e)=>{
        //     mouse.x = e.clientX;
        //     mouse.y = e.clientY;

        //     rotateObject(e);

        //      for (let i=0; i<building_3.length ; i++) {
        //         building_3[i].appear();

        //     }

        //     for (let i=0; i<building_2.length ; i++) {
        //         building_2[i].appear();

        //     }

        //     for (let i=0; i<building_1.length ; i++) {
        //         building_1[i].appear();

        //     }

        //      for (let i=0; i<houses.length ; i++) {
        //         houses[i].appear();
        //     }
        // });

        // document.getElementsByTagName('body')[0].onclick = function (event) {
        //     let text;
        //     if (event.target.nodeName === "IMG") {
        //         text = "SCROLLBAR";
        //     } else {
        //         text="";
        //     }

        //     document.querySelector("#gradient").innerHTML = text;
        // }

        // window.onload

        function rotateObject(e) {
            let amt = Math.PI*0.1;

            city.rotation.y = map(e.clientX, 0, window.innerWidth, -amt, amt);
            city.rotation.x = map(e.clientY, 0, window.innerHeight, -0, amt);
        }

        window.addEventListener( 'resize', ()=> {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }, false );

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
