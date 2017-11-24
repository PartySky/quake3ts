let i: number = 2;
console.log(i);

// import * as main2 from "./main";

import { FunctionA } from "./models/index";

/*
 * main.js - Setup for Quake 3 WebGL demo
 */

/*
 * Copyright (c) 2011 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */

// The bits that need to change to load different maps are right here!
// ===========================================

var mapName = 'q3tourney2';

// If you're running from your own copy of Quake 3, you'll want to use these shaders
/*var mapShaders = [
    'scripts/base.shader', 'scripts/base_button.shader', 'scripts/base_floor.shader',
    'scripts/base_light.shader', 'scripts/base_object.shader', 'scripts/base_support.shader',
    'scripts/base_trim.shader', 'scripts/base_wall.shader', 'scripts/common.shader',
    'scripts/ctf.shader', 'scripts/eerie.shader', 'scripts/gfx.shader',
    'scripts/gothic_block.shader', 'scripts/gothic_floor.shader', 'scripts/gothic_light.shader',
    'scripts/gothic_trim.shader', 'scripts/gothic_wall.shader', 'scripts/hell.shader',
    'scripts/liquid.shader', 'scripts/menu.shader', 'scripts/models.shader',
    'scripts/organics.shader', 'scripts/sfx.shader', 'scripts/shrine.shader',
    'scripts/skin.shader', 'scripts/sky.shader', 'scripts/test.shader'
];*/

// For my demo, I compiled only the shaders the map used into a single file for performance reasons
var mapShaders = ['scripts/web_demo.shader'];

// ===========================================
// Everything below here is common to all maps
var leftViewMat, rightViewMat, projMat;
var leftViewport, rightViewport;
var activeShader;
var map, playerMover;
var mobileSite = false;

var zAngle = 3;
var xAngle = 0;
var cameraPosition = [0, 0, 0];
var onResize = null;

// VR Globals
var vrDisplay = null;

// These values are in meters
var playerHeight = 57; // Roughly where my eyes sit (1.78 meters off the ground)
var vrIPDScale = 32.0; // There are 32 units per meter in Quake 3
var vrFrameData = null;
var vrPose = null;

var vrDrawMode = 0;

var SKIP_FRAMES = 0;
var REPEAT_FRAMES = 1;

function isVRPresenting() {
    console.log();
    return (vrDisplay && vrDisplay.isPresenting);
}


/// gl-matrix-min ///

// import * as glMatrixMin from "./util/gl-matrix-min.2.3.2"
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.2
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

class FunctionB {
    x1: any;
    m: any;
}
function add(): FunctionB {
    // return x + y;
    return;
}
add().x1 = null;


declare let define;
declare let o;


