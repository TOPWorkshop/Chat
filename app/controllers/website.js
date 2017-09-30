const AbstractController = require('.');

module.exports = class WebsiteController extends AbstractController {
  initRouter() {
    this.router.get('/', (req, res) => WebsiteController.indexAction(req, res));
    this.router.get('/rooms', (req, res) => WebsiteController.roomsAction(req, res));
    this.router.get('/room/:roomId', (req, res) => WebsiteController.roomAction(req, res));

    this.router.param('roomId', (req, res) => WebsiteController.retrieveRoom(req, res));
  }

  static indexAction(req, res) {
    res.render('login');
  }

  static roomsAction(req, res) {

  }

  static roomAction(req, res) {

  }

  static retrieveRoom(req) {
    const roomId = req.params.roomId;

    req.room = roomId;
  }
};
