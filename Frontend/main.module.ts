// let i: number = 2;
// console.log(i);
/// main ///

import {
    NavigatorTemp,
    HTMLElementTemp
} from "./models/index";

var mapShaders = ['scripts/web_demo.shader'];
let mapName = 'q3tourney2';

// // ===========================================
// Everything below here is common to all maps
let leftViewMat, rightViewMat, projMat;
let leftViewport, rightViewport;
let activeShader;
let map, playerMover;
let mobileSite = false;

let zAngle = 3;
let xAngle = 0;
let cameraPosition = [0, 0, 0];
let onResize = null;

// VR Globals
let vrDisplay = null;

// These values are in meters
let playerHeight = 57; // Roughly where my eyes sit (1.78 meters off the ground)
let vrIPDScale = 32.0; // There are 32 units per meter in Quake 3
let vrFrameData = null;
let vrPose = null;

let vrDrawMode = 0;

let SKIP_FRAMES = 0;
let REPEAT_FRAMES = 1;


function isVRPresenting() {
    return (vrDisplay && vrDisplay.isPresenting);
}

declare let unescape;

function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return unescape(pair[1]);
        }
    }
    return null;
}


// Load the map
function initMap(gl) {
    var titleEl = document.getElementById("mapTitle");
    titleEl.innerHtml = mapName.toUpperCase();

    var tesselation = getQueryVariable("tesselate");
    if (tesselation) {
        tesselation = parseInt(tesselation, 10);
    }

    var vrMode = getQueryVariable("vrDrawMode");
    if (vrMode) {
        vrDrawMode = parseInt(vrMode, 10);
    }

    map = new q3bsp(gl);
    map.onentitiesloaded = initMapEntities;
    map.onbsp = initPlayerMover;
    //map.onsurfaces = initSurfaces;
    map.loadShaders(mapShaders);
    map.load('maps/' + mapName + '.bsp', tesselation);
}

// Process entities loaded from the map
function initMapEntities(entities) {
    respawnPlayer(0);
}

declare let q3movement;

function initPlayerMover(bsp) {
    playerMover = new q3movement(bsp);
    respawnPlayer(0);
    document.getElementById('viewport').style.display = 'block';
    onResize();
}

var lastIndex = 0;
// "Respawns" the player at a specific spawn point. Passing -1 will move the player to the next spawn point.
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

var lastMove = 0;

function onFrame(gl, event) {
    if (!map || !playerMover) { return; }

    // Update VR pose if needed
    if (vrDisplay) {
        vrDisplay.getFrameData(vrFrameData);
        vrPose = vrFrameData.pose;
    }

    // Update player movement @ 60hz
    // The while ensures that we update at a fixed rate even if the rendering bogs down
    while (event.elapsed - lastMove >= 16) {
        updateInput(16);
        lastMove += 16;
    }

    // For great laggage!
    for (var i = 0; i < REPEAT_FRAMES; ++i)
        drawFrame(gl);

    if (vrDisplay && vrDisplay.isPresenting)
        vrDisplay.submitFrame(vrPose);
}

declare let mat4;

var poseMatrix = mat4.create();

function getViewMatrix(out, pose, eye) {
    mat4.identity(out);

    mat4.translate(out, out, playerMover.position);
    //if (!vrDisplay || !vrDisplay.stageParameters)
    mat4.translate(out, out, [0, 0, playerHeight]);
    mat4.rotateZ(out, out, -zAngle);
    mat4.rotateX(out, out, Math.PI / 2);

    if (pose) {
        var orientation = pose.orientation;
        var position = pose.position;
        if (!orientation) { orientation = [0, 0, 0, 1]; }
        if (!position) { position = [0, 0, 0]; }

        mat4.fromRotationTranslation(poseMatrix, orientation, [
            position[0] * vrIPDScale,
            position[1] * vrIPDScale,
            position[2] * vrIPDScale
        ]);
        /*if (vrDisplay.stageParameters) {
          mat4.multiply(poseMatrix, vrDisplay.stageParameters.sittingToStandingTransform, out);
        }*/

        if (eye) {
            mat4.translate(poseMatrix, poseMatrix, [eye.offset[0] * vrIPDScale, eye.offset[1] * vrIPDScale, eye.offset[2] * vrIPDScale]);
        }

        mat4.multiply(out, out, poseMatrix);
    }

    mat4.rotateX(out, out, -xAngle);

    mat4.invert(out, out);
}

declare var canvas: HTMLElementTemp;

// Draw a single frame
function drawFrame(gl) {
    // Clear back buffer but not color buffer (we expect the entire scene to be overwritten)
    gl.depthMask(true);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    if (!map || !playerMover) { return; }

    if (!isVRPresenting()) {
        // Matrix setup
        // getViewMatrix(leftViewMat, vrPose); // why only 2?
        getViewMatrix(leftViewMat, vrPose, "none"); // why only 2?

        // Here's where all the magic happens...
        map.draw(leftViewMat, projMat);
    } else if (vrDrawMode == 1) {
        var canvas = document.getElementById("viewport");
        // let canvasTemp: HTMLElementTemp = canvas; 

        leftViewport.width = canvas.width / 2.0;
        leftViewport.height = canvas.height;

        rightViewport.x = canvas.width / 2.0;
        rightViewport.width = canvas.width / 2.0;
        rightViewport.height = canvas.height;

        var leftEye = vrDisplay.getEyeParameters("left");
        var rightEye = vrDisplay.getEyeParameters("right");

        getViewMatrix(leftViewMat, vrPose, leftEye);
        getViewMatrix(rightViewMat, vrPose, rightEye);

        map.draw(leftViewMat, vrFrameData.leftProjectionMatrix, leftViewport,
            rightViewMat, vrFrameData.rightProjectionMatrix, rightViewport);
    } else {
        var canvas = document.getElementById("viewport");

        var leftEye = vrDisplay.getEyeParameters("left");
        var rightEye = vrDisplay.getEyeParameters("right");

        // Left Eye
        gl.viewport(0, 0, canvas.width / 2.0, canvas.height);
        getViewMatrix(leftViewMat, vrPose, leftEye);

        map.draw(leftViewMat, vrFrameData.leftProjectionMatrix);

        // Right Eye
        gl.viewport(canvas.width / 2.0, 0, canvas.width / 2.0, canvas.height);
        getViewMatrix(rightViewMat, vrPose, rightEye);

        map.draw(rightViewMat, vrFrameData.rightProjectionMatrix);
    }
}

var pressed = new Array(128);
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

function filterDeadzone(value) {
    return Math.abs(value) > 0.35 ? value : 0;
}

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

declare var navigator: NavigatorTemp;

function updateInput(frameTime) {
    if (!playerMover) { return; }

    var dir = [0, 0, 0];

    // This is our first person movement code. It's not really pretty, but it works
    if (pressed['W'.charCodeAt(0)]) {
        dir[1] += 1;
    }
    if (pressed['S'.charCodeAt(0)]) {
        dir[1] -= 1;
    }
    if (pressed['A'.charCodeAt(0)]) {
        dir[0] -= 1;
    }
    if (pressed['D'.charCodeAt(0)]) {
        dir[0] += 1;
    }

    var gamepads = [];
    if (navigator.getGamepads) {
        gamepads = navigator.getGamepads();
    } else if (navigator.webkitGetGamepads) {
        gamepads = navigator.webkitGetGamepads();
    }

    for (var i = 0; i < gamepads.length; ++i) {
        var pad = gamepads[i];
        if (pad) {
            dir[0] += filterDeadzone(pad.axes[0]);
            dir[1] -= filterDeadzone(pad.axes[1]);

            moveLookLocked(
                filterDeadzone(pad.axes[2]) * 25.0,
                filterDeadzone(pad.axes[3]) * 25.0
            );

            for (var j = 0; j < Math.min(pad.buttons.length, 4); ++j) {
                var button = pad.buttons[j];
                if (typeof (button) == "number" && button == 1.0) {
                    playerMover.jump();
                } else if (button.pressed) {
                    playerMover.jump();
                }
            }
        }
    }

    moveViewOriented(dir, frameTime);
}

// Set up event handling
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

// Utility function that tests a list of webgl contexts and returns when one can be created
// Hopefully this future-proofs us a bit
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

declare let timestamp;

function renderLoop(gl, stats) {
    var startTime = new Date().getTime();
    var lastTimestamp = startTime;
    var lastFps = startTime;

    var frameId = 0;

    function onRequestedFrame() {
        timestamp = new Date().getTime();

        if (vrDisplay && vrDisplay.isPresenting) {
            vrDisplay.requestAnimationFrame(onRequestedFrame);
        } else {
            window.requestAnimationFrame(onRequestedFrame);
        }

        frameId++;
        if (SKIP_FRAMES != 0 && frameId % SKIP_FRAMES != 0)
            return;

        stats.begin();

        onFrame(gl, {
            timestamp: timestamp,
            elapsed: timestamp - startTime,
            frameTime: timestamp - lastTimestamp
        });

        stats.end();
    }
    window.requestAnimationFrame(onRequestedFrame);
}

declare let Stats;

declare let VRFrameData;
declare let initGL;

