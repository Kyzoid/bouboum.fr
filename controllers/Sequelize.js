const Sequelize = require("sequelize");
const { DATABASE_URL } = require('../config')

console.log(DATABASE_URL)

const connection = new Sequelize(DATABASE_URL);
connection
  .authenticate()
  .then(() => console.log("connected to PG"))
  .catch((err) => console.log(err));

module.exports = connection;