// csstransformutils.js
// Copyright (c) 2014 AKIYAMA Kouhei
// This software is released under the MIT License.

(function(global){
    if(!global.misohena){ global.misohena = {};}
    if(!global.misohena.CSSTransformUtils){ global.misohena.CSSTransformUtils = {};}
    var mypkg = global.misohena.CSSTransformUtils;


    mypkg.relPosX = relPosX;
    function relPosX(elem){
        return !elem.offsetParent ? elem.offsetLeft :
            elem.parentNode == elem.offsetParent ? elem.offsetLeft :
            elem.parentNode.offsetParent == elem.offsetParent ? elem.offsetLeft - elem.parentNode.offsetLeft :
            0;
    }
    mypkg.relPosY = relPosY;
    function relPosY(elem){
        return !elem.offsetParent ? elem.offsetTop :
            elem.parentNode == elem.offsetParent ? elem.offsetTop :
            elem.parentNode.offsetParent == elem.offsetParent ? elem.offsetTop - elem.parentNode.offsetTop :
            0;
    }

    // ページ座標から要素内コンテンツ領域左上を原点とする座標系へ変換します。
    mypkg.convertPointFromPageToNodeContentArea = convertPointFromPageToNodeContentArea;
    function convertPointFromPageToNodeContentArea(elem, pageX, pageY)
    {
        var outerLeftTop = getElementOuterLeftTop(elem);
        var pos = convertPointFromPageToNode(elem, pageX, pageY);
        pos[0] -= outerLeftTop[0];
        pos[1] -= outerLeftTop[1];
        return pos;
    }

    /// ページ座標から要素内bounding-box左上を原点とする座標系へ変換します。
    mypkg.convertPointFromPageToNode = convertPointFromPageToNode;
    function convertPointFromPageToNode(elem, pageX, pageY)
    {
        if(global.webkitConvertPointFromPageToNode && global.WebKitPoint){
            //console.log("use webkitConvertPointFromPageToNode");
            var r = webkitConvertPointFromPageToNode(elem, new WebKitPoint(pageX, pageY));
            return [r.x, r.y];
        }
        else{
            return convertPointFromPageToNode_Impl(elem, pageX, pageY);
        }
    }

    function convertPointFromPageToNode_Impl(elem, pageX, pageY)
    {
        var matPageToElement = matNewInverse(getMatrixFromNodeToPage(elem));
        if(matPageToElement){
            return matNewMulVec(matPageToElement, [pageX, pageY]);
        }
        else{
            return [0,0];
        }
    }

    /// 要素コンテンツ領域左上側の幅と高さを求めます。
    function getElementOuterLeftTop(elem)
    {
        var elemStyle = getElementComputedStyle(elem);
        function getNumber(propName){ return parseFloat(elemStyle.getPropertyValue(propName));}
        var left = getNumber("border-left-width") + getNumber("padding-left") || 0;
        var top = getNumber("border-top-width") + getNumber("padding-top") || 0;
        return [left, top];
    }

    /// 要素内bounding-box左上を原点とする座標系からページ左上を原点とする座標系へ変換する行列を求めます。
    function getMatrixFromNodeToPage(elem)
    {
        var mat = matNewIdentity();
        while(elem){
            var tformMat = getCSSTransformMatrix(elem);
            if(tformMat){
                matMul(mat, tformMat, mat);
            }

            matMul(mat, matNewTranslate(relPosX(elem), relPosY(elem)), mat );
            var elemStyle = getElementComputedStyle(elem);
            if(elemStyle && elemStyle.position == "fixed"){ //see Firefox Bug https://bugzilla.mozilla.org/show_bug.cgi?id=434678
                matMul(mat, matNewTranslate(window.pageXOffset, window.pageYOffset), mat);
                break;
            }
            if(!elem.offsetParent){
                break; //root or body
            }
            elem = elem.parentNode;
        }
        return mat;
    }

    function getElementComputedStyle(elem)
    {
        return window.getComputedStyle ? window.getComputedStyle(elem, "") :
            document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(elem, "") :
            elem.currentStyle ||
            elem.style;
    }

    /// CSS Transformのプロパティ(transformプロパティやtransform-originプロパティなど)による変換行列を求めます。
    function getCSSTransformMatrix(elem)
    {
        var elemStyle = getElementComputedStyle(elem);
        var origins = parseCSSTransformOrigin(elemStyle.transformOrigin, [elem.offsetWidth, elem.offsetHeight]);
        var tform = parseCSSTransform(elemStyle.transform);
        return matNewMul(matNewTranslate(origins[0], origins[1]), matNewMul(tform, matNewTranslate(-origins[0], -origins[1])));
    }

    /// transform-originプロパティの文字列を解析し、座標値を入れた配列を返します。
    function parseCSSTransformOrigin(originStr, boxSizes)
    {
        //http://www.w3.org/TR/css3-transforms/#transform-origin-property
        var values = originStr.split(" ");
        var origins = [];
        for(var i = 0; i < values.length; ++i){
            var value = values[i].trim().toLowerCase();
            if(value == ""){
                continue;
            }
            var refSize = boxSizes[origins.length] || 0;
            switch(value){
            case "left": origins.push(0); break;
            case "top": origins.push(0); break;
            case "right": origins.push(boxSizes[0] || 0); break;
            case "bottom": origins.push(boxSizes[1] || 0); break;
            case "center": origins.push(refSize*0.5); break;
            default:
                if(value.indexOf("%") > 0){
                    origins.push(refSize * parseFloat(value) / 100);
                }
                else{
                    origins.push(parseFloat(value));
                }
                break;
            }
        }

        while(origins.length < 2){
            refSize = boxSizes[origins.length] || 0;
            origins.push(refSize * 0.5); //default 50%
        }

        return origins;
    }

    /// transformプロパティの文字列を解析し、行列を返します。
    function parseCSSTransform(tformStr)
    {
        //http://www.w3.org/TR/css3-transforms/#transform-property
        var funStrs = tformStr.split(")");
        funStrs.pop();

        var mat = matNewIdentity();

        for(var i = 0; i < funStrs.length; ++i){

            var funNameValue = funStrs[i].split("(");
            var fun = funNameValue[0].trim();
            var args = funNameValue[1];
            switch(fun){
            // 2D Transform Functions
            // http://www.w3.org/TR/css3-transforms/#two-d-transform-functions
            case "matrix":
                matMul(mat, mat, matNewMatrix3x2.apply(null, args.split(",")));
                break;
            case "translate":
                var xy = args.split(",");
                matMul(mat, mat, matNewTranslate(parseFloat(xy[0]), parseFloat(xy[1] || "0")));
                break;
            case "translateX":
                matMul(mat, mat, matNewTranslate(parseFloat(args), 0));
                break;
            case "translateY":
                matMul(mat, mat, matNewTranslate(0, parseFloat(args)));
                break;
            case "scale":
                var sxy = args.split(",");
                matMul(mat, mat, matNewScale(parseFloat(sxy[0]), parseFloat(sxy.length >= 2 ? sxy[1] : sxy[0])));
                break;
            case "scaleX":
                matMul(mat, mat, matNewScale(parseFloat(args), 1));
                break;
            case "scaleY":
                matMul(mat, mat, matNewScale(1, parseFloat(args)));
                break;
            case "rotate":
                matMul(mat, mat, matNewRotate2D(toRadian(args)));
                break;
            case "skew":
                var wxy = args.split(",");
                matMul(mat, mat, matNewSkew2D(toRadian(wxy[0]), toRadian(wxy[1] || "0")));
                break;
            case "skewX":
                matMul(mat, mat, matNewSkew2D(toRadian(args), 0));
                break;
            case "skewY":
                matMul(mat, mat, matNewSkew2D(0, toRadian(args)));
                break;
            //http://www.w3.org/TR/css3-transforms/#three-d-transform-functions
            ///@todo support 3D Transform Functions
            }
        }
        return mat;
    }
    function toRadian(angle)
    {
        return angle.indexOf("deg") >= 0 ? parseFloat(angle) * (Math.PI/180) :
            angle.indexOf("grad") >= 0 ? parseFloat(angle) * (Math.PI/200) :
            parseFloat(angle);
    }
    //
    // Matrix
    //
    // http://www.w3.org/TR/css3-transforms/#MatrixDefined
    function matSet(dst, a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p)
    {
        dst[0] = a; dst[1] = b; dst[2] = c; dst[3] = d;
        dst[4] = e; dst[5] = f; dst[6] = g; dst[7] = h;
        dst[8] = i; dst[9] = j; dst[10] = k; dst[11] = l;
        dst[12] = m; dst[13] = n; dst[14] = o; dst[15] = p;
        return dst;
    }
    function matIdentity(dst)
    {
        return matSet(dst, 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
    }
    function matMatrix3x2(dst, a, b, c, d, e, f)
    {
        return matSet(dst, a,c,0,e, b,d,0,f, 0,0,1,0, 0,0,0,1);
    }
    function matTranslate(dst, x, y, z)
    {
        return matSet(dst, 1,0,0,x||0, 0,1,0,y||0, 0,0,1,z||0, 0,0,0,1);
    }
    function matScale(dst, x, y, z)
    {
        if(z === undefined) z = 1;
        return matSet(dst, x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1);
    }
    function matRotate2D(dst, rad)
    {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        return matSet(dst, c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1);
    }
    function matSkew2D(dst, xrad, yrad)
    {
        var tx = Math.tan(xrad);
        var ty = Math.tan(yrad);
        return matSet(dst, 1,tx,0,0, ty,1,0,0, 0,0,1,0, 0,0,0,1);
    }

    function matNewIdentity()
    {
        return matIdentity(new Array(16));
    }
    function matNewMatrix3x2(a, b, c, d, e, f)
    {
        return matMatrix3x2(new Array(16), a,b,c,d,e,f);
    }
    function matNewTranslate(x, y, z)
    {
        return matTranslate(new Array(16), x, y, z);
    }
    function matNewScale(x, y, z)
    {
        return matScale(new Array(16), x, y, z);
    }
    function matNewRotate2D(rad)
    {
        return matRotate2D(new Array(16), rad);
    }
    function matNewSkew2D(xrad, yrad)
    {
        return matSkew2D(new Array(16), xrad, yrad);
    }

    function matMul(dst, l, r)
    {
        return matSet(
            dst,
            l[0]*r[0] + l[1]*r[4] + l[2]*r[8] + l[3]*r[12],
            l[0]*r[1] + l[1]*r[5] + l[2]*r[9] + l[3]*r[13],
            l[0]*r[2] + l[1]*r[6] + l[2]*r[10] + l[3]*r[14],
            l[0]*r[3] + l[1]*r[7] + l[2]*r[11] + l[3]*r[15],

            l[4]*r[0] + l[5]*r[4] + l[6]*r[8] + l[7]*r[12],
            l[4]*r[1] + l[5]*r[5] + l[6]*r[9] + l[7]*r[13],
            l[4]*r[2] + l[5]*r[6] + l[6]*r[10] + l[7]*r[14],
            l[4]*r[3] + l[5]*r[7] + l[6]*r[11] + l[7]*r[15],

            l[8]*r[0] + l[9]*r[4] + l[10]*r[8] + l[11]*r[12],
            l[8]*r[1] + l[9]*r[5] + l[10]*r[9] + l[11]*r[13],
            l[8]*r[2] + l[9]*r[6] + l[10]*r[10] + l[11]*r[14],
            l[8]*r[3] + l[9]*r[7] + l[10]*r[11] + l[11]*r[15],

            l[12]*r[0] + l[13]*r[4] + l[14]*r[8] + l[15]*r[12],
            l[12]*r[1] + l[13]*r[5] + l[14]*r[9] + l[15]*r[13],
            l[12]*r[2] + l[13]*r[6] + l[14]*r[10] + l[15]*r[14],
            l[12]*r[3] + l[13]*r[7] + l[14]*r[11] + l[15]*r[15]);
    }
    function matNewMul(l, r)
    {
        return matMul(new Array(16), l, r);
    }
    function matMulVec(dst, mat, v)
    {
        var v0 = v[0]||0;
        var v1 = v[1]||0;
        var v2 = v[2]||0;
        var v3 = v[3] !== undefined ? v[3] : 1;
        dst[0] = mat[0]*v0 + mat[1]*v1 + mat[2]*v2 + mat[3]*v3;
        dst[1] = mat[4]*v0 + mat[5]*v1 + mat[6]*v2 + mat[7]*v3;
        dst[2] = mat[8]*v0 + mat[9]*v1 + mat[10]*v2 + mat[11]*v3;
        dst[3] = mat[12]*v0 + mat[13]*v1 + mat[14]*v2 + mat[15]*v3;
        return dst;
    }
    function matNewMulVec(mat, v)
    {
        return matMulVec(new Array(4), mat, v);
    }
    function matDeterminant(mat)
    {
        return ( +mat[10]*mat[15] -mat[11]*mat[14]) * (mat[0]*mat[5] -mat[1]*mat[4]) +
            ( +mat[11]*mat[12] -mat[8]*mat[15]) * (mat[2]*mat[5] -mat[1]*mat[6]) +
            ( +mat[9]*mat[15] -mat[11]*mat[13]) * (mat[2]*mat[4] -mat[0]*mat[6]) +
            ( +mat[9]*mat[14] -mat[10]*mat[13]) * (mat[0]*mat[7] -mat[3]*mat[4]) +
            ( +mat[8]*mat[14] -mat[10]*mat[12]) * (mat[3]*mat[5] -mat[1]*mat[7]) +
            ( +mat[8]*mat[13] -mat[9]*mat[12]) * (mat[2]*mat[7] -mat[3]*mat[6]);
    }
    function matInverse(dst, mat)
    {
        var det = matDeterminant(mat);
        if(det > 0 || det < 0){
            var idet = 1/det;

            return matSet(
                dst,
                idet * (mat[5]*(mat[10]*mat[15] - mat[11]*mat[14]) + mat[6]*(mat[11]*mat[13] - mat[9]*mat[15]) + mat[7]*(mat[9]*mat[14] - mat[10]*mat[13])),
                idet * (mat[9]*(mat[2]*mat[15] - mat[3]*mat[14]) + mat[10]*(mat[3]*mat[13] - mat[1]*mat[15]) + mat[11]*(mat[1]*mat[14] - mat[2]*mat[13])),
                idet * (mat[13]*(mat[2]*mat[7] - mat[3]*mat[6]) + mat[14]*(mat[3]*mat[5] - mat[1]*mat[7]) + mat[15]*(mat[1]*mat[6] - mat[2]*mat[5])),
                idet * (mat[1]*(mat[7]*mat[10] - mat[6]*mat[11]) + mat[2]*(mat[5]*mat[11] - mat[7]*mat[9]) + mat[3]*(mat[6]*mat[9] - mat[5]*mat[10])),

                idet * (mat[6]*(mat[8]*mat[15] - mat[11]*mat[12]) + mat[7]*(mat[10]*mat[12] - mat[8]*mat[14]) + mat[4]*(mat[11]*mat[14] - mat[10]*mat[15])),
                idet * (mat[10]*(mat[0]*mat[15] - mat[3]*mat[12]) + mat[11]*(mat[2]*mat[12] - mat[0]*mat[14]) + mat[8]*(mat[3]*mat[14] - mat[2]*mat[15])),
                idet * (mat[14]*(mat[0]*mat[7] - mat[3]*mat[4]) + mat[15]*(mat[2]*mat[4] - mat[0]*mat[6]) + mat[12]*(mat[3]*mat[6] - mat[2]*mat[7])),
                idet * (mat[2]*(mat[7]*mat[8] - mat[4]*mat[11]) + mat[3]*(mat[4]*mat[10] - mat[6]*mat[8]) + mat[0]*(mat[6]*mat[11] - mat[7]*mat[10])),

                idet * (mat[7]*(mat[8]*mat[13] - mat[9]*mat[12]) + mat[4]*(mat[9]*mat[15] - mat[11]*mat[13]) + mat[5]*(mat[11]*mat[12] - mat[8]*mat[15])),
                idet * (mat[11]*(mat[0]*mat[13] - mat[1]*mat[12]) + mat[8]*(mat[1]*mat[15] - mat[3]*mat[13]) + mat[9]*(mat[3]*mat[12] - mat[0]*mat[15])),
                idet * (mat[15]*(mat[0]*mat[5] - mat[1]*mat[4]) + mat[12]*(mat[1]*mat[7] - mat[3]*mat[5]) + mat[13]*(mat[3]*mat[4] - mat[0]*mat[7])),
                idet * (mat[3]*(mat[5]*mat[8] - mat[4]*mat[9]) + mat[0]*(mat[7]*mat[9] - mat[5]*mat[11]) + mat[1]*(mat[4]*mat[11] - mat[7]*mat[8])),

                idet * (mat[4]*(mat[10]*mat[13] - mat[9]*mat[14]) + mat[5]*(mat[8]*mat[14] - mat[10]*mat[12]) + mat[6]*(mat[9]*mat[12] - mat[8]*mat[13])),
                idet * (mat[8]*(mat[2]*mat[13] - mat[1]*mat[14]) + mat[9]*(mat[0]*mat[14] - mat[2]*mat[12]) + mat[10]*(mat[1]*mat[12] - mat[0]*mat[13])),
                idet * (mat[12]*(mat[2]*mat[5] - mat[1]*mat[6]) + mat[13]*(mat[0]*mat[6] - mat[2]*mat[4]) + mat[14]*(mat[1]*mat[4] - mat[0]*mat[5])),
                idet * (mat[0]*(mat[5]*mat[10] - mat[6]*mat[9]) + mat[1]*(mat[6]*mat[8] - mat[4]*mat[10]) + mat[2]*(mat[4]*mat[9] - mat[5]*mat[8])) );
        }
        else{
            return null;
        }
    }
    function matNewInverse(mat)
    {
        return matInverse(new Array(16), mat);
    }

})(this);