function main() {
    var stats = new Stats();
    document.getElementById("viewport-frame").appendChild(stats.domElement);

    var canvas = document.getElementById("viewport");

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

    var showFPS = document.getElementById("showFPS");
    showFPS.addEventListener("change", function () {
        stats.domElement.style.display = showFPS.checked ? "block" : "none";
    });

    function EnumerateVRDisplays(displays) {
        if (displays.length > 0) {
            vrDisplay = displays[0];

            vrDisplay.depthNear = 1.0;
            vrDisplay.depthFar = 4096.0;

            vrFrameData = new VRFrameData();

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

    if (navigator.getVRDisplays) {
        navigator.getVRDisplays().then(EnumerateVRDisplays);
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

/// end of main ///

/// q3bsp_worker.js ///

/*
 * q3bsp_worker.js - Parses Quake 3 Maps (.bsp) for use in WebGL
 * This file is the threaded backend that does the main parsing and processing
 */

/*
 * Copyright (c) 2009 Brandon Jones
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

importScripts('./util/binary-file.js');
importScripts('./util/gl-matrix-min.2.3.2.js');

declare let q3bsp;
declare let q3shader;

onmessage = function (msg) {
    switch (msg.data.type) {
        case 'load':
            q3bsp.load(msg.data.url, msg.data.tesselationLevel, function () {
                // Fallback to account for Opera handling URLs in a worker 
                // differently than other browsers. 
                q3bsp.load("../" + msg.data.url, msg.data.tesselationLevel);
            });
            break;
        case 'loadShaders':
            q3shader.loadList(msg.data.sources);
            break;
        case 'trace':
            q3bsp.trace(msg.data.traceId, msg.data.start, msg.data.end, msg.data.radius, msg.data.slide);
            break;
        case 'visibility':
            q3bsp.buildVisibleList(q3bsp.getLeaf(msg.data.pos));
            break;
        default:
            throw 'Unexpected message type: ' + msg.data;
    }
};

// BSP Elements
var planes, nodes, leaves, faces;
var brushes, brushSides;
var leafFaces, leafBrushes;
var visBuffer, visSize;
var shaders; // This needs to be kept here for collision detection (indicates non-solid surfaces)

q3bsp = {};
declare let BinaryFile;

q3bsp.load = function (url, tesselationLevel, errorCallback) {
    var request = new XMLHttpRequest();

    request.addEventListener("load", function () {
        q3bsp.parse(new BinaryFile(request.responseText), tesselationLevel);
    }, false);

    request.open('GET', url, true);
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.setRequestHeader('Content-Type', 'text/plain');
    request.send(null);
};

declare let postMessage;
// Parses the BSP file
q3bsp.parse = function (src, tesselationLevel) {
    postMessage({
        type: 'status',
        message: 'Map downloaded, parsing level geometry...'
    });

    var header = q3bsp.readHeader(src);

    // Check for appropriate format
    if (header.tag != 'IBSP' || header.version != 46) {
        postMessage({
            type: 'status',
            message: 'Incompatible BSP version.'
        });

        return;
    }

    // Read map entities
    q3bsp.readEntities(header.lumps[0], src);

    // Load visual map components
    shaders = q3bsp.readShaders(header.lumps[1], src);
    var lightmaps = q3bsp.readLightmaps(header.lumps[14], src);
    var verts = q3bsp.readVerts(header.lumps[10], src);
    var meshVerts = q3bsp.readMeshVerts(header.lumps[11], src);
    faces = q3bsp.readFaces(header.lumps[13], src);

    q3bsp.compileMap(verts, faces, meshVerts, lightmaps, shaders, tesselationLevel);

    postMessage({
        type: 'status',
        message: 'Geometry compiled, parsing collision tree...'
    });

    // Load bsp components
    planes = q3bsp.readPlanes(header.lumps[2], src);
    nodes = q3bsp.readNodes(header.lumps[3], src);
    leaves = q3bsp.readLeaves(header.lumps[4], src);
    leafFaces = q3bsp.readLeafFaces(header.lumps[5], src);
    leafBrushes = q3bsp.readLeafBrushes(header.lumps[6], src);
    brushes = q3bsp.readBrushes(header.lumps[8], src);
    brushSides = q3bsp.readBrushSides(header.lumps[9], src);
    var visData = q3bsp.readVisData(header.lumps[16], src);
    visBuffer = visData.buffer;
    visSize = visData.size;

    postMessage({
        type: 'bsp',
        bsp: {
            planes: planes,
            nodes: nodes,
            leaves: leaves,
            leafFaces: leafFaces,
            leafBrushes: leafBrushes,
            brushes: brushes,
            brushSides: brushSides,
            surfaces: shaders,
            visBuffer: visBuffer,
            visSize: visSize
        }
    });


};

// Read all lump headers
q3bsp.readHeader = function (src) {
    // Read the magic number and the version
    var header = {
        tag: src.readString(4),
        version: src.readULong(),
        lumps: []
    };

    // Read the lump headers
    for (var i = 0; i < 17; ++i) {
        var lump = {
            offset: src.readULong(),
            length: src.readULong()
        };
        header.lumps.push(lump);
    }

    return header;
};

// Read all entity structures
q3bsp.readEntities = function (lump, src) {
    src.seek(lump.offset);
    var entities = src.readString(lump.length);

    var elements = {
        targets: {}
    };

    entities.replace(/\{([^}]*)\}/mg, function ($0, entitySrc) {
        var entity = {
            classname: 'unknown'
        };
        entitySrc.replace(/"(.+)" "(.+)"$/mg, function ($0, key, value) {
            switch (key) {
                case 'origin':
                    value.replace(/(.+) (.+) (.+)/, function ($0, x, y, z) {
                        entity[key] = [
                            parseFloat(x),
                            parseFloat(y),
                            parseFloat(z)
                        ];
                    });
                    break;
                case 'angle':
                    entity[key] = parseFloat(value);
                    break;
                default:
                    entity[key] = value;
                    break;
            }
        });

        if (entity['targetname']) {
            elements.targets[entity['targetname']] = entity;
        }

        if (!elements[entity.classname]) { elements[entity.classname] = []; }
        elements[entity.classname].push(entity);
    });

    // Send the compiled vertex/index data back to the render thread
    postMessage({
        type: 'entities',
        entities: elements
    });
};

// Read all shader structures
q3bsp.readShaders = function (lump, src) {
    var count = lump.length / 72;
    var elements = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        var shader = {
            shaderName: src.readString(64),
            flags: src.readLong(),
            contents: src.readLong(),
            shader: null,
            faces: [],
            indexOffset: 0,
            elementCount: 0,
            visible: true
        };

        elements.push(shader);
    }

    return elements;
};

// Scale up an RGB color
q3bsp.brightnessAdjust = function (color, factor) {
    var scale = 1.0, temp = 0.0;

    color[0] *= factor;
    color[1] *= factor;
    color[2] *= factor;

    if (color[0] > 255 && (temp = 255 / color[0]) < scale) { scale = temp; }
    if (color[1] > 255 && (temp = 255 / color[1]) < scale) { scale = temp; }
    if (color[2] > 255 && (temp = 255 / color[2]) < scale) { scale = temp; }

    color[0] *= scale;
    color[1] *= scale;
    color[2] *= scale;

    return color;
};

q3bsp.brightnessAdjustVertex = function (color, factor) {
    var scale = 1.0, temp = 0.0;

    color[0] *= factor;
    color[1] *= factor;
    color[2] *= factor;

    if (color[0] > 1 && (temp = 1 / color[0]) < scale) { scale = temp; }
    if (color[1] > 1 && (temp = 1 / color[1]) < scale) { scale = temp; }
    if (color[2] > 1 && (temp = 1 / color[2]) < scale) { scale = temp; }

    color[0] *= scale;
    color[1] *= scale;
    color[2] *= scale;

    return color;
};

// Read all lightmaps
q3bsp.readLightmaps = function (lump, src) {
    var lightmapSize = 128 * 128;
    var count = lump.length / (lightmapSize * 3);

    var gridSize = 2;

    while (gridSize * gridSize < count) {
        gridSize *= 2;
    }

    var textureSize = gridSize * 128;

    var xOffset = 0;
    var yOffset = 0;

    var lightmaps = [];
    var lightmapRects = [];
    var rgb = [0, 0, 0];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        var elements = new Array(lightmapSize * 4);

        for (var j = 0; j < lightmapSize * 4; j += 4) {
            rgb[0] = src.readUByte();
            rgb[1] = src.readUByte();
            rgb[2] = src.readUByte();

            q3bsp.brightnessAdjust(rgb, 4.0);

            elements[j] = rgb[0];
            elements[j + 1] = rgb[1];
            elements[j + 2] = rgb[2];
            elements[j + 3] = 255;
        }

        lightmaps.push({
            x: xOffset, y: yOffset,
            width: 128, height: 128,
            bytes: elements
        });

        lightmapRects.push({
            x: xOffset / textureSize,
            y: yOffset / textureSize,
            xScale: 128 / textureSize,
            yScale: 128 / textureSize
        });

        xOffset += 128;
        if (xOffset >= textureSize) {
            yOffset += 128;
            xOffset = 0;
        }
    }

    // Send the lightmap data back to the render thread
    postMessage({
        type: 'lightmap',
        size: textureSize,
        lightmaps: lightmaps
    });

    return lightmapRects;
};

q3bsp.readVerts = function (lump, src) {
    var count = lump.length / 44;
    var elements = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        elements.push({
            pos: [src.readFloat(), src.readFloat(), src.readFloat()],
            texCoord: [src.readFloat(), src.readFloat()],
            lmCoord: [src.readFloat(), src.readFloat()],
            lmNewCoord: [0, 0],
            normal: [src.readFloat(), src.readFloat(), src.readFloat()],
            color: q3bsp.brightnessAdjustVertex(q3bsp.colorToVec(src.readULong()), 4.0)
        });
    }

    return elements;
};

q3bsp.readMeshVerts = function (lump, src) {
    var count = lump.length / 4;
    var meshVerts = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        meshVerts.push(src.readLong());
    }

    return meshVerts;
};

// Read all face structures
q3bsp.readFaces = function (lump, src) {
    var faceCount = lump.length / 104;
    var faces = [];

    src.seek(lump.offset);
    for (var i = 0; i < faceCount; ++i) {
        var face = {
            shader: src.readLong(),
            effect: src.readLong(),
            type: src.readLong(),
            vertex: src.readLong(),
            vertCount: src.readLong(),
            meshVert: src.readLong(),
            meshVertCount: src.readLong(),
            lightmap: src.readLong(),
            lmStart: [src.readLong(), src.readLong()],
            lmSize: [src.readLong(), src.readLong()],
            lmOrigin: [src.readFloat(), src.readFloat(), src.readFloat()],
            lmVecs: [[src.readFloat(), src.readFloat(), src.readFloat()],
            [src.readFloat(), src.readFloat(), src.readFloat()]],
            normal: [src.readFloat(), src.readFloat(), src.readFloat()],
            size: [src.readLong(), src.readLong()],
            indexOffset: -1
        };

        faces.push(face);
    }

    return faces;
};

// Read all Plane structures
q3bsp.readPlanes = function (lump, src) {
    var count = lump.length / 16;
    var elements = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        elements.push({
            normal: [src.readFloat(), src.readFloat(), src.readFloat()],
            distance: src.readFloat()
        });
    }

    return elements;
};

// Read all Node structures
q3bsp.readNodes = function (lump, src) {
    var count = lump.length / 36;
    var elements = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        elements.push({
            plane: src.readLong(),
            children: [src.readLong(), src.readLong()],
            min: [src.readLong(), src.readLong(), src.readLong()],
            max: [src.readLong(), src.readLong(), src.readLong()]
        });
    }

    return elements;
};

// Read all Leaf structures
q3bsp.readLeaves = function (lump, src) {
    var count = lump.length / 48;
    var elements = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        elements.push({
            cluster: src.readLong(),
            area: src.readLong(),
            min: [src.readLong(), src.readLong(), src.readLong()],
            max: [src.readLong(), src.readLong(), src.readLong()],
            leafFace: src.readLong(),
            leafFaceCount: src.readLong(),
            leafBrush: src.readLong(),
            leafBrushCount: src.readLong()
        });
    }

    return elements;
};

// Read all Leaf Faces
q3bsp.readLeafFaces = function (lump, src) {
    var count = lump.length / 4;
    var elements = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        elements.push(src.readLong());
    }

    return elements;
};

// Read all Brushes
q3bsp.readBrushes = function (lump, src) {
    var count = lump.length / 12;
    var elements = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        elements.push({
            brushSide: src.readLong(),
            brushSideCount: src.readLong(),
            shader: src.readLong()
        });
    }

    return elements;
};

// Read all Leaf Brushes
q3bsp.readLeafBrushes = function (lump, src) {
    var count = lump.length / 4;
    var elements = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        elements.push(src.readLong());
    }

    return elements;
};

// Read all Brush Sides
q3bsp.readBrushSides = function (lump, src) {
    var count = lump.length / 8;
    var elements = [];

    src.seek(lump.offset);
    for (var i = 0; i < count; ++i) {
        elements.push({
            plane: src.readLong(),
            shader: src.readLong()
        });
    }

    return elements;
};

// Read all Vis Data
q3bsp.readVisData = function (lump, src) {
    src.seek(lump.offset);
    var vecCount = src.readLong();
    var size = src.readLong();

    var byteCount = vecCount * size;
    var elements = new Array(byteCount);

    for (var i = 0; i < byteCount; ++i) {
        elements[i] = src.readUByte();
    }

    return {
        buffer: elements,
        size: size
    };
};

q3bsp.colorToVec = function (color) {
    return [
        (color & 0xFF) / 0xFF,
        ((color & 0xFF00) >> 8) / 0xFF,
        ((color & 0xFF0000) >> 16) / 0xFF,
        1
    ];
};


//
// Compile the map into a stream of WebGL-compatible data
//

q3bsp.compileMap = function (verts, faces, meshVerts, lightmaps, shaders, tesselationLevel) {
    postMessage({
        type: 'status',
        message: 'Map geometry parsed, compiling...'
    });

    // Find associated shaders for all clusters

    // Per-face operations
    for (var i = 0; i < faces.length; ++i) {
        var face = faces[i];

        if (face.type == 1 || face.type == 2 || face.type == 3) {
            // Add face to the appropriate texture face list
            var shader = shaders[face.shader];
            shader.faces.push(face);
            var lightmap = lightmaps[face.lightmap];

            if (!lightmap) {
                lightmap = lightmaps[0];
            }

            if (face.type == 1 || face.type == 3) {
                shader.geomType = face.type;
                // Transform lightmap coords to match position in combined texture
                for (var j = 0; j < face.meshVertCount; ++j) {
                    var vert = verts[face.vertex + meshVerts[face.meshVert + j]];

                    vert.lmNewCoord[0] = (vert.lmCoord[0] * lightmap.xScale) + lightmap.x;
                    vert.lmNewCoord[1] = (vert.lmCoord[1] * lightmap.yScale) + lightmap.y;
                }
            } else {
                postMessage({
                    type: 'status',
                    message: 'Tesselating face ' + i + " of " + faces.length
                });
                // Build Bezier curve
                q3bsp.tesselate(face, verts, meshVerts, tesselationLevel);
                for (var j = 0; j < face.vertCount; ++j) {
                    var vert = verts[face.vertex + j];

                    vert.lmNewCoord[0] = (vert.lmCoord[0] * lightmap.xScale) + lightmap.x;
                    vert.lmNewCoord[1] = (vert.lmCoord[1] * lightmap.yScale) + lightmap.y;
                }
            }
        }
    }

    // Compile vert list
    var vertices = new Array(verts.length * 14);
    var offset = 0;
    for (var i = 0; i < verts.length; ++i) {
        var vert = verts[i];

        vertices[offset++] = vert.pos[0];
        vertices[offset++] = vert.pos[1];
        vertices[offset++] = vert.pos[2];

        vertices[offset++] = vert.texCoord[0];
        vertices[offset++] = vert.texCoord[1];

        vertices[offset++] = vert.lmNewCoord[0];
        vertices[offset++] = vert.lmNewCoord[1];

        vertices[offset++] = vert.normal[0];
        vertices[offset++] = vert.normal[1];
        vertices[offset++] = vert.normal[2];

        vertices[offset++] = vert.color[0];
        vertices[offset++] = vert.color[1];
        vertices[offset++] = vert.color[2];
        vertices[offset++] = vert.color[3];
    }

    // Compile index list
    var indices = new Array();
    for (var i = 0; i < shaders.length; ++i) {
        var shader = shaders[i];
        if (shader.faces.length > 0) {
            shader.indexOffset = indices.length * 2; // Offset is in bytes

            for (var j = 0; j < shader.faces.length; ++j) {
                var face = shader.faces[j];
                face.indexOffset = indices.length * 2;
                for (var k = 0; k < face.meshVertCount; ++k) {
                    indices.push(face.vertex + meshVerts[face.meshVert + k]);
                }
                shader.elementCount += face.meshVertCount;
            }
        }
        shader.faces = null; // Don't need to send this to the render thread.
    }

    // Send the compiled vertex/index data back to the render thread
    postMessage({
        type: 'geometry',
        vertices: vertices,
        indices: indices,
        surfaces: shaders
    });
};

//
// Curve Tesselation
//

q3bsp.getCurvePoint3 = function (c0, c1, c2, dist) {
    var a, b = 1.0 - dist;

    return vec3.add(
        a = vec3.add(
            a = vec3.scale([0, 0, 0], c0, (b * b)),
            a,
            vec3.scale([0, 0, 0], c1, (2 * b * dist))
        ),
        a,
        vec3.scale([0, 0, 0], c2, (dist * dist))
    );
};
declare let c30;
declare let c31;
declare let c32;
// This is kinda ugly. Clean it up at some point?
q3bsp.getCurvePoint2 = function (c0, c1, c2, dist) {
    var a, b = 1.0 - dist;

    c30 = [c0[0], c0[1], 0];
    c31 = [c1[0], c1[1], 0];
    c32 = [c2[0], c2[1], 0];

    var res = vec3.add(
        a = vec3.add(
            a = vec3.scale([0, 0, 0], c30, (b * b)),
            a,
            vec3.scale([0, 0, 0], c31, (2 * b * dist))
        ),
        a,
        vec3.scale([0, 0, 0], c32, (dist * dist))
    );

    return [res[0], res[1]];
};
declare let j;
q3bsp.tesselate = function (face, verts, meshVerts, level) {
    var off = face.vertex;
    var count = face.vertCount;

    var L1 = level + 1;

    face.vertex = verts.length;
    face.meshVert = meshVerts.length;

    face.vertCount = 0;
    face.meshVertCount = 0;

    for (var py = 0; py < face.size[1] - 2; py += 2) {
        for (var px = 0; px < face.size[0] - 2; px += 2) {

            var rowOff = (py * face.size[0]);

            // Store control points
            var c0 = verts[off + rowOff + px], c1 = verts[off + rowOff + px + 1], c2 = verts[off + rowOff + px + 2];
            rowOff += face.size[0];
            var c3 = verts[off + rowOff + px], c4 = verts[off + rowOff + px + 1], c5 = verts[off + rowOff + px + 2];
            rowOff += face.size[0];
            var c6 = verts[off + rowOff + px], c7 = verts[off + rowOff + px + 1], c8 = verts[off + rowOff + px + 2];

            var indexOff = face.vertCount;
            face.vertCount += L1 * L1;

            // Tesselate!
            for (var i = 0; i < L1; ++i) {
                var a = i / level;

                var pos = q3bsp.getCurvePoint3(c0.pos, c3.pos, c6.pos, a);
                var lmCoord = q3bsp.getCurvePoint2(c0.lmCoord, c3.lmCoord, c6.lmCoord, a);
                var texCoord = q3bsp.getCurvePoint2(c0.texCoord, c3.texCoord, c6.texCoord, a);
                var color = q3bsp.getCurvePoint3(c0.color, c3.color, c6.color, a);

                var vert = {
                    pos: pos,
                    texCoord: texCoord,
                    lmCoord: lmCoord,
                    color: [color[0], color[1], color[2], 1],
                    lmNewCoord: [0, 0],
                    normal: [0, 0, 1]
                };

                verts.push(vert);
            }

            for (var i = 1; i < L1; i++) {
                var a = i / level;

                var pc0 = q3bsp.getCurvePoint3(c0.pos, c1.pos, c2.pos, a);
                var pc1 = q3bsp.getCurvePoint3(c3.pos, c4.pos, c5.pos, a);
                var pc2 = q3bsp.getCurvePoint3(c6.pos, c7.pos, c8.pos, a);

                var tc0 = q3bsp.getCurvePoint3(c0.texCoord, c1.texCoord, c2.texCoord, a);
                var tc1 = q3bsp.getCurvePoint3(c3.texCoord, c4.texCoord, c5.texCoord, a);
                var tc2 = q3bsp.getCurvePoint3(c6.texCoord, c7.texCoord, c8.texCoord, a);

                var lc0 = q3bsp.getCurvePoint3(c0.lmCoord, c1.lmCoord, c2.lmCoord, a);
                var lc1 = q3bsp.getCurvePoint3(c3.lmCoord, c4.lmCoord, c5.lmCoord, a);
                var lc2 = q3bsp.getCurvePoint3(c6.lmCoord, c7.lmCoord, c8.lmCoord, a);

                var cc0 = q3bsp.getCurvePoint3(c0.color, c1.color, c2.color, a);
                var cc1 = q3bsp.getCurvePoint3(c3.color, c4.color, c5.color, a);
                var cc2 = q3bsp.getCurvePoint3(c6.color, c7.color, c8.color, a);

                for (j = 0; j < L1; j++) {
                    var b = j / level;

                    var pos = q3bsp.getCurvePoint3(pc0, pc1, pc2, b);
                    var texCoord = q3bsp.getCurvePoint2(tc0, tc1, tc2, b);
                    var lmCoord = q3bsp.getCurvePoint2(lc0, lc1, lc2, b);
                    var color = q3bsp.getCurvePoint3(cc0, cc1, cc2, a);

                    var vert = {
                        pos: pos,
                        texCoord: texCoord,
                        lmCoord: lmCoord,
                        color: [color[0], color[1], color[2], 1],
                        lmNewCoord: [0, 0],
                        normal: [0, 0, 1]
                    };

                    verts.push(vert);
                }
            }

            face.meshVertCount += level * level * 6;

            for (var row = 0; row < level; ++row) {
                for (var col = 0; col < level; ++col) {
                    meshVerts.push(indexOff + (row + 1) * L1 + col);
                    meshVerts.push(indexOff + row * L1 + col);
                    meshVerts.push(indexOff + row * L1 + (col + 1));

                    meshVerts.push(indexOff + (row + 1) * L1 + col);
                    meshVerts.push(indexOff + row * L1 + (col + 1));
                    meshVerts.push(indexOff + (row + 1) * L1 + (col + 1));
                }
            }

        }
    }
};

//
// BSP Collision Detection
//

q3bsp.trace = function (traceId, start, end, radius, slide) {
    if (!radius) { radius = 0; }
    if (!slide) { slide = false; }

    if (!brushSides) { return end; }

    var output = {
        startsOut: true,
        allSolid: false,
        plane: null,
        fraction: 1
    };

    q3bsp.traceNode(0, 0, 1, start, end, radius, output);

    if (output.fraction != 1) { // collided with something
        if (slide && output.plane) {
            var endDist = Math.abs(vec3.dot(end, output.plane.normal) - (output.plane.distance + radius + 0.03125));
            for (var i = 0; i < 3; i++) {
                end[i] = end[i] + endDist * (output.plane.normal[i]);
            }
        } else {
            for (var i = 0; i < 3; i++) {
                end[i] = start[i] + output.fraction * (end[i] - start[i]);
            }
        }
    }

    postMessage({
        type: 'trace',
        traceId: traceId,
        end: end
    });
};

q3bsp.traceNode = function (nodeIdx, startFraction, endFraction, start, end, radius, output) {
    if (nodeIdx < 0) { // Leaf node?
        var leaf = leaves[-(nodeIdx + 1)];
        for (var i = 0; i < leaf.leafBrushCount; i++) {
            var brush = brushes[leafBrushes[leaf.leafBrush + i]];
            var shader = shaders[brush.shader];
            if (brush.brushSideCount > 0 && (shader.contents & 1)) {
                q3bsp.traceBrush(brush, start, end, radius, output);
            }
        }
        return;
    }

    // Tree node
    var node = nodes[nodeIdx];
    var plane = planes[node.plane];

    var startDist = vec3.dot(plane.normal, start) - plane.distance;
    var endDist = vec3.dot(plane.normal, end) - plane.distance;

    if (startDist >= radius && endDist >= radius) {
        q3bsp.traceNode(node.children[0], startFraction, endFraction, start, end, radius, output);
    } else if (startDist < -radius && endDist < -radius) {
        q3bsp.traceNode(node.children[1], startFraction, endFraction, start, end, radius, output);
    } else {
        var side;
        var fraction1, fraction2, middleFraction;
        var middle = [0, 0, 0];

        if (startDist < endDist) {
            side = 1; // back
            var iDist = 1 / (startDist - endDist);
            fraction1 = (startDist - radius + 0.03125) * iDist;
            fraction2 = (startDist + radius + 0.03125) * iDist;
        } else if (startDist > endDist) {
            side = 0; // front
            var iDist = 1 / (startDist - endDist);
            fraction1 = (startDist + radius + 0.03125) * iDist;
            fraction2 = (startDist - radius - 0.03125) * iDist;
        } else {
            side = 0; // front
            fraction1 = 1;
            fraction2 = 0;
        }

        if (fraction1 < 0) fraction1 = 0;
        else if (fraction1 > 1) fraction1 = 1;
        if (fraction2 < 0) fraction2 = 0;
        else if (fraction2 > 1) fraction2 = 1;

        middleFraction = startFraction + (endFraction - startFraction) * fraction1;

        for (var i = 0; i < 3; i++) {
            middle[i] = start[i] + fraction1 * (end[i] - start[i]);
        }

        q3bsp.traceNode(node.children[side], startFraction, middleFraction, start, middle, radius, output);

        middleFraction = startFraction + (endFraction - startFraction) * fraction2;

        for (var i = 0; i < 3; i++) {
            middle[i] = start[i] + fraction2 * (end[i] - start[i]);
        }

        q3bsp.traceNode(node.children[side === 0 ? 1 : 0], middleFraction, endFraction, middle, end, radius, output);
    }
};

q3bsp.traceBrush = function (brush, start, end, radius, output) {
    var startFraction = -1;
    var endFraction = 1;
    var startsOut = false;
    var endsOut = false;
    var collisionPlane = null;

    for (var i = 0; i < brush.brushSideCount; i++) {
        var brushSide = brushSides[brush.brushSide + i];
        var plane = planes[brushSide.plane];

        var startDist = vec3.dot(start, plane.normal) - (plane.distance + radius);
        var endDist = vec3.dot(end, plane.normal) - (plane.distance + radius);

        if (startDist > 0) startsOut = true;
        if (endDist > 0) endsOut = true;

        // make sure the trace isn't completely on one side of the brush
        if (startDist > 0 && endDist > 0) { return; }
        if (startDist <= 0 && endDist <= 0) { continue; }

        if (startDist > endDist) { // line is entering into the brush
            var fraction = (startDist - 0.03125) / (startDist - endDist);
            if (fraction > startFraction) {
                startFraction = fraction;
                collisionPlane = plane;
            }
        } else { // line is leaving the brush
            var fraction = (startDist + 0.03125) / (startDist - endDist);
            if (fraction < endFraction)
                endFraction = fraction;
        }
    }

    if (startsOut === false) {
        output.startsOut = false;
        if (endsOut === false)
            output.allSolid = true;
        return;
    }

    if (startFraction < endFraction) {
        if (startFraction > -1 && startFraction < output.fraction) {
            output.plane = collisionPlane;
            if (startFraction < 0)
                startFraction = 0;
            output.fraction = startFraction;
        }
    }

    return;
};

//
// Visibility Checking
//

var lastLeaf = -1;
declare let testCluster;
q3bsp.checkVis = function (visCluster, testCluster) {
    if (visCluster == testCluster || visCluster == -1) { return true; }
    var i = (visCluster * visSize) + (testCluster >> 3);
    var visSet = visBuffer[i];
    return (visSet & (1 << (testCluster & 7)) !== 0);
};

q3bsp.getLeaf = function (pos) {
    var index = 0;

    var node = null;
    var plane = null;
    var distance = 0;

    while (index >= 0) {
        node = nodes[index];
        plane = planes[node.plane];
        distance = vec3.dot(plane.normal, pos) - plane.distance;

        if (distance >= 0) {
            index = node.children[0];
        } else {
            index = node.children[1];
        }
    }

    return -(index + 1);
};

q3bsp.buildVisibleList = function (leafIndex) {
    // Determine visible faces
    if (leafIndex == lastLeaf) { return; }
    lastLeaf = leafIndex;

    var curLeaf = leaves[leafIndex];

    var visibleShaders = new Array(shaders.length);

    for (var i = 0; i < leaves.length; ++i) {
        var leaf = leaves[i];
        if (q3bsp.checkVis(curLeaf.cluster, leaf.cluster)) {
            for (var j = 0; j < leaf.leafFaceCount; ++j) {
                var face = faces[leafFaces[[j + leaf.leafFace]]];
                if (face) {
                    visibleShaders[face.shader] = true;
                }
            }
        }
    }

    var ar = new Array(visSize);

    for (var i = 0; i < visSize; ++i) {
        ar[i] = visBuffer[(curLeaf.cluster * visSize) + i];
    }

    postMessage({
        type: 'visibility',
        visibleSurfaces: visibleShaders
    });
};

/// end of q3bsp_worker.js ///

/// q3bsp.js ///

declare let q3bsp_vertex_stride;
declare let q3bsp_sky_vertex_stride;
declare let q3bsp_base_folder;

// Constants
q3bsp_vertex_stride = 56;
q3bsp_sky_vertex_stride = 20;

q3bsp_base_folder = 'demo_baseq3';

/*
 * q3bsp
 */

q3bsp = function (gl) {
    // gl initialization
    this.gl = gl;
    this.onload = null;
    this.onbsp = null;
    this.onentitiesloaded = null;

    var map = this;

    this.showLoadStatus();

    // Spawn the web worker
    this.worker = new Worker('js/q3bsp_worker.js');
    this.worker.onmessage = function (msg) {
        map.onMessage(msg);
    };
    this.worker.onerror = function (msg) {
        console.error('Line: ' + msg.lineno + ', ' + msg.message);
    };

    // Map elements
    this.skyboxBuffer = null;
    this.skyboxIndexBuffer = null;
    this.skyboxIndexCount = 0;
    this.skyboxMat = mat4.create();

    this.vertexBuffer = null;
    this.indexBuffer = null;
    this.indexCount = 0;
    this.lightmap = q3glshader.createSolidTexture(gl, [255, 255, 255, 255]);
    this.surfaces = null;
    this.shaders = {};

    this.highlighted = null;

    // Sorted draw elements
    this.skyShader = null;
    this.unshadedSurfaces = [];
    this.defaultSurfaces = [];
    this.modelSurfaces = [];
    this.effectSurfaces = [];

    // BSP Elements
    this.bspTree = null;

    // Effect elements
    this.startTime = new Date().getTime();
    this.bgMusic = null;
};

q3bsp.prototype.highlightShader = function (name) {
    this.highlighted = name;
};

q3bsp.prototype.playMusic = function (play) {
    if (!this.bgMusic) { return; }

    if (play) {
        this.bgMusic.play();
    } else {
        this.bgMusic.pause();
    }
};

q3bsp.prototype.onMessage = function (msg) {
    switch (msg.data.type) {
        case 'entities':
            this.entities = msg.data.entities;
            this.processEntities(this.entities);
            break;
        case 'geometry':
            this.buildBuffers(msg.data.vertices, msg.data.indices);
            this.surfaces = msg.data.surfaces;
            this.bindShaders();
            break;
        case 'lightmap':
            this.buildLightmaps(msg.data.size, msg.data.lightmaps);
            break;
        case 'shaders':
            this.buildShaders(msg.data.shaders);
            break;
        case 'bsp':
            this.bspTree = new q3bsptree(msg.data.bsp);
            if (this.onbsp) {
                this.onbsp(this.bspTree);
            }
            this.clearLoadStatus();
            break;
        case 'visibility':
            this.setVisibility(msg.data.visibleSurfaces);
            break;
        case 'status':
            this.onLoadStatus(msg.data.message);
            break;
        default:
            throw 'Unexpected message type: ' + msg.data.type;
    }
};

q3bsp.prototype.showLoadStatus = function () {
    // Yeah, this shouldn't be hardcoded in here
    var loading = document.getElementById('loading');
    loading.style.display = 'block';
};

q3bsp.prototype.onLoadStatus = function (message) {
    // Yeah, this shouldn't be hardcoded in here
    var loading = document.getElementById('loading');
    loading.innerHTML = message;
};

q3bsp.prototype.clearLoadStatus = function () {
    // Yeah, this shouldn't be hardcoded in here
    var loading = document.getElementById('loading');
    loading.style.display = 'none';
};

q3bsp.prototype.load = function (url, tesselationLevel) {
    if (!tesselationLevel) {
        tesselationLevel = 5;
    }
    this.worker.postMessage({
        type: 'load',
        url: '../' + q3bsp_base_folder + '/' + url,
        tesselationLevel: tesselationLevel
    });
};

q3bsp.prototype.loadShaders = function (sources) {
    var map = this;

    for (var i = 0; i < sources.length; ++i) {
        sources[i] = q3bsp_base_folder + '/' + sources[i];
    }

    q3shader.loadList(sources, function (shaders) {
        map.buildShaders(shaders);
    });
};

q3bsp.prototype.processEntities = function (entities) {
    if (this.onentitiesloaded) {
        this.onentitiesloaded(entities);
    }

    // Background music
    /*if(entities.worldspawn[0].music) {
        this.bgMusic = new Audio(q3bsp_base_folder + '/' + entities.worldspawn[0].music.replace('.wav', '.ogg'));
        // TODO: When can we change this to simply setting the 'loop' property?
        this.bgMusic.addEventListener('ended', function(){
            this.currentTime = 0;
        }, false);
        this.bgMusic.play();
    }*/

    // It would be relatively easy to do some ambient sound processing here, but I don't really feel like
    // HTML5 audio is up to the task. For example, lack of reliable gapless looping makes them sound terrible!
    // Look into this more when browsers get with the program.
    /*var speakers = entities.target_speaker;
    for(var i = 0; i < 1; ++i) {
        var speaker = speakers[i];
        q3bspCreateSpeaker(speaker);
    }*/
};

function q3bspCreateSpeaker(speaker) {
    speaker.audio = new Audio(q3bsp_base_folder + '/' + speaker.noise.replace('.wav', '.ogg'));

    // TODO: When can we change this to simply setting the 'loop' property?
    speaker.audio.addEventListener('ended', function () {
        this.currentTime = 0;
    }, false);
    speaker.audio.play();
};

q3bsp.prototype.buildBuffers = function (vertices, indices) {
    var gl = this.gl;

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.indexCount = indices.length;

    var skyVerts = [
        -128, 128, 128, 0, 0,
        128, 128, 128, 1, 0,
        -128, -128, 128, 0, 1,
        128, -128, 128, 1, 1,

        -128, 128, 128, 0, 1,
        128, 128, 128, 1, 1,
        -128, 128, -128, 0, 0,
        128, 128, -128, 1, 0,

        -128, -128, 128, 0, 0,
        128, -128, 128, 1, 0,
        -128, -128, -128, 0, 1,
        128, -128, -128, 1, 1,

        128, 128, 128, 0, 0,
        128, -128, 128, 0, 1,
        128, 128, -128, 1, 0,
        128, -128, -128, 1, 1,

        -128, 128, 128, 1, 0,
        -128, -128, 128, 1, 1,
        -128, 128, -128, 0, 0,
        -128, -128, -128, 0, 1
    ];

    var skyIndices = [
        0, 1, 2,
        1, 2, 3,

        4, 5, 6,
        5, 6, 7,

        8, 9, 10,
        9, 10, 11,

        12, 13, 14,
        13, 14, 15,

        16, 17, 18,
        17, 18, 19
    ];

    this.skyboxBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.skyboxBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skyVerts), gl.STATIC_DRAW);

    this.skyboxIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.skyboxIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(skyIndices), gl.STATIC_DRAW);

    this.skyboxIndexCount = skyIndices.length;
};

q3bsp.prototype.buildLightmaps = function (size, lightmaps) {
    var gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.lightmap);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    for (var i = 0; i < lightmaps.length; ++i) {
        gl.texSubImage2D(
            gl.TEXTURE_2D, 0, lightmaps[i].x, lightmaps[i].y, lightmaps[i].width, lightmaps[i].height,
            gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(lightmaps[i].bytes)
        );
    }

    gl.generateMipmap(gl.TEXTURE_2D);

    q3glshader.init(gl, this.lightmap);
};

