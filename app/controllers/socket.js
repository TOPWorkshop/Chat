const AbstractController = require('.');

const log = require('../libraries/log');
const models = require('../models');

module.exports = class SocketController extends AbstractController {
  initRouter() {
    this.ioRoom = this.io.of('/room');
    this.ioRoom.on('connection', socket => this.handleRoomSocket(socket));
  }

  handleRoomSocket(socket) {
    log.socket.info('Connected');

    socket.on('join', roomId => this.handleRoomJoin(socket, roomId));
    socket.on('newMessage', (roomId, message) => this.handleRoomNewMessage(socket, roomId, message));
  }

  async handleRoomJoin(socket, roomId) {
    socket.join(roomId);

    log.socket.silly(`Room ${roomId} joined`);

    const messages = await models.message.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{
        model: models.room,
        where: {
          id: roomId,
        },
      }],
    });

    messages.reverse().forEach(message => this.ioRoom.emit('message', message));
  }

  async handleRoomNewMessage(socket, roomId, message) {
    const messageObj = models.message.build();

    messageObj.text = message;

    await messageObj.save();
    await messageObj.setRoom(roomId);

    this.ioRoom.emit('message', messageObj);
  }
};
