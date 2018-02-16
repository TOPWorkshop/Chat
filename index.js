const ChatApp = require('./app');
const log = require('./app/libraries/log');

const app = new ChatApp();

app.listen()
  .then(() => log.silly('After listening'));