q3bsp.prototype.buildShaders = function (shaders) {
    var gl = this.gl;

    for (var i = 0; i < shaders.length; ++i) {
        var shader = shaders[i];
        var glShader = q3glshader.build(gl, shader);
        this.shaders[shader.name] = glShader;
    }
};

q3bsp.prototype.bindShaders = function () {
    if (!this.surfaces) { return; }

    if (this.onsurfaces) {
        this.onsurfaces(this.surfaces);
    }

    for (var i = 0; i < this.surfaces.length; ++i) {
        var surface = this.surfaces[i];
        if (surface.elementCount === 0 || surface.shader || surface.shaderName == 'noshader') { continue; }
        this.unshadedSurfaces.push(surface);
    }

    var map = this;

    var interval = setInterval(function () {
        if (map.unshadedSurfaces.length === 0) { // Have we processed all surfaces?
            // Sort to ensure correct order of transparent objects
            map.effectSurfaces.sort(function (a, b) {
                var order = a.shader.sort - b.shader.sort;
                // TODO: Sort by state here to cut down on changes?
                return order; //(order == 0 ? 1 : order);
            });

            clearInterval(interval);
            return;
        }

        var surface = map.unshadedSurfaces.shift();

        var shader = map.shaders[surface.shaderName];
        if (!shader) {
            surface.shader = q3glshader.buildDefault(map.gl, surface);
            if (surface.geomType == 3) {
                surface.shader.model = true;
                map.modelSurfaces.push(surface);
            } else {
                map.defaultSurfaces.push(surface);
            }
        } else {
            surface.shader = shader;
            if (shader.sky) {
                map.skyShader = shader; // Sky does not get pushed into effectSurfaces. It's a separate pass
            } else {
                map.effectSurfaces.push(surface);
            }
            q3glshader.loadShaderMaps(map.gl, surface, shader);
        }
    }, 10);
};

