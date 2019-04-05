          let City, Camera, Scene, Renderer, Div, GroundTarget, Ground,
            Data = 'datas.json', //json data for position and animation
            Elems = {},
            Spawned = {}, //newly added elements
            Year = 1989,
            NeedsUpdate = true, //needs rendering again
            ScaleFactor = 400,
            SpreadFactor = 8;

        const Options = {
                "mac10 scroll": {
                    "s": "fixed",
                },

                "mac7 scroll": {
                    "s": "pre",
                },

                "w3 scroll": {
                    "s": "pre fixed",
                },
            },

            Models = {}, //models in html index
            Types = [], //classname of all dom models
            Mouse = {
                x: 0,
                y: 0,
                _x: 0,
                _y: 0,
                angleX: 0,
                angleY: 0,
                camY: 0,
                camZ: 1200,
                horizAngle: 0,
                pressed: 0,
                panAmt: Math.PI * 0.1
            }, //mouse pos, old mouse pos, angles of camera, horizon line angle, amt panning


            Tooltip = {
                delay: 1000,
                noShow: null,
                show: null,
                elem: null,
                info: null,
                names: 'tooltips.json',

                update(e) {
                    clearTimeout(this.show);
                    this.show = this.delay > 0 ? setTimeout(_ => this.draw(e), this.delay) : this.draw(e);
                },

                rename(elem) {

                    let c = elem.classList,
                        i = c.length;
                    result = [];

                    for (; i--;) {
                        let v = this.names[c[i]];
                        if (v) {
                            result[v[1]] = v[0];
                            if (v[1] !== 0)
                                result[v[1]] += '\n';
                        }
                    }

                    return result.filter(el => el).join(' ').slice(0, -1);

                },

                draw(e) {
                    const elem = e.target.closest('[data-o]');

                    if (elem && !Mouse.pressed) {

                        if (elem !== this.elem) {
                            // this.info.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
                            this.info.style.top = e.clientY + 'px';
                            this.info.style.left = e.clientX + 'px';
                            this.info.classList.add('show');
                            this.info.firstElementChild.innerText = this.rename(elem);
                        }

                        this.delay = 0;
                        clearTimeout(this.noShow);

                    } else if (Mouse.pressed) {

                        this.info.classList.remove('show');
                        this.delay = 1000;
                    } else if (!this.delay) {
                        this.info.classList.remove('show');
                        this.delay = 100;
                        this.noShow = setTimeout(_ => this.delay = 1e3, 1e3);

                    }

                    this.elem = elem;
                },

                hide() {
                    this.info.classList.remove('show');
                    this.delay = 1000;
                }
            },

            Utils = {

                map: function(n, start1, stop1, start2, stop2) {
                    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
                },

                minMax: function(n, min, max) {
                    if (n < min)
                        n = min;
                    else if (n > max)
                        n = max;

                    return n;
                },

                readJson: function(url) {
                    return new Promise((resolve, reject) => {
                        const x = new XMLHttpRequest();

                        x.onreadystatechange = _ => {

                            if (x.status === 404) {
                                x.abort();
                                reject(url);
                            }

                            if (x.readyState == 4 && x.status == 200)
                                resolve(JSON.parse(x.responseText));
                        };

                        x.open("GET", url, true);
                        x.send();
                    });
                }
            }


        window.addEventListener('load', init, false);
        async function init() {

            await preload();
            console.log('hey');
            getModels();

            // Camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );
            Camera = new THREE.PerspectiveCamera(37.8, window.innerWidth / window.innerHeight, 1, 10000);
            Camera.position.z = Mouse.camZ;
            Camera.position.y = Mouse.camY;


            Mouse.horizAngle = Math.atan(-Mouse.camY / Mouse.camZ);
            Tooltip.info = document.getElementById('tooltip');
            let groundTargetElem = document.createElement('div');
            Ground = document.querySelector('#ground');
            groundTargetElem.id = 'groundTarget';
            GroundTarget = new THREE.CSS3DObject(groundTargetElem);
            GroundTarget.position.copy(new THREE.Vector3(0, 0, -10000));

            City = new THREE.Group();
            City.rotation.y = 0;
            City.add(GroundTarget);

            Scene = new THREE.Scene();
            Scene.add(City);

            Renderer = new THREE.CSS3DRenderer(Mouse);
            Renderer.setSize(window.innerWidth, window.innerHeight);
            Renderer.domElement.style.position = 'absolute';
            Renderer.domElement.style.top = 0;

            document.querySelector("#container-project").appendChild(Renderer.domElement);

            addListeners();
            changeElems();
            animate();
            updateGroundPos();
        }

        async function preload() {
            const data = Utils.readJson(Data),
                tooltips = Utils.readJson(Tooltip.names),
                results = await Promise.all([data, tooltips]);

            Data = results[0];
            Tooltip.names = results[1];
        }

        function rotateObject() {
            let amt = Mouse.panAmt;

            Mouse.angleY = City.rotation.y = Utils.map(Mouse.x, 0, window.innerWidth, -amt, amt);
            Mouse.angleX = Utils.map(Mouse.y, window.innerHeight, 0, amt, Mouse.horizAngle);

            if (Mouse.angleX < Mouse.horizAngle)
                Mouse.angleX = Mouse.horizAngle;

            City.rotation.x = Mouse.angleX;

            updateGroundPos();
        }

        function updateGroundPos() {
            let top = GroundTarget.element.getBoundingClientRect().top;
            if (top < 0)
                top = 0;

            Ground.style.transform = `translateY(${top}px)`;
            Ground.style.top = 0;
        }

        function animate() {
            requestAnimationFrame(animate);

            if (NeedsUpdate) {
                Renderer.render(Scene, Camera);
                growElem();
                NeedsUpdate = false;
            }
        }

        function growElem() {
            let k = Object.keys(Spawned),
                i = k.length;

            if (i) {
                Renderer.domElement.firstElementChild.offsetHeight; //recalculate css
                for (; i--;) {
                    Spawned[k[i]].classList.remove('grow_h', 'grow_w');
                    delete Spawned[k[i]];
                }
            }
        }

        function changeElems() {
            let currElems = Object.assign({}, Elems),
                keys = Object.keys(Data[Year]),
                i = keys.length,
                id, obj;

            for (; i--;) {
                id = keys[i];
                obj = Data[Year][id];

                delete currElems[id];

                if (!Elems[id])
                    Spawned[id] = createElem(id, obj);

                updateElem(id, obj);
            }


            let _keys = Object.keys(currElems);
            // console.log('keys', currElems, keys, Year);
            i = _keys.length;

            for (; i--;)
                removeElem(_keys[i]);
        }

        function createElem(id, obj) {

            if (typeof obj === 'number')
                obj = Data[obj][id];

            let className = obj[4],
                i = Types.length;

            for (; i--;) {
                if (className.includes(Types[i])) {
                    let elem = Models[Types[i]].cloneNode(true);

                    elem.className = obj[4] + (obj[3] < 0 ? ' grow_w' : ' grow_h');
                    elem.dataset.o = 'obj';

                    if (Options[className]) {

                        let keys = Object.keys(Options[className]),
                            j = keys.length;

                        for (; j--;) {
                            elem.dataset[keys[j]] = Options[className][keys[j]];
                        }
                    }

                    Elems[id] = obj.length > 5 ?
                        new THREE.CSS3DObject(elem) :
                        new THREE.CSS3DSprite(elem);

                    City.add(Elems[id]);

                    console.log(elem.className);

                    return elem;
                }
            }
        }

        function removeElem(id) {
            const dom = Elems[id].element;
            if (Elems[id].name == 'end') {
                City.remove(Elems[id]);
                delete Elems[id];
            } else {
                dom.classList.remove('preventgrow');
                dom.classList.add('grow_h');
                Elems[id].name = 'end';
            }
        }

        function updateElem(id, obj) {

            if (typeof obj === 'number')
                obj = Data[obj][id];

            let dom = Elems[id].element;

            let state = '';

            if (Elems[id].name !== 'end') {
                state = ' preventgrow';
                if (dom.className.includes('grow_h'))
                    state = ' grow_h';
                else if (dom.className.includes('grow_w'))
                    state = ' grow_w';
            }

            dom.className = obj[4] + state;

            Elems[id].name = '';

            if (obj.length > 5) {

                if(obj[3]==='') {

                } else if (obj[3] < 0)
                    dom.style.width = -obj[3] * SpreadFactor * 2 + 'px';
                else
                    dom.style.height = obj[3] * SpreadFactor * 2 + 'px';

                Elems[id].position.copy(new THREE.Vector3(obj[0] * SpreadFactor, obj[1] * ScaleFactor * 0.5, obj[2] * SpreadFactor));
                Elems[id].rotation.x = obj[6] * Math.PI;
                Elems[id].rotation.z = obj[5] * Math.PI;
            } else {
                if (obj[3] !== '')
                    dom.style.height = obj[3] * ScaleFactor + 'px';

                Elems[id].position.copy(new THREE.Vector3(obj[0] * SpreadFactor, obj[1] * ScaleFactor / 2, obj[2] * SpreadFactor));
            }
        }

        function getModels() {
            const modelsContainer = document.getElementById('models'),
                elems = modelsContainer.children;

            for (let i = elems.length; i--;) {
                Models[elems[i].className] = elems[i];
            }

            Types.push(...Object.keys(Models));
        }

        //Listeners

        function addListeners() {

            window.addEventListener('mousedown', e => {
                Mouse.pressed = 1;
                Tooltip.hide();
            }, true);

            window.addEventListener('mouseup', e => {
                Mouse.pressed = 0;
            }, true);

            window.addEventListener('mousemove', e => {
                Tooltip.update(e);
            }, false);

            window.addEventListener('resize', _ => {
                Camera.aspect = window.innerWidth / window.innerHeight;
                Camera.updateProjectionMatrix();
                Renderer.setSize(window.innerWidth, window.innerHeight);
                NeedsUpdate = true;
            }, false);

            document.addEventListener('mousemove', e => {
                Mouse._x = Mouse.x;
                Mouse._y = Mouse.y;
                Mouse.x = e.clientX;
                Mouse.y = e.clientY;

                if (Mouse._x !== Mouse.x || Mouse.y !== Mouse._y) {
                    rotateObject();
                    NeedsUpdate = true;
                }
            });

            document.addEventListener('timeline-scroll', e => {

                let dotDate = moment(e.detail.date),
                    _year = Year;

                Year = dotDate.year();

                console.log(Year);

                //abort transitions
                // if (Math.abs(_year - Year) > 0 && Data[Year]) {
                if (_year !== Year && Data[Year]) {

                    let dom = Renderer.domElement.firstElementChild;
                    dom.classList.add('notransition');
                    dom.offsetHeight;
                    dom.classList.remove('notransition');
                    changeElems();
                    NeedsUpdate = true;
                }
            });
        }
