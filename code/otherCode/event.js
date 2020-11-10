
const {EventEmitter} = require('events');

const server = new EventEmitter();

server.on('client', (req)=>console.log(req, 'u`re user'))
server.on('admin', (req)=>console.log(req, 'u`re admin'))

server.emit('client', {hello: 'hello world'})
server.emit('admin', {hello: 'hello world'})