// Update which portions of the map are visible based on position

q3bsp.prototype.updateVisibility = function (pos) {
    this.worker.postMessage({
        type: 'visibility',
        pos: pos
    });
};

q3bsp.prototype.setVisibility = function (visibilityList) {
    if (this.surfaces.length > 0) {
        for (var i = 0; i < this.surfaces.length; ++i) {
            this.surfaces[i].visible = (visibilityList[i] === true);
        }
    }
};

// Draw the map

q3bsp.prototype.bindShaderMatrix = function (shader, modelViewMat, projectionMat) {
    var gl = this.gl;

    // Set uniforms
    gl.uniformMatrix4fv(shader.uniform.modelViewMat, false, modelViewMat);
    gl.uniformMatrix4fv(shader.uniform.projectionMat, false, projectionMat);
}

q3bsp.prototype.bindShaderAttribs = function (shader) {
    var gl = this.gl;

    // Setup vertex attributes
    gl.enableVertexAttribArray(shader.attrib.position);
    gl.vertexAttribPointer(shader.attrib.position, 3, gl.FLOAT, false, q3bsp_vertex_stride, 0);

    if (shader.attrib.texCoord !== undefined) {
        gl.enableVertexAttribArray(shader.attrib.texCoord);
        gl.vertexAttribPointer(shader.attrib.texCoord, 2, gl.FLOAT, false, q3bsp_vertex_stride, 3 * 4);
    }

    if (shader.attrib.lightCoord !== undefined) {
        gl.enableVertexAttribArray(shader.attrib.lightCoord);
        gl.vertexAttribPointer(shader.attrib.lightCoord, 2, gl.FLOAT, false, q3bsp_vertex_stride, 5 * 4);
    }

    if (shader.attrib.normal !== undefined) {
        gl.enableVertexAttribArray(shader.attrib.normal);
        gl.vertexAttribPointer(shader.attrib.normal, 3, gl.FLOAT, false, q3bsp_vertex_stride, 7 * 4);
    }

    if (shader.attrib.color !== undefined) {
        gl.enableVertexAttribArray(shader.attrib.color);
        gl.vertexAttribPointer(shader.attrib.color, 4, gl.FLOAT, false, q3bsp_vertex_stride, 10 * 4);
    }
}

q3bsp.prototype.bindSkyMatrix = function (shader, modelViewMat, projectionMat) {
    var gl = this.gl;

    mat4.copy(this.skyboxMat, modelViewMat);
    // Clear out the translation components
    this.skyboxMat[12] = 0;
    this.skyboxMat[13] = 0;
    this.skyboxMat[14] = 0;

    // Set uniforms
    gl.uniformMatrix4fv(shader.uniform.modelViewMat, false, this.skyboxMat);
    gl.uniformMatrix4fv(shader.uniform.projectionMat, false, projectionMat);
};

q3bsp.prototype.bindSkyAttribs = function (shader) {
    var gl = this.gl;

    // Setup vertex attributes
    gl.enableVertexAttribArray(shader.attrib.position);
    gl.vertexAttribPointer(shader.attrib.position, 3, gl.FLOAT, false, q3bsp_sky_vertex_stride, 0);

    if (shader.attrib.texCoord !== undefined) {
        gl.enableVertexAttribArray(shader.attrib.texCoord);
        gl.vertexAttribPointer(shader.attrib.texCoord, 2, gl.FLOAT, false, q3bsp_sky_vertex_stride, 3 * 4);
    }
};

q3bsp.prototype.setViewport = function (viewport) {
    if (viewport) {
        this.gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
    }
}

