const fs = require('fs');
const path = require('path');
const http = require('http');
const config = require('config');
const socket = require('socket.io');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const log = require('./libraries/log');
const models = require('./models');

module.exports = class ChatApp {
  constructor() {
    this.config = config.get('server');

    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
  }

  initServer() {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = socket(this.server);

    this.server.on('error', error => ChatApp.handleServerError(error));

    log.silly('Server initialized');
  }

  initMiddlewares() {
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');

    this.app.use(morgan('dev', {
      skip: (req, res) => res.statusCode >= 400,
      stream: { write: message => log.server.info(message) },
    }));

    this.app.use(morgan('dev', {
      skip: (req, res) => res.statusCode < 400,
      stream: { write: message => log.server.warn(message) },
    }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    log.silly('Middlewares initialized');
  }

  initRoutes() {
    const controllersDir = path.join(__dirname, 'controllers');

    fs
      .readdirSync(controllersDir)
      .filter(filename => filename !== 'index.js' && filename.substr(-3) === '.js')
      .forEach((filename) => {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const Controller = require(path.join(controllersDir, filename));

        this.app.use('/', new Controller(this.io).router);
      });

    log.silly('Routes initialized');
  }

  static handleServerError(error) {
    log.error('Server error');
    log.debug(error.message);
  }

  async listen() {
    await models.sequelize.sync();

    await new Promise((resolve, reject) =>
      this.server.listen(this.config.port, err =>
        (err ? reject(err) : resolve())));

    log.info(`Listening on port ${this.config.port}`);
  }
};
