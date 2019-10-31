const fs = require('fs');

setTimeout(() => console.log('setTimeout 1 finished'), 0);
setImmediate(() => console.log('setImmediate 1 finished'));

fs.readFile('./test-file.txt', () => {
    console.log('I/O finished');
    console.log('-------------------------');

    setTimeout(() => {
        console.log('setTimeout 2 finished');
    }, 0);
    setTimeout(() => {
        console.log('setTimeout 3 finished');
    }, 3000);
    setImmediate(() => console.log('setImmediate 2 finished'));

    process.nextTick(() => console.log('Process nextTich'));
});

console.log('top-level code');