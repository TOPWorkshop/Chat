const fs = require('fs');
const path = require('path');
const config = require('config');
const Sequelize = require('sequelize');

const log = require('../libraries/log');

const configDb = config.get('database');
configDb.logging = message => log.db.debug(message);

if (configDb.dialect === 'sqlite') {
  configDb.storage = path.join(__dirname, '..', '..', `${configDb.database}.db`);
}

let url = configDb.url;
if (url && configDb.dialect === 'postgres' && configDb.dialectOptions && configDb.dialectOptions.ssl && !url.includes('?ssl=')) {
  url += '?ssl=true';
}

const sequelize = new Sequelize(configDb);

const models = { Sequelize, sequelize };
const modelsDirpath = __dirname;

fs
  .readdirSync(modelsDirpath)
  .filter(filename => filename !== 'index.js' && filename.substr(-3) === '.js')
  .forEach((filename) => {
    const filepath = path.join(modelsDirpath, filename);
    const Model = sequelize.import(filepath);

    models[Model.name] = Model;
  });

Object.keys(models).forEach((modelName) => {
  const model = models[modelName];

  if (model.associate && typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;
