        let City, Camera, Scene, Renderer, Div, GroundTarget, Ground, AnchorCam,
            $camera,
            $containerProject,
            Data = 'data/datas.json', //json data for position and animation
            Elems = {},
            Spawned = {}, //newly added elements
            Year = 1989,
            NeedsUpdate = 1, //needs to update city again
            NeedsRender = 1,
            ScaleFactor = 400,
            SpreadFactor = 8;

        const Options = {
                "mac10 scroll": {
                    "s": "fixed"
                },

                "mac7 scroll": {
                    "s": "pre"
                },

                "w3 scroll": {
                    "s": "pre fixed"
                },

                "op10 w7 _btn refr": {
                    "b": "refr"
                },

                "op12 w7 _btn refr": {
                    "b": "refr"
                },

                "op15 w8 _btn refr": {
                    "b": "refr"
                },

                "op50 w10 _btn refr": {
                    "b": "refr"
                },

                "ie7 xp _btn refr b": {
                    "b": "refr"
                }
            },

            Models = {}, //models present in html index
            Types = [], //classname of all dom models
            M = {
                _time: performance.now(),
                fps: 30,
                vX: 0,
                vY: 0,
                x: 0,
                y: 0,
                _x: 0,
                _y: 0,
                angleX_: 0,
                angleY_: 0,
                angleX: 0,
                angleY: 0,
                camY: -20,
                camZ: 2000,
                horizAngle: 0,
                pressed: 0,
                panAmt: Math.PI * 0.12
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

                    if (elem && !M.pressed) {

                        if (elem !== this.elem) {
                            // this.info.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
                            this.info.style.top = e.clientY + 'px';
                            this.info.style.left = e.clientX + 'px';
                            this.info.classList.add('show');
                            this.info.firstElementChild.textContent = this.rename(elem);
                        }

                        this.delay = 0;
                        clearTimeout(this.noShow);

                    } else if (M.pressed) {
                        this.hide();

                    } else if (!this.delay) {
                        this.info.classList.remove('show');
                        this.delay = 100;

                        this.noShow = setTimeout(_ => this.delay = 1e3, 1e3);
                    }

                    this.elem = elem;
                },

                hide() {
                    this.info.classList.remove('show');
                    this.delay = 1e3;
                }
            },

            Utils = {

                map(n, start1, stop1, start2, stop2) {
                    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
                },

                minMax(n, min, max) {
                    if (n < min)
                        n = min;
                    else if (n > max)
                        n = max;

                    return n;
                },

                readJson(url) {
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
            getModels();

            // Camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );
            Camera = new THREE.PerspectiveCamera(17.8, window.innerWidth / window.innerHeight, 1, 10000);
            Camera.position.z = M.camZ;
            Camera.position.y = M.camY;
            AnchorCam = new THREE.Group();

            AnchorCam.add(Camera);

            M.horizAngle = Math.atan(M.camY / M.camZ);
            // (Camera.projectionMatrix.elements[5] * 2 * AnchorCam.position.y) / Camera.position.z;

            Tooltip.info = document.getElementById('elTooltip');

            let groundTargetElem = document.createElement('div');
            groundTargetElem.id = 'groundTarget';
            Ground = document.querySelector('#ground');
            GroundTarget = new THREE.CSS3DObject(groundTargetElem);

            GroundTarget.position.copy(new THREE.Vector3(0, 0, -1500)); //-10000

            City = new THREE.Group();
            City.add(GroundTarget);

            Scene = new THREE.Scene();
            Scene.add(City);
            Scene.add(AnchorCam);

            M.angleY_ = M.angleY = M.panAmt * 0.5;
            M.angleX_ = M.angleX = -M.panAmt * 0.25;


            AnchorCam.rotation.set(M.angleX_, M.angleY_, 0, 'YXZ');

            Renderer = new THREE.CSS3DRenderer(M);
            Renderer.setSize(window.innerWidth, window.innerHeight);
            Renderer.domElement.style.position = 'absolute';

            $containerProject = document.querySelector("#container-project");
            $containerProject.appendChild(Renderer.domElement);
            $camera = Renderer.domElement.querySelector('#camera');

            addListeners();
            changeElems();

            Renderer.render(Scene, Camera);
            update();
        }

        async function preload() {

            //preload background-images
            let preloadedTex = document.querySelector('#preloadedTex'),
                fragment = document.createDocumentFragment(),
                urls = ["ie10_w8__btn_a.png", "ie10_w8__btn_b.png", "ie1_w95_btn.png", "ie1_w95_thr.png", "ie2_w95_btn.png", "ie3_w95_btn.png", "ie3_w95_thr.png", "ie4_w95_btn.png", "ie4_w95_thr.png", "ie5_mac9_btn.png", "ie5_mac9_thr.png", "ie5_w95_thr.png", "ie6_xp_btn.png", "ie6_xp_thr.png", "ie7_xp-vista_btn.png", "ie7_xp-vista_btn_b.png", "ie9_w7__btn_a.png", "ie9_w7__btn_b.png", "mac10a.svg", "mac10b.png", "mac7a.svg", "mac7b.svg", "mac9.svg", "mac9_.svg", "me_w10__btn.svg", "mos1-2_mac7_btn.png", "mos1_mac7_thr.png", "mos1_w3_btn.png", "mos1_w3_thr.png", "mos3_w95_btn.png", "mos3_w95_thr.png", "ns.png", "nsc0-1_w3_btn.png", "nsc0_mac7_thr.gif", "nsc0_w3_thr.png", "nsc0_w95_thr.gif", "nsc1_w3_thr.png", "nsc2-3__btn.png", "nsc2-3_thr.png", "nsc4__btn.png", "nsc4_thr.png", "nsc6_w98__btn.png", "nsc6_w98_thr.png", "nsc6_w98_thr_b.png", "nsc7_xp__btn.png", "nsc7_xp_thr.png", "nsc8_thr.png", "nsc8d1f_vista__btn.png", "nsc8d1w_vista__btn.png", "nsc8f_xp__btn.png", "nsc8w_xp__btn.png", "nsc9_vista__btn.png", "nsc9_vista_thr.png", "op10_w7__btn.png", "op10d50_w7__btn.png", "op11_w7__btn.png", "op12_w7__btn.png", "op15_w8__btn.svg", "op1_w3__btn.png", "op2_w95__btn.png", "op3_w95__btn.png", "op3d60_w98__btn.png", "op4_w98__btn.png", "op50_w10__btn.svg", "op6_xp__btn.png", "op7_xp__btn.png", "op8_xp__btn.png", "op9d60_vista__btn.png", "sf1_mac10_btn.png", "sf3-4_osx5_btn.png", "sf6_osx8_btn copie.svg", "sf6_osx8_btn.png", "sf6_osx8_btn.svg", "sf6_osx8_btn@2x.png", "sf8_osx10_btn.svg", "vista.svg", "w10.svg", "w3.png", "w3.svg", "w95.svg", "www_ns_ico.png", "xp.svg", "xps.svg"],
                i = urls.length;

            for (; i--;) {
                let img = new Image();
                img.src = "./css/src/" + urls[i];
                fragment.appendChild(img);
            }
            preloadedTex.appendChild(fragment);

            const data = Utils.readJson(Data),
                tooltips = Utils.readJson(Tooltip.names),
                results = await Promise.all([data, tooltips]);

            Data = results[0];
            Tooltip.names = results[1];
        }

        function rotateCamera() {

            let amt = -M.panAmt,
                deltaX = M.y / window.innerHeight - M._y / window.innerHeight,
                deltaY = M.x / window.innerWidth - M._x / window.innerWidth,
                ampX = M.pressed ? 1 : 0.05,
                ampY = ampX;

            M._y = M.y;
            M._x = M.x;
            M.angleX_ -= deltaX * ampX;
            M.angleY_ -= deltaY * ampY;

            let fX = M.angleX_,
                fY = M.angleY_,
                dist;

            if (!M.pressed) {

                if ((dist = M.horizAngle - M.angleX) < 0.001 || (dist = amt - M.angleX) > 0.001) {
                    fX = M.angleX;
                    M.vX = dist * 0.2;
                    NeedsRender = 1;
                } else {
                    M.vX = 0;
                }

                fX += M.vX;
                M.angleX_ = fX;

                if ((dist = -amt - M.angleY) < 0.001 || (dist = amt - M.angleY) > 0.001) {
                    fY = M.angleY;
                    M.vY = dist * 0.2;
                    NeedsRender = 1;
                } else {
                    M.vY = 0;
                }

                fY += M.vY;
                M.angleY_ = fY;

            } else {

                if (fX > M.horizAngle) {
                    dist = fX - M.horizAngle;
                    fX = M.horizAngle + dist / (dist * 20 + 1);
                } else if (fX < amt) {
                    dist = amt - fX;
                    fX = amt - dist / (dist * 10 + 1);
                }

                if (fY < amt) {
                    dist = amt - fY;
                    fY = amt - dist / (dist * 10 + 1);
                } else if (-fY < amt) {
                    dist = amt + fY;
                    fY = -amt + dist / (dist * 10 + 1);
                }
            }

            M.angleY = fY;
            M.angleX = fX;
            AnchorCam.rotation.set(M.angleX, M.angleY, 0, 'YXZ');

        }

        var quaternion = new THREE.Quaternion;

        function updateGroundPos() {
            let vector = new THREE.Vector3(),
                heightHalf = 0.5 * window.innerHeight,
                groundOpt = '',
                lumAmt = 255,
                lum = -((M.horizAngle - M.angleX) * lumAmt) + 255,
                top = 0;

            vector.setFromMatrixPosition(GroundTarget.matrixWorld).project(Camera);

            if (M.angleX - M.horizAngle > 0.0001) {

                vector.y = -vector.y + (Camera.projectionMatrix.elements[5] * 2 * -Camera.position.y) / Camera.position.z;
                op = 1 + 2* M.horizAngle - M.angleX;


                groundOpt = `z-index: 1; opacity: ${op};`;
            }

            top = -vector.y * heightHalf + heightHalf;

            Ground.style.cssText =
                `${groundOpt}transform: translateY(${top}px) scale3d(200, 200, 1);
                background-color: rgb(0,0,${lum});`;
        }

        function update() {
            requestAnimationFrame(update);

            let t = performance.now();
            if (t - M._time > 1e3 / M.fps) {
                M._time = t;

                if (NeedsRender === 1) {
                    NeedsRender = 0;
                    rotateCamera();


                    if (M.pressed)
                        $containerProject.classList.add('grabbing');
                    Renderer.render(Scene, Camera);
                    updateGroundPos();
                }

                if (NeedsUpdate === 1) {
                    growElem();
                    NeedsUpdate = 0;

                } else if (NeedsUpdate === 2) {
                    NeedsUpdate = NeedsRender = 1;
                    $camera.classList.remove('notransition');
                    changeElems();
                }
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

                if (!Elems[id]) {
                    Spawned[id] = createElem(id, obj);
                }

                updateElem(id, obj);
            }


            let _keys = Object.keys(currElems);

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

                    addOptions(elem, className);

                    Elems[id] = obj.length > 5 ?
                        new THREE.CSS3DObject(elem, obj) :
                        new THREE.CSS3DSprite(elem, obj);

                    City.add(Elems[id]);

                    return elem;
                }
            }
        }

        function addOptions(elem, className) {
            delete elem.dataset.s;
            delete elem.dataset.b;

            if (!Options[className])
                return;

            let keys = Object.keys(Options[className]),
                j = keys.length;

            for (; j--;) {
                elem.dataset[keys[j]] = Options[className][keys[j]];
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

            let el = Elems[id],
                dom = el.element,
                state = '';

            if (el.name !== 'end') {
                state = ' preventgrow';
                if (dom.className.includes('grow_h'))
                    state = ' grow_h';
                else if (dom.className.includes('grow_w'))
                    state = ' grow_w';
            }

            el.name = '';

            dom.className = obj[4] + state;

            if (el.attributes[4] !== obj[4]) {
                addOptions(dom, obj[4]);
            }

            el.attributes = obj;

            //check if not sprite
            if (obj.length > 5) {

                if (obj[3] === '') {} else if (obj[3] < 0)
                    dom.style.width = -obj[3] * SpreadFactor * 2 + 'px';
                else
                    dom.style.height = obj[3] * SpreadFactor * 2 + 'px';

                el.position.copy(new THREE.Vector3(obj[0] * SpreadFactor, obj[1] * ScaleFactor * 0.5, obj[2] * SpreadFactor));
                el.rotation.x = obj[6] * Math.PI;
                el.rotation.z = obj[5] * Math.PI;

            } else {

                if (obj[3] !== '')
                    dom.style.height = obj[3] * ScaleFactor + 'px';

                el.position.copy(new THREE.Vector3(obj[0] * SpreadFactor, obj[1] * ScaleFactor * 0.5, obj[2] * SpreadFactor));
                el.rotation.y = M.angleY;
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

        function addListeners() {

            window.addEventListener('resize', _ => {
                Camera.aspect = window.innerWidth / window.innerHeight;
                Camera.updateProjectionMatrix();
                Renderer.setSize(window.innerWidth, window.innerHeight);
                NeedsUpdate = NeedsRender = 1;
            }, false);

            $containerProject.addEventListener('mousedown', e => {
                M.pressed = 1;
                $containerProject.classList.remove('nograb');
            }, false);

            document.addEventListener('mousedown', e => {
                Tooltip.hide();
                $containerProject.classList.add('nograb');
            }, true);

            document.addEventListener('mouseup', e => {
                M.pressed = 0;
                rotateCamera();
                $containerProject.className = '';
            }, true);

            document.addEventListener('mousemove', e => {

                Tooltip.update(e);

                // if (typeof M.x === 'undefined')
                //     M._x = e.clientY, M._y = e.clientX;
                // else
                //     M._x = M.x, M._y = M.y;
                let _x = M.x;
                let _y = M.y;

                M.x = e.clientX;
                M.y = e.clientY;

                if (_x !== M.x || M.y !== _y) {
                    NeedsRender = 1;
                }
            }, false);

            document.addEventListener('timeline-scroll', e => {

                let dotDate = moment(e.detail.date),
                    _year = Year;

                Year = dotDate.year();

                // console.log(Year);
                //abort transitions
                // if (Math.abs(_year - Year) > 0 && Data[Year]) {

                if (_year !== Year && Data[Year]) {
                    $camera.classList.add('notransition');
                    NeedsUpdate = 2;
                }
            });
        }