!function (t, a) {
    if ("object" == typeof exports && "object" == typeof module)
        module.exports = a();
    else if ("function" == typeof define && define.amd)
        define(a);
    else {
        var n = a();
        for (var r in n)
            ("object" == typeof exports ? exports : t)[r] = n[r]
    }
}(this, function () {
    return function (t) {
        function a(r) {
            if (n[r])
                return n[r].exports;
            var o = n[r] = {
                exports: {},
                id: r,
                loaded: !1
            };
            return t[r].call(o.exports, o, o.exports, a),
                o.loaded = !0,
                o.exports
        }
        var n = {};
        return a.m = t,
            a.c = n,
            a.p = "",
            a(0)
    }([function (t, a, n) {
        a.glMatrix = n(1),
            a.mat2 = n(2),
            a.mat2d = n(3),
            a.mat3 = n(4),
            a.mat4 = n(5),
            a.quat = n(6),
            a.vec2 = n(9),
            a.vec3 = n(7),
            a.vec4 = n(8)
    }
        , function (t, a) {
            var n = {};
            n.EPSILON = 1e-6,
                n.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array,
                n.RANDOM = Math.random,
                n.ENABLE_SIMD = !1,
                n.SIMD_AVAILABLE = n.ARRAY_TYPE === Float32Array && "SIMD" in this,
                n.USE_SIMD = n.ENABLE_SIMD && n.SIMD_AVAILABLE,
                n.setMatrixArrayType = function (t) {
                    n.ARRAY_TYPE = t
                }
                ;
            var r = Math.PI / 180;
            n.toRadian = function (t) {
                return t * r
            }
                ,
                t.exports = n
        }
        , function (t, a, n) {
            var r = n(1)
                , o = {
                    create: null;
                    clone: null;
                    copy: null;
                    identity: null;
                    transpose: null;
                    invert: null;
                    adjoint: null;
                    determinant: null;
                    multiply: null;
                    mul: null;
                    rotate: null;
                    scale: null;
                    fromRotation: null;
                    fromScaling: null;
                    str: null;
                    frob: null;
                    LDU: null;
                };
            o.create = function () {
                var t = new r.ARRAY_TYPE(4);
                return t[0] = 1,
                    t[1] = 0,
                    t[2] = 0,
                    t[3] = 1,
                    t
            }
                ,
                o.clone = function (t) {
                    var a = new r.ARRAY_TYPE(4);
                    return a[0] = t[0],
                        a[1] = t[1],
                        a[2] = t[2],
                        a[3] = t[3],
                        a
                }
                ,
                o.copy = function (t, a) {
                    return t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t[3] = a[3],
                        t
                }
                ,
                o.identity = function (t) {
                    return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 1,
                        t
                }
                ,
                o.transpose = function (t, a) {
                    if (t === a) {
                        var n = a[1];
                        t[1] = a[2],
                            t[2] = n
                    } else
                        t[0] = a[0],
                            t[1] = a[2],
                            t[2] = a[1],
                            t[3] = a[3];
                    return t
                }
                ,
                o.invert = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = n * l - o * r;
                    return u ? (u = 1 / u,
                        t[0] = l * u,
                        t[1] = -r * u,
                        t[2] = -o * u,
                        t[3] = n * u,
                        t) : null
                }
                ,
                o.adjoint = function (t, a) {
                    var n = a[0];
                    return t[0] = a[3],
                        t[1] = -a[1],
                        t[2] = -a[2],
                        t[3] = n,
                        t
                }
                ,
                o.determinant = function (t) {
                    return t[0] * t[3] - t[2] * t[1]
                }
                ,
                o.multiply = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = n[0]
                        , M = n[1]
                        , i = n[2]
                        , s = n[3];
                    return t[0] = r * e + l * M,
                        t[1] = o * e + u * M,
                        t[2] = r * i + l * s,
                        t[3] = o * i + u * s,
                        t
                }
                ,
                o.mul = o.multiply,
                o.rotate = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = Math.sin(n)
                        , M = Math.cos(n);
                    return t[0] = r * M + l * e,
                        t[1] = o * M + u * e,
                        t[2] = r * -e + l * M,
                        t[3] = o * -e + u * M,
                        t
                }
                ,
                o.scale = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = n[0]
                        , M = n[1];
                    return t[0] = r * e,
                        t[1] = o * e,
                        t[2] = l * M,
                        t[3] = u * M,
                        t
                }
                ,
                o.fromRotation = function (t, a) {
                    var n = Math.sin(a)
                        , r = Math.cos(a);
                    return t[0] = r,
                        t[1] = n,
                        t[2] = -n,
                        t[3] = r,
                        t
                }
                ,
                o.fromScaling = function (t, a) {
                    return t[0] = a[0],
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = a[1],
                        t
                }
                ,
                o.str = function (t) {
                    return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
                }
                ,
                o.frob = function (t) {
                    return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2))
                }
                ,
                o.LDU = function (t, a, n, r) {
                    return t[2] = r[2] / r[0],
                        n[0] = r[0],
                        n[1] = r[1],
                        n[3] = r[3] - t[2] * n[1],
                        [t, a, n]
                }
                ,
                t.exports = o
        }
        , function (t, a, n) {
            var r = n(1)
                , o = {
                    create: null;
                    clone: null;
                    copy: null;
                    identity: null;
                    transpose: null;
                    invert: null;
                    adjoint: null;
                    determinant: null;
                    multiply: null;
                    mul: null;
                    rotate: null;
                    scale: null;
                    fromRotation: null;
                    fromScaling: null;
                    str: null;
                    frob: null;
                    LDU: null;
                    translate: null;
                    fromTranslation: null;
                };
            o.create = function () {
                var t = new r.ARRAY_TYPE(6);
                return t[0] = 1,
                    t[1] = 0,
                    t[2] = 0,
                    t[3] = 1,
                    t[4] = 0,
                    t[5] = 0,
                    t
            }
                ,
                o.clone = function (t) {
                    var a = new r.ARRAY_TYPE(6);
                    return a[0] = t[0],
                        a[1] = t[1],
                        a[2] = t[2],
                        a[3] = t[3],
                        a[4] = t[4],
                        a[5] = t[5],
                        a
                }
                ,
                o.copy = function (t, a) {
                    return t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t[3] = a[3],
                        t[4] = a[4],
                        t[5] = a[5],
                        t
                }
                ,
                o.identity = function (t) {
                    return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 1,
                        t[4] = 0,
                        t[5] = 0,
                        t
                }
                ,
                o.invert = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = a[4]
                        , e = a[5]
                        , M = n * l - r * o;
                    return M ? (M = 1 / M,
                        t[0] = l * M,
                        t[1] = -r * M,
                        t[2] = -o * M,
                        t[3] = n * M,
                        t[4] = (o * e - l * u) * M,
                        t[5] = (r * u - n * e) * M,
                        t) : null
                }
                ,
                o.determinant = function (t) {
                    return t[0] * t[3] - t[1] * t[2]
                }
                ,
                o.multiply = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = a[4]
                        , M = a[5]
                        , i = n[0]
                        , s = n[1]
                        , c = n[2]
                        , D = n[3]
                        , S = n[4]
                        , I = n[5];
                    return t[0] = r * i + l * s,
                        t[1] = o * i + u * s,
                        t[2] = r * c + l * D,
                        t[3] = o * c + u * D,
                        t[4] = r * S + l * I + e,
                        t[5] = o * S + u * I + M,
                        t
                }
                ,
                o.mul = o.multiply,
                o.rotate = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = a[4]
                        , M = a[5]
                        , i = Math.sin(n)
                        , s = Math.cos(n);
                    return t[0] = r * s + l * i,
                        t[1] = o * s + u * i,
                        t[2] = r * -i + l * s,
                        t[3] = o * -i + u * s,
                        t[4] = e,
                        t[5] = M,
                        t
                }
                ,
                o.scale = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = a[4]
                        , M = a[5]
                        , i = n[0]
                        , s = n[1];
                    return t[0] = r * i,
                        t[1] = o * i,
                        t[2] = l * s,
                        t[3] = u * s,
                        t[4] = e,
                        t[5] = M,
                        t
                }
                ,
                o.translate = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = a[4]
                        , M = a[5]
                        , i = n[0]
                        , s = n[1];
                    return t[0] = r,
                        t[1] = o,
                        t[2] = l,
                        t[3] = u,
                        t[4] = r * i + l * s + e,
                        t[5] = o * i + u * s + M,
                        t
                }
                ,
                o.fromRotation = function (t, a) {
                    var n = Math.sin(a)
                        , r = Math.cos(a);
                    return t[0] = r,
                        t[1] = n,
                        t[2] = -n,
                        t[3] = r,
                        t[4] = 0,
                        t[5] = 0,
                        t
                }
                ,
                o.fromScaling = function (t, a) {
                    return t[0] = a[0],
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = a[1],
                        t[4] = 0,
                        t[5] = 0,
                        t
                }
                ,
                o.fromTranslation = function (t, a) {
                    return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 1,
                        t[4] = a[0],
                        t[5] = a[1],
                        t
                }
                ,
                o.str = function (t) {
                    return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")"
                }
                ,
                o.frob = function (t) {
                    return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1)
                }
                ,
                t.exports = o
        }
        , function (t, a, n) {
            var r = n(1)
                , o = {
                    create: null;
                    clone: null;
                    copy: null;
                    identity: null;
                    transpose: null;
                    invert: null;
                    adjoint: null;
                    determinant: null;
                    multiply: null;
                    mul: null;
                    rotate: null;
                    scale: null;
                    fromRotation: null;
                    fromScaling: null;
                    str: null;
                    frob: null;
                    LDU: null;
                    translate: null;
                    fromTranslation: null;
                    fromMat4: null;
                    fromMat2d: null;
                    fromQuat: null;
                    normalFromMat4: null;
                };
            o.create = function () {
                var t = new r.ARRAY_TYPE(9);
                return t[0] = 1,
                    t[1] = 0,
                    t[2] = 0,
                    t[3] = 0,
                    t[4] = 1,
                    t[5] = 0,
                    t[6] = 0,
                    t[7] = 0,
                    t[8] = 1,
                    t
            }
                ,
                o.fromMat4 = function (t, a) {
                    return t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t[3] = a[4],
                        t[4] = a[5],
                        t[5] = a[6],
                        t[6] = a[8],
                        t[7] = a[9],
                        t[8] = a[10],
                        t
                }
                ,
                o.clone = function (t) {
                    var a = new r.ARRAY_TYPE(9);
                    return a[0] = t[0],
                        a[1] = t[1],
                        a[2] = t[2],
                        a[3] = t[3],
                        a[4] = t[4],
                        a[5] = t[5],
                        a[6] = t[6],
                        a[7] = t[7],
                        a[8] = t[8],
                        a
                }
                ,
                o.copy = function (t, a) {
                    return t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t[3] = a[3],
                        t[4] = a[4],
                        t[5] = a[5],
                        t[6] = a[6],
                        t[7] = a[7],
                        t[8] = a[8],
                        t
                }
                ,
                o.identity = function (t) {
                    return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 1,
                        t[5] = 0,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 1,
                        t
                }
                ,
                o.transpose = function (t, a) {
                    if (t === a) {
                        var n = a[1]
                            , r = a[2]
                            , o = a[5];
                        t[1] = a[3],
                            t[2] = a[6],
                            t[3] = n,
                            t[5] = a[7],
                            t[6] = r,
                            t[7] = o
                    } else
                        t[0] = a[0],
                            t[1] = a[3],
                            t[2] = a[6],
                            t[3] = a[1],
                            t[4] = a[4],
                            t[5] = a[7],
                            t[6] = a[2],
                            t[7] = a[5],
                            t[8] = a[8];
                    return t
                }
                ,
                o.invert = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = a[4]
                        , e = a[5]
                        , M = a[6]
                        , i = a[7]
                        , s = a[8]
                        , c = s * u - e * i
                        , D = -s * l + e * M
                        , S = i * l - u * M
                        , I = n * c + r * D + o * S;
                    return I ? (I = 1 / I,
                        t[0] = c * I,
                        t[1] = (-s * r + o * i) * I,
                        t[2] = (e * r - o * u) * I,
                        t[3] = D * I,
                        t[4] = (s * n - o * M) * I,
                        t[5] = (-e * n + o * l) * I,
                        t[6] = S * I,
                        t[7] = (-i * n + r * M) * I,
                        t[8] = (u * n - r * l) * I,
                        t) : null
                }
                ,
                o.adjoint = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = a[4]
                        , e = a[5]
                        , M = a[6]
                        , i = a[7]
                        , s = a[8];
                    return t[0] = u * s - e * i,
                        t[1] = o * i - r * s,
                        t[2] = r * e - o * u,
                        t[3] = e * M - l * s,
                        t[4] = n * s - o * M,
                        t[5] = o * l - n * e,
                        t[6] = l * i - u * M,
                        t[7] = r * M - n * i,
                        t[8] = n * u - r * l,
                        t
                }
                ,
                o.determinant = function (t) {
                    var a = t[0]
                        , n = t[1]
                        , r = t[2]
                        , o = t[3]
                        , l = t[4]
                        , u = t[5]
                        , e = t[6]
                        , M = t[7]
                        , i = t[8];
                    return a * (i * l - u * M) + n * (-i * o + u * e) + r * (M * o - l * e)
                }
                ,
                o.multiply = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = a[4]
                        , M = a[5]
                        , i = a[6]
                        , s = a[7]
                        , c = a[8]
                        , D = n[0]
                        , S = n[1]
                        , I = n[2]
                        , x = n[3]
                        , f = n[4]
                        , F = n[5]
                        , m = n[6]
                        , h = n[7]
                        , d = n[8];
                    return t[0] = D * r + S * u + I * i,
                        t[1] = D * o + S * e + I * s,
                        t[2] = D * l + S * M + I * c,
                        t[3] = x * r + f * u + F * i,
                        t[4] = x * o + f * e + F * s,
                        t[5] = x * l + f * M + F * c,
                        t[6] = m * r + h * u + d * i,
                        t[7] = m * o + h * e + d * s,
                        t[8] = m * l + h * M + d * c,
                        t
                }
                ,
                o.mul = o.multiply,
                o.translate = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = a[4]
                        , M = a[5]
                        , i = a[6]
                        , s = a[7]
                        , c = a[8]
                        , D = n[0]
                        , S = n[1];
                    return t[0] = r,
                        t[1] = o,
                        t[2] = l,
                        t[3] = u,
                        t[4] = e,
                        t[5] = M,
                        t[6] = D * r + S * u + i,
                        t[7] = D * o + S * e + s,
                        t[8] = D * l + S * M + c,
                        t
                }
                ,
                o.rotate = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = a[4]
                        , M = a[5]
                        , i = a[6]
                        , s = a[7]
                        , c = a[8]
                        , D = Math.sin(n)
                        , S = Math.cos(n);
                    return t[0] = S * r + D * u,
                        t[1] = S * o + D * e,
                        t[2] = S * l + D * M,
                        t[3] = S * u - D * r,
                        t[4] = S * e - D * o,
                        t[5] = S * M - D * l,
                        t[6] = i,
                        t[7] = s,
                        t[8] = c,
                        t
                }
                ,
                o.scale = function (t, a, n) {
                    var r = n[0]
                        , o = n[1];
                    return t[0] = r * a[0],
                        t[1] = r * a[1],
                        t[2] = r * a[2],
                        t[3] = o * a[3],
                        t[4] = o * a[4],
                        t[5] = o * a[5],
                        t[6] = a[6],
                        t[7] = a[7],
                        t[8] = a[8],
                        t
                }
                ,
                o.fromTranslation = function (t, a) {
                    return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 1,
                        t[5] = 0,
                        t[6] = a[0],
                        t[7] = a[1],
                        t[8] = 1,
                        t
                }
                ,
                o.fromRotation = function (t, a) {
                    var n = Math.sin(a)
                        , r = Math.cos(a);
                    return t[0] = r,
                        t[1] = n,
                        t[2] = 0,
                        t[3] = -n,
                        t[4] = r,
                        t[5] = 0,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 1,
                        t
                }
                ,
                o.fromScaling = function (t, a) {
                    return t[0] = a[0],
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = a[1],
                        t[5] = 0,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 1,
                        t
                }
                ,
                o.fromMat2d = function (t, a) {
                    return t[0] = a[0],
                        t[1] = a[1],
                        t[2] = 0,
                        t[3] = a[2],
                        t[4] = a[3],
                        t[5] = 0,
                        t[6] = a[4],
                        t[7] = a[5],
                        t[8] = 1,
                        t
                }
                ,
                o.fromQuat = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = n + n
                        , e = r + r
                        , M = o + o
                        , i = n * u
                        , s = r * u
                        , c = r * e
                        , D = o * u
                        , S = o * e
                        , I = o * M
                        , x = l * u
                        , f = l * e
                        , F = l * M;
                    return t[0] = 1 - c - I,
                        t[3] = s - F,
                        t[6] = D + f,
                        t[1] = s + F,
                        t[4] = 1 - i - I,
                        t[7] = S - x,
                        t[2] = D - f,
                        t[5] = S + x,
                        t[8] = 1 - i - c,
                        t
                }
                ,
                o.normalFromMat4 = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = a[4]
                        , e = a[5]
                        , M = a[6]
                        , i = a[7]
                        , s = a[8]
                        , c = a[9]
                        , D = a[10]
                        , S = a[11]
                        , I = a[12]
                        , x = a[13]
                        , f = a[14]
                        , F = a[15]
                        , m = n * e - r * u
                        , h = n * M - o * u
                        , d = n * i - l * u
                        , v = r * M - o * e
                        , z = r * i - l * e
                        , p = o * i - l * M
                        , w = s * x - c * I
                        , A = s * f - D * I
                        , R = s * F - S * I
                        , b = c * f - D * x
                        , Y = c * F - S * x
                        , q = D * F - S * f
                        , y = m * q - h * Y + d * b + v * R - z * A + p * w;
                    return y ? (y = 1 / y,
                        t[0] = (e * q - M * Y + i * b) * y,
                        t[1] = (M * R - u * q - i * A) * y,
                        t[2] = (u * Y - e * R + i * w) * y,
                        t[3] = (o * Y - r * q - l * b) * y,
                        t[4] = (n * q - o * R + l * A) * y,
                        t[5] = (r * R - n * Y - l * w) * y,
                        t[6] = (x * p - f * z + F * v) * y,
                        t[7] = (f * d - I * p - F * h) * y,
                        t[8] = (I * z - x * d + F * m) * y,
                        t) : null
                }
                ,
                o.str = function (t) {
                    return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")"
                }
                ,
                o.frob = function (t) {
                    return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2))
                }
                ,
                t.exports = o
        }
        , function (t, a, n) {
            var r = n(1)
                , o = {
                    scalar: {
                        transpose: null;
                        adjoint: null;
                        invert: null;
                    },
                    SIMD: {
                        transpose: null;
                        invert: null;
                        adjoint: null;
                        multiply: null;
                    },

                    create: null;
                    clone: null;
                    copy: null;
                    identity: null;
                    transpose: null;
                    invert: null;
                    adjoint: null;
                    determinant: null;
                    multiply: null;
                    mul: null;
                    rotate: null;
                    scale: null;
                    fromRotation: null;
                    fromScaling: null;
                    str: null;
                    frob: null;
                    LDU: null;
                    translate: null;
                    fromTranslation: null;
                    fromMat4: null;
                    fromMat2d: null;
                    fromQuat: null;
                    normalFromMat4: null;
                };
            o.create = function () {
                var t = new r.ARRAY_TYPE(16);
                return t[0] = 1,
                    t[1] = 0,
                    t[2] = 0,
                    t[3] = 0,
                    t[4] = 0,
                    t[5] = 1,
                    t[6] = 0,
                    t[7] = 0,
                    t[8] = 0,
                    t[9] = 0,
                    t[10] = 1,
                    t[11] = 0,
                    t[12] = 0,
                    t[13] = 0,
                    t[14] = 0,
                    t[15] = 1,
                    t
            }
                ,
                o.clone = function (t) {
                    var a = new r.ARRAY_TYPE(16);
                    return a[0] = t[0],
                        a[1] = t[1],
                        a[2] = t[2],
                        a[3] = t[3],
                        a[4] = t[4],
                        a[5] = t[5],
                        a[6] = t[6],
                        a[7] = t[7],
                        a[8] = t[8],
                        a[9] = t[9],
                        a[10] = t[10],
                        a[11] = t[11],
                        a[12] = t[12],
                        a[13] = t[13],
                        a[14] = t[14],
                        a[15] = t[15],
                        a
                }
                ,
                o.copy = function (t, a) {
                    return t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t[3] = a[3],
                        t[4] = a[4],
                        t[5] = a[5],
                        t[6] = a[6],
                        t[7] = a[7],
                        t[8] = a[8],
                        t[9] = a[9],
                        t[10] = a[10],
                        t[11] = a[11],
                        t[12] = a[12],
                        t[13] = a[13],
                        t[14] = a[14],
                        t[15] = a[15],
                        t
                }
                ,
                o.identity = function (t) {
                    return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = 1,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 0,
                        t[9] = 0,
                        t[10] = 1,
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t
                }
                ,
                o.scalar.transpose = function (t, a) {
                    if (t === a) {
                        var n = a[1]
                            , r = a[2]
                            , o = a[3]
                            , l = a[6]
                            , u = a[7]
                            , e = a[11];
                        t[1] = a[4],
                            t[2] = a[8],
                            t[3] = a[12],
                            t[4] = n,
                            t[6] = a[9],
                            t[7] = a[13],
                            t[8] = r,
                            t[9] = l,
                            t[11] = a[14],
                            t[12] = o,
                            t[13] = u,
                            t[14] = e
                    } else
                        t[0] = a[0],
                            t[1] = a[4],
                            t[2] = a[8],
                            t[3] = a[12],
                            t[4] = a[1],
                            t[5] = a[5],
                            t[6] = a[9],
                            t[7] = a[13],
                            t[8] = a[2],
                            t[9] = a[6],
                            t[10] = a[10],
                            t[11] = a[14],
                            t[12] = a[3],
                            t[13] = a[7],
                            t[14] = a[11],
                            t[15] = a[15];
                    return t
                }
                ,
                o.SIMD.transpose = function (t, a) {
                    var n, r, o, l, u, e, M, i, s, c;
                    return n = SIMD.Float32x4.load(a, 0),
                        r = SIMD.Float32x4.load(a, 4),
                        o = SIMD.Float32x4.load(a, 8),
                        l = SIMD.Float32x4.load(a, 12),
                        u = SIMD.Float32x4.shuffle(n, r, 0, 1, 4, 5),
                        e = SIMD.Float32x4.shuffle(o, l, 0, 1, 4, 5),
                        M = SIMD.Float32x4.shuffle(u, e, 0, 2, 4, 6),
                        i = SIMD.Float32x4.shuffle(u, e, 1, 3, 5, 7),
                        SIMD.Float32x4.store(t, 0, M),
                        SIMD.Float32x4.store(t, 4, i),
                        u = SIMD.Float32x4.shuffle(n, r, 2, 3, 6, 7),
                        e = SIMD.Float32x4.shuffle(o, l, 2, 3, 6, 7),
                        s = SIMD.Float32x4.shuffle(u, e, 0, 2, 4, 6),
                        c = SIMD.Float32x4.shuffle(u, e, 1, 3, 5, 7),
                        SIMD.Float32x4.store(t, 8, s),
                        SIMD.Float32x4.store(t, 12, c),
                        t
                }
                ,
                o.transpose = r.USE_SIMD ? o.SIMD.transpose : o.scalar.transpose,
                o.scalar.invert = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = a[4]
                        , e = a[5]
                        , M = a[6]
                        , i = a[7]
                        , s = a[8]
                        , c = a[9]
                        , D = a[10]
                        , S = a[11]
                        , I = a[12]
                        , x = a[13]
                        , f = a[14]
                        , F = a[15]
                        , m = n * e - r * u
                        , h = n * M - o * u
                        , d = n * i - l * u
                        , v = r * M - o * e
                        , z = r * i - l * e
                        , p = o * i - l * M
                        , w = s * x - c * I
                        , A = s * f - D * I
                        , R = s * F - S * I
                        , b = c * f - D * x
                        , Y = c * F - S * x
                        , q = D * F - S * f
                        , y = m * q - h * Y + d * b + v * R - z * A + p * w;
                    return y ? (y = 1 / y,
                        t[0] = (e * q - M * Y + i * b) * y,
                        t[1] = (o * Y - r * q - l * b) * y,
                        t[2] = (x * p - f * z + F * v) * y,
                        t[3] = (D * z - c * p - S * v) * y,
                        t[4] = (M * R - u * q - i * A) * y,
                        t[5] = (n * q - o * R + l * A) * y,
                        t[6] = (f * d - I * p - F * h) * y,
                        t[7] = (s * p - D * d + S * h) * y,
                        t[8] = (u * Y - e * R + i * w) * y,
                        t[9] = (r * R - n * Y - l * w) * y,
                        t[10] = (I * z - x * d + F * m) * y,
                        t[11] = (c * d - s * z - S * m) * y,
                        t[12] = (e * A - u * b - M * w) * y,
                        t[13] = (n * b - r * A + o * w) * y,
                        t[14] = (x * h - I * v - f * m) * y,
                        t[15] = (s * v - c * h + D * m) * y,
                        t) : null
                }
                ,
                o.SIMD.invert = function (t, a) {
                    var n, r, o, l, u, e, M, i, s, c, D = SIMD.Float32x4.load(a, 0), S = SIMD.Float32x4.load(a, 4), I = SIMD.Float32x4.load(a, 8), x = SIMD.Float32x4.load(a, 12);
                    return u = SIMD.Float32x4.shuffle(D, S, 0, 1, 4, 5),
                        r = SIMD.Float32x4.shuffle(I, x, 0, 1, 4, 5),
                        n = SIMD.Float32x4.shuffle(u, r, 0, 2, 4, 6),
                        r = SIMD.Float32x4.shuffle(r, u, 1, 3, 5, 7),
                        u = SIMD.Float32x4.shuffle(D, S, 2, 3, 6, 7),
                        l = SIMD.Float32x4.shuffle(I, x, 2, 3, 6, 7),
                        o = SIMD.Float32x4.shuffle(u, l, 0, 2, 4, 6),
                        l = SIMD.Float32x4.shuffle(l, u, 1, 3, 5, 7),
                        u = SIMD.Float32x4.mul(o, l),
                        u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2),
                        e = SIMD.Float32x4.mul(r, u),
                        M = SIMD.Float32x4.mul(n, u),
                        u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1),
                        e = SIMD.Float32x4.sub(SIMD.Float32x4.mul(r, u), e),
                        M = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, u), M),
                        M = SIMD.Float32x4.swizzle(M, 2, 3, 0, 1),
                        u = SIMD.Float32x4.mul(r, o),
                        u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2),
                        e = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, u), e),
                        s = SIMD.Float32x4.mul(n, u),
                        u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1),
                        e = SIMD.Float32x4.sub(e, SIMD.Float32x4.mul(l, u)),
                        s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, u), s),
                        s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1),
                        u = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), l),
                        u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2),
                        o = SIMD.Float32x4.swizzle(o, 2, 3, 0, 1),
                        e = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, u), e),
                        i = SIMD.Float32x4.mul(n, u),
                        u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1),
                        e = SIMD.Float32x4.sub(e, SIMD.Float32x4.mul(o, u)),
                        i = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, u), i),
                        i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1),
                        u = SIMD.Float32x4.mul(n, r),
                        u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2),
                        i = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, u), i),
                        s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(o, u), s),
                        u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1),
                        i = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, u), i),
                        s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(o, u)),
                        u = SIMD.Float32x4.mul(n, l),
                        u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2),
                        M = SIMD.Float32x4.sub(M, SIMD.Float32x4.mul(o, u)),
                        i = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, u), i),
                        u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1),
                        M = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, u), M),
                        i = SIMD.Float32x4.sub(i, SIMD.Float32x4.mul(r, u)),
                        u = SIMD.Float32x4.mul(n, o),
                        u = SIMD.Float32x4.swizzle(u, 1, 0, 3, 2),
                        M = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, u), M),
                        s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(r, u)),
                        u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1),
                        M = SIMD.Float32x4.sub(M, SIMD.Float32x4.mul(l, u)),
                        s = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, u), s),
                        c = SIMD.Float32x4.mul(n, e),
                        c = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(c, 2, 3, 0, 1), c),
                        c = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(c, 1, 0, 3, 2), c),
                        u = SIMD.Float32x4.reciprocalApproximation(c),
                        c = SIMD.Float32x4.sub(SIMD.Float32x4.add(u, u), SIMD.Float32x4.mul(c, SIMD.Float32x4.mul(u, u))),
                        (c = SIMD.Float32x4.swizzle(c, 0, 0, 0, 0)) ? (SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(c, e)),
                            SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(c, M)),
                            SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(c, i)),
                            SIMD.Float32x4.store(t, 12, SIMD.Float32x4.mul(c, s)),
                            t) : null
                }
                ,
                o.invert = r.USE_SIMD ? o.SIMD.invert : o.scalar.invert,
                o.scalar.adjoint = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = a[4]
                        , e = a[5]
                        , M = a[6]
                        , i = a[7]
                        , s = a[8]
                        , c = a[9]
                        , D = a[10]
                        , S = a[11]
                        , I = a[12]
                        , x = a[13]
                        , f = a[14]
                        , F = a[15];
                    return t[0] = e * (D * F - S * f) - c * (M * F - i * f) + x * (M * S - i * D),
                        t[1] = -(r * (D * F - S * f) - c * (o * F - l * f) + x * (o * S - l * D)),
                        t[2] = r * (M * F - i * f) - e * (o * F - l * f) + x * (o * i - l * M),
                        t[3] = -(r * (M * S - i * D) - e * (o * S - l * D) + c * (o * i - l * M)),
                        t[4] = -(u * (D * F - S * f) - s * (M * F - i * f) + I * (M * S - i * D)),
                        t[5] = n * (D * F - S * f) - s * (o * F - l * f) + I * (o * S - l * D),
                        t[6] = -(n * (M * F - i * f) - u * (o * F - l * f) + I * (o * i - l * M)),
                        t[7] = n * (M * S - i * D) - u * (o * S - l * D) + s * (o * i - l * M),
                        t[8] = u * (c * F - S * x) - s * (e * F - i * x) + I * (e * S - i * c),
                        t[9] = -(n * (c * F - S * x) - s * (r * F - l * x) + I * (r * S - l * c)),
                        t[10] = n * (e * F - i * x) - u * (r * F - l * x) + I * (r * i - l * e),
                        t[11] = -(n * (e * S - i * c) - u * (r * S - l * c) + s * (r * i - l * e)),
                        t[12] = -(u * (c * f - D * x) - s * (e * f - M * x) + I * (e * D - M * c)),
                        t[13] = n * (c * f - D * x) - s * (r * f - o * x) + I * (r * D - o * c),
                        t[14] = -(n * (e * f - M * x) - u * (r * f - o * x) + I * (r * M - o * e)),
                        t[15] = n * (e * D - M * c) - u * (r * D - o * c) + s * (r * M - o * e),
                        t
                }
                ,
                o.SIMD.adjoint = function (t, a) {
                    var n, r, o, l, u, e, M, i, s, c, D, S, I, n = SIMD.Float32x4.load(a, 0), r = SIMD.Float32x4.load(a, 4), o = SIMD.Float32x4.load(a, 8), l = SIMD.Float32x4.load(a, 12);
                    return s = SIMD.Float32x4.shuffle(n, r, 0, 1, 4, 5),
                        e = SIMD.Float32x4.shuffle(o, l, 0, 1, 4, 5),
                        u = SIMD.Float32x4.shuffle(s, e, 0, 2, 4, 6),
                        e = SIMD.Float32x4.shuffle(e, s, 1, 3, 5, 7),
                        s = SIMD.Float32x4.shuffle(n, r, 2, 3, 6, 7),
                        i = SIMD.Float32x4.shuffle(o, l, 2, 3, 6, 7),
                        M = SIMD.Float32x4.shuffle(s, i, 0, 2, 4, 6),
                        i = SIMD.Float32x4.shuffle(i, s, 1, 3, 5, 7),
                        s = SIMD.Float32x4.mul(M, i),
                        s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2),
                        c = SIMD.Float32x4.mul(e, s),
                        D = SIMD.Float32x4.mul(u, s),
                        s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1),
                        c = SIMD.Float32x4.sub(SIMD.Float32x4.mul(e, s), c),
                        D = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, s), D),
                        D = SIMD.Float32x4.swizzle(D, 2, 3, 0, 1),
                        s = SIMD.Float32x4.mul(e, M),
                        s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2),
                        c = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, s), c),
                        I = SIMD.Float32x4.mul(u, s),
                        s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1),
                        c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(i, s)),
                        I = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, s), I),
                        I = SIMD.Float32x4.swizzle(I, 2, 3, 0, 1),
                        s = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 2, 3, 0, 1), i),
                        s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2),
                        M = SIMD.Float32x4.swizzle(M, 2, 3, 0, 1),
                        c = SIMD.Float32x4.add(SIMD.Float32x4.mul(M, s), c),
                        S = SIMD.Float32x4.mul(u, s),
                        s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1),
                        c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(M, s)),
                        S = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, s), S),
                        S = SIMD.Float32x4.swizzle(S, 2, 3, 0, 1),
                        s = SIMD.Float32x4.mul(u, e),
                        s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2),
                        S = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, s), S),
                        I = SIMD.Float32x4.sub(SIMD.Float32x4.mul(M, s), I),
                        s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1),
                        S = SIMD.Float32x4.sub(SIMD.Float32x4.mul(i, s), S),
                        I = SIMD.Float32x4.sub(I, SIMD.Float32x4.mul(M, s)),
                        s = SIMD.Float32x4.mul(u, i),
                        s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2),
                        D = SIMD.Float32x4.sub(D, SIMD.Float32x4.mul(M, s)),
                        S = SIMD.Float32x4.add(SIMD.Float32x4.mul(e, s), S),
                        s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1),
                        D = SIMD.Float32x4.add(SIMD.Float32x4.mul(M, s), D),
                        S = SIMD.Float32x4.sub(S, SIMD.Float32x4.mul(e, s)),
                        s = SIMD.Float32x4.mul(u, M),
                        s = SIMD.Float32x4.swizzle(s, 1, 0, 3, 2),
                        D = SIMD.Float32x4.add(SIMD.Float32x4.mul(i, s), D),
                        I = SIMD.Float32x4.sub(I, SIMD.Float32x4.mul(e, s)),
                        s = SIMD.Float32x4.swizzle(s, 2, 3, 0, 1),
                        D = SIMD.Float32x4.sub(D, SIMD.Float32x4.mul(i, s)),
                        I = SIMD.Float32x4.add(SIMD.Float32x4.mul(e, s), I),
                        SIMD.Float32x4.store(t, 0, c),
                        SIMD.Float32x4.store(t, 4, D),
                        SIMD.Float32x4.store(t, 8, S),
                        SIMD.Float32x4.store(t, 12, I),
                        t
                }
                ,
                o.adjoint = r.USE_SIMD ? o.SIMD.adjoint : o.scalar.adjoint,
                o.determinant = function (t) {
                    var a = t[0]
                        , n = t[1]
                        , r = t[2]
                        , o = t[3]
                        , l = t[4]
                        , u = t[5]
                        , e = t[6]
                        , M = t[7]
                        , i = t[8]
                        , s = t[9]
                        , c = t[10]
                        , D = t[11]
                        , S = t[12]
                        , I = t[13]
                        , x = t[14]
                        , f = t[15]
                        , F = a * u - n * l
                        , m = a * e - r * l
                        , h = a * M - o * l
                        , d = n * e - r * u
                        , v = n * M - o * u
                        , z = r * M - o * e
                        , p = i * I - s * S
                        , w = i * x - c * S
                        , A = i * f - D * S
                        , R = s * x - c * I
                        , b = s * f - D * I
                        , Y = c * f - D * x;
                    return F * Y - m * b + h * R + d * A - v * w + z * p
                }
                ,
                o.SIMD.multiply = function (t, a, n) {
                    var r = SIMD.Float32x4.load(a, 0)
                        , o = SIMD.Float32x4.load(a, 4)
                        , l = SIMD.Float32x4.load(a, 8)
                        , u = SIMD.Float32x4.load(a, 12)
                        , e = SIMD.Float32x4.load(n, 0)
                        , M = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 2, 2, 2, 2), l), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 3, 3, 3, 3), u))));
                    SIMD.Float32x4.store(t, 0, M);
                    var i = SIMD.Float32x4.load(n, 4)
                        , s = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(i, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(i, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(i, 2, 2, 2, 2), l), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(i, 3, 3, 3, 3), u))));
                    SIMD.Float32x4.store(t, 4, s);
                    var c = SIMD.Float32x4.load(n, 8)
                        , D = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 2, 2, 2, 2), l), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(c, 3, 3, 3, 3), u))));
                    SIMD.Float32x4.store(t, 8, D);
                    var S = SIMD.Float32x4.load(n, 12)
                        , I = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(S, 0, 0, 0, 0), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(S, 1, 1, 1, 1), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(S, 2, 2, 2, 2), l), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(S, 3, 3, 3, 3), u))));
                    return SIMD.Float32x4.store(t, 12, I),
                        t
                }
                ,
                o.scalar.multiply = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = a[4]
                        , M = a[5]
                        , i = a[6]
                        , s = a[7]
                        , c = a[8]
                        , D = a[9]
                        , S = a[10]
                        , I = a[11]
                        , x = a[12]
                        , f = a[13]
                        , F = a[14]
                        , m = a[15]
                        , h = n[0]
                        , d = n[1]
                        , v = n[2]
                        , z = n[3];
                    return t[0] = h * r + d * e + v * c + z * x,
                        t[1] = h * o + d * M + v * D + z * f,
                        t[2] = h * l + d * i + v * S + z * F,
                        t[3] = h * u + d * s + v * I + z * m,
                        h = n[4],
                        d = n[5],
                        v = n[6],
                        z = n[7],
                        t[4] = h * r + d * e + v * c + z * x,
                        t[5] = h * o + d * M + v * D + z * f,
                        t[6] = h * l + d * i + v * S + z * F,
                        t[7] = h * u + d * s + v * I + z * m,
                        h = n[8],
                        d = n[9],
                        v = n[10],
                        z = n[11],
                        t[8] = h * r + d * e + v * c + z * x,
                        t[9] = h * o + d * M + v * D + z * f,
                        t[10] = h * l + d * i + v * S + z * F,
                        t[11] = h * u + d * s + v * I + z * m,
                        h = n[12],
                        d = n[13],
                        v = n[14],
                        z = n[15],
                        t[12] = h * r + d * e + v * c + z * x,
                        t[13] = h * o + d * M + v * D + z * f,
                        t[14] = h * l + d * i + v * S + z * F,
                        t[15] = h * u + d * s + v * I + z * m,
                        t
                }
                ,
                o.multiply = r.USE_SIMD ? o.SIMD.multiply : o.scalar.multiply,
                o.mul = o.multiply,
                o.scalar.translate = function (t, a, n) {
                    var r, o, l, u, e, M, i, s, c, D, S, I, x = n[0], f = n[1], F = n[2];
                    return a === t ? (t[12] = a[0] * x + a[4] * f + a[8] * F + a[12],
                        t[13] = a[1] * x + a[5] * f + a[9] * F + a[13],
                        t[14] = a[2] * x + a[6] * f + a[10] * F + a[14],
                        t[15] = a[3] * x + a[7] * f + a[11] * F + a[15]) : (r = a[0],
                            o = a[1],
                            l = a[2],
                            u = a[3],
                            e = a[4],
                            M = a[5],
                            i = a[6],
                            s = a[7],
                            c = a[8],
                            D = a[9],
                            S = a[10],
                            I = a[11],
                            t[0] = r,
                            t[1] = o,
                            t[2] = l,
                            t[3] = u,
                            t[4] = e,
                            t[5] = M,
                            t[6] = i,
                            t[7] = s,
                            t[8] = c,
                            t[9] = D,
                            t[10] = S,
                            t[11] = I,
                            t[12] = r * x + e * f + c * F + a[12],
                            t[13] = o * x + M * f + D * F + a[13],
                            t[14] = l * x + i * f + S * F + a[14],
                            t[15] = u * x + s * f + I * F + a[15]),
                        t
                }
                ,
                o.SIMD.translate = function (t, a, n) {
                    var r = SIMD.Float32x4.load(a, 0)
                        , o = SIMD.Float32x4.load(a, 4)
                        , l = SIMD.Float32x4.load(a, 8)
                        , u = SIMD.Float32x4.load(a, 12)
                        , e = SIMD.Float32x4(n[0], n[1], n[2], 0);
                    a !== t && (t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t[3] = a[3],
                        t[4] = a[4],
                        t[5] = a[5],
                        t[6] = a[6],
                        t[7] = a[7],
                        t[8] = a[8],
                        t[9] = a[9],
                        t[10] = a[10],
                        t[11] = a[11]),
                        r = SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(e, 0, 0, 0, 0)),
                        o = SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(e, 1, 1, 1, 1)),
                        l = SIMD.Float32x4.mul(l, SIMD.Float32x4.swizzle(e, 2, 2, 2, 2));
                    var M = SIMD.Float32x4.add(r, SIMD.Float32x4.add(o, SIMD.Float32x4.add(l, u)));
                    return SIMD.Float32x4.store(t, 12, M),
                        t
                }
                ,
                o.translate = r.USE_SIMD ? o.SIMD.translate : o.scalar.translate,
                o.scalar.scale = function (t, a, n) {
                    var r = n[0]
                        , o = n[1]
                        , l = n[2];
                    return t[0] = a[0] * r,
                        t[1] = a[1] * r,
                        t[2] = a[2] * r,
                        t[3] = a[3] * r,
                        t[4] = a[4] * o,
                        t[5] = a[5] * o,
                        t[6] = a[6] * o,
                        t[7] = a[7] * o,
                        t[8] = a[8] * l,
                        t[9] = a[9] * l,
                        t[10] = a[10] * l,
                        t[11] = a[11] * l,
                        t[12] = a[12],
                        t[13] = a[13],
                        t[14] = a[14],
                        t[15] = a[15],
                        t
                }
                ,
                o.SIMD.scale = function (t, a, n) {
                    var r, o, l, u = SIMD.Float32x4(n[0], n[1], n[2], 0);
                    return r = SIMD.Float32x4.load(a, 0),
                        SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(u, 0, 0, 0, 0))),
                        o = SIMD.Float32x4.load(a, 4),
                        SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(u, 1, 1, 1, 1))),
                        l = SIMD.Float32x4.load(a, 8),
                        SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(l, SIMD.Float32x4.swizzle(u, 2, 2, 2, 2))),
                        t[12] = a[12],
                        t[13] = a[13],
                        t[14] = a[14],
                        t[15] = a[15],
                        t
                }
                ,
                o.scale = r.USE_SIMD ? o.SIMD.scale : o.scalar.scale,
                o.rotate = function (t, a, n, o) {
                    var l, u, e, M, i, s, c, D, S, I, x, f, F, m, h, d, v, z, p, w, A, R, b, Y, q = o[0], y = o[1], E = o[2], g = Math.sqrt(q * q + y * y + E * E);
                    return Math.abs(g) < r.EPSILON ? null : (g = 1 / g,
                        q *= g,
                        y *= g,
                        E *= g,
                        l = Math.sin(n),
                        u = Math.cos(n),
                        e = 1 - u,
                        M = a[0],
                        i = a[1],
                        s = a[2],
                        c = a[3],
                        D = a[4],
                        S = a[5],
                        I = a[6],
                        x = a[7],
                        f = a[8],
                        F = a[9],
                        m = a[10],
                        h = a[11],
                        d = q * q * e + u,
                        v = y * q * e + E * l,
                        z = E * q * e - y * l,
                        p = q * y * e - E * l,
                        w = y * y * e + u,
                        A = E * y * e + q * l,
                        R = q * E * e + y * l,
                        b = y * E * e - q * l,
                        Y = E * E * e + u,
                        t[0] = M * d + D * v + f * z,
                        t[1] = i * d + S * v + F * z,
                        t[2] = s * d + I * v + m * z,
                        t[3] = c * d + x * v + h * z,
                        t[4] = M * p + D * w + f * A,
                        t[5] = i * p + S * w + F * A,
                        t[6] = s * p + I * w + m * A,
                        t[7] = c * p + x * w + h * A,
                        t[8] = M * R + D * b + f * Y,
                        t[9] = i * R + S * b + F * Y,
                        t[10] = s * R + I * b + m * Y,
                        t[11] = c * R + x * b + h * Y,
                        a !== t && (t[12] = a[12],
                            t[13] = a[13],
                            t[14] = a[14],
                            t[15] = a[15]),
                        t)
                }
                ,
                o.scalar.rotateX = function (t, a, n) {
                    var r = Math.sin(n)
                        , o = Math.cos(n)
                        , l = a[4]
                        , u = a[5]
                        , e = a[6]
                        , M = a[7]
                        , i = a[8]
                        , s = a[9]
                        , c = a[10]
                        , D = a[11];
                    return a !== t && (t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t[3] = a[3],
                        t[12] = a[12],
                        t[13] = a[13],
                        t[14] = a[14],
                        t[15] = a[15]),
                        t[4] = l * o + i * r,
                        t[5] = u * o + s * r,
                        t[6] = e * o + c * r,
                        t[7] = M * o + D * r,
                        t[8] = i * o - l * r,
                        t[9] = s * o - u * r,
                        t[10] = c * o - e * r,
                        t[11] = D * o - M * r,
                        t
                }
                ,
                o.SIMD.rotateX = function (t, a, n) {
                    var r = SIMD.Float32x4.splat(Math.sin(n))
                        , o = SIMD.Float32x4.splat(Math.cos(n));
                    a !== t && (t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t[3] = a[3],
                        t[12] = a[12],
                        t[13] = a[13],
                        t[14] = a[14],
                        t[15] = a[15]);
                    var l = SIMD.Float32x4.load(a, 4)
                        , u = SIMD.Float32x4.load(a, 8);
                    return SIMD.Float32x4.store(t, 4, SIMD.Float32x4.add(SIMD.Float32x4.mul(l, o), SIMD.Float32x4.mul(u, r))),
                        SIMD.Float32x4.store(t, 8, SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, o), SIMD.Float32x4.mul(l, r))),
                        t
                }
                ,
                o.rotateX = r.USE_SIMD ? o.SIMD.rotateX : o.scalar.rotateX,
                o.scalar.rotateY = function (t, a, n) {
                    var r = Math.sin(n)
                        , o = Math.cos(n)
                        , l = a[0]
                        , u = a[1]
                        , e = a[2]
                        , M = a[3]
                        , i = a[8]
                        , s = a[9]
                        , c = a[10]
                        , D = a[11];
                    return a !== t && (t[4] = a[4],
                        t[5] = a[5],
                        t[6] = a[6],
                        t[7] = a[7],
                        t[12] = a[12],
                        t[13] = a[13],
                        t[14] = a[14],
                        t[15] = a[15]),
                        t[0] = l * o - i * r,
                        t[1] = u * o - s * r,
                        t[2] = e * o - c * r,
                        t[3] = M * o - D * r,
                        t[8] = l * r + i * o,
                        t[9] = u * r + s * o,
                        t[10] = e * r + c * o,
                        t[11] = M * r + D * o,
                        t
                }
                ,
                o.SIMD.rotateY = function (t, a, n) {
                    var r = SIMD.Float32x4.splat(Math.sin(n))
                        , o = SIMD.Float32x4.splat(Math.cos(n));
                    a !== t && (t[4] = a[4],
                        t[5] = a[5],
                        t[6] = a[6],
                        t[7] = a[7],
                        t[12] = a[12],
                        t[13] = a[13],
                        t[14] = a[14],
                        t[15] = a[15]);
                    var l = SIMD.Float32x4.load(a, 0)
                        , u = SIMD.Float32x4.load(a, 8);
                    return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, o), SIMD.Float32x4.mul(u, r))),
                        SIMD.Float32x4.store(t, 8, SIMD.Float32x4.add(SIMD.Float32x4.mul(l, r), SIMD.Float32x4.mul(u, o))),
                        t
                }
                ,
                o.rotateY = r.USE_SIMD ? o.SIMD.rotateY : o.scalar.rotateY,
                o.scalar.rotateZ = function (t, a, n) {
                    var r = Math.sin(n)
                        , o = Math.cos(n)
                        , l = a[0]
                        , u = a[1]
                        , e = a[2]
                        , M = a[3]
                        , i = a[4]
                        , s = a[5]
                        , c = a[6]
                        , D = a[7];
                    return a !== t && (t[8] = a[8],
                        t[9] = a[9],
                        t[10] = a[10],
                        t[11] = a[11],
                        t[12] = a[12],
                        t[13] = a[13],
                        t[14] = a[14],
                        t[15] = a[15]),
                        t[0] = l * o + i * r,
                        t[1] = u * o + s * r,
                        t[2] = e * o + c * r,
                        t[3] = M * o + D * r,
                        t[4] = i * o - l * r,
                        t[5] = s * o - u * r,
                        t[6] = c * o - e * r,
                        t[7] = D * o - M * r,
                        t
                }
                ,
                o.SIMD.rotateZ = function (t, a, n) {
                    var r = SIMD.Float32x4.splat(Math.sin(n))
                        , o = SIMD.Float32x4.splat(Math.cos(n));
                    a !== t && (t[8] = a[8],
                        t[9] = a[9],
                        t[10] = a[10],
                        t[11] = a[11],
                        t[12] = a[12],
                        t[13] = a[13],
                        t[14] = a[14],
                        t[15] = a[15]);
                    var l = SIMD.Float32x4.load(a, 0)
                        , u = SIMD.Float32x4.load(a, 4);
                    return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.add(SIMD.Float32x4.mul(l, o), SIMD.Float32x4.mul(u, r))),
                        SIMD.Float32x4.store(t, 4, SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, o), SIMD.Float32x4.mul(l, r))),
                        t
                }
                ,
                o.rotateZ = r.USE_SIMD ? o.SIMD.rotateZ : o.scalar.rotateZ,
                o.fromTranslation = function (t, a) {
                    return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = 1,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 0,
                        t[9] = 0,
                        t[10] = 1,
                        t[11] = 0,
                        t[12] = a[0],
                        t[13] = a[1],
                        t[14] = a[2],
                        t[15] = 1,
                        t
                }
                ,
                o.fromScaling = function (t, a) {
                    return t[0] = a[0],
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = a[1],
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 0,
                        t[9] = 0,
                        t[10] = a[2],
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t
                }
                ,
                o.fromRotation = function (t, a, n) {
                    var o, l, u, e = n[0], M = n[1], i = n[2], s = Math.sqrt(e * e + M * M + i * i);
                    return Math.abs(s) < r.EPSILON ? null : (s = 1 / s,
                        e *= s,
                        M *= s,
                        i *= s,
                        o = Math.sin(a),
                        l = Math.cos(a),
                        u = 1 - l,
                        t[0] = e * e * u + l,
                        t[1] = M * e * u + i * o,
                        t[2] = i * e * u - M * o,
                        t[3] = 0,
                        t[4] = e * M * u - i * o,
                        t[5] = M * M * u + l,
                        t[6] = i * M * u + e * o,
                        t[7] = 0,
                        t[8] = e * i * u + M * o,
                        t[9] = M * i * u - e * o,
                        t[10] = i * i * u + l,
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t)
                }
                ,
                o.fromXRotation = function (t, a) {
                    var n = Math.sin(a)
                        , r = Math.cos(a);
                    return t[0] = 1,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = r,
                        t[6] = n,
                        t[7] = 0,
                        t[8] = 0,
                        t[9] = -n,
                        t[10] = r,
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t
                }
                ,
                o.fromYRotation = function (t, a) {
                    var n = Math.sin(a)
                        , r = Math.cos(a);
                    return t[0] = r,
                        t[1] = 0,
                        t[2] = -n,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = 1,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = n,
                        t[9] = 0,
                        t[10] = r,
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t
                }
                ,
                o.fromZRotation = function (t, a) {
                    var n = Math.sin(a)
                        , r = Math.cos(a);
                    return t[0] = r,
                        t[1] = n,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = -n,
                        t[5] = r,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 0,
                        t[9] = 0,
                        t[10] = 1,
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t
                }
                ,
                o.fromRotationTranslation = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = r + r
                        , M = o + o
                        , i = l + l
                        , s = r * e
                        , c = r * M
                        , D = r * i
                        , S = o * M
                        , I = o * i
                        , x = l * i
                        , f = u * e
                        , F = u * M
                        , m = u * i;
                    return t[0] = 1 - (S + x),
                        t[1] = c + m,
                        t[2] = D - F,
                        t[3] = 0,
                        t[4] = c - m,
                        t[5] = 1 - (s + x),
                        t[6] = I + f,
                        t[7] = 0,
                        t[8] = D + F,
                        t[9] = I - f,
                        t[10] = 1 - (s + S),
                        t[11] = 0,
                        t[12] = n[0],
                        t[13] = n[1],
                        t[14] = n[2],
                        t[15] = 1,
                        t
                }
                ,
                o.fromRotationTranslationScale = function (t, a, n, r) {
                    var o = a[0]
                        , l = a[1]
                        , u = a[2]
                        , e = a[3]
                        , M = o + o
                        , i = l + l
                        , s = u + u
                        , c = o * M
                        , D = o * i
                        , S = o * s
                        , I = l * i
                        , x = l * s
                        , f = u * s
                        , F = e * M
                        , m = e * i
                        , h = e * s
                        , d = r[0]
                        , v = r[1]
                        , z = r[2];
                    return t[0] = (1 - (I + f)) * d,
                        t[1] = (D + h) * d,
                        t[2] = (S - m) * d,
                        t[3] = 0,
                        t[4] = (D - h) * v,
                        t[5] = (1 - (c + f)) * v,
                        t[6] = (x + F) * v,
                        t[7] = 0,
                        t[8] = (S + m) * z,
                        t[9] = (x - F) * z,
                        t[10] = (1 - (c + I)) * z,
                        t[11] = 0,
                        t[12] = n[0],
                        t[13] = n[1],
                        t[14] = n[2],
                        t[15] = 1,
                        t
                }
                ,
                o.fromRotationTranslationScaleOrigin = function (t, a, n, r, o) {
                    var l = a[0]
                        , u = a[1]
                        , e = a[2]
                        , M = a[3]
                        , i = l + l
                        , s = u + u
                        , c = e + e
                        , D = l * i
                        , S = l * s
                        , I = l * c
                        , x = u * s
                        , f = u * c
                        , F = e * c
                        , m = M * i
                        , h = M * s
                        , d = M * c
                        , v = r[0]
                        , z = r[1]
                        , p = r[2]
                        , w = o[0]
                        , A = o[1]
                        , R = o[2];
                    return t[0] = (1 - (x + F)) * v,
                        t[1] = (S + d) * v,
                        t[2] = (I - h) * v,
                        t[3] = 0,
                        t[4] = (S - d) * z,
                        t[5] = (1 - (D + F)) * z,
                        t[6] = (f + m) * z,
                        t[7] = 0,
                        t[8] = (I + h) * p,
                        t[9] = (f - m) * p,
                        t[10] = (1 - (D + x)) * p,
                        t[11] = 0,
                        t[12] = n[0] + w - (t[0] * w + t[4] * A + t[8] * R),
                        t[13] = n[1] + A - (t[1] * w + t[5] * A + t[9] * R),
                        t[14] = n[2] + R - (t[2] * w + t[6] * A + t[10] * R),
                        t[15] = 1,
                        t
                }
                ,
                o.fromQuat = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = n + n
                        , e = r + r
                        , M = o + o
                        , i = n * u
                        , s = r * u
                        , c = r * e
                        , D = o * u
                        , S = o * e
                        , I = o * M
                        , x = l * u
                        , f = l * e
                        , F = l * M;
                    return t[0] = 1 - c - I,
                        t[1] = s + F,
                        t[2] = D - f,
                        t[3] = 0,
                        t[4] = s - F,
                        t[5] = 1 - i - I,
                        t[6] = S + x,
                        t[7] = 0,
                        t[8] = D + f,
                        t[9] = S - x,
                        t[10] = 1 - i - c,
                        t[11] = 0,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 0,
                        t[15] = 1,
                        t
                }
                ,
                o.frustum = function (t, a, n, r, o, l, u) {
                    var e = 1 / (n - a)
                        , M = 1 / (o - r)
                        , i = 1 / (l - u);
                    return t[0] = 2 * l * e,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = 2 * l * M,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = (n + a) * e,
                        t[9] = (o + r) * M,
                        t[10] = (u + l) * i,
                        t[11] = -1,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = u * l * 2 * i,
                        t[15] = 0,
                        t
                }
                ,
                o.perspective = function (t, a, n, r, o) {
                    var l = 1 / Math.tan(a / 2)
                        , u = 1 / (r - o);
                    return t[0] = l / n,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = l,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 0,
                        t[9] = 0,
                        t[10] = (o + r) * u,
                        t[11] = -1,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = 2 * o * r * u,
                        t[15] = 0,
                        t
                }
                ,
                o.perspectiveFromFieldOfView = function (t, a, n, r) {
                    var o = Math.tan(a.upDegrees * Math.PI / 180)
                        , l = Math.tan(a.downDegrees * Math.PI / 180)
                        , u = Math.tan(a.leftDegrees * Math.PI / 180)
                        , e = Math.tan(a.rightDegrees * Math.PI / 180)
                        , M = 2 / (u + e)
                        , i = 2 / (o + l);
                    return t[0] = M,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = i,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = -((u - e) * M * .5),
                        t[9] = (o - l) * i * .5,
                        t[10] = r / (n - r),
                        t[11] = -1,
                        t[12] = 0,
                        t[13] = 0,
                        t[14] = r * n / (n - r),
                        t[15] = 0,
                        t
                }
                ,
                o.ortho = function (t, a, n, r, o, l, u) {
                    var e = 1 / (a - n)
                        , M = 1 / (r - o)
                        , i = 1 / (l - u);
                    return t[0] = -2 * e,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 0,
                        t[4] = 0,
                        t[5] = -2 * M,
                        t[6] = 0,
                        t[7] = 0,
                        t[8] = 0,
                        t[9] = 0,
                        t[10] = 2 * i,
                        t[11] = 0,
                        t[12] = (a + n) * e,
                        t[13] = (o + r) * M,
                        t[14] = (u + l) * i,
                        t[15] = 1,
                        t
                }
                ,
                o.lookAt = function (t, a, n, l) {
                    var u, e, M, i, s, c, D, S, I, x, f = a[0], F = a[1], m = a[2], h = l[0], d = l[1], v = l[2], z = n[0], p = n[1], w = n[2];
                    return Math.abs(f - z) < r.EPSILON && Math.abs(F - p) < r.EPSILON && Math.abs(m - w) < r.EPSILON ? o.identity(t) : (D = f - z,
                        S = F - p,
                        I = m - w,
                        x = 1 / Math.sqrt(D * D + S * S + I * I),
                        D *= x,
                        S *= x,
                        I *= x,
                        u = d * I - v * S,
                        e = v * D - h * I,
                        M = h * S - d * D,
                        x = Math.sqrt(u * u + e * e + M * M),
                        x ? (x = 1 / x,
                            u *= x,
                            e *= x,
                            M *= x) : (u = 0,
                                e = 0,
                                M = 0),
                        i = S * M - I * e,
                        s = I * u - D * M,
                        c = D * e - S * u,
                        x = Math.sqrt(i * i + s * s + c * c),
                        x ? (x = 1 / x,
                            i *= x,
                            s *= x,
                            c *= x) : (i = 0,
                                s = 0,
                                c = 0),
                        t[0] = u,
                        t[1] = i,
                        t[2] = D,
                        t[3] = 0,
                        t[4] = e,
                        t[5] = s,
                        t[6] = S,
                        t[7] = 0,
                        t[8] = M,
                        t[9] = c,
                        t[10] = I,
                        t[11] = 0,
                        t[12] = -(u * f + e * F + M * m),
                        t[13] = -(i * f + s * F + c * m),
                        t[14] = -(D * f + S * F + I * m),
                        t[15] = 1,
                        t)
                }
                ,
                o.str = function (t) {
                    console.log();
                    return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
                }
                ,
                o.frob = function (t) {
                    return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2))
                }
                ,
                t.exports = o
        }
        , function (t, a, n) {
            var r = n(1)
                , o = n(4)
                , l = n(7)
                , u = n(8)
                , e = {};
            e.create = function () {
                var t = new r.ARRAY_TYPE(4);
                return t[0] = 0,
                    t[1] = 0,
                    t[2] = 0,
                    t[3] = 1,
                    t
            }
                ,
                e.rotationTo = function () {
                    var t = l.create()
                        , a = l.fromValues(1, 0, 0)
                        , n = l.fromValues(0, 1, 0);
                    return function (r, o, u) {
                        var M = l.dot(o, u);
                        return -.999999 > M ? (l.cross(t, a, o),
                            l.length(t) < 1e-6 && l.cross(t, n, o),
                            l.normalize(t, t),
                            e.setAxisAngle(r, t, Math.PI),
                            r) : M > .999999 ? (r[0] = 0,
                                r[1] = 0,
                                r[2] = 0,
                                r[3] = 1,
                                r) : (l.cross(t, o, u),
                                    r[0] = t[0],
                                    r[1] = t[1],
                                    r[2] = t[2],
                                    r[3] = 1 + M,
                                    e.normalize(r, r))
                    }
                }(),
                e.setAxes = function () {
                    var t = o.create();
                    return function (a, n, r, o) {
                        return t[0] = r[0],
                            t[3] = r[1],
                            t[6] = r[2],
                            t[1] = o[0],
                            t[4] = o[1],
                            t[7] = o[2],
                            t[2] = -n[0],
                            t[5] = -n[1],
                            t[8] = -n[2],
                            e.normalize(a, e.fromMat3(a, t))
                    }
                }(),
                e.clone = u.clone,
                e.fromValues = u.fromValues,
                e.copy = u.copy,
                e.set = u.set,
                e.identity = function (t) {
                    return t[0] = 0,
                        t[1] = 0,
                        t[2] = 0,
                        t[3] = 1,
                        t
                }
                ,
                e.setAxisAngle = function (t, a, n) {
                    n = .5 * n;
                    var r = Math.sin(n);
                    return t[0] = r * a[0],
                        t[1] = r * a[1],
                        t[2] = r * a[2],
                        t[3] = Math.cos(n),
                        t
                }
                ,
                e.add = u.add,
                e.multiply = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = n[0]
                        , M = n[1]
                        , i = n[2]
                        , s = n[3];
                    return t[0] = r * s + u * e + o * i - l * M,
                        t[1] = o * s + u * M + l * e - r * i,
                        t[2] = l * s + u * i + r * M - o * e,
                        t[3] = u * s - r * e - o * M - l * i,
                        t
                }
                ,
                e.mul = e.multiply,
                e.scale = u.scale,
                e.rotateX = function (t, a, n) {
                    n *= .5;
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = Math.sin(n)
                        , M = Math.cos(n);
                    return t[0] = r * M + u * e,
                        t[1] = o * M + l * e,
                        t[2] = l * M - o * e,
                        t[3] = u * M - r * e,
                        t
                }
                ,
                e.rotateY = function (t, a, n) {
                    n *= .5;
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = Math.sin(n)
                        , M = Math.cos(n);
                    return t[0] = r * M - l * e,
                        t[1] = o * M + u * e,
                        t[2] = l * M + r * e,
                        t[3] = u * M - o * e,
                        t
                }
                ,
                e.rotateZ = function (t, a, n) {
                    n *= .5;
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3]
                        , e = Math.sin(n)
                        , M = Math.cos(n);
                    return t[0] = r * M + o * e,
                        t[1] = o * M - r * e,
                        t[2] = l * M + u * e,
                        t[3] = u * M - l * e,
                        t
                }
                ,
                e.calculateW = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2];
                    return t[0] = n,
                        t[1] = r,
                        t[2] = o,
                        t[3] = Math.sqrt(Math.abs(1 - n * n - r * r - o * o)),
                        t
                }
                ,
                e.dot = u.dot,
                e.lerp = u.lerp,
                e.slerp = function (t, a, n, r) {
                    var o, l, u, e, M, i = a[0], s = a[1], c = a[2], D = a[3], S = n[0], I = n[1], x = n[2], f = n[3];
                    return l = i * S + s * I + c * x + D * f,
                        0 > l && (l = -l,
                            S = -S,
                            I = -I,
                            x = -x,
                            f = -f),
                        1 - l > 1e-6 ? (o = Math.acos(l),
                            u = Math.sin(o),
                            e = Math.sin((1 - r) * o) / u,
                            M = Math.sin(r * o) / u) : (e = 1 - r,
                                M = r),
                        t[0] = e * i + M * S,
                        t[1] = e * s + M * I,
                        t[2] = e * c + M * x,
                        t[3] = e * D + M * f,
                        t
                }
                ,
                e.sqlerp = function () {
                    var t = e.create()
                        , a = e.create();
                    return function (n, r, o, l, u, M) {
                        return e.slerp(t, r, u, M),
                            e.slerp(a, o, l, M),
                            e.slerp(n, t, a, 2 * M * (1 - M)),
                            n
                    }
                }(),
                e.invert = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = n * n + r * r + o * o + l * l
                        , e = u ? 1 / u : 0;
                    return t[0] = -n * e,
                        t[1] = -r * e,
                        t[2] = -o * e,
                        t[3] = l * e,
                        t
                }
                ,
                e.conjugate = function (t, a) {
                    return t[0] = -a[0],
                        t[1] = -a[1],
                        t[2] = -a[2],
                        t[3] = a[3],
                        t
                }
                ,
                e.length = u.length,
                e.len = e.length,
                e.squaredLength = u.squaredLength,
                e.sqrLen = e.squaredLength,
                e.normalize = u.normalize,
                e.fromMat3 = function (t, a) {
                    var n, r = a[0] + a[4] + a[8];
                    if (r > 0)
                        n = Math.sqrt(r + 1),
                            t[3] = .5 * n,
                            n = .5 / n,
                            t[0] = (a[5] - a[7]) * n,
                            t[1] = (a[6] - a[2]) * n,
                            t[2] = (a[1] - a[3]) * n;
                    else {
                        var o = 0;
                        a[4] > a[0] && (o = 1),
                            a[8] > a[3 * o + o] && (o = 2);
                        var l = (o + 1) % 3
                            , u = (o + 2) % 3;
                        n = Math.sqrt(a[3 * o + o] - a[3 * l + l] - a[3 * u + u] + 1),
                            t[o] = .5 * n,
                            n = .5 / n,
                            t[3] = (a[3 * l + u] - a[3 * u + l]) * n,
                            t[l] = (a[3 * l + o] + a[3 * o + l]) * n,
                            t[u] = (a[3 * u + o] + a[3 * o + u]) * n
                    }
                    return t
                }
                ,
                e.str = function (t) {
                    return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
                }
                ,
                t.exports = e
        }
        , function (t, a, n) {
            var r = n(1)
                , o = {};
            o.create = function () {
                var t = new r.ARRAY_TYPE(3);
                return t[0] = 0,
                    t[1] = 0,
                    t[2] = 0,
                    t
            }
                ,
                o.clone = function (t) {
                    var a = new r.ARRAY_TYPE(3);
                    return a[0] = t[0],
                        a[1] = t[1],
                        a[2] = t[2],
                        a
                }
                ,
                o.fromValues = function (t, a, n) {
                    var o = new r.ARRAY_TYPE(3);
                    return o[0] = t,
                        o[1] = a,
                        o[2] = n,
                        o
                }
                ,
                o.copy = function (t, a) {
                    return t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t
                }
                ,
                o.set = function (t, a, n, r) {
                    return t[0] = a,
                        t[1] = n,
                        t[2] = r,
                        t
                }
                ,
                o.add = function (t, a, n) {
                    return t[0] = a[0] + n[0],
                        t[1] = a[1] + n[1],
                        t[2] = a[2] + n[2],
                        t
                }
                ,
                o.subtract = function (t, a, n) {
                    return t[0] = a[0] - n[0],
                        t[1] = a[1] - n[1],
                        t[2] = a[2] - n[2],
                        t
                }
                ,
                o.sub = o.subtract,
                o.multiply = function (t, a, n) {
                    return t[0] = a[0] * n[0],
                        t[1] = a[1] * n[1],
                        t[2] = a[2] * n[2],
                        t
                }
                ,
                o.mul = o.multiply,
                o.divide = function (t, a, n) {
                    return t[0] = a[0] / n[0],
                        t[1] = a[1] / n[1],
                        t[2] = a[2] / n[2],
                        t
                }
                ,
                o.div = o.divide,
                o.min = function (t, a, n) {
                    return t[0] = Math.min(a[0], n[0]),
                        t[1] = Math.min(a[1], n[1]),
                        t[2] = Math.min(a[2], n[2]),
                        t
                }
                ,
                o.max = function (t, a, n) {
                    return t[0] = Math.max(a[0], n[0]),
                        t[1] = Math.max(a[1], n[1]),
                        t[2] = Math.max(a[2], n[2]),
                        t
                }
                ,
                o.scale = function (t, a, n) {
                    return t[0] = a[0] * n,
                        t[1] = a[1] * n,
                        t[2] = a[2] * n,
                        t
                }
                ,
                o.scaleAndAdd = function (t, a, n, r) {
                    return t[0] = a[0] + n[0] * r,
                        t[1] = a[1] + n[1] * r,
                        t[2] = a[2] + n[2] * r,
                        t
                }
                ,
                o.distance = function (t, a) {
                    var n = a[0] - t[0]
                        , r = a[1] - t[1]
                        , o = a[2] - t[2];
                    return Math.sqrt(n * n + r * r + o * o)
                }
                ,
                o.dist = o.distance,
                o.squaredDistance = function (t, a) {
                    var n = a[0] - t[0]
                        , r = a[1] - t[1]
                        , o = a[2] - t[2];
                    return n * n + r * r + o * o
                }
                ,
                o.sqrDist = o.squaredDistance,
                o.length = function (t) {
                    var a = t[0]
                        , n = t[1]
                        , r = t[2];
                    return Math.sqrt(a * a + n * n + r * r)
                }
                ,
                o.len = o.length,
                o.squaredLength = function (t) {
                    var a = t[0]
                        , n = t[1]
                        , r = t[2];
                    return a * a + n * n + r * r
                }
                ,
                o.sqrLen = o.squaredLength,
                o.negate = function (t, a) {
                    return t[0] = -a[0],
                        t[1] = -a[1],
                        t[2] = -a[2],
                        t
                }
                ,
                o.inverse = function (t, a) {
                    return t[0] = 1 / a[0],
                        t[1] = 1 / a[1],
                        t[2] = 1 / a[2],
                        t
                }
                ,
                o.normalize = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = n * n + r * r + o * o;
                    return l > 0 && (l = 1 / Math.sqrt(l),
                        t[0] = a[0] * l,
                        t[1] = a[1] * l,
                        t[2] = a[2] * l),
                        t
                }
                ,
                o.dot = function (t, a) {
                    return t[0] * a[0] + t[1] * a[1] + t[2] * a[2]
                }
                ,
                o.cross = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = n[0]
                        , e = n[1]
                        , M = n[2];
                    return t[0] = o * M - l * e,
                        t[1] = l * u - r * M,
                        t[2] = r * e - o * u,
                        t
                }
                ,
                o.lerp = function (t, a, n, r) {
                    var o = a[0]
                        , l = a[1]
                        , u = a[2];
                    return t[0] = o + r * (n[0] - o),
                        t[1] = l + r * (n[1] - l),
                        t[2] = u + r * (n[2] - u),
                        t
                }
                ,
                o.hermite = function (t, a, n, r, o, l) {
                    var u = l * l
                        , e = u * (2 * l - 3) + 1
                        , M = u * (l - 2) + l
                        , i = u * (l - 1)
                        , s = u * (3 - 2 * l);
                    return t[0] = a[0] * e + n[0] * M + r[0] * i + o[0] * s,
                        t[1] = a[1] * e + n[1] * M + r[1] * i + o[1] * s,
                        t[2] = a[2] * e + n[2] * M + r[2] * i + o[2] * s,
                        t
                }
                ,
                o.bezier = function (t, a, n, r, o, l) {
                    var u = 1 - l
                        , e = u * u
                        , M = l * l
                        , i = e * u
                        , s = 3 * l * e
                        , c = 3 * M * u
                        , D = M * l;
                    return t[0] = a[0] * i + n[0] * s + r[0] * c + o[0] * D,
                        t[1] = a[1] * i + n[1] * s + r[1] * c + o[1] * D,
                        t[2] = a[2] * i + n[2] * s + r[2] * c + o[2] * D,
                        t
                }
                ,
                o.random = function (t, a) {
                    a = a || 1;
                    var n = 2 * r.RANDOM() * Math.PI
                        , o = 2 * r.RANDOM() - 1
                        , l = Math.sqrt(1 - o * o) * a;
                    return t[0] = Math.cos(n) * l,
                        t[1] = Math.sin(n) * l,
                        t[2] = o * a,
                        t
                }
                ,
                o.transformMat4 = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = n[3] * r + n[7] * o + n[11] * l + n[15];
                    return u = u || 1,
                        t[0] = (n[0] * r + n[4] * o + n[8] * l + n[12]) / u,
                        t[1] = (n[1] * r + n[5] * o + n[9] * l + n[13]) / u,
                        t[2] = (n[2] * r + n[6] * o + n[10] * l + n[14]) / u,
                        t
                }
                ,
                o.transformMat3 = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2];
                    return t[0] = r * n[0] + o * n[3] + l * n[6],
                        t[1] = r * n[1] + o * n[4] + l * n[7],
                        t[2] = r * n[2] + o * n[5] + l * n[8],
                        t
                }
                ,
                o.transformQuat = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = n[0]
                        , e = n[1]
                        , M = n[2]
                        , i = n[3]
                        , s = i * r + e * l - M * o
                        , c = i * o + M * r - u * l
                        , D = i * l + u * o - e * r
                        , S = -u * r - e * o - M * l;
                    return t[0] = s * i + S * -u + c * -M - D * -e,
                        t[1] = c * i + S * -e + D * -u - s * -M,
                        t[2] = D * i + S * -M + s * -e - c * -u,
                        t
                }
                ,
                o.rotateX = function (t, a, n, r) {
                    var o = []
                        , l = [];
                    return o[0] = a[0] - n[0],
                        o[1] = a[1] - n[1],
                        o[2] = a[2] - n[2],
                        l[0] = o[0],
                        l[1] = o[1] * Math.cos(r) - o[2] * Math.sin(r),
                        l[2] = o[1] * Math.sin(r) + o[2] * Math.cos(r),
                        t[0] = l[0] + n[0],
                        t[1] = l[1] + n[1],
                        t[2] = l[2] + n[2],
                        t
                }
                ,
                o.rotateY = function (t, a, n, r) {
                    var o = []
                        , l = [];
                    return o[0] = a[0] - n[0],
                        o[1] = a[1] - n[1],
                        o[2] = a[2] - n[2],
                        l[0] = o[2] * Math.sin(r) + o[0] * Math.cos(r),
                        l[1] = o[1],
                        l[2] = o[2] * Math.cos(r) - o[0] * Math.sin(r),
                        t[0] = l[0] + n[0],
                        t[1] = l[1] + n[1],
                        t[2] = l[2] + n[2],
                        t
                }
                ,
                o.rotateZ = function (t, a, n, r) {
                    var o = []
                        , l = [];
                    return o[0] = a[0] - n[0],
                        o[1] = a[1] - n[1],
                        o[2] = a[2] - n[2],
                        l[0] = o[0] * Math.cos(r) - o[1] * Math.sin(r),
                        l[1] = o[0] * Math.sin(r) + o[1] * Math.cos(r),
                        l[2] = o[2],
                        t[0] = l[0] + n[0],
                        t[1] = l[1] + n[1],
                        t[2] = l[2] + n[2],
                        t
                }
                ,
                o.forEach = function () {
                    var t = o.create();
                    return function (a, n, r, o, l, u) {
                        var e, M;
                        for (n || (n = 3),
                            r || (r = 0),
                            M = o ? Math.min(o * n + r, a.length) : a.length,
                            e = r; M > e; e += n)
                            t[0] = a[e],
                                t[1] = a[e + 1],
                                t[2] = a[e + 2],
                                l(t, t, u),
                                a[e] = t[0],
                                a[e + 1] = t[1],
                                a[e + 2] = t[2];
                        return a
                    }
                }(),
                o.angle = function (t, a) {
                    var n = o.fromValues(t[0], t[1], t[2])
                        , r = o.fromValues(a[0], a[1], a[2]);
                    o.normalize(n, n),
                        o.normalize(r, r);
                    var l = o.dot(n, r);
                    return l > 1 ? 0 : Math.acos(l)
                }
                ,
                o.str = function (t) {
                    return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")"
                }
                ,
                t.exports = o
        }
        , function (t, a, n) {
            var r = n(1)
                , o = {};
            o.create = function () {
                var t = new r.ARRAY_TYPE(4);
                return t[0] = 0,
                    t[1] = 0,
                    t[2] = 0,
                    t[3] = 0,
                    t
            }
                ,
                o.clone = function (t) {
                    var a = new r.ARRAY_TYPE(4);
                    return a[0] = t[0],
                        a[1] = t[1],
                        a[2] = t[2],
                        a[3] = t[3],
                        a
                }
                ,
                o.fromValues = function (t, a, n, o) {
                    var l = new r.ARRAY_TYPE(4);
                    return l[0] = t,
                        l[1] = a,
                        l[2] = n,
                        l[3] = o,
                        l
                }
                ,
                o.copy = function (t, a) {
                    return t[0] = a[0],
                        t[1] = a[1],
                        t[2] = a[2],
                        t[3] = a[3],
                        t
                }
                ,
                o.set = function (t, a, n, r, o) {
                    return t[0] = a,
                        t[1] = n,
                        t[2] = r,
                        t[3] = o,
                        t
                }
                ,
                o.add = function (t, a, n) {
                    return t[0] = a[0] + n[0],
                        t[1] = a[1] + n[1],
                        t[2] = a[2] + n[2],
                        t[3] = a[3] + n[3],
                        t
                }
                ,
                o.subtract = function (t, a, n) {
                    return t[0] = a[0] - n[0],
                        t[1] = a[1] - n[1],
                        t[2] = a[2] - n[2],
                        t[3] = a[3] - n[3],
                        t
                }
                ,
                o.sub = o.subtract,
                o.multiply = function (t, a, n) {
                    return t[0] = a[0] * n[0],
                        t[1] = a[1] * n[1],
                        t[2] = a[2] * n[2],
                        t[3] = a[3] * n[3],
                        t
                }
                ,
                o.mul = o.multiply,
                o.divide = function (t, a, n) {
                    return t[0] = a[0] / n[0],
                        t[1] = a[1] / n[1],
                        t[2] = a[2] / n[2],
                        t[3] = a[3] / n[3],
                        t
                }
                ,
                o.div = o.divide,
                o.min = function (t, a, n) {
                    return t[0] = Math.min(a[0], n[0]),
                        t[1] = Math.min(a[1], n[1]),
                        t[2] = Math.min(a[2], n[2]),
                        t[3] = Math.min(a[3], n[3]),
                        t
                }
                ,
                o.max = function (t, a, n) {
                    return t[0] = Math.max(a[0], n[0]),
                        t[1] = Math.max(a[1], n[1]),
                        t[2] = Math.max(a[2], n[2]),
                        t[3] = Math.max(a[3], n[3]),
                        t
                }
                ,
                o.scale = function (t, a, n) {
                    return t[0] = a[0] * n,
                        t[1] = a[1] * n,
                        t[2] = a[2] * n,
                        t[3] = a[3] * n,
                        t
                }
                ,
                o.scaleAndAdd = function (t, a, n, r) {
                    return t[0] = a[0] + n[0] * r,
                        t[1] = a[1] + n[1] * r,
                        t[2] = a[2] + n[2] * r,
                        t[3] = a[3] + n[3] * r,
                        t
                }
                ,
                o.distance = function (t, a) {
                    var n = a[0] - t[0]
                        , r = a[1] - t[1]
                        , o = a[2] - t[2]
                        , l = a[3] - t[3];
                    return Math.sqrt(n * n + r * r + o * o + l * l)
                }
                ,
                o.dist = o.distance,
                o.squaredDistance = function (t, a) {
                    var n = a[0] - t[0]
                        , r = a[1] - t[1]
                        , o = a[2] - t[2]
                        , l = a[3] - t[3];
                    return n * n + r * r + o * o + l * l
                }
                ,
                o.sqrDist = o.squaredDistance,
                o.length = function (t) {
                    var a = t[0]
                        , n = t[1]
                        , r = t[2]
                        , o = t[3];
                    return Math.sqrt(a * a + n * n + r * r + o * o)
                }
                ,
                o.len = o.length,
                o.squaredLength = function (t) {
                    var a = t[0]
                        , n = t[1]
                        , r = t[2]
                        , o = t[3];
                    return a * a + n * n + r * r + o * o
                }
                ,
                o.sqrLen = o.squaredLength,
                o.negate = function (t, a) {
                    return t[0] = -a[0],
                        t[1] = -a[1],
                        t[2] = -a[2],
                        t[3] = -a[3],
                        t
                }
                ,
                o.inverse = function (t, a) {
                    return t[0] = 1 / a[0],
                        t[1] = 1 / a[1],
                        t[2] = 1 / a[2],
                        t[3] = 1 / a[3],
                        t
                }
                ,
                o.normalize = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = a[2]
                        , l = a[3]
                        , u = n * n + r * r + o * o + l * l;
                    return u > 0 && (u = 1 / Math.sqrt(u),
                        t[0] = n * u,
                        t[1] = r * u,
                        t[2] = o * u,
                        t[3] = l * u),
                        t
                }
                ,
                o.dot = function (t, a) {
                    return t[0] * a[0] + t[1] * a[1] + t[2] * a[2] + t[3] * a[3]
                }
                ,
                o.lerp = function (t, a, n, r) {
                    var o = a[0]
                        , l = a[1]
                        , u = a[2]
                        , e = a[3];
                    return t[0] = o + r * (n[0] - o),
                        t[1] = l + r * (n[1] - l),
                        t[2] = u + r * (n[2] - u),
                        t[3] = e + r * (n[3] - e),
                        t
                }
                ,
                o.random = function (t, a) {
                    return a = a || 1,
                        t[0] = r.RANDOM(),
                        t[1] = r.RANDOM(),
                        t[2] = r.RANDOM(),
                        t[3] = r.RANDOM(),
                        o.normalize(t, t),
                        o.scale(t, t, a),
                        t
                }
                ,
                o.transformMat4 = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = a[3];
                    return t[0] = n[0] * r + n[4] * o + n[8] * l + n[12] * u,
                        t[1] = n[1] * r + n[5] * o + n[9] * l + n[13] * u,
                        t[2] = n[2] * r + n[6] * o + n[10] * l + n[14] * u,
                        t[3] = n[3] * r + n[7] * o + n[11] * l + n[15] * u,
                        t
                }
                ,
                o.transformQuat = function (t, a, n) {
                    var r = a[0]
                        , o = a[1]
                        , l = a[2]
                        , u = n[0]
                        , e = n[1]
                        , M = n[2]
                        , i = n[3]
                        , s = i * r + e * l - M * o
                        , c = i * o + M * r - u * l
                        , D = i * l + u * o - e * r
                        , S = -u * r - e * o - M * l;
                    return t[0] = s * i + S * -u + c * -M - D * -e,
                        t[1] = c * i + S * -e + D * -u - s * -M,
                        t[2] = D * i + S * -M + s * -e - c * -u,
                        t[3] = a[3],
                        t
                }
                ,
                o.forEach = function () {
                    var t = o.create();
                    return function (a, n, r, o, l, u) {
                        var e, M;
                        for (n || (n = 4),
                            r || (r = 0),
                            M = o ? Math.min(o * n + r, a.length) : a.length,
                            e = r; M > e; e += n)
                            t[0] = a[e],
                                t[1] = a[e + 1],
                                t[2] = a[e + 2],
                                t[3] = a[e + 3],
                                l(t, t, u),
                                a[e] = t[0],
                                a[e + 1] = t[1],
                                a[e + 2] = t[2],
                                a[e + 3] = t[3];
                        return a
                    }
                }(),
                o.str = function (t) {
                    return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
                }
                ,
                t.exports = o
        }
        , function (t, a, n) {
            var r = n(1)
                , o = {};
            o.create = function () {
                var t = new r.ARRAY_TYPE(2);
                return t[0] = 0,
                    t[1] = 0,
                    t
            }
                ,
                o.clone = function (t) {
                    var a = new r.ARRAY_TYPE(2);
                    return a[0] = t[0],
                        a[1] = t[1],
                        a
                }
                ,
                o.fromValues = function (t, a) {
                    var n = new r.ARRAY_TYPE(2);
                    return n[0] = t,
                        n[1] = a,
                        n
                }
                ,
                o.copy = function (t, a) {
                    return t[0] = a[0],
                        t[1] = a[1],
                        t
                }
                ,
                o.set = function (t, a, n) {
                    return t[0] = a,
                        t[1] = n,
                        t
                }
                ,
                o.add = function (t, a, n) {
                    return t[0] = a[0] + n[0],
                        t[1] = a[1] + n[1],
                        t
                }
                ,
                o.subtract = function (t, a, n) {
                    return t[0] = a[0] - n[0],
                        t[1] = a[1] - n[1],
                        t
                }
                ,
                o.sub = o.subtract,
                o.multiply = function (t, a, n) {
                    return t[0] = a[0] * n[0],
                        t[1] = a[1] * n[1],
                        t
                }
                ,
                o.mul = o.multiply,
                o.divide = function (t, a, n) {
                    return t[0] = a[0] / n[0],
                        t[1] = a[1] / n[1],
                        t
                }
                ,
                o.div = o.divide,
                o.min = function (t, a, n) {
                    return t[0] = Math.min(a[0], n[0]),
                        t[1] = Math.min(a[1], n[1]),
                        t
                }
                ,
                o.max = function (t, a, n) {
                    return t[0] = Math.max(a[0], n[0]),
                        t[1] = Math.max(a[1], n[1]),
                        t
                }
                ,
                o.scale = function (t, a, n) {
                    return t[0] = a[0] * n,
                        t[1] = a[1] * n,
                        t
                }
                ,
                o.scaleAndAdd = function (t, a, n, r) {
                    return t[0] = a[0] + n[0] * r,
                        t[1] = a[1] + n[1] * r,
                        t
                }
                ,
                o.distance = function (t, a) {
                    var n = a[0] - t[0]
                        , r = a[1] - t[1];
                    return Math.sqrt(n * n + r * r)
                }
                ,
                o.dist = o.distance,
                o.squaredDistance = function (t, a) {
                    var n = a[0] - t[0]
                        , r = a[1] - t[1];
                    return n * n + r * r
                }
                ,
                o.sqrDist = o.squaredDistance,
                o.length = function (t) {
                    var a = t[0]
                        , n = t[1];
                    return Math.sqrt(a * a + n * n)
                }
                ,
                o.len = o.length,
                o.squaredLength = function (t) {
                    var a = t[0]
                        , n = t[1];
                    return a * a + n * n
                }
                ,
                o.sqrLen = o.squaredLength,
                o.negate = function (t, a) {
                    return t[0] = -a[0],
                        t[1] = -a[1],
                        t
                }
                ,
                o.inverse = function (t, a) {
                    return t[0] = 1 / a[0],
                        t[1] = 1 / a[1],
                        t
                }
                ,
                o.normalize = function (t, a) {
                    var n = a[0]
                        , r = a[1]
                        , o = n * n + r * r;
                    return o > 0 && (o = 1 / Math.sqrt(o),
                        t[0] = a[0] * o,
                        t[1] = a[1] * o),
                        t
                }
                ,
                o.dot = function (t, a) {
                    return t[0] * a[0] + t[1] * a[1]
                }
                ,
                o.cross = function (t, a, n) {
                    var r = a[0] * n[1] - a[1] * n[0];
                    return t[0] = t[1] = 0,
                        t[2] = r,
                        t
                }
                ,
                o.lerp = function (t, a, n, r) {
                    var o = a[0]
                        , l = a[1];
                    return t[0] = o + r * (n[0] - o),
                        t[1] = l + r * (n[1] - l),
                        t
                }
                ,
                o.random = function (t, a) {
                    a = a || 1;
                    var n = 2 * r.RANDOM() * Math.PI;
                    return t[0] = Math.cos(n) * a,
                        t[1] = Math.sin(n) * a,
                        t
                }
                ,
                o.transformMat2 = function (t, a, n) {
                    var r = a[0]
                        , o = a[1];
                    return t[0] = n[0] * r + n[2] * o,
                        t[1] = n[1] * r + n[3] * o,
                        t
                }
                ,
                o.transformMat2d = function (t, a, n) {
                    var r = a[0]
                        , o = a[1];
                    return t[0] = n[0] * r + n[2] * o + n[4],
                        t[1] = n[1] * r + n[3] * o + n[5],
                        t
                }
                ,
                o.transformMat3 = function (t, a, n) {
                    var r = a[0]
                        , o = a[1];
                    return t[0] = n[0] * r + n[3] * o + n[6],
                        t[1] = n[1] * r + n[4] * o + n[7],
                        t
                }
                ,
                o.transformMat4 = function (t, a, n) {
                    var r = a[0]
                        , o = a[1];
                    return t[0] = n[0] * r + n[4] * o + n[12],
                        t[1] = n[1] * r + n[5] * o + n[13],
                        t
                }
                ,
                o.forEach = function () {
                    var t = o.create();
                    return function (a, n, r, o, l, u) {
                        var e, M;
                        for (n || (n = 2),
                            r || (r = 0),
                            M = o ? Math.min(o * n + r, a.length) : a.length,
                            e = r; M > e; e += n)
                            t[0] = a[e],
                                t[1] = a[e + 1],
                                l(t, t, u),
                                a[e] = t[0],
                                a[e + 1] = t[1];
                        return a
                    }
                }(),
                o.str = function (t) {
                    return "vec2(" + t[0] + ", " + t[1] + ")"
                }
                ,
                t.exports = o
        }
    ])
});