q3bsp.prototype.draw = function (leftViewMat, leftProjMat, leftViewport, rightViewMat, rightProjMat, rightViewport) {
    if (this.vertexBuffer === null || this.indexBuffer === null) { return; } // Not ready to draw yet

    var gl = this.gl; // Easier to type and potentially a bit faster

    // Seconds passed since map was initialized
    var time = (new Date().getTime() - this.startTime) / 1000.0;
    var i = 0;

    // Loop through all shaders, drawing all surfaces associated with them
    if (this.surfaces.length > 0) {

        // If we have a skybox, render it first
        if (this.skyShader) {
            // SkyBox Buffers
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.skyboxIndexBuffer);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.skyboxBuffer);

            // Render Skybox
            if (q3glshader.setShader(gl, this.skyShader)) {
                for (var j = 0; j < this.skyShader.stages.length; ++j) {
                    var stage = this.skyShader.stages[j];

                    var shaderProgram = q3glshader.setShaderStage(gl, this.skyShader, stage, time);
                    if (!shaderProgram) { continue; }
                    this.bindSkyAttribs(shaderProgram);

                    // Draw Sky geometry
                    this.bindSkyMatrix(shaderProgram, leftViewMat, leftProjMat);
                    this.setViewport(leftViewport);
                    gl.drawElements(gl.TRIANGLES, this.skyboxIndexCount, gl.UNSIGNED_SHORT, 0);

                    if (rightViewMat) {
                        this.bindSkyMatrix(shaderProgram, rightViewMat, rightProjMat);
                        this.setViewport(rightViewport);
                        gl.drawElements(gl.TRIANGLES, this.skyboxIndexCount, gl.UNSIGNED_SHORT, 0);
                    }
                }
            }
        }

        // Map Geometry buffers
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        // Default shader surfaces (can bind shader once and draw all of them very quickly)
        if (this.defaultSurfaces.length > 0 || this.unshadedSurfaces.length > 0) {
            // Setup State
            var shader = q3glshader.defaultShader;
            q3glshader.setShader(gl, shader);
            var shaderProgram = q3glshader.setShaderStage(gl, shader, shader.stages[0], time);
            this.bindShaderAttribs(shaderProgram);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, q3glshader.defaultTexture);

            this.bindShaderMatrix(shaderProgram, leftViewMat, leftProjMat);
            this.setViewport(leftViewport);
            for (i = 0; i < this.unshadedSurfaces.length; ++i) {
                var surface = this.unshadedSurfaces[i];
                gl.drawElements(gl.TRIANGLES, surface.elementCount, gl.UNSIGNED_SHORT, surface.indexOffset);
            }
            for (i = 0; i < this.defaultSurfaces.length; ++i) {
                var surface = this.defaultSurfaces[i];
                var stage = surface.shader.stages[0];
                gl.bindTexture(gl.TEXTURE_2D, stage.texture);
                gl.drawElements(gl.TRIANGLES, surface.elementCount, gl.UNSIGNED_SHORT, surface.indexOffset);
            }

            if (rightViewMat) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, q3glshader.defaultTexture);

                this.bindShaderMatrix(shaderProgram, rightViewMat, rightProjMat);
                this.setViewport(rightViewport);
                for (i = 0; i < this.unshadedSurfaces.length; ++i) {
                    var surface = this.unshadedSurfaces[i];
                    gl.drawElements(gl.TRIANGLES, surface.elementCount, gl.UNSIGNED_SHORT, surface.indexOffset);
                }

                for (i = 0; i < this.defaultSurfaces.length; ++i) {
                    var surface = this.defaultSurfaces[i];
                    var stage = surface.shader.stages[0];
                    gl.bindTexture(gl.TEXTURE_2D, stage.texture);
                    gl.drawElements(gl.TRIANGLES, surface.elementCount, gl.UNSIGNED_SHORT, surface.indexOffset);
                }
            }
        }

        // Model shader surfaces (can bind shader once and draw all of them very quickly)
        if (this.modelSurfaces.length > 0) {
            // Setup State
            var shader = this.modelSurfaces[0].shader;
            q3glshader.setShader(gl, shader);
            var shaderProgram = q3glshader.setShaderStage(gl, shader, shader.stages[0], time);
            this.bindShaderAttribs(shaderProgram);
            gl.activeTexture(gl.TEXTURE0);

            this.bindShaderMatrix(shaderProgram, leftViewMat, leftProjMat);
            this.setViewport(leftViewport);
            for (i = 0; i < this.modelSurfaces.length; ++i) {
                var surface = this.modelSurfaces[i];
                var stage = surface.shader.stages[0];
                gl.bindTexture(gl.TEXTURE_2D, stage.texture);
                gl.drawElements(gl.TRIANGLES, surface.elementCount, gl.UNSIGNED_SHORT, surface.indexOffset);
            }

            if (rightViewMat) {
                this.bindShaderMatrix(shaderProgram, rightViewMat, rightProjMat);
                this.setViewport(rightViewport);
                for (i = 0; i < this.modelSurfaces.length; ++i) {
                    var surface = this.modelSurfaces[i];
                    var stage = surface.shader.stages[0];
                    gl.bindTexture(gl.TEXTURE_2D, stage.texture);
                    gl.drawElements(gl.TRIANGLES, surface.elementCount, gl.UNSIGNED_SHORT, surface.indexOffset);
                }
            }
        }

        // Effect surfaces
        for (var i = 0; i < this.effectSurfaces.length; ++i) {
            var surface = this.effectSurfaces[i];
            if (surface.elementCount == 0 || surface.visible !== true) { continue; }

            // Bind the surface shader
            var shader = surface.shader;

            if (this.highlighted && this.highlighted == surface.shaderName) {
                shader = q3glshader.defaultShader;
            }

            if (!q3glshader.setShader(gl, shader)) { continue; }

            for (var j = 0; j < shader.stages.length; ++j) {
                var stage = shader.stages[j];

                var shaderProgram = q3glshader.setShaderStage(gl, shader, stage, time);
                if (!shaderProgram) { continue; }
                this.bindShaderAttribs(shaderProgram);
                this.bindShaderMatrix(shaderProgram, leftViewMat, leftProjMat);
                this.setViewport(leftViewport);
                // Draw all geometry that uses this textures
                gl.drawElements(gl.TRIANGLES, surface.elementCount, gl.UNSIGNED_SHORT, surface.indexOffset);

                if (rightViewMat) {
                    this.bindShaderMatrix(shaderProgram, rightViewMat, rightProjMat);
                    this.setViewport(rightViewport);
                    // Draw all geometry that uses this textures
                    gl.drawElements(gl.TRIANGLES, surface.elementCount, gl.UNSIGNED_SHORT, surface.indexOffset);
                }
            }
        }
    }
};


declare let q3bsptree;
//
// BSP Tree Collision Detection
//
q3bsptree = function (bsp) {
    this.bsp = bsp;
};

q3bsptree.prototype.trace = function (start, end, radius) {
    var output = {
        allSolid: false,
        startSolid: false,
        fraction: 1.0,
        endPos: end,
        plane: null
    };

    if (!this.bsp) { return output; }
    if (!radius) { radius = 0; }

    this.traceNode(0, 0, 1, start, end, radius, output);

    if (output.fraction != 1.0) { // collided with something
        for (var i = 0; i < 3; i++) {
            output.endPos[i] = start[i] + output.fraction * (end[i] - start[i]);
        }
    }

    return output;
};

var q3bsptree_trace_offset = 0.03125;

q3bsptree.prototype.traceNode = function (nodeIdx, startFraction, endFraction, start, end, radius, output) {
    if (nodeIdx < 0) { // Leaf node?
        var leaf = this.bsp.leaves[-(nodeIdx + 1)];
        for (var i = 0; i < leaf.leafBrushCount; i++) {
            var brush = this.bsp.brushes[this.bsp.leafBrushes[leaf.leafBrush + i]];
            var surface = this.bsp.surfaces[brush.shader];
            if (brush.brushSideCount > 0 && surface.contents & 1) {
                this.traceBrush(brush, start, end, radius, output);
            }
        }
        return;
    }

    // Tree node
    var node = this.bsp.nodes[nodeIdx];
    var plane = this.bsp.planes[node.plane];

    var startDist = vec3.dot(plane.normal, start) - plane.distance;
    var endDist = vec3.dot(plane.normal, end) - plane.distance;

    if (startDist >= radius && endDist >= radius) {
        this.traceNode(node.children[0], startFraction, endFraction, start, end, radius, output);
    } else if (startDist < -radius && endDist < -radius) {
        this.traceNode(node.children[1], startFraction, endFraction, start, end, radius, output);
    } else {
        var side;
        var fraction1, fraction2, middleFraction;
        var middle = [0, 0, 0];

        if (startDist < endDist) {
            side = 1; // back
            var iDist = 1 / (startDist - endDist);
            fraction1 = (startDist - radius + q3bsptree_trace_offset) * iDist;
            fraction2 = (startDist + radius + q3bsptree_trace_offset) * iDist;
        } else if (startDist > endDist) {
            side = 0; // front
            var iDist = 1 / (startDist - endDist);
            fraction1 = (startDist + radius + q3bsptree_trace_offset) * iDist;
            fraction2 = (startDist - radius - q3bsptree_trace_offset) * iDist;
        } else {
            side = 0; // front
            fraction1 = 1;
            fraction2 = 0;
        }

        if (fraction1 < 0) fraction1 = 0;
        else if (fraction1 > 1) fraction1 = 1;
        if (fraction2 < 0) fraction2 = 0;
        else if (fraction2 > 1) fraction2 = 1;

        middleFraction = startFraction + (endFraction - startFraction) * fraction1;

        for (var i = 0; i < 3; i++) {
            middle[i] = start[i] + fraction1 * (end[i] - start[i]);
        }

        this.traceNode(node.children[side], startFraction, middleFraction, start, middle, radius, output);

        middleFraction = startFraction + (endFraction - startFraction) * fraction2;

        for (var i = 0; i < 3; i++) {
            middle[i] = start[i] + fraction2 * (end[i] - start[i]);
        }

        this.traceNode(node.children[side === 0 ? 1 : 0], middleFraction, endFraction, middle, end, radius, output);
    }
};

q3bsptree.prototype.traceBrush = function (brush, start, end, radius, output) {
    var startFraction = -1;
    var endFraction = 1;
    var startsOut = false;
    var endsOut = false;
    var collisionPlane = null;

    for (var i = 0; i < brush.brushSideCount; i++) {
        var brushSide = this.bsp.brushSides[brush.brushSide + i];
        var plane = this.bsp.planes[brushSide.plane];

        var startDist = vec3.dot(start, plane.normal) - (plane.distance + radius);
        var endDist = vec3.dot(end, plane.normal) - (plane.distance + radius);

        if (startDist > 0) startsOut = true;
        if (endDist > 0) endsOut = true;

        // make sure the trace isn't completely on one side of the brush
        if (startDist > 0 && endDist > 0) { return; }
        if (startDist <= 0 && endDist <= 0) { continue; }

        if (startDist > endDist) { // line is entering into the brush
            var fraction = (startDist - q3bsptree_trace_offset) / (startDist - endDist);
            if (fraction > startFraction) {
                startFraction = fraction;
                collisionPlane = plane;
            }
        } else { // line is leaving the brush
            var fraction = (startDist + q3bsptree_trace_offset) / (startDist - endDist);
            if (fraction < endFraction)
                endFraction = fraction;
        }
    }

    if (startsOut === false) {
        output.startSolid = true;
        if (endsOut === false)
            output.allSolid = true;
        return;
    }

    if (startFraction < endFraction) {
        if (startFraction > -1 && startFraction < output.fraction) {
            output.plane = collisionPlane;
            if (startFraction < 0)
                startFraction = 0;
            output.fraction = startFraction;
        }
    }

    return;
};
/// end of q3bsp.js ///
declare let q3bsp_default_vertex;
/// q3glshader ///

q3bsp_default_vertex = '\
    #ifdef GL_ES \n\
    precision highp float; \n\
    #endif \n\
    attribute vec3 position; \n\
    attribute vec3 normal; \n\
    attribute vec2 texCoord; \n\
    attribute vec2 lightCoord; \n\
    attribute vec4 color; \n\
\n\
    varying vec2 vTexCoord; \n\
    varying vec2 vLightmapCoord; \n\
    varying vec4 vColor; \n\
\n\
    uniform mat4 modelViewMat; \n\
    uniform mat4 projectionMat; \n\
\n\
    void main(void) { \n\
        vec4 worldPosition = modelViewMat * vec4(position, 1.0); \n\
        vTexCoord = texCoord; \n\
        vColor = color; \n\
        vLightmapCoord = lightCoord; \n\
        gl_Position = projectionMat * worldPosition; \n\
    } \n\
';
declare let q3bsp_default_fragment;
q3bsp_default_fragment = '\
    #ifdef GL_ES \n\
    precision highp float; \n\
    #endif \n\
    varying vec2 vTexCoord; \n\
    varying vec2 vLightmapCoord; \n\
    uniform sampler2D texture; \n\
    uniform sampler2D lightmap; \n\
\n\
    void main(void) { \n\
        vec4 diffuseColor = texture2D(texture, vTexCoord); \n\
        vec4 lightColor = texture2D(lightmap, vLightmapCoord); \n\
        gl_FragColor = vec4(diffuseColor.rgb * lightColor.rgb, diffuseColor.a); \n\
    } \n\
';
declare let q3bsp_model_fragment
q3bsp_model_fragment = '\
    #ifdef GL_ES \n\
    precision highp float; \n\
    #endif \n\
    varying vec2 vTexCoord; \n\
    varying vec4 vColor; \n\
    uniform sampler2D texture; \n\
\n\
    void main(void) { \n\
        vec4 diffuseColor = texture2D(texture, vTexCoord); \n\
        gl_FragColor = vec4(diffuseColor.rgb * vColor.rgb, diffuseColor.a); \n\
    } \n\
';

var q3glshader = {}

q3glshader.lightmap = null;
q3glshader.white = null;
q3glshader.defaultShader = null;
q3glshader.defaultTexture = null;
q3glshader.texMat = mat4.create();
q3glshader.defaultProgram = null;

