'use strict';

window.addEventListener('load', _ => {
    const A = {

        singleEvents: new WeakMap(),

        onEvent(dom, ...listener) {
            let name = listener[0],
                old = A.singleEvents.get(dom);

            if (!old) {
                old = {};
                A.singleEvents.set(dom, old);
            }

            if (old[name])
                dom.removeEventListener(...old[name]);

            old[name] = listener;

            dom.addEventListener(...listener);
        },

        _btn(btn, e) {

            if (btn.classList.contains('false'))
                return btn.onmouseup = btn.ontouchend = null;

            let opts = (btn.dataset.b||'').split(' ');


            A.readOptions(opts, {
                focus(o) {
                    btn.blur();

                    A.onEvent(btn, 'animationend', function(e) {
                        if (e.target === this && e.animationName === o.name)
                            setTimeout(_ => btn.blur(), 500);

                    });
                }

            });

            btn.ontouchend = btn.onmouseup = _ => {
                // btn.addEventListener('mousedown', evl, true);
                btn.onmouseup = btn.ontouchend = null;

                A.readOptions(opts, {

                    refr() {

                        clearTimeout(A.clock);

                        let c1, c2, suff = btn.className;

                        if (suff.includes('stop')) {
                            suff = A.findSuffix(suff, 'stop');
                            c1 = 'stop' + suff;
                            c2 = 'refr' + suff;

                        } else if (suff.includes('refr')) {

                            suff = A.findSuffix(suff, 'refr');
                            c1 = 'refr' + suff;
                            c2 = 'stop' + suff;

                            A.clock = setTimeout(_ => A.replace(btn, c2, c1), Math.random() * 2e3 + 100); //Math.random() * 2e3 + 100

                        } else {
                            return;
                        }

                        A.replace(btn, c1, c2);
                    },

                    check() {
                        btn.classList.toggle('check');
                    }
                });
            }
        },

        readOptions(opts, scenar) {
            let i = opts.length,
                curr, args;



            for (; i--;) {
                [curr, args] = opts[i].split('{');

                if (curr = scenar[curr]) {
                    if (args)
                        args = Function('return {' + args)();
                    curr(args);
                }
            }
        },

        findSuffix(target, string) {
            let reg = new RegExp(string + "\\S+", "i"),
                res = target.match(reg);

            return !res ? '' : res[0].replace(string, '');
        },

        replace(dom, cl, cl_) {
            dom.classList.remove(cl);
            dom.classList.add(cl_);
        },

        _trk(trk, e) {

            e.stopPropagation();


            if (e.touches)
                e = e.touches[0];

            const prg = trk.querySelector('.prg'),
                thb = trk.querySelector('.thb');

            let offset = 0;

            let scr = trk.parentElement;

            let fixed = new A.fixedBg(trk, prg, thb, scr),
                prev = new A.preview(thb, scr);

            if (e.target === thb) {
                const mouseY = convertPointFromPageToNode(trk, e.pageX, e.pageY).y;

                offset = -mouseY + thb.offsetTop + thb.offsetHeight * 0.5;
            } else {
                drag(e);
            }

            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('mouseup', done);
            document.addEventListener('touchend', done);

            function drag(e) {


                if (e.touches && e.touches.length === 1)
                    e = e.touches[0];

                const mouseY = convertPointFromPageToNode(trk, e.pageX, e.pageY).y,
                    v = (mouseY + offset - thb.offsetHeight * 0.5) / (trk.offsetHeight - thb.offsetHeight);

                A.moveThb(prg, v);
                fixed.update();
                prev.update();
            }

            function done() {
                if (e.touches && e.touches.length)
                    return;

                document.removeEventListener('mousemove', drag);
                document.removeEventListener('touchmove', drag);
                document.removeEventListener('mouseup', done);
                document.removeEventListener('touchend', done);

                prev.reset();
                fixed = prev = null;
            }
        },

        moveThb: function(prg, amt) {
            prg.style.flexGrow = amt < 0 ? 0 : amt > 1 ? 1 : amt;
            if (typeof MOUSE !== 'undefined' && MOUSE.drag < 0.5) MOUSE.drag += 0.1;
        },

        preview: function(thb, scr) {
            let y = (scr.dataset.b + '').includes('pre') ? thb.offsetTop : undefined;

            this.update = function() {
                if (y !== undefined) scr.style.setProperty('--p', y - thb.offsetTop + 'px');
            }

            this.reset = function() {
                scr.style.setProperty('--p', 0);
            }
        },

        fixedBg: function(trk, prg, thb, scr) {
            let oh, og;

            prg = prg || trk.querySelector('.prg');
            thb = thb || trk.querySelector('.thb');
            scr = scr || trk.parentElement;

            this.update = function() {
                if (oh !== undefined) thb.style.setProperty('--b', og + oh - prg.offsetHeight + 'px');
            }

            if ((scr.dataset.b + '').includes('fixed')) {
                oh = prg.offsetHeight;
                og = parseInt(thb.style.getPropertyValue('--b'));
            }
        },

        _arr(btn, event) {

            let O = { delay: 300, clock: 50, amt: undefined }, //delay, clock, amt
                opts = A.findSuffix(btn.parentElement.dataset.b, '_arr');

            if (opts) {
                opts = Function('return ' + opts)();
            }

            Object.assign(O, opts);

            let f = (d = O.clock, firstTime) => {
                if (firstTime || btn.matches(':active')) {
                    A.setScroll(btn, O.amt), A.clock = setTimeout(f, d);
                }
            };

            clearTimeout(A.clock);
            f(O.delay, true); //settimeout bug fix firefox
        },

        setScroll(e, amt) {
            // let ss = e.parentNode.querySelectorAll('._trk.s .prg'),
            let s = e.parentNode.querySelector('.prg'),
                sc = e.parentNode.querySelector('._trk'),
                v = s.style.flexGrow;

            amt = amt ? amt / (sc.getBoundingClientRect().height) : 1 / 15;

            v = +v + amt * (e.classList.contains('top') ? -1 : 1);

            let fixed = new A.fixedBg(sc);

            A.moveThb(s, v);
            fixed.update();
            fixed = '';

            // for (var i = ss.length; i--;)
            //     A.$thumb(ss[i]);
        },

        _btn2() {},

        // $thumb() {}
    }

    DOM_EL.containerProject.addEventListener('touchstart', e => {

        //disable long press (right click) on mobile
        e.target.oncontextmenu = function(e) {
            this.oncontextmenu = null;
            e.preventDefault();
        }

        if (e.touches.length === 1)
            mouseDown_capture(e);

    }, true);

    function mouseDown_capture(e) {
        let c = e.target,
            p, args;

        while (c.parentNode) {

            p = c.className;

            if (typeof p === 'string' && p.includes('_')) {
                p = '_' + c.className.split('_')[1].split(' ')[0];

                // if(typeof A[p] !== 'undefined')

                A[p](c, e);

                break;
            }
            c = c.parentNode;
        }
    }

    document.addEventListener('mousedown', mouseDown_capture, true);
});