/// end of gl-matrix-min ///

// function getQueryVariable(variable) {
//     var query = window.location.search.substring(1);
//     var vars = query.split("&");
//     for (var i = 0; i < vars.length; i++) {
//         var pair = vars[i].split("=");
//         if (pair[0] == variable) {
//             return unescape(pair[1]);
//         }
//     }
//     return null;
// }

// // Set up basic GL State up front
function initGL(gl, canvas) {
    //     gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //     gl.clearDepth(1.0);

    //     gl.enable(gl.DEPTH_TEST);
    //     gl.enable(gl.BLEND);
    //     gl.enable(gl.CULL_FACE);

    //     leftViewMat = mat4.create();
    //     rightViewMat = mat4.create();
    //     projMat = mat4.create();

    //     leftViewport = { x: 0, y: 0, width: 0, height: 0 };
    //     rightViewport = { x: 0, y: 0, width: 0, height: 0 };

    //     initMap(gl);
}

// // Load the map
// function initMap(gl) {
//     var titleEl = document.getElementById("mapTitle");
//     titleEl.innerHtml = mapName.toUpperCase();

//     var tesselation = getQueryVariable("tesselate");
//     if (tesselation) {
//         tesselation = parseInt(tesselation, 10);
//     }

//     var vrMode = getQueryVariable("vrDrawMode");
//     if (vrMode) {
//         vrDrawMode = parseInt(vrMode, 10);
//     }

