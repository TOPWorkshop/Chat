const path = require('path');
const http = require('http');
const socket = require('socket.io');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const models = require('./models');

const SocketController = require('./controllers/socket');
const WebsiteController = require('./controllers/website');

module.exports = class ChatApp {
  constructor(config) {
    this.config = config;

    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
  }

  initServer() {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = socket(this.server);

    this.server.on('error', error => ChatApp.handleServerError(error));
  }

  initMiddlewares() {
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');

    this.app.use(morgan('dev'));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(express.static(path.join(__dirname, '..', 'public')));
  }

  initRoutes() {
    this.app.use('/', new SocketController(this.io).router);
    this.app.use('/', new WebsiteController(this.io).router);
  }

  static handleServerError(error) {
    console.error(error.message);
  }

  listen() {
    return models.sequelize.sync()
      .then(() => {
        console.log('Database synchronized');

        return new Promise(resolve => this.server.listen(this.config.port, () => {
          console.log(`Listening on port ${this.config.port}`);

          resolve();
        }));
      });
  }
};
