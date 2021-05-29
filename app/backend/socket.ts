const server = require('./app.js');
const io = require('socket.io').listen(server);
module.exports = io;