//     map = new q3bsp(gl);
//     map.onentitiesloaded = initMapEntities;
//     map.onbsp = initPlayerMover;
//     //map.onsurfaces = initSurfaces;
//     map.loadShaders(mapShaders);
//     map.load('maps/' + mapName + '.bsp', tesselation);
// }

// // Process entities loaded from the map
// function initMapEntities(entities) {
//     respawnPlayer(0);
// }

// function initPlayerMover(bsp) {
//     playerMover = new q3movement(bsp);
//     respawnPlayer(0);
//     document.getElementById('viewport').style.display = 'block';
//     onResize();
// }

let lastIndex = 0;
// // "Respawns" the player at a specific spawn point. Passing -1 will move the player to the next spawn point.
function respawnPlayer(index) {
    if (map.entities && playerMover) {
        if (index == -1) {
            index = (lastIndex + 1) % map.entities.info_player_deathmatch.length;
        }
        lastIndex = index;

        var spawnPoint = map.entities.info_player_deathmatch[index];
        playerMover.position = [
            spawnPoint.origin[0],
            spawnPoint.origin[1],
            spawnPoint.origin[2] + 30 // Start a little ways above the floor
        ];

        playerMover.velocity = [0, 0, 0];

        zAngle = -(spawnPoint.angle || 0) * (3.1415 / 180) + (3.1415 * 0.5); // Negative angle in radians + 90 degrees
        xAngle = 0;
    }
}

