const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  // TV cria sala
  socket.on('create-room', () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    socket.join(pin);
    socket.emit('room-ready', pin);
  });

  // Celular entra na sala
  socket.on('join-room', (pin) => {
    socket.join(pin);
    socket.to(pin).emit('player-joined');
  });

  // Celular manda comando (move)
  socket.on('move', (data) => {
    socket.to(data.pin).emit('game-command', data.dir);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Servidor rodando!'));
