const sequelize = require("../lib/Sequelize.js");
const { DataTypes, Model } = require("sequelize");
const bcrypt = require('bcrypt');

class Admin extends Model { }
Admin.init(
  {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 100]
      },
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "admin",
    paranoid: true,
  }
);

Admin.addHook('beforeCreate', async (admin, options) => {
  const salt = await bcrypt.genSalt();
  admin.password = await bcrypt.hash(admin.password, salt);
});

module.exports = Admin;