function eulerFromQuaternion(out, q, order) {
    function clamp(value, min, max) {
        return (value < min ? min : (value > max ? max : value));
    }
    // Borrowed from Three.JS :)
    // q is assumed to be normalized
    // http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
    var sqx = q[0] * q[0];
    var sqy = q[1] * q[1];
    var sqz = q[2] * q[2];
    var sqw = q[3] * q[3];

    if (order === 'XYZ') {
        out[0] = Math.atan2(2 * (q[0] * q[3] - q[1] * q[2]), (sqw - sqx - sqy + sqz));
        out[1] = Math.asin(clamp(2 * (q[0] * q[2] + q[1] * q[3]), -1, 1));
        out[2] = Math.atan2(2 * (q[2] * q[3] - q[0] * q[1]), (sqw + sqx - sqy - sqz));
    } else if (order === 'YXZ') {
        out[0] = Math.asin(clamp(2 * (q[0] * q[3] - q[1] * q[2]), -1, 1));
        out[1] = Math.atan2(2 * (q[0] * q[2] + q[1] * q[3]), (sqw - sqx - sqy + sqz));
        out[2] = Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), (sqw - sqx + sqy - sqz));
    } else if (order === 'ZXY') {
        out[0] = Math.asin(clamp(2 * (q[0] * q[3] + q[1] * q[2]), -1, 1));
        out[1] = Math.atan2(2 * (q[1] * q[3] - q[2] * q[0]), (sqw - sqx - sqy + sqz));
        out[2] = Math.atan2(2 * (q[2] * q[3] - q[0] * q[1]), (sqw - sqx + sqy - sqz));
    } else if (order === 'ZYX') {
        out[0] = Math.atan2(2 * (q[0] * q[3] + q[2] * q[1]), (sqw - sqx - sqy + sqz));
        out[1] = Math.asin(clamp(2 * (q[1] * q[3] - q[0] * q[2]), -1, 1));
        out[2] = Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), (sqw + sqx - sqy - sqz));
    } else if (order === 'YZX') {
        out[0] = Math.atan2(2 * (q[0] * q[3] - q[2] * q[1]), (sqw - sqx + sqy - sqz));
        out[1] = Math.atan2(2 * (q[1] * q[3] - q[0] * q[2]), (sqw + sqx - sqy - sqz));
        out[2] = Math.asin(clamp(2 * (q[0] * q[1] + q[2] * q[3]), -1, 1));
    } else if (order === 'XZY') {
        out[0] = Math.atan2(2 * (q[0] * q[3] + q[1] * q[2]), (sqw - sqx + sqy - sqz));
        out[1] = Math.atan2(2 * (q[0] * q[2] + q[1] * q[3]), (sqw + sqx - sqy - sqz));
        out[2] = Math.asin(clamp(2 * (q[2] * q[3] - q[0] * q[1]), -1, 1));
    } else {
        console.log('No order given for quaternion to euler conversion.');
        return;
    }
}

