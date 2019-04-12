window.addEventListener('load', _ => {
    const A = {

        _btn(btn, e) {

            if (btn.classList.contains('false'))
                return btn.onmouseup = '';

            btn.onmouseup = _ => {
                btn.onmouseup = '';
                switch (btn.dataset.b) {
                    case 'refr':
                        clearTimeout(A.clock);

                        let c1, c2, suff;

                        if (btn.className.includes('stop')) {
                            suff = A.findSuffix(btn, 'stop');
                            c1 = 'stop' + suff;
                            c2 = 'refr' + suff;

                        } else if(btn.className.includes('refr')) {

                            suff = A.findSuffix(btn, 'refr');
                            c1 = 'refr' + suff;
                            c2 = 'stop' + suff;

                            A.clock = setTimeout(_ => A.replace(btn, c2, c1), Math.random() * 2e3 + 100); //Math.random() * 2e3 + 100

                        } else {
                            
                            break;
                        }

                        A.replace(btn, c1, c2);
                        break;
                    case 'check':
                        btn.classList.toggle('check');
                        break;
                }
            }
        },

        findSuffix(elem, string) {
            let reg = new RegExp(string + "\\S\\w*", "i"),
                res = elem.className.match(reg);

            return !res ? '' : res[0].replace(string, '');
        },

        replace(dom, cl, cl_) {
            dom.classList.remove(cl);
            dom.classList.add(cl_);
        },

        _trk(trk, e) {
            const prg = trk.querySelector('.prg'),
                thb = trk.querySelector('.thb');


            let offset = 0;

            let fixed = new A.fixedBg(trk, prg, thb),
                prev = new A.preview(thb);

            if (e.target === thb) {
                const mouseY = convertPointFromPageToNode(trk, e.pageX, e.pageY).y;

                offset = -mouseY + thb.offsetTop + thb.offsetHeight * 0.5;
            } else {
                drag(e);
            }

            window.addEventListener('mousemove', drag);
            window.addEventListener('mouseup', done);

            function drag(e) {
                const mouseY = convertPointFromPageToNode(trk, e.pageX, e.pageY).y;

                v = (mouseY + offset - thb.offsetHeight * 0.5) / (trk.offsetHeight - thb.offsetHeight);
                v = v < 0 ? 0 : v > 1 ? 1 : v;
                prg.style.flexGrow = v;

                fixed.update();
                prev.update();
            }

            function done() {
                window.removeEventListener('mousemove', drag);
                window.removeEventListener('mouseup', done);
                prev.reset();
                fixed = prev = null;
            }
        },

        preview: function(thb) {
            let y = (thb.parentElement.parentElement.dataset.s + '').includes('pre') ? thb.offsetTop : undefined;

            this.update = function() {
                if (y !== undefined) thb.style.setProperty('--p', y - thb.offsetTop + 'px');
            }

            this.reset = function() {
                thb.style.setProperty('--p', 0);
            }
        },

        fixedBg: function(trk, prg, thb) {
            let oh, og;

            prg = prg || trk.querySelector('.prg');
            thb = thb || trk.querySelector('.thb');

            this.update = function() {
                if (oh !== undefined) thb.style.backgroundPositionY = og + oh - prg.offsetHeight + 'px';
            }

            if ((trk.parentElement.dataset.s + '').includes('fixed')) {
                oh = prg.offsetHeight;
                og = parseInt(thb.style.backgroundPositionY || window.getComputedStyle(thb).getPropertyValue('background-position-y'));
            }
        },

        _arr(btn, e) {
            let O = [300, 50, undefined]; //delay, clock, amt

            if (btn.parentElement.dataset.b) {
                let a = btn.parentElement.dataset.b.split(' ');
                for (let i = a.length; i--;) {
                    O[i] = +a[i];
                }
            }

            let f = (d = O[1]) => {
                if (btn.matches(':active'))
                    A.setScroll(btn, O[2]), A.clock = setTimeout(f, d);
            };

            clearTimeout(A.clock);
            setTimeout(_ => f(O[0])); //settimeout bug fix firefox
        },

        setScroll(e, amt) {
            let ss = e.parentNode.querySelectorAll('._trk.s .prg'),
                s = e.parentNode.querySelector('._trk:not(.s) .prg'),
                sc = e.parentNode.querySelector('._trk'),
                v = s.style.flexGrow || window.getComputedStyle(s).getPropertyValue('flex-grow');

            amt = amt ? amt / (sc.getBoundingClientRect().height) : 1 / 15;

            v = +v + amt * (e.matches(':first-of-type') ? -1 : 1);

            let fixed = new A.fixedBg(sc);
            s.style.flexGrow = v < 0 ? 0 : v > 1 ? 1 : v;
            fixed.update();
            fixed = '';

            for (var i = ss.length; i--;)
                A.$thumb(ss[i]);
        },

        _btn2() {},

        $thumb() {

        }
    }

    document.addEventListener('mousedown', e => {

        let c = e.target,
            p, args;

        while (c.parentNode) {

            p = c.className;

            if (typeof p === 'string' && p.includes('_')) {
                p = '_' + c.className.split('_')[1].split(' ')[0];

                // if(typeof A[p] !== 'undefined')
                A[p](c, e);

                e.stopPropagation();
                break;
            }
            c = c.parentNode;
        }

    }, true);
});