q3glshader.init = function (gl, lightmap) {
    q3glshader.lightmap = lightmap;
    q3glshader.white = q3glshader.createSolidTexture(gl, [255, 255, 255, 255]);

    q3glshader.defaultProgram = q3glshader.compileShaderProgram(gl, q3bsp_default_vertex, q3bsp_default_fragment);
    q3glshader.modelProgram = q3glshader.compileShaderProgram(gl, q3bsp_default_vertex, q3bsp_model_fragment);

    var image = new Image();
    q3glshader.defaultTexture = gl.createTexture();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, q3glshader.defaultTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    image.src = q3bsp_base_folder + '/webgl/no-shader.png';

    // Load default stage
    q3glshader.defaultShader = q3glshader.buildDefault(gl);
}

//
// Shader building
//

q3glshader.build = function (gl, shader) {
    var glShader = {
        cull: q3glshader.translateCull(gl, shader.cull),
        sort: shader.sort,
        sky: shader.sky,
        blend: shader.blend,
        name: shader.name,
        stages: []
    };

    for (var j = 0; j < shader.stages.length; ++j) {
        var stage = shader.stages[j];
        var glStage = stage;

        glStage.texture = null;
        glStage.blendSrc = q3glshader.translateBlend(gl, stage.blendSrc);
        glStage.blendDest = q3glshader.translateBlend(gl, stage.blendDest);
        glStage.depthFunc = q3glshader.translateDepthFunc(gl, stage.depthFunc);

        glShader.stages.push(glStage);
    }

    return glShader;
}

q3glshader.buildDefault = function (gl, surface) {
    var diffuseStage = {
        map: (surface ? surface.shaderName + '.png' : null),
        isLightmap: false,
        blendSrc: gl.ONE,
        blendDest: gl.ZERO,
        depthFunc: gl.LEQUAL,
        depthWrite: true
    };

    if (surface) {
        q3glshader.loadTexture(gl, surface, diffuseStage);
    } else {
        diffuseStage.texture = q3glshader.defaultTexture;
    }

    var glShader = {
        cull: gl.FRONT,
        blend: false,
        sort: 3,
        stages: [diffuseStage]
    };

    return glShader;
}

q3glshader.translateDepthFunc = function (gl, depth) {
    if (!depth) { return gl.LEQUAL; }
    switch (depth.toLowerCase()) {
        case 'gequal': return gl.GEQUAL;
        case 'lequal': return gl.LEQUAL;
        case 'equal': return gl.EQUAL;
        case 'greater': return gl.GREATER;
        case 'less': return gl.LESS;
        default: return gl.LEQUAL;
    }
};

q3glshader.translateCull = function (gl, cull) {
    if (!cull) { return gl.FRONT; }
    switch (cull.toLowerCase()) {
        case 'disable':
        case 'none': return null;
        case 'front': return gl.BACK;
        case 'back':
        default: return gl.FRONT;
    }
};

q3glshader.translateBlend = function (gl, blend) {
    if (!blend) { return gl.ONE; }
    switch (blend.toUpperCase()) {
        case 'GL_ONE': return gl.ONE;
        case 'GL_ZERO': return gl.ZERO;
        case 'GL_DST_COLOR': return gl.DST_COLOR;
        case 'GL_ONE_MINUS_DST_COLOR': return gl.ONE_MINUS_DST_COLOR;
        case 'GL_SRC_ALPHA ': return gl.SRC_ALPHA;
        case 'GL_ONE_MINUS_SRC_ALPHA': return gl.ONE_MINUS_SRC_ALPHA;
        case 'GL_SRC_COLOR': return gl.SRC_COLOR;
        case 'GL_ONE_MINUS_SRC_COLOR': return gl.ONE_MINUS_SRC_COLOR;
        default: return gl.ONE;
    }
};

//
// Texture loading
//

q3glshader.loadShaderMaps = function (gl, surface, shader) {
    for (var i = 0; i < shader.stages.length; ++i) {
        var stage = shader.stages[i];
        if (stage.map) {
            q3glshader.loadTexture(gl, surface, stage);
        }

        if (stage.shaderSrc && !stage.program) {
            stage.program = q3glshader.compileShaderProgram(gl, stage.shaderSrc.vertex, stage.shaderSrc.fragment);
        }
    }
};

q3glshader.loadTexture = function (gl, surface, stage) {
    if (!stage.map) {
        stage.texture = q3glshader.white;
        return;
    } else if (stage.map == '$lightmap') {
        stage.texture = (surface.geomType != 3 ? q3glshader.lightmap : q3glshader.white);
        return;
    } else if (stage.map == '$whiteimage') {
        stage.texture = q3glshader.white;
        return;
    }

    stage.texture = q3glshader.defaultTexture;

    if (stage.map == 'anim') {
        stage.animTexture = [];
        for (var i = 0; i < stage.animMaps.length; ++i) {
            var animLoad = function (i) {
                stage.animTexture[i] = q3glshader.defaultTexture;
                q3glshader.loadTextureUrl(gl, stage, stage.animMaps[i], function (texture) {
                    stage.animTexture[i] = texture;
                });
            };
            animLoad(i);
        }
        stage.animFrame = 0;
    } else {
        q3glshader.loadTextureUrl(gl, stage, stage.map, function (texture) {
            stage.texture = texture;
        });
    }
};

q3glshader.loadTextureUrl = function (gl, stage, url, onload) {
    var image = new Image();
    image.onload = function () {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        if (stage.clamp) {
            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.generateMipmap(gl.TEXTURE_2D);
        onload(texture);
    }
    image.src = q3bsp_base_folder + '/' + url;
}

q3glshader.createSolidTexture = function (gl, color) {
    var data = new Uint8Array(color);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    return texture;
}

//
// Render state setup
//

q3glshader.setShader = function (gl, shader) {
    if (!shader) {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
    } else if (shader.cull && !shader.sky) {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(shader.cull);
    } else {
        gl.disable(gl.CULL_FACE);
    }

    return true;
}

q3glshader.setShaderStage = function (gl, shader, shaderStage, time) {
    var stage = shaderStage;
    if (!stage) {
        stage = q3glshader.defaultShader.stages[0];
    }

    if (stage.animFreq) {
        // Texture animation seems like a natural place for setInterval, but that approach has proved error prone. 
        // It can easily get out of sync with other effects (like rgbGen pulses and whatnot) which can give a 
        // jittery or flat out wrong appearance. Doing it this way ensures all effects are synced.
        var animFrame = Math.floor(time * stage.animFreq) % stage.animTexture.length;
        stage.texture = stage.animTexture[animFrame];
    }

    gl.blendFunc(stage.blendSrc, stage.blendDest);

    if (stage.depthWrite && !shader.sky) {
        gl.depthMask(true);
    } else {
        gl.depthMask(false);
    }

    gl.depthFunc(stage.depthFunc);

    var program = stage.program;
    if (!program) {
        if (shader.model) {
            program = q3glshader.modelProgram;
        } else {
            program = q3glshader.defaultProgram;
        }
    }

    gl.useProgram(program);

    var texture = stage.texture;
    if (!texture) { texture = q3glshader.defaultTexture; }

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(program.uniform.texture, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    if (program.uniform.lightmap) {
        gl.activeTexture(gl.TEXTURE1);
        gl.uniform1i(program.uniform.lightmap, 1);
        gl.bindTexture(gl.TEXTURE_2D, q3glshader.lightmap);
    }

    if (program.uniform.time) {
        gl.uniform1f(program.uniform.time, time);
    }

    return program;
};

//
// Shader program compilation
//

q3glshader.compileShaderProgram = function (gl, vertexSrc, fragmentSrc) {
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSrc);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        /*console.debug(gl.getShaderInfoLog(fragmentShader));
        console.debug(vertexSrc);
        console.debug(fragmentSrc);*/
        gl.deleteShader(fragmentShader);
        return null;
    }

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSrc);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        /*console.debug(gl.getShaderInfoLog(vertexShader));
        console.debug(vertexSrc);
        console.debug(fragmentSrc);*/
        gl.deleteShader(vertexShader);
        return null;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        gl.deleteProgram(shaderProgram);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        /*console.debug('Could not link shaders');
        console.debug(vertexSrc);
        console.debug(fragmentSrc);*/
        return null;
    }

    var i, attrib, uniform;
    var attribCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
    shaderProgram.attrib = {};
    for (i = 0; i < attribCount; i++) {
        attrib = gl.getActiveAttrib(shaderProgram, i);
        shaderProgram.attrib[attrib.name] = gl.getAttribLocation(shaderProgram, attrib.name);
    }

    var uniformCount = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
    shaderProgram.uniform = {};
    for (i = 0; i < uniformCount; i++) {
        uniform = gl.getActiveUniform(shaderProgram, i);
        shaderProgram.uniform[uniform.name] = gl.getUniformLocation(shaderProgram, uniform.name);
    }

    return shaderProgram;
}
/// end of q3glshader ///

/// q3movement ///

// Some movement constants ripped from the Q3 Source code
var q3movement_stopspeed = 100.0;
var q3movement_duckScale = 0.25;
var q3movement_jumpvelocity = 50;

var q3movement_accelerate = 10.0;
var q3movement_airaccelerate = 0.1;
var q3movement_flyaccelerate = 8.0;

var q3movement_friction = 6.0;
var q3movement_flightfriction = 3.0;

var q3movement_frameTime = 0.30;
var q3movement_overclip = 0.501;
var q3movement_stepsize = 18;

var q3movement_gravity = 20.0;

var q3movement_playerRadius = 10.0;
var q3movement_scale = 50;

q3movement = function (bsp) {
    this.bsp = bsp;

    this.velocity = [0, 0, 0];
    this.position = [0, 0, 0];
    this.onGround = false;

    this.groundTrace = null;
};

q3movement.prototype.applyFriction = function () {
    if (!this.onGround) { return; }

    var speed = vec3.length(this.velocity);

    var drop = 0;

    var control = speed < q3movement_stopspeed ? q3movement_stopspeed : speed;
    drop += control * q3movement_friction * q3movement_frameTime;

    var newSpeed = speed - drop;
    if (newSpeed < 0) {
        newSpeed = 0;
    }
    if (speed !== 0) {
        newSpeed /= speed;
        vec3.scale(this.velocity, this.velocity, newSpeed);
    } else {
        this.velocity = [0, 0, 0];
    }
};

q3movement.prototype.groundCheck = function () {
    var checkPoint = [this.position[0], this.position[1], this.position[2] - q3movement_playerRadius - 0.25];

    this.groundTrace = this.bsp.trace(this.position, checkPoint, q3movement_playerRadius);

    if (this.groundTrace.fraction == 1.0) { // falling
        this.onGround = false;
        return;
    }

    if (this.velocity[2] > 0 && vec3.dot(this.velocity, this.groundTrace.plane.normal) > 10) { // jumping
        this.onGround = false;
        return;
    }

    if (this.groundTrace.plane.normal[2] < 0.7) { // steep slope
        this.onGround = false;
        return;
    }

    this.onGround = true;
};

q3movement.prototype.clipVelocity = function (velIn, normal) {
    var backoff = vec3.dot(velIn, normal);

    if (backoff < 0) {
        backoff *= q3movement_overclip;
    } else {
        backoff /= q3movement_overclip;
    }

    var change = vec3.scale([0, 0, 0], normal, backoff);
    return vec3.subtract(change, velIn, change);
};

q3movement.prototype.accelerate = function (dir, speed, accel) {
    var currentSpeed = vec3.dot(this.velocity, dir);
    var addSpeed = speed - currentSpeed;
    if (addSpeed <= 0) {
        return;
    }

    var accelSpeed = accel * q3movement_frameTime * speed;
    if (accelSpeed > addSpeed) {
        accelSpeed = addSpeed;
    }

    var accelDir = vec3.scale([0, 0, 0], dir, accelSpeed);
    vec3.add(this.velocity, this.velocity, accelDir);
};

q3movement.prototype.jump = function () {
    if (!this.onGround) { return false; }

    this.onGround = false;
    this.velocity[2] = q3movement_jumpvelocity;

    //Make sure that the player isn't stuck in the ground
    var groundDist = vec3.dot(this.position, this.groundTrace.plane.normal) - this.groundTrace.plane.distance - q3movement_playerRadius;
    vec3.add(this.position, this.position, vec3.scale([0, 0, 0], this.groundTrace.plane.normal, groundDist + 5));

    return true;
};

q3movement.prototype.move = function (dir, frameTime) {
    q3movement_frameTime = frameTime * 0.0075;

    this.groundCheck();

    vec3.normalize(dir, dir);

    if (this.onGround) {
        this.walkMove(dir);
    } else {
        this.airMove(dir);
    }

    return this.position;
};

q3movement.prototype.airMove = function (dir) {
    var speed = vec3.length(dir) * q3movement_scale;

    this.accelerate(dir, speed, q3movement_airaccelerate);

    this.stepSlideMove(true);
};

q3movement.prototype.walkMove = function (dir) {
    this.applyFriction();

    var speed = vec3.length(dir) * q3movement_scale;

    this.accelerate(dir, speed, q3movement_accelerate);

    this.velocity = this.clipVelocity(this.velocity, this.groundTrace.plane.normal);

    if (!this.velocity[0] && !this.velocity[1]) { return; }

    this.stepSlideMove(false);
};