// var lastMove = 0;

// function onFrame(gl, event) {
//     if (!map || !playerMover) { return; }

//     // Update VR pose if needed
//     if (vrDisplay) {
//         vrDisplay.getFrameData(vrFrameData);
//         vrPose = vrFrameData.pose;
//     }

//     // Update player movement @ 60hz
//     // The while ensures that we update at a fixed rate even if the rendering bogs down
//     while (event.elapsed - lastMove >= 16) {
//         updateInput(16);
//         lastMove += 16;
//     }

//     // For great laggage!
//     for (var i = 0; i < REPEAT_FRAMES; ++i)
//         drawFrame(gl);

//     if (vrDisplay && vrDisplay.isPresenting)
//         vrDisplay.submitFrame(vrPose);
// }

// var poseMatrix = mat4.create();

// function getViewMatrix(out, pose, eye) {
//     mat4.identity(out);

//     mat4.translate(out, out, playerMover.position);
//     //if (!vrDisplay || !vrDisplay.stageParameters)
//     mat4.translate(out, out, [0, 0, playerHeight]);
//     mat4.rotateZ(out, out, -zAngle);
//     mat4.rotateX(out, out, Math.PI / 2);

//     if (pose) {
//         var orientation = pose.orientation;
//         var position = pose.position;
//         if (!orientation) { orientation = [0, 0, 0, 1]; }
//         if (!position) { position = [0, 0, 0]; }

