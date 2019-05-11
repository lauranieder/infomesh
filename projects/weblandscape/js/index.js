    'use strict';

    const
        GLOBAL = {
            year: 1989,
            needsUpdate: 1, // 1 = needs to update city again
            needsRender: 1, // 1 = render 3d
            _time: performance.now(),
            fps: 1000 / 30,

        },

        SCROLL = {
            time: performance.now(),
            max: 1000,
            min: 50,
            delay: 1000,
            scrollTotal: 0,
        },

        VIEW = {
            heightFactor: 400,
            spreadFactor: 8,
            camFov: 55,
            camY: -20,
            camZ: 700,
            // angleY: 0,angleY_: 0,angleX: 0,angleX_: 0,horizAngle: 0,
            panAmt: Math.PI * 0.12
        },

        MOUSE = {  //also used by ui.js
            vX: 0,
            vY: 0,
            x: 0,
            y: 0,
            _x: 0,
            _y: 0,
            pressed: 0,
            drag: 0,
        },

        UTILS = new Utilities(),
        TOOLTIP = new Tooltips(),

        CITY_SPAWNED = new Map(), //newly added elements
        CITY_EL = new Map(),
        THREE_EL = {},
        DOM_EL = {},    //also used by ui.js
        MODEL_EL = {},

        DATA = {
            opt_el: 'json/city_options.json',
            map: 'json/datas.json', //json data for position and animation
            name_el: 'json/tooltips.json',
            textures: 'json/textures.json'
        }


    // VIEW.heightFactor = 400,
    window.addEventListener('load', init, false);
    async function init() {

        DOM_EL.containerProject = document.querySelector("#container-project");

        await preload();
        getModels();

        // THREE_EL.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );
        THREE_EL.camera = new THREE.PerspectiveCamera(VIEW.camFov, window.innerWidth / window.innerHeight, 1, 10000);
        THREE_EL.camera.position.z = VIEW.camZ;
        THREE_EL.camera.position.y = VIEW.camY;
        THREE_EL.anchorCam = new THREE.Group();

        THREE_EL.anchorCam.add(THREE_EL.camera);

        VIEW.horizAngle = Math.atan(VIEW.camY / VIEW.camZ);
        // (THREE_EL.camera.projectionMatrix.elements[5] * 2 * THREE_EL.anchorCam.position.y) / THREE_EL.camera.position.z;

        TOOLTIP.info = document.querySelector('#elTooltip');

        DOM_EL.ground = document.querySelector('#ground');
        THREE_EL.groundTarget = new THREE.Object3D();
        THREE_EL.pivotGround = new THREE.Object3D();
        THREE_EL.pivotGround.add(THREE_EL.groundTarget);

        THREE_EL.groundTarget.position.copy(new THREE.Vector3(0, 0, -1500)); //-10000

        THREE_EL.city = new THREE.Group();
        THREE_EL.anchorCam.add(THREE_EL.pivotGround);

        THREE_EL.scene = new THREE.Scene();
        THREE_EL.scene.add(THREE_EL.city);
        THREE_EL.scene.add(THREE_EL.anchorCam);

        VIEW.angleY_ = VIEW.angleY = VIEW.panAmt * 0.5;
        VIEW.angleX_ = VIEW.angleX = -VIEW.panAmt * 0.25;

        THREE_EL.anchorCam.rotation.set(VIEW.angleX_, VIEW.angleY_, 0, 'YXZ');

        THREE_EL.renderer = new THREE.CSS3DRenderer(VIEW);
        THREE_EL.renderer.setSize(window.innerWidth, window.innerHeight);
        THREE_EL.renderer.domElement.style.position = 'absolute';

        DOM_EL.containerProject.appendChild(THREE_EL.renderer.domElement);
        DOM_EL.camera = THREE_EL.renderer.domElement.querySelector('#camera');

        addListeners();
        changeElems();

        THREE_EL.renderer.render(THREE_EL.scene, THREE_EL.camera);
        update();
    }

    async function preload() {


        let i;

        const keys = [],
            texContainer = document.createElement('div'),
            promises = [];

        for (const k in DATA) {
            keys.push(k);
            promises.push(UTILS.readJson(DATA[k]));
        }

        const results = await Promise.all(promises);

        for (i = keys.length; i--;) {
            DATA[keys[i]] = results[i];
            // console.log(results[i]);
        }

        //preload background-images
        for (i = DATA.textures.length; i--;) {
            let img = new Image();
            img.src = './css/src/' + DATA.textures[i];
            texContainer.appendChild(img);
        }

        texContainer.style.display = 'none';
        DOM_EL.containerProject.appendChild(texContainer);
    }

    function rotateCamera() {

        let amt = -VIEW.panAmt,
            amtY = -VIEW.panAmt * 1.3,
            deltaX = (MOUSE.y - MOUSE._y) / window.innerHeight,
            deltaY = (MOUSE.x - MOUSE._x) / 950,

            ampX = MOUSE.pressed ? 1 : 0.05,
            ampY = ampX;

        let bottom = VIEW.horizAngle - 0.1;

        MOUSE._y = MOUSE.y;
        MOUSE._x = MOUSE.x;
        VIEW.angleX_ -= deltaX * ampX;
        VIEW.angleY_ -= deltaY * ampY;

        let fX = VIEW.angleX_,
            fY = VIEW.angleY_,
            dist;

        if (!MOUSE.pressed) {

            if ((dist = bottom - VIEW.angleX) < -0.001 || (dist = amt - VIEW.angleX) > 0.001) {

                fX = VIEW.angleX;

                MOUSE.vX = dist * 0.2;
                GLOBAL.needsRender = 1;
            } else {

                MOUSE.vX = 0;
            }

            fX += MOUSE.vX;
            VIEW.angleX_ = fX;

            // if ((dist = -amtY - VIEW.angleY) < -0.001 || (dist = amtY - VIEW.angleY) > 0.001) {
            //     fY = VIEW.angleY;
            //     MOUSE.vY = dist * 0.2;
            //     GLOBAL.needsRender = 1;

            // } else {
            //     MOUSE.vY = 0;
            // }


            fY += MOUSE.vY;
            VIEW.angleY_ = fY;

        } else {

            if (fX > bottom) {
                dist = fX - bottom;
                fX = bottom + dist / (dist * 20 + 1);
            } else if (fX < amt) {
                dist = amt - fX;
                fX = amt - dist / (dist * 10 + 1);
            }

            // if (fY < amtY) {
            //     dist = amtY - fY;
            //     fY = amtY - dist / (dist * 10 + 1);
            // } else if (-fY < amtY) {
            //     dist = amtY + fY;
            //     fY = -amtY + dist / (dist * 10 + 1);
            // }
        }

        VIEW.angleY = fY % (2 * Math.PI);
        VIEW.angleX = fX;
        THREE_EL.anchorCam.rotation.set(VIEW.angleX, VIEW.angleY, 0, 'YXZ');
        THREE_EL.pivotGround.rotation.x = -VIEW.angleX;
    }

    function updateGroundPos() {
        const vector = new THREE.Vector3(),
            heightHalf = 0.5 * window.innerHeight;

        //THREE_EL.camera.matrixWorldInverse
        vector.setFromMatrixPosition(THREE_EL.groundTarget.matrixWorld).project(THREE_EL.camera);
        DOM_EL.ground.style.transform = 'translateY(' + (-vector.y * heightHalf + heightHalf) + 'px) scale3d(200, 200, 1)';
    }

    function update() {
        requestAnimationFrame(update);

        const t = performance.now();

        if (t - GLOBAL._time > GLOBAL.fps) {

            animateScrollbars(t);

            // console.log(Math.random() < 0.05);

            GLOBAL._time = t;

            if (GLOBAL.needsRender === 1) {
                GLOBAL.needsRender = 0;

                rotateCamera();

                if (MOUSE.drag >= 1)
                    DOM_EL.containerProject.classList.add('grabbing');

                THREE_EL.renderer.render(THREE_EL.scene, THREE_EL.camera);
                updateGroundPos();

            }

            if (GLOBAL.needsUpdate === 1) {
                growElem();
                GLOBAL.needsUpdate = 0;

            } else if (GLOBAL.needsUpdate === 2) {
                GLOBAL.needsUpdate = GLOBAL.needsRender = 1;
                DOM_EL.camera.classList.remove('notransition');
                changeElems();
            }
        }
    }

    function growElem() {

        if (CITY_SPAWNED.size) {
            THREE_EL.renderer.domElement.firstElementChild.offsetHeight; //recalculate css
            for (const s of CITY_SPAWNED) {
                s[1].classList.remove('grow_h', 'grow_w');
                CITY_SPAWNED.delete(s[0]);
            }
        }
    }

    function changeElems() {
        let currElems = new Map(CITY_EL),
            keys = Object.keys(DATA.map[GLOBAL.year]),
            i = keys.length,
            id, obj;



        for (; i--;) {
            id = keys[i];
            obj = DATA.map[GLOBAL.year][id];

            currElems.delete(id);

            if (!CITY_EL.has(id)) {
                CITY_SPAWNED.set(id, createElem(id, obj));
            }

            updateElem(id, obj);
        }

        for (const k of currElems) {
            removeElem(k[0]);
        }
    }

    function createElem(id, obj) {

        if (typeof obj === 'number')
            obj = DATA.map[obj][id];

        let className = obj[4],
            i = MODEL_EL.keys.length;

        for (; i--;) {

            if (className.includes(MODEL_EL.keys[i])) {
                const elem = MODEL_EL[MODEL_EL.keys[i]].cloneNode(true);
                elem.className = obj[4] + (obj[3] < 0 ? ' grow_w' : ' grow_h');



                elem.dataset.o = 'obj';

                addOptions(elem, className);

                CITY_EL.set(id, obj.length > 5 ?
                    new THREE.CSS3DObject(elem, obj) :
                    new THREE.CSS3DSprite(elem, obj));



                THREE_EL.city.add(CITY_EL.get(id));

                return elem;
            }
        }
    }

    function animateScrollbars(currTime) {

        if (currTime - SCROLL.time > SCROLL.delay && !MOUSE.pressed) {
            SCROLL.time = currTime;

            let scrolls = Array.from(document.querySelectorAll(':not(:active):not(:hover).scroll')),
                nScrolls = ~~(scrolls.length / 30) + 1;

            SCROLL.delay = Math.random() * (SCROLL.max / (scrolls.length || SCROLL.max)) + SCROLL.min;

            if (!scrolls.length)
                return;

            for (; nScrolls--;) {

                let scr = scrolls.splice(~~(Math.random() * scrolls.length), 1)[0];
                // console.log(scr);
                let prg = scr.querySelector('.prg'),
                    currFlex = +prg.style.flexGrow,
                    direction;

                if (currFlex > 1) {
                    direction = -1;
                } else if (currFlex < 0) {
                    direction = 1;
                } else {
                    direction = Math.sign(Math.random() - 0.5);
                }

                prg.style.flexGrow = currFlex + (Math.random() * 0.3 + 0.1) * direction;
            }


        }
    }

    function addOptions(elem, className) {
        elem.dataset.b = DATA.opt_el[className] || '';
    }

    function removeElem(id) {

        const el = CITY_EL.get(id);
        const dom = el.element;

        if (el.name == 'end') {
            THREE_EL.city.remove(el);
            CITY_EL.delete(id);
        } else {
            dom.classList.remove('preventgrow');
            dom.classList.add('grow_h');
            el.name = 'end';
        }
    }

    function updateElem(id, obj) {

        if (typeof obj === 'number')
            obj = DATA.map[obj][id];

        let el = CITY_EL.get(id),
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
            dom.style.removeProperty('--p');
            addOptions(dom, obj[4]);
        }

        el.attributes = obj;

        //check if not sprite
        if (obj.length > 5) {

            if (obj[3] < 0)
                dom.style.width = -obj[3] * VIEW.spreadFactor * 2 + 'px';
            else if (obj[3] !== '')
                dom.style.height = obj[3] * VIEW.spreadFactor * 2 + 'px';

            el.position.copy(new THREE.Vector3(obj[0] * VIEW.spreadFactor, obj[1] * VIEW.heightFactor * 0.5, obj[2] * VIEW.spreadFactor));
            el.rotation.x = obj[6] * Math.PI;
            el.rotation.z = obj[5] * Math.PI;

        } else {

            if (obj[3] !== '')
                dom.style.height = obj[3] * VIEW.heightFactor + 'px';

            el.position.copy(new THREE.Vector3(obj[0] * VIEW.spreadFactor, obj[1] * VIEW.heightFactor * 0.5, obj[2] * VIEW.spreadFactor));
            el.rotation.y = VIEW.angleY;
        }
    }

    function getModels() {
        const modelsContainer = document.getElementById('models'),
            elems = modelsContainer.children;

        for (let i = elems.length; i--;) {
            MODEL_EL[elems[i].className] = elems[i];
        }

        MODEL_EL.keys = Object.keys(MODEL_EL);
        // console.log(MODEL_EL.keys);
    }


    function addListeners() {

        window.addEventListener('resize', _ => {

            THREE_EL.camera.aspect = window.innerWidth / window.innerHeight;
            THREE_EL.camera.updateProjectionMatrix();
            THREE_EL.renderer.setSize(window.innerWidth, window.innerHeight);
            GLOBAL.needsUpdate = GLOBAL.needsRender = 1;

        }, false);

        document.addEventListener('timeline-scroll', e => {

            const dotDate = moment(e.detail.date),
                _year = GLOBAL.year;

            GLOBAL.year = dotDate.year();

            if (_year !== GLOBAL.year && DATA.map[GLOBAL.year]) {
                DOM_EL.camera.classList.add('notransition');
                GLOBAL.needsUpdate = 2;
            }
        });

        //computer

        DOM_EL.containerProject.addEventListener('mousedown', mouseDown, false);
        document.addEventListener('mousedown', mouseDown_capture, true);
        document.addEventListener('mousemove', mouseMove, false);
        document.addEventListener('mouseup', mouseUp_capture, true);

        //mobile

        DOM_EL.containerProject.addEventListener('touchstart', e => {
            mouseDown(e.touches[0]);
        }, false);

        document.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                const t = e.touches[0];
                MOUSE._x = MOUSE.x = t.clientX;
                MOUSE._y = MOUSE.y = t.clientY;

                mouseDown_capture(t);
            }

        }, true);

        document.addEventListener('touchend', function(e) {
            if (!e.touches.length) {

                if(e.cancelable) {
                    //prevent event flow after touchend
                    e.preventDefault();
                    //dirty fix for the click event of Popup
                    e.target.dispatchEvent(new Event('click', {bubbles: true}));
                }

                Object.assign(e, { clientX: MOUSE.x, clientY: MOUSE.y });
                mouseUp_capture(e);
            }

        }, true);


        document.addEventListener('touchmove', function(e) {
            if (e.touches.length === 1) mouseMove(e.touches[0]);
        }, false);



        function mouseDown(e) {
            MOUSE.pressed = 1;
        }

        function mouseDown_capture(e) {
            if (e.target === DOM_EL.camera.parentElement) {
                MOUSE.drag = 1;
                TOOLTIP.hide(e);
            }

            e.target.onmouseleave = leave;
            e.target.ontouchmove = function(te) {
                const t = te.touches[0];
                if (te.target !== document.elementFromPoint(t.clientX, t.clientY))
                    leave.call(this);
            }

            function leave() {
                this.onmouseleave = this.ontouchmove = null;

                TOOLTIP.hide();

                if (MOUSE.pressed)
                    MOUSE.drag = 1;
            }
        }

        function mouseUp_capture(e) {

            TOOLTIP.show(e);
            MOUSE.drag = MOUSE.pressed = 0;

            rotateCamera();
            DOM_EL.containerProject.className = '';
        }

        function mouseMove(e) {

            const _x = MOUSE.x,
                _y = MOUSE.y;

            MOUSE.x = e.clientX;
            MOUSE.y = e.clientY;

            if (_x !== MOUSE.x || MOUSE.y !== _y)
                GLOBAL.needsRender = 1;
        }
    }

    //CLASSES

    function Tooltips() {
        this.delay = 1000;
        this.elem = this.info = null;
    }

    Tooltips.prototype.rename = function(elem) {

        let c = elem.classList,
            i = c.length,
            result = [];

        for (; i--;) {
            let v = DATA.name_el[c[i]];
            if (v)
                result[v[1]] = v[0] + (v[1] !== 0 ? '\n' : ' ');
        }

        return result.filter(el => el).join('').slice(0, -1);

    }

    Tooltips.prototype.show = function(e) {
        if (!e.target.closest)
            return;

        const elem = e.target.closest('[data-o]');

        if (elem && this.elem !== elem && MOUSE.drag < 0.3) {
            this.info.style.top = e.clientY + 'px';
            this.info.classList.add('show');
            this.info.previousElementSibling.style.width = (e.clientX / window.innerWidth * 100) + '%';
            this.info.firstElementChild.textContent = this.rename(elem);

            this.elem = elem;
        }
    }

    Tooltips.prototype.toggle = function(e) {


        const elem = e.target.closest('[data-o]');

        if (elem && this.elem !== elem && MOUSE.drag < 0.3) {
            this.info.style.top = e.clientY + 'px';
            this.info.classList.add('show');
            this.info.previousElementSibling.style.width = (e.clientX / window.innerWidth * 100) + '%';
            this.info.firstElementChild.textContent = this.rename(elem);

            this.elem = elem;

        } else {
            this.hide();
        }
    }

    Tooltips.prototype.hide = function() {
        this.info.classList.remove('show');
        this.elem = null;
    }


    function Utilities() {}

    Utilities.prototype.map = function(n, start1, stop1, start2, stop2) {
        return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    }

    Utilities.prototype.minMax = function(n, min, max) {
        if (n < min)
            n = min;
        else if (n > max)
            n = max;

        return n;
    }

    Utilities.prototype.readJson = function(url) {
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