q3movement.prototype.slideMove = function (gravity) {
    var bumpcount;
    var numbumps = 4;
    var planes = [];
    var endVelocity = [0, 0, 0];

    if (gravity) {
        vec3.copy(endVelocity, this.velocity);
        endVelocity[2] -= q3movement_gravity * q3movement_frameTime;
        this.velocity[2] = (this.velocity[2] + endVelocity[2]) * 0.5;

        if (this.groundTrace && this.groundTrace.plane) {
            // slide along the ground plane
            this.velocity = this.clipVelocity(this.velocity, this.groundTrace.plane.normal);
        }
    }

    // never turn against the ground plane
    if (this.groundTrace && this.groundTrace.plane) {
        planes.push(vec3.copy([0, 0, 0], this.groundTrace.plane.normal));
    }

    // never turn against original velocity
    planes.push(vec3.normalize([0, 0, 0], this.velocity));

    var time_left = q3movement_frameTime;
    var end = [0, 0, 0];
    for (bumpcount = 0; bumpcount < numbumps; ++bumpcount) {

        // calculate position we are trying to move to
        vec3.add(end, this.position, vec3.scale([0, 0, 0], this.velocity, time_left));

        // see if we can make it there
        var trace = this.bsp.trace(this.position, end, q3movement_playerRadius);

        if (trace.allSolid) {
            // entity is completely trapped in another solid
            this.velocity[2] = 0;   // don't build up falling damage, but allow sideways acceleration
            return true;
        }

        if (trace.fraction > 0) {
            // actually covered some distance
            vec3.copy(this.position, trace.endPos);
        }

        if (trace.fraction == 1) {
            break;     // moved the entire distance
        }

        time_left -= time_left * trace.fraction;

        planes.push(vec3.copy([0, 0, 0], trace.plane.normal));

        //
        // modify velocity so it parallels all of the clip planes
        //

        // find a plane that it enters
        for (var i = 0; i < planes.length; ++i) {
            var into = vec3.dot(this.velocity, planes[i]);
            if (into >= 0.1) { continue; } // move doesn't interact with the plane

            // slide along the plane
            var clipVelocity = this.clipVelocity(this.velocity, planes[i]);
            var endClipVelocity = this.clipVelocity(endVelocity, planes[i]);

            // see if there is a second plane that the new move enters
            for (var j = 0; j < planes.length; j++) {
                if (j == i) { continue; }
                if (vec3.dot(clipVelocity, planes[j]) >= 0.1) { continue; } // move doesn't interact with the plane

                // try clipping the move to the plane
                clipVelocity = this.clipVelocity(clipVelocity, planes[j]);
                endClipVelocity = this.clipVelocity(endClipVelocity, planes[j]);

                // see if it goes back into the first clip plane
                if (vec3.dot(clipVelocity, planes[i]) >= 0) { continue; }

                // slide the original velocity along the crease
                var dir = [0, 0, 0];
                vec3.cross(dir, planes[i], planes[j]);
                vec3.normalize(dir, dir);
                var d = vec3.dot(dir, this.velocity);
                vec3.scale(clipVelocity, dir, d);

                vec3.cross(dir, planes[i], planes[j]);
                vec3.normalize(dir, dir);
                d = vec3.dot(dir, endVelocity);
                vec3.scale(endClipVelocity, dir, d);

                // see if there is a third plane the the new move enters
                for (var k = 0; k < planes.length; ++k) {
                    if (k == i || k == j) { continue; }
                    if (vec3.dot(clipVelocity, planes[k]) >= 0.1) { continue; } // move doesn't interact with the plane

                    // stop dead at a tripple plane interaction
                    this.velocity = [0, 0, 0];
                    return true;
                }
            }

            // if we have fixed all interactions, try another move
            vec3.copy(this.velocity, clipVelocity);
            vec3.copy(endVelocity, endClipVelocity);
            break;
        }
    }

    if (gravity) {
        vec3.copy(this.velocity, endVelocity);
    }

    return (bumpcount !== 0);
};

q3movement.prototype.stepSlideMove = function (gravity) {
    var start_o = vec3.copy([0, 0, 0], this.position);
    var start_v = vec3.copy([0, 0, 0], this.velocity);

    if (this.slideMove(gravity) === 0) { return; } // we got exactly where we wanted to go first try

    var down = vec3.copy([0, 0, 0], start_o);
    down[2] -= q3movement_stepsize;
    var trace = this.bsp.trace(start_o, down, q3movement_playerRadius);

    var up = [0, 0, 1];

    // never step up when you still have up velocity
    if (this.velocity[2] > 0 && (trace.fraction == 1.0 || vec3.dot(trace.plane.normal, up) < 0.7)) { return; }

    var down_o = vec3.copy([0, 0, 0], this.position);
    var down_v = vec3.copy([0, 0, 0], this.velocity);

    vec3.copy(up, start_o);
    up[2] += q3movement_stepsize;

    // test the player position if they were a stepheight higher
    trace = this.bsp.trace(start_o, up, q3movement_playerRadius);
    if (trace.allSolid) { return; } // can't step up

    var stepSize = trace.endPos[2] - start_o[2];
    // try slidemove from this position
    vec3.copy(this.position, trace.endPos);
    vec3.copy(this.velocity, start_v);

    this.slideMove(gravity);

    // push down the final amount
    vec3.copy(down, this.position);
    down[2] -= stepSize;
    trace = this.bsp.trace(this.position, down, q3movement_playerRadius);
    if (!trace.allSolid) {
        vec3.copy(this.position, trace.endPos);
    }
    if (trace.fraction < 1.0) {
        this.velocity = this.clipVelocity(this.velocity, trace.plane.normal);
    }
};
/// end of q3movement ///
declare let shaderTokenizer;
/// q3shader ///

shaderTokenizer = function (src) {
    // Strip out comments
    src = src.replace(/\/\/.*$/mg, ''); // C++ style (//...)
    src = src.replace(/\/\*[^*\/]*\*\//mg, ''); // C style (/*...*/) (Do the shaders even use these?)
    this.tokens = src.match(/[^\s\n\r\"]+/mg);

    this.offset = 0;
};

shaderTokenizer.prototype.EOF = function () {
    if (this.tokens === null) { return true; }
    var token = this.tokens[this.offset];
    while (token === '' && this.offset < this.tokens.length) {
        this.offset++;
        token = this.tokens[this.offset];
    }
    return this.offset >= this.tokens.length;
};

shaderTokenizer.prototype.next = function () {
    if (this.tokens === null) { return; }
    var token = '';
    while (token === '' && this.offset < this.tokens.length) {
        token = this.tokens[this.offset++];
    }
    return token;
};

shaderTokenizer.prototype.prev = function () {
    if (this.tokens === null) { return; }
    var token = '';
    while (token === '' && this.offset >= 0) {
        token = this.tokens[this.offset--];
    }
    return token;
};

//
// Shader Loading
//

q3shader = {};

q3shader.loadList = function (sources, onload) {
    for (var i = 0; i < sources.length; ++i) {
        q3shader.load(sources[i], onload);
    }
};

q3shader.load = function (url, onload) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            q3shader.parse(url, request.responseText, onload);
        }
    };

    request.open('GET', url, true);
    request.setRequestHeader('Content-Type', 'text/plain');
    request.send(null);
};

q3shader.parse = function (url, src, onload) {
    var shaders = [];

    var tokens = new shaderTokenizer(src);

    // Parse a shader
    while (!tokens.EOF()) {
        var name = tokens.next();
        var shader = q3shader.parseShader(name, tokens);
        if (shader) {
            shader.url = url;

            if (shader.stages) {
                for (var i = 0; i < shader.stages.length; ++i) {
                    // Build a WebGL shader program out of the stage parameters set here
                    shader.stages[i].shaderSrc = q3shader.buildShaderSource(shader, shader.stages[i]);
                }
            }
        }
        shaders.push(shader);
    }

    // Send shaders to gl Thread
    onload(shaders);
};

q3shader.parseShader = function (name, tokens) {
    var brace = tokens.next();
    if (brace != '{') {
        return null;
    }

    var shader = {
        name: name,
        cull: 'back',
        sky: false,
        blend: false,
        opaque: false,
        sort: 0,
        vertexDeforms: [],
        stages: []
    };

    // Parse a shader
    while (!tokens.EOF()) {
        var token = tokens.next().toLowerCase();
        if (token == '}') { break; }

        switch (token) {
            case '{': {
                var stage = q3shader.parseStage(tokens);

                // I really really really don't like doing this, which basically just forces lightmaps to use the 'filter' blendmode
                // but if I don't a lot of textures end up looking too bright. I'm sure I'm jsut missing something, and this shouldn't
                // be needed.
                if (stage.isLightmap && (stage.hasBlendFunc)) {
                    stage.blendSrc = 'GL_DST_COLOR';
                    stage.blendDest = 'GL_ZERO';
                }

                // I'm having a ton of trouble getting lightingSpecular to work properly,
                // so this little hack gets it looking right till I can figure out the problem
                if (stage.alphaGen == 'lightingspecular') {
                    stage.blendSrc = 'GL_ONE';
                    stage.blendDest = 'GL_ZERO';
                    stage.hasBlendFunc = false;
                    stage.depthWrite = true;
                    shader.stages = [];
                }

                if (stage.hasBlendFunc) { shader.blend = true; } else { shader.opaque = true; }

                shader.stages.push(stage);
            } break;

            case 'cull':
                shader.cull = tokens.next();
                break;

            case 'deformvertexes':
                var deform = {
                    type: tokens.next().toLowerCase()
                };

                switch (deform.type) {
                    case 'wave':
                        deform.spread = 1.0 / parseFloat(tokens.next());
                        deform.waveform = q3shader.parseWaveform(tokens);
                        break;
                    default: deform = null; break;
                }

                if (deform) { shader.vertexDeforms.push(deform); }
                break;

            case 'sort':
                var sort = tokens.next().toLowerCase();
                switch (sort) {
                    case 'portal': shader.sort = 1; break;
                    case 'sky': shader.sort = 2; break;
                    case 'opaque': shader.sort = 3; break;
                    case 'banner': shader.sort = 6; break;
                    case 'underwater': shader.sort = 8; break;
                    case 'additive': shader.sort = 9; break;
                    case 'nearest': shader.sort = 16; break;
                    default: shader.sort = parseInt(sort); break;
                };
                break;

            case 'surfaceparm':
                var param = tokens.next().toLowerCase();

                switch (param) {
                    case 'sky':
                        shader.sky = true;
                        break;
                    default: break;
                }
                break;

            default: break;
        }
    }

    if (!shader.sort) {
        shader.sort = (shader.opaque ? 3 : 9);
    }

    return shader;
};

q3shader.parseStage = function (tokens) {
    var stage = {
        map: null,
        clamp: false,
        tcGen: 'base',
        rgbGen: 'identity',
        rgbWaveform: null,
        alphaGen: '1.0',
        alphaFunc: null,
        alphaWaveform: null,
        blendSrc: 'GL_ONE',
        blendDest: 'GL_ZERO',
        hasBlendFunc: false,
        tcMods: [],
        animMaps: [],
        animFreq: 0,
        depthFunc: 'lequal',
        depthWrite: true
    };

    // Parse a shader
    while (!tokens.EOF()) {
        var token = tokens.next();
        if (token == '}') { break; }

        switch (token.toLowerCase()) {
            case 'clampmap':
                stage.clamp = true;
            case 'map':
                stage.map = tokens.next().replace(/(\.jpg|\.tga)/, '.png');
                break;

            case 'animmap':
                stage.map = 'anim';
                stage.animFreq = parseFloat(tokens.next());
                var nextMap = tokens.next();
                while (nextMap.match(/(\.jpg|\.tga)/)) {
                    stage.animMaps.push(nextMap.replace(/(\.jpg|\.tga)/, '.png'));
                    nextMap = tokens.next();
                }
                tokens.prev();
                break;

            case 'rgbgen':
                stage.rgbGen = tokens.next().toLowerCase();;
                switch (stage.rgbGen) {
                    case 'wave':
                        stage.rgbWaveform = q3shader.parseWaveform(tokens);
                        if (!stage.rgbWaveform) { stage.rgbGen == 'identity'; }
                        break;
                };
                break;

            case 'alphagen':
                stage.alphaGen = tokens.next().toLowerCase();
                switch (stage.alphaGen) {
                    case 'wave':
                        stage.alphaWaveform = q3shader.parseWaveform(tokens);
                        if (!stage.alphaWaveform) { stage.alphaGen == '1.0'; }
                        break;
                    default: break;
                };
                break;

            case 'alphafunc':
                stage.alphaFunc = tokens.next().toUpperCase();
                break;

            case 'blendfunc':
                stage.blendSrc = tokens.next();
                stage.hasBlendFunc = true;
                if (!stage.depthWriteOverride) {
                    stage.depthWrite = false;
                }
                switch (stage.blendSrc) {
                    case 'add':
                        stage.blendSrc = 'GL_ONE';
                        stage.blendDest = 'GL_ONE';
                        break;

                    case 'blend':
                        stage.blendSrc = 'GL_SRC_ALPHA';
                        stage.blendDest = 'GL_ONE_MINUS_SRC_ALPHA';
                        break;

                    case 'filter':
                        stage.blendSrc = 'GL_DST_COLOR';
                        stage.blendDest = 'GL_ZERO';
                        break;

                    default:
                        stage.blendDest = tokens.next();
                        break;
                }
                break;

            case 'depthfunc':
                stage.depthFunc = tokens.next().toLowerCase();
                break;

            case 'depthwrite':
                stage.depthWrite = true;
                stage.depthWriteOverride = true;
                break;

            case 'tcmod':
                var tcMod = {
                    type: tokens.next().toLowerCase()
                }
                switch (tcMod.type) {
                    case 'rotate':
                        tcMod.angle = parseFloat(tokens.next()) * (3.1415 / 180);
                        break;
                    case 'scale':
                        tcMod.scaleX = parseFloat(tokens.next());
                        tcMod.scaleY = parseFloat(tokens.next());
                        break;
                    case 'scroll':
                        tcMod.sSpeed = parseFloat(tokens.next());
                        tcMod.tSpeed = parseFloat(tokens.next());
                        break;
                    case 'stretch':
                        tcMod.waveform = q3shader.parseWaveform(tokens);
                        if (!tcMod.waveform) { tcMod.type == null; }
                        break;
                    case 'turb':
                        tcMod.turbulance = {
                            base: parseFloat(tokens.next()),
                            amp: parseFloat(tokens.next()),
                            phase: parseFloat(tokens.next()),
                            freq: parseFloat(tokens.next())
                        };
                        break;
                    default: tcMod.type == null; break;
                }
                if (tcMod.type) {
                    stage.tcMods.push(tcMod);
                }
                break;
            case 'tcgen':
                stage.tcGen = tokens.next();
                break;
            default: break;
        }
    }

    if (stage.blendSrc == 'GL_ONE' && stage.blendDest == 'GL_ZERO') {
        stage.hasBlendFunc = false;
        stage.depthWrite = true;
    }

    stage.isLightmap = stage.map == '$lightmap'

    return stage;
};

