console.log('hello from a webworker');

onmessage = function(msg) {
    console.log('onmessage in worker');
}

onmessagerandom = function(msg) {
    console.log('onmessagerandom in worker');
}