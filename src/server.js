const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { ContentType: 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

const io = socketio(app);

const draws = {};

io.sockets.on('connection', (socket) => {
  console.log('started');
  socket.join('room1');
  socket.emit('setup', draws);
  socket.on('draw', (data) => {
    draws[data.name] = data.coords;
    io.sockets.in('room1').emit('clientUpdate', data);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log('Websocket server started');
