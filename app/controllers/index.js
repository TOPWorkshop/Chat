const express = require('express');

module.exports = class AbstractController {
  constructor(io) {
    this.io = io;
    this.router = express.Router();

    this.initRouter();

    this.promisifyMiddlewares();
  }

  initRouter() { // eslint-disable-line class-methods-use-this
    throw new Error('"initRouter" method must be implemented');
  }

  promisifyMiddlewares() {
    this.router.stack.forEach(({ route }) => {
      route.stack.forEach((stack) => {
        if (stack.handle.constructor.name === 'AsyncFunction') {
          const oldHandle = stack.handle;

          // eslint-disable-next-line no-param-reassign
          stack.handle = AbstractController.wrapPromise(oldHandle);
        }
      });
    });
  }

  static wrapPromise(middleware) {
    return (request, response, next) => {
      middleware(request, response, next)
        .catch(next);
    };
  }
};