//         mat4.fromRotationTranslation(poseMatrix, orientation, [
//             position[0] * vrIPDScale,
//             position[1] * vrIPDScale,
//             position[2] * vrIPDScale
//         ]);
//         /*if (vrDisplay.stageParameters) {
//           mat4.multiply(poseMatrix, vrDisplay.stageParameters.sittingToStandingTransform, out);
//         }*/

//         if (eye) {
//             mat4.translate(poseMatrix, poseMatrix, [eye.offset[0] * vrIPDScale, eye.offset[1] * vrIPDScale, eye.offset[2] * vrIPDScale]);
//         }

//         mat4.multiply(out, out, poseMatrix);
//     }

//     mat4.rotateX(out, out, -xAngle);

//     mat4.invert(out, out);
// }

// // Draw a single frame
// function drawFrame(gl) {
//     // Clear back buffer but not color buffer (we expect the entire scene to be overwritten)
//     gl.depthMask(true);
//     gl.clear(gl.DEPTH_BUFFER_BIT);

//     if (!map || !playerMover) { return; }

//     if (!isVRPresenting()) {
//         // Matrix setup
//         getViewMatrix(leftViewMat, vrPose);

//         // Here's where all the magic happens...
//         map.draw(leftViewMat, projMat);
//     } else if (vrDrawMode == 1) {
//         var canvas = document.getElementById("viewport");
//         leftViewport.width = canvas.width / 2.0;
//         leftViewport.height = canvas.height;

//         rightViewport.x = canvas.width / 2.0;
//         rightViewport.width = canvas.width / 2.0;
//         rightViewport.height = canvas.height;

//         var leftEye = vrDisplay.getEyeParameters("left");
//         var rightEye = vrDisplay.getEyeParameters("right");

//         getViewMatrix(leftViewMat, vrPose, leftEye);
//         getViewMatrix(rightViewMat, vrPose, rightEye);

//         map.draw(leftViewMat, vrFrameData.leftProjectionMatrix, leftViewport,
//             rightViewMat, vrFrameData.rightProjectionMatrix, rightViewport);
//     } else {
//         var canvas = document.getElementById("viewport");

//         var leftEye = vrDisplay.getEyeParameters("left");
//         var rightEye = vrDisplay.getEyeParameters("right");

//         // Left Eye
//         gl.viewport(0, 0, canvas.width / 2.0, canvas.height);
//         getViewMatrix(leftViewMat, vrPose, leftEye);

//         map.draw(leftViewMat, vrFrameData.leftProjectionMatrix);

//         // Right Eye
//         gl.viewport(canvas.width / 2.0, 0, canvas.width / 2.0, canvas.height);
//         getViewMatrix(rightViewMat, vrPose, rightEye);

//         map.draw(rightViewMat, vrFrameData.rightProjectionMatrix);
//     }
// }

// var pressed = new Array(128);
var cameraMat = mat4.create();

