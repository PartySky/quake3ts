// making class from function
export class q3bsp {

    constructor(gl) {
        this.gl = gl;
        this.onload = null;
        this.onbsp = null;
        this.onentitiesloaded = null; // публичные поля

        var map = this; // в ts сделать private поле _map 

        this.showLoadStatus();

        // Spawn the web worker
        // this.worker = new Worker('js/q3bsp_worker.js');
        // this.worker = new Worker('./q3bsp_worker');

        // HOTFIX added Worker object like function
        // let worker = {
        //     // function onmessage(msg) { }
        //     onmessage: null
        // };
        // this.worker = worker;
        // this.worker = new Worker('js/q3bsp_worker.js');
        this.worker = new Worker('js/test_worker.js');

        // let qwe = new Worker(null);
        this.workerTest = {
            onmessageTest: function (x: any, y: any) {
                console.log(x, y);
            },
        };

        this.workerTest.onmessageTest('test ', ' custom function 1');

        this.workerTest.onmessageTest2 = function (msg) {
            console.log(msg);
        };

        this.workerTest.onmessageTest2('test custom function 2');

        // postMessage test
        this.worker.postMessage({
            type: 'test',
            url: 'use postMessage'
        });

        // moved from worker
        // onmessage = function (msg) {
        // let exWorkerOnmessage = function (msg) {
        //     switch (msg.data.type) {
        //         case 'load':
        //             q3bspObj.load(msg.data.url, msg.data.tesselationLevel, function () {
        //                 // Fallback to account for Opera handling URLs in a worker 
        //                 // differently than other browsers. 
        //                 q3bspObj.load("../" + msg.data.url, msg.data.tesselationLevel);
        //             });
        //             break;
        //         case 'loadShaders':
        //             q3shader.loadList(msg.data.sources);
        //             break;
        //         case 'trace':
        //             q3bspObj.trace(msg.data.traceId, msg.data.start, msg.data.end, msg.data.radius, msg.data.slide);
        //             break;
        //         case 'visibility':
        //             q3bspObj.buildVisibleList(q3bspObj.getLeaf(msg.data.pos));
        //             break;
        //         default:
        //             throw 'Unexpected message type: ' + msg.data;
        //     }
        // };


        // end of moved from worker



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
    }

    test3(name) {
        console.log('f(x) q3bsp prototype field test');
    }

}