q3shader.parseWaveform = function (tokens) {
    return {
        funcName: tokens.next().toLowerCase(),
        base: parseFloat(tokens.next()),
        amp: parseFloat(tokens.next()),
        phase: parseFloat(tokens.next()),
        freq: parseFloat(tokens.next())
    };
};

//
// WebGL Shader creation
//

// This whole section is a bit ugly, but it gets the job done. The job, in this case, is translating
// Quake 3 shaders into GLSL shader programs. We should probably be doing a bit more normalization here.

q3shader.buildShaderSource = function (shader, stage) {
    return {
        vertex: q3shader.buildVertexShader(shader, stage),
        fragment: q3shader.buildFragmentShader(shader, stage)
    };
}
declare let shaderBuilder;
q3shader.buildVertexShader = function (stageShader, stage) {
    var shader = new shaderBuilder();

    shader.addAttribs({
        position: 'vec3',
        normal: 'vec3',
        color: 'vec4',
    });

    shader.addVaryings({
        vTexCoord: 'vec2',
        vColor: 'vec4',
    });

    shader.addUniforms({
        modelViewMat: 'mat4',
        projectionMat: 'mat4',
        time: 'float',
    });

    if (stage.isLightmap) {
        shader.addAttribs({ lightCoord: 'vec2' });
    } else {
        shader.addAttribs({ texCoord: 'vec2' });
    }

    shader.addLines(['vec3 defPosition = position;']);

    for (var i = 0; i < stageShader.vertexDeforms.length; ++i) {
        var deform = stageShader.vertexDeforms[i];

        switch (deform.type) {
            case 'wave':
                var name = 'deform' + i;
                var offName = 'deformOff' + i;

                shader.addLines([
                    'float ' + offName + ' = (position.x + position.y + position.z) * ' + deform.spread.toFixed(4) + ';'
                ]);

                var phase = deform.waveform.phase;
                deform.waveform.phase = phase.toFixed(4) + ' + ' + offName;
                shader.addWaveform(name, deform.waveform);
                deform.waveform.phase = phase;

                shader.addLines([
                    'defPosition += normal * ' + name + ';'
                ]);
                break;
            default: break;
        }
    }

    shader.addLines(['vec4 worldPosition = modelViewMat * vec4(defPosition, 1.0);']);
    shader.addLines(['vColor = color;']);

    if (stage.tcGen == 'environment') {
        shader.addLines([
            'vec3 viewer = normalize(-worldPosition.xyz);',
            'float d = dot(normal, viewer);',
            'vec3 reflected = normal*2.0*d - viewer;',
            'vTexCoord = vec2(0.5, 0.5) + reflected.xy * 0.5;'
        ]);
    } else {
        // Standard texturing
        if (stage.isLightmap) {
            shader.addLines(['vTexCoord = lightCoord;']);
        } else {
            shader.addLines(['vTexCoord = texCoord;']);
        }
    }

    // tcMods
    for (var i = 0; i < stage.tcMods.length; ++i) {
        var tcMod = stage.tcMods[i];
        switch (tcMod.type) {
            case 'rotate':
                shader.addLines([
                    'float r = ' + tcMod.angle.toFixed(4) + ' * time;',
                    'vTexCoord -= vec2(0.5, 0.5);',
                    'vTexCoord = vec2(vTexCoord.s * cos(r) - vTexCoord.t * sin(r), vTexCoord.t * cos(r) + vTexCoord.s * sin(r));',
                    'vTexCoord += vec2(0.5, 0.5);',
                ]);
                break;
            case 'scroll':
                shader.addLines([
                    'vTexCoord += vec2(' + tcMod.sSpeed.toFixed(4) + ' * time, ' + tcMod.tSpeed.toFixed(4) + ' * time);'
                ]);
                break;
            case 'scale':
                shader.addLines([
                    'vTexCoord *= vec2(' + tcMod.scaleX.toFixed(4) + ', ' + tcMod.scaleY.toFixed(4) + ');'
                ]);
                break;
            case 'stretch':
                shader.addWaveform('stretchWave', tcMod.waveform);
                shader.addLines([
                    'stretchWave = 1.0 / stretchWave;',
                    'vTexCoord *= stretchWave;',
                    'vTexCoord += vec2(0.5 - (0.5 * stretchWave), 0.5 - (0.5 * stretchWave));',
                ]);
                break;
            case 'turb':
                var tName = 'turbTime' + i;
                shader.addLines([
                    'float ' + tName + ' = ' + tcMod.turbulance.phase.toFixed(4) + ' + time * ' + tcMod.turbulance.freq.toFixed(4) + ';',
                    'vTexCoord.s += sin( ( ( position.x + position.z )* 1.0/128.0 * 0.125 + ' + tName + ' ) * 6.283) * ' + tcMod.turbulance.amp.toFixed(4) + ';',
                    'vTexCoord.t += sin( ( position.y * 1.0/128.0 * 0.125 + ' + tName + ' ) * 6.283) * ' + tcMod.turbulance.amp.toFixed(4) + ';'
                ]);
                break;
            default: break;
        }
    }

    switch (stage.alphaGen) {
        case 'lightingspecular':
            shader.addAttribs({ lightCoord: 'vec2' });
            shader.addVaryings({ vLightCoord: 'vec2' });
            shader.addLines(['vLightCoord = lightCoord;']);
            break;
        default:
            break;
    }

    shader.addLines(['gl_Position = projectionMat * worldPosition;']);

    return shader.getSource();

}

q3shader.buildFragmentShader = function (stageShader, stage) {
    var shader = new shaderBuilder();

    shader.addVaryings({
        vTexCoord: 'vec2',
        vColor: 'vec4',
    });

    shader.addUniforms({
        texture: 'sampler2D',
        time: 'float',
    });

    shader.addLines(['vec4 texColor = texture2D(texture, vTexCoord.st);']);

    switch (stage.rgbGen) {
        case 'vertex':
            shader.addLines(['vec3 rgb = texColor.rgb * vColor.rgb;']);
            break;
        case 'wave':
            shader.addWaveform('rgbWave', stage.rgbWaveform);
            shader.addLines(['vec3 rgb = texColor.rgb * rgbWave;']);
            break;
        default:
            shader.addLines(['vec3 rgb = texColor.rgb;']);
            break;
    }

    switch (stage.alphaGen) {
        case 'wave':
            shader.addWaveform('alpha', stage.alphaWaveform);
            break;
        case 'lightingspecular':
            // For now this is VERY special cased. May not work well with all instances of lightingSpecular
            shader.addUniforms({
                lightmap: 'sampler2D'
            });
            shader.addVaryings({
                vLightCoord: 'vec2',
                vLight: 'float'
            });
            shader.addLines([
                'vec4 light = texture2D(lightmap, vLightCoord.st);',
                'rgb *= light.rgb;',
                'rgb += light.rgb * texColor.a * 0.6;', // This was giving me problems, so I'm ignorning an actual specular calculation for now
                'float alpha = 1.0;'
            ]);
            break;
        default:
            shader.addLines(['float alpha = texColor.a;']);
            break;
    }

    if (stage.alphaFunc) {
        switch (stage.alphaFunc) {
            case 'GT0':
                shader.addLines([
                    'if(alpha == 0.0) { discard; }'
                ]);
                break;
            case 'LT128':
                shader.addLines([
                    'if(alpha >= 0.5) { discard; }'
                ]);
                break;
            case 'GE128':
                shader.addLines([
                    'if(alpha < 0.5) { discard; }'
                ]);
                break;
            default:
                break;
        }
    }

    shader.addLines(['gl_FragColor = vec4(rgb, alpha);']);

    return shader.getSource();
}

//
// WebGL Shader builder utility
//

shaderBuilder = function () {
    this.attrib = {};
    this.varying = {};
    this.uniform = {};

    this.functions = {};

    this.statements = [];
}

shaderBuilder.prototype.addAttribs = function (attribs) {
    for (var name in attribs) {
        this.attrib[name] = 'attribute ' + attribs[name] + ' ' + name + ';'
    }
}

shaderBuilder.prototype.addVaryings = function (varyings) {
    for (var name in varyings) {
        this.varying[name] = 'varying ' + varyings[name] + ' ' + name + ';'
    }
}

shaderBuilder.prototype.addUniforms = function (uniforms) {
    for (var name in uniforms) {
        this.uniform[name] = 'uniform ' + uniforms[name] + ' ' + name + ';'
    }
}

shaderBuilder.prototype.addFunction = function (name, lines) {
    this.functions[name] = lines.join('\n');
}

shaderBuilder.prototype.addLines = function (statements) {
    for (var i = 0; i < statements.length; ++i) {
        this.statements.push(statements[i]);
    }
}

shaderBuilder.prototype.getSource = function () {
    var src = '\
#ifdef GL_ES \n\
precision highp float; \n\
#endif \n';

    for (var i in this.attrib) {
        src += this.attrib[i] + '\n';
    }

    for (var i in this.varying) {
        src += this.varying[i] + '\n';
    }

    for (var i in this.uniform) {
        src += this.uniform[i] + '\n';
    }

    for (var i in this.functions) {
        src += this.functions[i] + '\n';
    }

    src += 'void main(void) {\n\t';
    src += this.statements.join('\n\t');
    src += '\n}\n';

    return src;
}

declare let funcName;

// q3-centric functions

shaderBuilder.prototype.addWaveform = function (name, wf, timeVar) {
    if (!wf) {
        this.statements.push('float ' + name + ' = 0.0;');
        return;
    }

    if (!timeVar) { timeVar = 'time'; }

    if (typeof (wf.phase) == "number") {
        wf.phase = wf.phase.toFixed(4)
    }

    switch (wf.funcName) {
        case 'sin':
            this.statements.push('float ' + name + ' = ' + wf.base.toFixed(4) + ' + sin((' + wf.phase + ' + ' + timeVar + ' * ' + wf.freq.toFixed(4) + ') * 6.283) * ' + wf.amp.toFixed(4) + ';');
            return;
        case 'square': funcName = 'square'; this.addSquareFunc(); break;
        case 'triangle': funcName = 'triangle'; this.addTriangleFunc(); break;
        case 'sawtooth': funcName = 'fract'; break;
        case 'inversesawtooth': funcName = '1.0 - fract'; break;
        default:
            this.statements.push('float ' + name + ' = 0.0;');
            return;
    }
    this.statements.push('float ' + name + ' = ' + wf.base.toFixed(4) + ' + ' + funcName + '(' + wf.phase + ' + ' + timeVar + ' * ' + wf.freq.toFixed(4) + ') * ' + wf.amp.toFixed(4) + ';');
}

shaderBuilder.prototype.addSquareFunc = function () {
    this.addFunction('square', [
        'float square(float val) {',
        '   return (mod(floor(val*2.0)+1.0, 2.0) * 2.0) - 1.0;',
        '}',
    ]);
}

shaderBuilder.prototype.addTriangleFunc = function () {
    this.addFunction('triangle', [
        'float triangle(float val) {',
        '   return abs(2.0 * fract(val) - 1.0);',
        '}',
    ]);
}
/// end of q3shader ///

