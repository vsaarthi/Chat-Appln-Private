const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

var server = http.createServer(app);
var io = socketio(server);


io.on("connection", socket => {
  var online = Object.keys(io.engine.clients);
  const { id } = socket.client;
  console.log(`User Connected: ${id}`);

  socket.on("chat message", ({ name, msg, sendid,myid}) => {
    io.to(sendid).emit("chat message", { id, name, msg });
    // io.to(myid).emit("chat message", { id, name, msg });
  });

  io.emit('server message', JSON.stringify(online));

  socket.on('disconnect', () => {
    var online = Object.keys(io.engine.clients);
    io.emit('server message', JSON.stringify(online))
    console.log("Disconnected");
  });
});

const PORT = process.env.PORT || 2000;
server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));