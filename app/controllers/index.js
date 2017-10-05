const express = require('express');

module.exports = class AbstractController {
  constructor(io) {
    this.io = io;
    this.router = express.Router();

    this.initRouter();
  }

  initRouter() { // eslint-disable-line class-methods-use-this
    throw new Error('"initRouter" method must be implemented');
  }
};
