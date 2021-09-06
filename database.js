const Sequelize = require('sequelize');
const { delilah_db } = require('./src/config');

const db = new Sequelize(delilah_db);

module.exports = { db, Sequelize };