function moveLookLocked(xDelta, yDelta) {
    zAngle += xDelta * 0.0025;
    while (zAngle < 0)
        zAngle += Math.PI * 2;
    while (zAngle >= Math.PI * 2)
        zAngle -= Math.PI * 2;

    if (!isVRPresenting()) {
        xAngle += yDelta * 0.0025;
        while (xAngle < -Math.PI * 0.5)
            xAngle = -Math.PI * 0.5;
        while (xAngle > Math.PI * 0.5)
            xAngle = Math.PI * 0.5;
    }
}

// function filterDeadzone(value) {
//     return Math.abs(value) > 0.35 ? value : 0;
// }
declare let vec3;
var vrEuler = vec3.create();

function moveViewOriented(dir, frameTime) {
    if (dir[0] !== 0 || dir[1] !== 0 || dir[2] !== 0) {
        mat4.identity(cameraMat);
        if (vrPose) {
            eulerFromQuaternion(vrEuler, vrPose.orientation, 'YXZ');
            mat4.rotateZ(cameraMat, cameraMat, zAngle - vrEuler[1]);
        } else {
            mat4.rotateZ(cameraMat, cameraMat, zAngle);
        }
        mat4.invert(cameraMat, cameraMat);

        vec3.transformMat4(dir, dir, cameraMat);
    }

    // Send desired movement direction to the player mover for collision detection against the map
    playerMover.move(dir, frameTime);
}

// function updateInput(frameTime) {
//     if (!playerMover) { return; }

//     var dir = [0, 0, 0];

//     // This is our first person movement code. It's not really pretty, but it works
//     if (pressed['W'.charCodeAt(0)]) {
//         dir[1] += 1;
//     }
//     if (pressed['S'.charCodeAt(0)]) {
//         dir[1] -= 1;
//     }
//     if (pressed['A'.charCodeAt(0)]) {
//         dir[0] -= 1;
//     }
//     if (pressed['D'.charCodeAt(0)]) {
//         dir[0] += 1;
//     }

//     var gamepads = [];
//     if (navigator.getGamepads) {
//         gamepads = navigator.getGamepads();
//     } else if (navigator.webkitGetGamepads) {
//         gamepads = navigator.webkitGetGamepads();
//     }

//     for (var i = 0; i < gamepads.length; ++i) {
//         var pad = gamepads[i];
//         if (pad) {
//             dir[0] += filterDeadzone(pad.axes[0]);
//             dir[1] -= filterDeadzone(pad.axes[1]);

//             moveLookLocked(
//                 filterDeadzone(pad.axes[2]) * 25.0,
//                 filterDeadzone(pad.axes[3]) * 25.0
//             );

//             for (var j = 0; j < Math.min(pad.buttons.length, 4); ++j) {
//                 var button = pad.buttons[j];
//                 if (typeof (button) == "number" && button == 1.0) {
//                     playerMover.jump();
//                 } else if (button.pressed) {
//                     playerMover.jump();
//                 }
//             }
//         }
//     }

//     moveViewOriented(dir, frameTime);
// }

declare let pressed;
// // Set up event handling
function initEvents() {
    var movingModel = false;
    var lastX = 0;
    var lastY = 0;
    var lastMoveX = 0;
    var lastMoveY = 0;
    var viewport = document.getElementById("viewport");
    var viewportFrame = document.getElementById("viewport-frame");

    document.addEventListener("keydown", function (event) {
        if (event.keyCode == 32 && !pressed[32]) {
            playerMover.jump();
        }
        pressed[event.keyCode] = true;
        if ((event.keyCode == 'W'.charCodeAt(0) ||
            event.keyCode == 'S'.charCodeAt(0) ||
            event.keyCode == 'A'.charCodeAt(0) ||
            event.keyCode == 'D'.charCodeAt(0) ||
            event.keyCode == 32) && !event.ctrlKey) {
            event.preventDefault();
        }
    }, false);

    document.addEventListener("keypress", function (event) {
        if (event.charCode == 'R'.charCodeAt(0) || event.charCode == 'r'.charCodeAt(0)) {
            respawnPlayer(-1);
        }
        if (event.charCode == 'C'.charCodeAt(0) || event.charCode == 'c'.charCodeAt(0)) {
            if (vrDisplay) {
                vrDisplay.resetPose();
            }
        }
    }, false);

    document.addEventListener("keyup", function (event) {
        pressed[event.keyCode] = false;
    }, false);

    function startLook(x, y) {
        movingModel = true;

        lastX = x;
        lastY = y;
    }

    function endLook() {
        movingModel = false;
    }

    function moveLook(x, y) {
        var xDelta = x - lastX;
        var yDelta = y - lastY;
        lastX = x;
        lastY = y;

        if (movingModel) {
            moveLookLocked(xDelta, yDelta);
        }
    }

    function startMove(x, y) {
        lastMoveX = x;
        lastMoveY = y;
    }

    function moveUpdate(x, y, frameTime) {
        var xDelta = x - lastMoveX;
        var yDelta = y - lastMoveY;
        lastMoveX = x;
        lastMoveY = y;

        var dir = [xDelta, yDelta * -1, 0];

        moveViewOriented(dir, frameTime * 2);
    }

    viewport.addEventListener("click", function (event) {
        viewport.requestPointerLock();
    }, false);

    // Mouse handling code
    // When the mouse is pressed it rotates the players view
    viewport.addEventListener("mousedown", function (event) {
        if (event.which == 1) {
            startLook(event.pageX, event.pageY);
        }
    }, false);
    viewport.addEventListener("mouseup", function (event) {
        endLook();
    }, false);
    viewportFrame.addEventListener("mousemove", function (event) {
        if (document.pointerLockElement) {
            moveLookLocked(event.movementX, event.movementY);
        } else {
            moveLook(event.pageX, event.pageY);
        }
    }, false);

    // Touch handling code
    viewport.addEventListener('touchstart', function (event) {
        var touches = event.touches;
        switch (touches.length) {
            case 1: // Single finger looks around
                startLook(touches[0].pageX, touches[0].pageY);
                break;
            case 2: // Two fingers moves
                startMove(touches[0].pageX, touches[0].pageY);
                break;
            case 3: // Three finger tap jumps
                playerMover.jump();
                break;
            default:
                return;
        }
        event.stopPropagation();
        event.preventDefault();
    }, false);
    viewport.addEventListener('touchend', function (event) {
        endLook();
        return false;
    }, false);
    viewport.addEventListener('touchmove', function (event) {
        var touches = event.touches;
        switch (touches.length) {
            case 1:
                moveLook(touches[0].pageX, touches[0].pageY);
                break;
            case 2:
                moveUpdate(touches[0].pageX, touches[0].pageY, 16);
                break;
            default:
                return;
        }
        event.stopPropagation();
        event.preventDefault();
    }, false);
}

// // Utility function that tests a list of webgl contexts and returns when one can be created
// // Hopefully this future-proofs us a bit
function getAvailableContext(canvas, contextList) {
    if (canvas.getContext) {
        for (var i = 0; i < contextList.length; ++i) {
            try {
                var context = canvas.getContext(contextList[i], { antialias: false });
                if (context !== null)
                    return context;
            } catch (ex) { }
        }
    }
    return null;
}

function renderLoop(gl, stats) {
    //     var startTime = new Date().getTime();
    //     var lastTimestamp = startTime;
    //     var lastFps = startTime;

    //     var frameId = 0;

    //     function onRequestedFrame() {
    //         timestamp = new Date().getTime();

    //         if (vrDisplay && vrDisplay.isPresenting) {
    //             vrDisplay.requestAnimationFrame(onRequestedFrame);
    //         } else {
    //             window.requestAnimationFrame(onRequestedFrame);
    //         }

    //         frameId++;
    //         if (SKIP_FRAMES != 0 && frameId % SKIP_FRAMES != 0)
    //             return;

    //         stats.begin();

    //         onFrame(gl, {
    //             timestamp: timestamp,
    //             elapsed: timestamp - startTime,
    //             frameTime: timestamp - lastTimestamp
    //         });

    //         stats.end();
    //     }
    //     window.requestAnimationFrame(onRequestedFrame);
}

declare var mat4;
declare var getVRDisplays;
// declare var Stats;

// import * as Stats from "./util/stats"

// Stats();



/// function test
declare var appendChild;

var Stats = function () {
    console.log("export check");
    var l = Date.now()
        , m = l
        , g = 0
        , n = Infinity
        , o = 0
        , h = 0
        , p = Infinity
        , q = 0
        , r = 0
        , s = 0
        , f = document.createElement("div");
    f.id = "stats";
    f.addEventListener("mousedown", function (b) {
        b.preventDefault();
        t(++s % 2)
    }, !1);
    f.style.cssText = "width:80px;opacity:0.9;cursor:pointer";
    var a = document.createElement("div");
    a.id = "fps";
    a.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#002";
    f.appendChild(a);
    var i = document.createElement("div");
    i.id = "fpsText";
    i.style.cssText = "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
    i.innerHTML = "FPS";
    a.appendChild(i);
    var c = document.createElement("div");
    c.id = "fpsGraph";
    c.style.cssText = "position:relative;width:74px;height:30px;background-color:#0ff";
    for (a.appendChild(c); 74 > c.children.length;) {
        var j = document.createElement("span");
        j.style.cssText = "width:1px;height:30px;float:left;background-color:#113";
        c.appendChild(j)
    }
    var d = document.createElement("div");
    d.id = "ms";
    d.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";
    f.appendChild(d);
    var k = document.createElement("div");
    k.id = "msText";
    k.style.cssText = "color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
    k.innerHTML = "MS";
    d.appendChild(k);
    var e = document.createElement("div");
    e.id = "msGraph";
    e.style.cssText = "position:relative;width:74px;height:30px;background-color:#0f0";
    for (d.appendChild(e); 74 > e.children.length;)
        j = document.createElement("span"),
            j.style.cssText = "width:1px;height:30px;float:left;background-color:#131",
            e.appendChild(j);
    var t = function (b) {
        s = b;
        switch (s) {
            case 0:
                a.style.display = "block";
                d.style.display = "none";
                break;
            case 1:
                a.style.display = "none",
                    d.style.display = "block"
        }
    };
    return {
        REVISION: 12,
        domElement: f,
        setMode: t,
        begin: function () {
            l = Date.now()
        },
        end: function () {
            var b = Date.now();
            g = b - l;
            n = Math.min(n, g);
            o = Math.max(o, g);
            k.textContent = g + " MS (" + n + "-" + o + ")";
            var a = Math.min(30, 30 - 30 * (g / 200));
            // e.appendChild(e.firstChild).style.height = a + "px";
            // e.appendChild(e.firstChild).style.height = a + "px";
            r++;
            b > m + 1E3 && (h = Math.round(1E3 * r / (b - m)),
                p = Math.min(p, h),
                q = Math.max(q, h),
                i.textContent = h + " FPS (" + p + "-" + q + ")",
                a = Math.min(30, 30 - 30 * (h / 100)),
                // c.appendChild(c.firstChild).style.height = a + "px",
                m = b,
                r = 0);
            return b
        },
        update: function () {
            l = this.end()
        }
    }
};
"object" === typeof module && (module.exports = Stats);

/// end of function test


function main() {
    // var stats = new Stats();
    var stats = Stats();
    document.getElementById("viewport-frame").appendChild(stats.domElement);

    var canvas: any = document.getElementById("viewport");

    // Get the GL Context (try 'webgl' first, then fallback)
    var gl = getAvailableContext(canvas, ['webgl', 'experimental-webgl']);

    onResize = function () {
        if (vrDisplay && vrDisplay.isPresenting) {
            var leftEye = vrDisplay.getEyeParameters("left");
            var rightEye = vrDisplay.getEyeParameters("right");

            canvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
            canvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
        } else {
            var devicePixelRatio = window.devicePixelRatio || 1;

            if (document.fullscreenElement) {
                canvas.width = screen.width * devicePixelRatio;
                canvas.height = screen.height * devicePixelRatio;
            } else {
                canvas.width = canvas.clientWidth * devicePixelRatio;
                canvas.height = canvas.clientHeight * devicePixelRatio;
            }

            if (!isVRPresenting()) {
                gl.viewport(0, 0, canvas.width, canvas.height);
                mat4.perspective(projMat, 45.0, canvas.width / canvas.height, 1.0, 4096.0);
            }
        }
    }

    if (!gl) {
        document.getElementById('viewport-frame').style.display = 'none';
        document.getElementById('webgl-error').style.display = 'block';
    } else {
        document.getElementById('viewport-info').style.display = 'block';
        initEvents();
        initGL(gl, canvas);
        renderLoop(gl, stats);
    }

    onResize();
    window.addEventListener("resize", onResize, false);

    var showFPS: any = document.getElementById("showFPS");
    showFPS.addEventListener("change", function () {
        stats.domElement.style.display = showFPS.checked ? "block" : "none";
    });

    function EnumerateVRDisplays(displays) {
        if (displays.length > 0) {
            vrDisplay = displays[0];

            vrDisplay.depthNear = 1.0;
            vrDisplay.depthFar = 4096.0;

            vrFrameData = new vrFrameData();
            // vrFrameData = new VRFrameData();

            var vrToggle = document.getElementById("vrToggle");
            vrToggle.style.display = "block";
            var mobileVrBtn = document.getElementById("mobileVrBtn");
            mobileVrBtn.style.display = "block";

            // Handle VR presentation change
            window.addEventListener("vrdisplaypresentchange", function () {
                onResize();
            }, false);
        }
    }

    if ((<any>navigator).getVRDisplays) {
        (<any>navigator).getVRDisplays().then(EnumerateVRDisplays);
    }

    /*var playMusic = document.getElementById("playMusic");
    playMusic.addEventListener("change", function() {
        if(map) {
            map.playMusic(playMusic.checked);
        }
    });*/

    // Handle fullscreen transition
    var viewportFrame = document.getElementById("viewport-frame");
    var viewport = document.getElementById("viewport");
    document.addEventListener("fullscreenchange", function () {
        if (document.fullscreenElement) {
            viewport.requestPointerLock(); // Attempt to lock the mouse automatically on fullscreen
        }
        onResize();
    }, false);

    // Fullscreen
    function goFullscreen() {
        // viewportFrame.requestFullScreen();
        viewportFrame.requestFullscreen();
    }
    var fullscreenButton = document.getElementById('fullscreenBtn');
    var mobileFullscreenBtn = document.getElementById("mobileFullscreenBtn");
    fullscreenButton.addEventListener('click', goFullscreen, false);
    mobileFullscreenBtn.addEventListener('click', goFullscreen, false);

    // VR
    function presentVR() {
        if (vrDisplay.isPresenting) {
            vrDisplay.exitPresent();
        } else {
            xAngle = 0.0;
            vrDisplay.requestPresent([{ source: viewport }]);
        }
    }
    var vrBtn = document.getElementById("vrBtn");
    var mobileVrBtn = document.getElementById("mobileVrBtn");
    vrBtn.addEventListener("click", presentVR, false);
    mobileVrBtn.addEventListener("click", presentVR, false);

}
window.addEventListener("load", main); // Fire this once the page is loaded up