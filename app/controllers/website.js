const AbstractController = require('.');

const { Room } = require('../models');

module.exports = class WebsiteController extends AbstractController {
  initRouter() {
    this.router.get('/', (req, res) => res.redirect('/rooms'));
    this.router.get('/rooms', WebsiteController.roomListAction);
    this.router.post('/rooms', WebsiteController.roomCreateAction);
    this.router.get('/rooms/:roomId', WebsiteController.roomRetrieveAction);

    this.router.param('roomId', WebsiteController.retrieveRoom);
  }

  static async roomListAction(req, res) {
    const rooms = await Room.findAll();

    res.render('rooms', { rooms });
  }

  static async roomCreateAction(req, res) {
    const { name } = req.body;

    if (!name) {
      return res.redirect('/rooms');
    }

    const [room/* , created */] = await Room.findCreateFind({
      where: { name },
    });

    return res.redirect(`/rooms/${room.id}`);
  }

  static roomRetrieveAction(req, res) {
    res.render('room', { room: req.room });
  }

  static async retrieveRoom(req, res, next, id) {
    req.room = await Room.findOne({
      where: { id },
    });

    next();
  }
};
