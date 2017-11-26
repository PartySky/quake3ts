console.log('hello from a webworker');

onmessage = function(msg) {
    console.log('onmessage in worker');
}
