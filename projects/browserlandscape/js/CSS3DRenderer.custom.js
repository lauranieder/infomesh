/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 * @author yomotsu / https://yomotsu.net/
 */

THREE.CSS3DObject = function(element, attributes) {

    THREE.Object3D.call(this);

    this.element = element;
    this.element.style.position = 'absolute';

    this.attributes = attributes;

    this.addEventListener('removed', function() {

        if (this.element.parentNode !== null) {

            this.element.parentNode.removeChild(this.element);

        }

    });

};

THREE.CSS3DObject.prototype = Object.create(THREE.Object3D.prototype);
THREE.CSS3DObject.prototype.constructor = THREE.CSS3DObject;

THREE.CSS3DSprite = function(element, attributes) {

    THREE.CSS3DObject.call(this, element, attributes);

};

THREE.CSS3DSprite.prototype = Object.create(THREE.CSS3DObject.prototype);
THREE.CSS3DSprite.prototype.constructor = THREE.CSS3DSprite;

//

THREE.CSS3DRenderer = function(coords) {

    console.log('THREE.CSS3DRenderer', THREE.REVISION);

    var _width, _height;
    var _widthHalf, _heightHalf;

    var coords = coords;

    var matrix = new THREE.Matrix4();

    var cache = {
        camera: { fov: 0, style: '' },
        objects: new WeakMap()
    };

    var domElement = document.createElement('div');
    domElement.style.overflow = 'hidden';

    this.domElement = domElement;

    var cameraElement = document.createElement('div');

    cameraElement.style.WebkitTransformStyle = 'preserve-3d';
    cameraElement.style.transformStyle = 'preserve-3d';
    cameraElement.style.pointerEvents = 'none';
    cameraElement.id = 'camera';

    domElement.appendChild(cameraElement);

    var isIE = /Trident/i.test(navigator.userAgent);

    this.getSize = function() {
        return {
            width: _width,
            height: _height
        };

    };

    this.setSize = function(width, height) {

        _width = width;
        _height = height;
        _widthHalf = _width * 0.5;
        _heightHalf = _height * 0.5;

        domElement.style.width = width + 'px';
        domElement.style.height = height + 'px';

        cameraElement.style.width = width + 'px';
        cameraElement.style.height = height + 'px';

    };

    function epsilon(value) {
        if (Math.abs(value) < 1e-10) {
            return value;
        } else {
            return value;
        }
    }

    function getCameraCSSMatrix(matrix) {

        var elements = matrix.elements;

        return 'matrix3d(' +
            epsilon(elements[0]) + ',' +
            epsilon(-elements[1]) + ',' +
            epsilon(elements[2]) + ',' +
            epsilon(elements[3]) + ',' +
            epsilon(elements[4]) + ',' +
            epsilon(-elements[5]) + ',' +
            epsilon(elements[6]) + ',' +
            epsilon(elements[7]) + ',' +
            epsilon(elements[8]) + ',' +
            epsilon(-elements[9]) + ',' +
            epsilon(elements[10]) + ',' +
            epsilon(elements[11]) + ',' +
            epsilon(elements[12]) + ',' +
            epsilon(-elements[13]) + ',' +
            epsilon(elements[14]) + ',' +
            epsilon(elements[15]) +
            ')';
    }

    function getObjectCSSMatrix(matrix, cameraCSSMatrix, anchorPoint = [50, 50]) {

        var elements = matrix.elements;
        var anchor = `translate(-${anchorPoint[0]}%,-${anchorPoint[1]}%)`;
        var matrix3d = 'matrix3d(' +
            epsilon(elements[0]) + ',' +
            epsilon(elements[1]) + ',' +
            epsilon(elements[2]) + ',' +
            epsilon(elements[3]) + ',' +
            epsilon(-elements[4]) + ',' +
            epsilon(-elements[5]) + ',' +
            epsilon(-elements[6]) + ',' +
            epsilon(-elements[7]) + ',' +
            epsilon(elements[8]) + ',' +
            epsilon(elements[9]) + ',' +
            epsilon(elements[10]) + ',' +
            epsilon(elements[11]) + ',' +
            epsilon(elements[12]) + ',' +
            epsilon(elements[13]) + ',' +
            epsilon(elements[14]) + ',' +
            epsilon(elements[15]) +
            ')';

        if (isIE) {
            return anchor +
                'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)' +
                cameraCSSMatrix +
                matrix3d;
        }

        return anchor + matrix3d;
        // return 'translate(-50%,-50%)' + matrix3d;

    }

    function renderObject(object, camera, cameraCSSMatrix, fragment) {

        if (object instanceof THREE.CSS3DObject) {

            var style;

            if (object instanceof THREE.CSS3DSprite) {

                // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/
                // matrix.copy(camera.matrixWorldInverse);
                // matrix.transpose();
                // matrix.copyPosition(object.matrixWorld);
                // matrix.scale(object.scale);

                // matrix.elements[3] = 0;
                // matrix.elements[7] = 0;
                // matrix.elements[11] = 0;
                // matrix.elements[15] = 1;
                // style = getObjectCSSMatrix(matrix, cameraCSSMatrix);
                object.rotation.y = coords.angleY;
                style = getObjectCSSMatrix(object.matrixWorld, cameraCSSMatrix, [50, 100]);

            } else {
                style = getObjectCSSMatrix(object.matrixWorld, cameraCSSMatrix, [50, 100]);
            }


            var element = object.element;
            // if(element.id == 'ttt') {
            //  let z = object.getWorldQuaternion(new THREE.Euler()).z;
            //  z = THREE.Math.radToDeg( z ) + (z < 0 ? 180: -180);
            //  style += `skew(0, ${z}deg)`;
            // }

            var cachedObject = cache.objects.get(object);

            if (cachedObject === undefined || cachedObject.style !== style) {

                element.style.WebkitTransform = style;
                element.style.transform = style;

                var objectData = { style: style };

                if (isIE)
                    objectData.distanceToCameraSquared = getDistanceToSquared(camera, object);

                cache.objects.set(object, objectData);

            }

            if (element.parentNode !== cameraElement) {
                fragment = fragment || document.createDocumentFragment();
                fragment.appendChild(element);
            }

        }

        for (var i = 0, l = object.children.length; i < l; i++) {

            fragment = renderObject(object.children[i], camera, cameraCSSMatrix, fragment);

        }

        return fragment;

    }

    var getDistanceToSquared = function() {

        var a = new THREE.Vector3();
        var b = new THREE.Vector3();

        return function(object1, object2) {

            a.setFromMatrixPosition(object1.matrixWorld);
            b.setFromMatrixPosition(object2.matrixWorld);

            return a.distanceToSquared(b);

        };

    }();

    function filterAndFlatten(scene) {

        var result = [];

        scene.traverse(function(object) {
            if (object instanceof THREE.CSS3DObject)
                result.push(object);
        });

        return result;
    }

    function zOrder(scene) {

        var sorted = filterAndFlatten(scene).sort(function(a, b) {

            var distanceA = cache.objects.get(a).distanceToCameraSquared;
            var distanceB = cache.objects.get(b).distanceToCameraSquared;

            return distanceA - distanceB;

        });

        var zMax = sorted.length;

        for (var i = 0, l = sorted.length; i < l; i++) {

            sorted[i].element.style.zIndex = zMax - i;

        }

    }

    this.render = function(scene, camera) {

        let fov = camera.projectionMatrix.elements[5] * _heightHalf;

        if (cache.camera.fov !== fov) {
            if (camera.isPerspectiveCamera) {
                domElement.style.WebkitPerspective = fov + 'px';
                domElement.style.perspective = fov + 'px';
            }
            cache.camera.fov = fov;
        }

        scene.updateMatrixWorld();

        // if (camera.parent === null)
        camera.updateMatrixWorld();

        // if (camera.isOrthographicCamera) {
        //     var tx = -(camera.right + camera.left) / 2;
        //     var ty = (camera.top + camera.bottom) / 2;
        // }

        // var cameraCSSMatrix = camera.isOrthographicCamera ?
        //     'scale(' + fov + ')' + 'translate(' + epsilon(tx) + 'px,' + epsilon(ty) + 'px)' + getCameraCSSMatrix(camera.matrixWorldInverse) :
        //     'translateZ(' + fov + 'px)' + getCameraCSSMatrix(camera.matrixWorldInverse);
        let cameraCSSMatrix = `translateZ(${fov}px) ${getCameraCSSMatrix(camera.matrixWorldInverse)}`;
        let style = `${cameraCSSMatrix} translate(${_widthHalf}px, ${_heightHalf}px)`;

        if (cache.camera.style !== style && !isIE) {

            cameraElement.style.WebkitTransform = style;
            cameraElement.style.transform = style;
            cache.camera.style = style;
        }

        var fragment = renderObject(scene, camera, cameraCSSMatrix);
        if (fragment)
            cameraElement.appendChild(fragment);

        if (isIE)
            zOrder(scene);

    };

};