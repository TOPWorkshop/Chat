const config = require('config');

const ChatApp = require('./app');
const log = require('./app/libraries/log');

const app = new ChatApp(config.get('server'));

app.listen()
  .then(() => log.silly('After listening'));
