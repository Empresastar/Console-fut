const io = require('socket.io')(3000, {
  cors: { origin: "*" } // Libera acesso para o GitHub Pages
});

io.on('connection', (socket) => {
  // A tela principal (Console) cria uma sala
  socket.on('create-room', () => {
    const pin = Math.floor(1000 + Math.random() * 9000); // PIN de 4 dígitos
    socket.join(pin.toString());
    socket.emit('room-ready', pin);
  });

  // O celular entra na sala
  socket.on('join-room', (pin) => {
    socket.join(pin.toString());
    io.to(pin.toString()).emit('player-joined');
  });

  // Envia o movimento do celular para a tela
  socket.on('move', (data) => {
    // data = { pin: '1234', direction: 'left' }
    socket.to(data.pin).emit('update-game', data.direction);
  });
});
