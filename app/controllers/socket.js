const AbstractController = require('.');
const models = require('../models');

module.exports = class SocketController extends AbstractController {
  initRouter() {
    this.ioRoom = this.io.of('/room');
    this.ioRoom.on('connection', socket => this.handleRoomSocket(socket));
  }

  handleRoomSocket(socket) {
    console.log('Connected');

    socket.on('join', roomId => this.handleRoomJoin(socket, roomId));
    socket.on('newMessage', (roomId, message) => this.handleRoomNewMessage(socket, roomId, message));
  }

  async handleRoomJoin(socket, roomId) {
    socket.join(roomId);

    const messages = await models.message.findAll({
      where: {},
      limit: 10,
    });

    messages.forEach(message => this.ioRoom.emit('message', message));
  }

  async handleRoomNewMessage(socket, roomId, message) {
    const messageObj = models.message.build();

    messageObj.text = message;

    await messageObj.save();
    await messageObj.setRoom(roomId);

    this.ioRoom.emit('message', messageObj);
  }
};
