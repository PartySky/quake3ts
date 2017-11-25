import {
    map,
    playerMover,
    pressed,
    moveViewOriented,
    isVRPresenting,
    getViewMatrix,
    leftViewMat,
    vrPose,
    vrDisplay,
    projMat
} from "./main.module";

export function updateInput(frameTime) {
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
                if (typeof(button) == "number" && button == 1.0) {
                    playerMover.jump();
                } else if (button.pressed) {
                    playerMover.jump();
                }
            }
        }
    }

    moveViewOriented(dir, frameTime);
}

export function drawFrame(gl) {
    // Clear back buffer but not color buffer (we expect the entire scene to be overwritten)
    gl.depthMask(true);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    if (!map || !playerMover) { return; }

    if (!isVRPresenting()) {
        // Matrix setup
        getViewMatrix(leftViewMat, vrPose);

        // Here's where all the magic happens...
        map.draw(leftViewMat, projMat);
    } else if (vrDrawMode == 1) {
        var canvas = document.getElementById("viewport");
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