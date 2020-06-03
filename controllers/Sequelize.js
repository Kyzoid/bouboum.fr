require('dotenv').config();

const Sequelize = require("sequelize");
const { DATABASE_URL } = require('../config')

const connection = new Sequelize(DATABASE_URL, { logging: false });
connection
  .authenticate()
  .then(() => console.log("connected to PG"))
  .catch((err) => console.log(err));

module.exports = connection;