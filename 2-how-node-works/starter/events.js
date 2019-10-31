const http = require('http');

const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.emit('newSale');

const server = http.createServer();

server.on('request', (req, res) => {
    res.end('Request 1');
});

server.on('request', (req, res) => {
    res.end('Request 2');
});

server.on('close', () => console.log('Server closed'));

server.listen(8000, 'localhost', () => console.log('Waiting for requests ...'));
