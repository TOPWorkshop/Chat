const config = require('config');

const ChatApp = require('./app');

const app = new ChatApp(config.get('server'));

app.listen()
  .then(() => console.log('OK'));
